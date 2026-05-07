import { WEATHER_CACHE_TTL_MS } from "@/lib/constants";
import type { City, WeatherDashboardResponse } from "@/types/weather";

interface CacheRecord<T> {
  expiry: number;
  value: T;
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
}

function readCache<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CacheRecord<T>;
    if (parsed.expiry < Date.now()) {
      storage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const payload: CacheRecord<T> = {
    expiry: Date.now() + WEATHER_CACHE_TTL_MS,
    value,
  };
  storage.setItem(key, JSON.stringify(payload));
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to fetch weather data");
  }

  return payload as T;
}

export async function getCurrentWeather(city: string): Promise<WeatherDashboardResponse> {
  const cacheKey = `weather:${city.toLowerCase()}`;
  const cached = readCache<WeatherDashboardResponse>(cacheKey);

  if (cached) {
    return cached;
  }

  const data = await fetchJson<WeatherDashboardResponse>(`/api/weather?city=${encodeURIComponent(city)}`);
  writeCache(cacheKey, data);
  return data;
}

export async function getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherDashboardResponse> {
  const cacheKey = `weather:${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = readCache<WeatherDashboardResponse>(cacheKey);

  if (cached) {
    return cached;
  }

  const data = await fetchJson<WeatherDashboardResponse>(`/api/weather?lat=${lat}&lon=${lon}`);
  writeCache(cacheKey, data);
  return data;
}

export async function getForecast(city: string): Promise<WeatherDashboardResponse> {
  return getCurrentWeather(city);
}

export async function searchCities(query: string): Promise<City[]> {
  if (!query.trim()) {
    return [];
  }

  return fetchJson<City[]>(`/api/weather?search=${encodeURIComponent(query.trim())}`);
}
