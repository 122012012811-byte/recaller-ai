"use client";

import { useState } from "react";

interface GeolocationState {
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    isLoading: false,
    error: null,
  });

  const getLocation = () =>
    new Promise<{ lat: number; lon: number }>((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        const message = "Geolocation is not supported in this browser.";
        setState({ isLoading: false, error: message });
        reject(new Error(message));
        return;
      }

      setState({ isLoading: true, error: null });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ isLoading: false, error: null });
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          const message =
            error.code === error.PERMISSION_DENIED
              ? "Location access denied. Search for a city instead."
              : "Unable to access your location.";
          setState({ isLoading: false, error: message });
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
      );
    });

  return {
    ...state,
    getLocation,
  };
}
