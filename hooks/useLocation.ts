/**
 * useLocation — GPS capture for EVV clock in/out
 * Works on native (expo-location) and web (browser geolocation API)
 */
import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

interface LocationResult {
  lat: number;
  lng: number;
  accuracy: number | null;
  timestamp: number;
}

function getWebLocation(): Promise<LocationResult | null> {
  return new Promise((resolve) => {
    if (!navigator?.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export function useLocation() {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(async (): Promise<LocationResult | null> => {
    setLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'web') {
        const result = await getWebLocation();
        setLocation(result);
        setLoading(false);
        return result;
      }

      // Native: use expo-location
      const Location = require('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission required for EVV compliance');
        setLoading(false);
        return null;
      }

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
  }, []);

  return { location, loading, error, getLocation };
}

export default useLocation;
