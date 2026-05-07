import { WEATHER_ICON_BASE_URL } from "@/lib/constants";
import type {
  City,
  DailyForecastItem,
  ForecastData,
  HourlyForecastItem,
  TemperatureUnit,
} from "@/types/weather";

export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

export function kelvinToFahrenheit(kelvin: number): number {
  return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
}

export function formatTemperature(value: number, unit: TemperatureUnit): string {
  const rounded = Math.round(unit === "metric" ? value : (value * 9) / 5 + 32);
  return `${rounded}°${unit === "metric" ? "C" : "F"}`;
}

export function getWeatherIcon(iconCode: string): string {
  return `${WEATHER_ICON_BASE_URL}/${iconCode}@2x.png`;
}

export function formatTime(timestamp: number, timezone: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date((timestamp + timezone) * 1000));
}

export function formatDateTime(timestamp: number, timezone: number, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    ...options,
  }).format(new Date((timestamp + timezone) * 1000));
}

export function formatHour(timestamp: number, timezone: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    timeZone: "UTC",
  }).format(new Date((timestamp + timezone) * 1000));
}

export function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const normalized = ((degrees % 360) + 360) % 360;
  return directions[Math.round(normalized / 45) % 8];
}

export function getWeatherGradient(condition: string): string {
  const key = condition.toLowerCase();

  if (key.includes("clear") || key.includes("sun")) {
    return "from-[#FF6B35] via-[#F7931E] to-[#FFD166]";
  }
  if (key.includes("cloud")) {
    return "from-[#606c88] via-[#4f5d75] to-[#3f4c6b]";
  }
  if (key.includes("rain") || key.includes("drizzle") || key.includes("thunder")) {
    return "from-[#00c6ff] via-[#0072ff] to-[#003973]";
  }
  if (key.includes("snow") || key.includes("ice")) {
    return "from-[#e6dada] via-[#8db6d9] to-[#274046]";
  }

  return "from-[#0f2027] via-[#203a43] to-[#2c5364]";
}

export function formatVisibility(visibilityInMeters: number): string {
  return `${(visibilityInMeters / 1000).toFixed(1)} km`;
}

export function formatWindSpeed(speed: number, unit: TemperatureUnit): string {
  const value = unit === "metric" ? speed : speed * 2.23694;
  return `${Math.round(value)} ${unit === "metric" ? "m/s" : "mph"}`;
}

export function formatPrecipitation(pop: number): string {
  return `${Math.round(pop * 100)}%`;
}

export function getUvLabel(uvi: number | null): string {
  if (uvi === null) {
    return "Unavailable";
  }
  if (uvi <= 2) {
    return "Low";
  }
  if (uvi <= 5) {
    return "Moderate";
  }
  if (uvi <= 7) {
    return "High";
  }
  if (uvi <= 10) {
    return "Very high";
  }
  return "Extreme";
}

export function getCityLabel(city: City): string {
  return [city.name, city.state, city.country].filter(Boolean).join(", ");
}

export function groupForecastByDay(forecast: ForecastData): DailyForecastItem[] {
  const grouped = new Map<string, DailyForecastItem & { middayDistance: number }>();

  forecast.list.forEach((entry) => {
    const dateKey = entry.dt_txt.slice(0, 10);
    const existing = grouped.get(dateKey);
    const hour = Number(entry.dt_txt.slice(11, 13));
    const middayDistance = Math.abs(12 - hour);

    if (!existing) {
      grouped.set(dateKey, {
        dateKey,
        dt: entry.dt,
        tempMin: entry.main.temp_min,
        tempMax: entry.main.temp_max,
        humidity: entry.main.humidity,
        pop: entry.pop,
        weather: entry.weather[0],
        middayDistance,
      });
      return;
    }

    grouped.set(dateKey, {
      ...existing,
      dt: middayDistance < existing.middayDistance ? entry.dt : existing.dt,
      tempMin: Math.min(existing.tempMin, entry.main.temp_min),
      tempMax: Math.max(existing.tempMax, entry.main.temp_max),
      humidity: Math.round((existing.humidity + entry.main.humidity) / 2),
      pop: Math.max(existing.pop, entry.pop),
      weather: middayDistance < existing.middayDistance ? entry.weather[0] : existing.weather,
      middayDistance: Math.min(existing.middayDistance, middayDistance),
    });
  });

  return Array.from(grouped.values())
    .slice(0, 5)
    .map(
      (day) =>
        Object.fromEntries(Object.entries(day).filter(([key]) => key !== "middayDistance")) as DailyForecastItem,
    );
}

export function fallbackHourlyFromForecast(forecast: ForecastData): HourlyForecastItem[] {
  return forecast.list.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    feels_like: item.main.temp,
    humidity: item.main.humidity,
    pop: item.pop,
    weather: item.weather,
  }));
}
