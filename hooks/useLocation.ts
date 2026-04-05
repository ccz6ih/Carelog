/**
 * useLocation — GPS capture for EVV clock in/out
 * Wraps expo-location with CareLog-specific logic
 */
import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

interface LocationResult {
  lat: number;
  lng: number;
  accuracy: number | null;
  timestamp: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Location permission required for EVV compliance');
      return false;
    }
    return true;
  }, []);

  const captureLocation = useCallback(async (): Promise<LocationResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return null;

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const result: LocationResult = {
        lat: current.coords.latitude,
        lng: current.coords.longitude,
        accuracy: current.coords.accuracy,
        timestamp: current.timestamp,
      };

      setLocation(result);
      setLoading(false);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Location capture failed';
      setError(msg);
      setLoading(false);
      return null;
    }
  }, [requestPermission]);

  return { location, loading, error, captureLocation, requestPermission };
}

export default useLocation;
