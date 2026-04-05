/**
 * CareLog EVV Service
 * The technical moat: auto-submit 6 EVV data points to state aggregators.
 * 4 APIs → 37 states unlocked.
 */
import type { Visit, CareRecipient } from '@/types';

// The 6 EVV data points required by 21st Century Cures Act
export interface EVVDataPoints {
  serviceType: string;       // 1. Type of service
  recipientId: string;       // 2. Individual receiving service
  providerId: string;        // 3. Individual providing service
  dateOfService: string;     // 4. Date of service
  startTime: string;         // 5. Time service begins
  endTime: string;           // 6. Time service ends
  location: {                // GPS verification
    lat: number;
    lng: number;
  };
}

// Aggregator configurations
type Aggregator = 'hhax' | 'sandata' | 'tellus' | 'providerone' | 'calevv';

interface AggregatorConfig {
  name: string;
  states: string[];
  baseUrl: string;
  authType: 'oauth2' | 'apikey' | 'certificate';
}

const AGGREGATORS: Record<Aggregator, AggregatorConfig> = {
  hhax: {
    name: 'HHAeXchange',
    states: ['FL', 'NY', 'NJ', 'MA', 'MD', 'VA', 'GA', 'NC'],
    baseUrl: 'https://api.hhax.com/v1',
    authType: 'oauth2',
  },
  sandata: {
    name: 'Sandata eMBS',
    states: ['OH', 'PA', 'TX', 'IL', 'MI', 'IN', 'WI', 'MN', 'MO', 'TN',
             'KY', 'AL', 'SC', 'AR', 'KS', 'NE', 'IA', 'OK', 'MS', 'NM'],
    baseUrl: 'https://embs.sandata.com/api/v2',
    authType: 'oauth2',
  },
  tellus: {
    name: 'Tellus/Optum',
    states: ['AZ', 'OR', 'NV', 'HI', 'ME', 'NH'],
    baseUrl: 'https://api.tellusevv.com/v1',
    authType: 'apikey',
  },
  providerone: {
    name: 'ProviderOne + CalEVV',
    states: ['WA', 'CA', 'CO'],
    baseUrl: 'https://api.providerone.wa.gov/evv/v1',
    authType: 'certificate',
  },
  calevv: {
    name: 'CalEVV/CDSS',
    states: ['CA'],
    baseUrl: 'https://calevv.cdss.ca.gov/api/v1',
    authType: 'oauth2',
  },
};

/**
 * Build the 6 EVV data points from a completed visit
 */
function buildEVVPayload(visit: Visit, recipient: CareRecipient): EVVDataPoints {
  return {
    serviceType: 'PCS', // Personal Care Services
    recipientId: recipient.recipientId,
    providerId: recipient.providerId,
    dateOfService: visit.clockInTime.split('T')[0],
    startTime: visit.clockInTime,
    endTime: visit.clockOutTime || new Date().toISOString(),
    location: visit.clockInLocation,
  };
}

/**
 * Auto-submit EVV data to the state aggregator
 * This is the one-tap magic: clock out → auto-POST all 6 points
 */
export async function submitEVV(
  visit: Visit,
  recipient: CareRecipient
): Promise<{ success: boolean; confirmationId?: string; error?: string }> {
  const aggregator = AGGREGATORS[recipient.aggregator];
  if (!aggregator) {
    return { success: false, error: `Unknown aggregator: ${recipient.aggregator}` };
  }

  const payload = buildEVVPayload(visit, recipient);

  try {
    // TODO: Replace with real aggregator API call
    // Each aggregator has its own REST API format
    const response = await fetch(`${aggregator.baseUrl}/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Auth header varies by aggregator type
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Aggregator returned ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      confirmationId: data.confirmationId || data.id,
    };
  } catch (error) {
    // Queue for retry — critical for compliance
    await queueForRetry(visit, recipient);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Submission failed',
    };
  }
}

/**
 * Retry queue — offline-first resilience
 * Failed submissions get queued and retried with exponential backoff
 */
async function queueForRetry(visit: Visit, recipient: CareRecipient) {
  // TODO: Implement with AsyncStorage or SQLite
  // Store failed submission for background retry
  console.log(`[EVV] Queued for retry: visit ${visit.id}`);
}

/**
 * Get the aggregator config for a given state
 */
export function getAggregatorForState(state: string): AggregatorConfig | null {
  for (const [key, config] of Object.entries(AGGREGATORS)) {
    if (config.states.includes(state.toUpperCase())) {
      return config;
    }
  }
  return null;
}

/**
 * Check if a state supports auto-submit
 */
export function isAutoSubmitSupported(state: string): boolean {
  return getAggregatorForState(state) !== null;
}

export { AGGREGATORS, type AggregatorConfig };
