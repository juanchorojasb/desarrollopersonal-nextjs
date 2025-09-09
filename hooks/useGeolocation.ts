'use client';
import { useState, useEffect } from 'react';
import { geolocationService, DEFAULT_COUNTRY } from '@/lib/geolocation';

export function useGeolocation() {
  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY.code);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    detectUserCountry();
  }, []);

  const detectUserCountry = async () => {
    try {
      setLoading(true);
      setError(null);
      const detectedCountry = await geolocationService.getCountryFromIP();
      setCountry(detectedCountry);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error detecting country');
      setCountry(DEFAULT_COUNTRY.code);
    } finally {
      setLoading(false);
    }
  };

  const setManualCountry = (countryCode: string) => {
    if (geolocationService.isCountrySupported(countryCode)) {
      setCountry(countryCode);
      setError(null);
    } else {
      setError('Country not supported');
    }
  };

  return {
    country,
    countryInfo: geolocationService.getCountryInfo(country),
    currency: geolocationService.getCurrencyForCountry(country),
    loading,
    error,
    setCountry: setManualCountry,
    refresh: detectUserCountry,
    supportedCountries: geolocationService.getSupportedCountries()
  };
}