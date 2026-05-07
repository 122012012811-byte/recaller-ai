export const OPEN_WEATHER_BASE_URL = "https://api.openweathermap.org";
export const WEATHER_ICON_BASE_URL = "https://openweathermap.org/img/wn";
export const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000;
export const DEFAULT_CITY = "Chennai";
export const MAX_CITY_SUGGESTIONS = 5;
export const MAX_RECENT_SEARCHES = 6;
export const MAX_FAVORITES = 6;
export const STORAGE_KEYS = {
  unit: "weather-unit",
  theme: "weather-theme",
  lastCity: "weather-last-city",
  history: "weather-history",
  favorites: "weather-favorites",
} as const;
