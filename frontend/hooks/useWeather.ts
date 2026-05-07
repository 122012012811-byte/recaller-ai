"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DEFAULT_CITY, MAX_RECENT_SEARCHES, STORAGE_KEYS } from "@/lib/constants";
import { getCurrentWeather, getWeatherByCoordinates } from "@/lib/weather-api";
import type { TemperatureUnit, WeatherDashboardResponse } from "@/types/weather";

interface WeatherState {
  data: WeatherDashboardResponse | null;
  error: string | null;
  isLoading: boolean;
  unit: TemperatureUnit;
  recentSearches: string[];
  activeCity: string;
}

export function useWeather() {
  const hasLoadedRef = useRef(false);
  const [initialCity] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_CITY;
    }

    return window.localStorage.getItem(STORAGE_KEYS.lastCity) ?? DEFAULT_CITY;
  });
  const [state, setState] = useState<WeatherState>(() => {
    if (typeof window === "undefined") {
      return {
        data: null,
        error: null,
        isLoading: true,
        unit: "metric",
        recentSearches: [],
        activeCity: DEFAULT_CITY,
      };
    }

    const storedUnit = window.localStorage.getItem(STORAGE_KEYS.unit);
    const unit: TemperatureUnit = storedUnit === "imperial" ? "imperial" : "metric";

    return {
      data: null,
      error: null,
      isLoading: true,
      unit,
      recentSearches: JSON.parse(window.localStorage.getItem(STORAGE_KEYS.history) ?? "[]") as string[],
      activeCity: initialCity,
    };
  });

  const updateHistory = useCallback((city: string) => {
    const normalized = city.trim();
    if (!normalized) {
      return;
    }

    setState((current) => {
      const nextHistory = [normalized, ...current.recentSearches.filter((item) => item !== normalized)].slice(
        0,
        MAX_RECENT_SEARCHES,
      );

      window.localStorage.setItem(STORAGE_KEYS.lastCity, normalized);
      window.localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(nextHistory));

      return {
        ...current,
        activeCity: normalized,
        recentSearches: nextHistory,
      };
    });
  }, []);

  const searchByCity = useCallback(async (city: string, updateRecent = true) => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const data = await getCurrentWeather(city);
      if (updateRecent) {
        updateHistory(data.current.name);
      }
      setState((current) => ({
        ...current,
        data,
        isLoading: false,
        error: null,
        activeCity: data.current.name,
      }));
      if (!updateRecent) {
        window.localStorage.setItem(STORAGE_KEYS.lastCity, data.current.name);
      }
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to fetch weather data";
      setState((current) => ({ ...current, isLoading: false, error: message }));
      return null;
    }
  }, [updateHistory]);

  const searchByCoordinates = useCallback(async (lat: number, lon: number) => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const data = await getWeatherByCoordinates(lat, lon);
      updateHistory(data.current.name);
      setState((current) => ({
        ...current,
        data,
        isLoading: false,
        error: null,
        activeCity: data.current.name,
      }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to fetch weather data";
      setState((current) => ({ ...current, isLoading: false, error: message }));
      return null;
    }
  }, [updateHistory]);

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;
    void searchByCity(initialCity, false);
  }, [initialCity, searchByCity]);

  const setUnit = (unit: TemperatureUnit) => {
    window.localStorage.setItem(STORAGE_KEYS.unit, unit);
    setState((current) => ({ ...current, unit }));
  };

  return {
    ...state,
    setUnit,
    searchByCity,
    searchByCoordinates,
  };
}
