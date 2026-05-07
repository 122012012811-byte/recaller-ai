import { NextResponse } from "next/server";

import { OPEN_WEATHER_BASE_URL } from "@/lib/constants";
import { fallbackHourlyFromForecast, groupForecastByDay } from "@/lib/weather-utils";
import type {
  City,
  ForecastData,
  HourlyForecastItem,
  WeatherAlert,
  WeatherDashboardResponse,
  WeatherData,
} from "@/types/weather";

interface OneCallResponse {
  current?: {
    uvi?: number;
  };
  hourly?: HourlyForecastItem[];
  alerts?: WeatherAlert[];
}

const API_KEY = process.env.OPENWEATHER_API_KEY ?? process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export async function GET(request: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      {
        error:
          "Missing OpenWeatherMap API key. Add OPENWEATHER_API_KEY to frontend/.env.local before using the weather dashboard.",
      },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("search");
  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    if (query) {
      const suggestions = await fetchSuggestions(query);
      return NextResponse.json(suggestions);
    }

    if (city) {
      const current = await fetchWeather<WeatherData>("/data/2.5/weather", {
        q: city,
        appid: API_KEY,
        units: "metric",
      });

      const payload = await buildDashboardResponse(current);
      return NextResponse.json(payload);
    }

    if (lat && lon) {
      const current = await fetchWeather<WeatherData>("/data/2.5/weather", {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
      });

      const payload = await buildDashboardResponse(current);
      return NextResponse.json(payload);
    }

    return NextResponse.json({ error: "Provide a city name or coordinates." }, { status: 400 });
  } catch (error) {
    return handleWeatherError(error);
  }
}

async function buildDashboardResponse(current: WeatherData): Promise<WeatherDashboardResponse> {
  const params = {
    lat: String(current.coord.lat),
    lon: String(current.coord.lon),
    appid: API_KEY!,
    units: "metric",
  };

  const [forecast, oneCall] = await Promise.all([
    fetchWeather<ForecastData>("/data/2.5/forecast", params),
    fetchOneCall(params.lat, params.lon),
  ]);

  return {
    current,
    forecast,
    hourly: oneCall?.hourly?.slice(0, 24) ?? fallbackHourlyFromForecast(forecast),
    daily: groupForecastByDay(forecast),
    uvIndex: oneCall?.current?.uvi ?? null,
    alerts: oneCall?.alerts ?? [],
  };
}

async function fetchSuggestions(query: string): Promise<City[]> {
  return fetchWeather<City[]>("/geo/1.0/direct", {
    q: query,
    limit: "5",
    appid: API_KEY!,
  });
}

async function fetchOneCall(lat: string, lon: string): Promise<OneCallResponse | null> {
  const endpoints = ["/data/3.0/onecall", "/data/2.5/onecall"];

  for (const endpoint of endpoints) {
    try {
      return await fetchWeather<OneCallResponse>(endpoint, {
        lat,
        lon,
        appid: API_KEY!,
        units: "metric",
        exclude: "minutely,daily",
      });
    } catch (error) {
      if (error instanceof WeatherApiError && [401, 404].includes(error.status)) {
        continue;
      }
      throw error;
    }
  }

  return null;
}

async function fetchWeather<T>(path: string, params: Record<string, string>): Promise<T> {
  const endpoint = new URL(path, OPEN_WEATHER_BASE_URL);

  Object.entries(params).forEach(([key, value]) => {
    endpoint.searchParams.set(key, value);
  });

  const response = await fetch(endpoint, {
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new WeatherApiError(response.status, payload?.message ?? "Weather request failed");
  }

  return payload as T;
}

function handleWeatherError(error: unknown) {
  if (error instanceof WeatherApiError) {
    if (error.status === 404) {
      return NextResponse.json({ error: "City not found. Try a different search." }, { status: 404 });
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: "Your API key is invalid. Update OPENWEATHER_API_KEY in frontend/.env.local." },
        { status: 401 },
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 },
      );
    }
  }

  return NextResponse.json({ error: "Unable to fetch weather data right now." }, { status: 500 });
}

class WeatherApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
