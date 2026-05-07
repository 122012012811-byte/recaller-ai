export type TemperatureUnit = "metric" | "imperial";

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
  dt: number;
  timezone: number;
  visibility: number;
}

export interface ForecastListItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  pop: number;
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastListItem[];
  city: {
    name: string;
    country: string;
    timezone: number;
    sunrise?: number;
    sunset?: number;
  };
}

export interface City {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface HourlyForecastItem {
  dt: number;
  temp: number;
  feels_like?: number;
  humidity: number;
  pop: number;
  uvi?: number;
  weather: WeatherCondition[];
}

export interface DailyForecastItem {
  dateKey: string;
  dt: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pop: number;
  weather: WeatherCondition;
}

export interface WeatherAlert {
  event: string;
  start: number;
  end: number;
  sender_name?: string;
  description: string;
}

export interface WeatherDashboardResponse {
  current: WeatherData;
  forecast: ForecastData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  uvIndex: number | null;
  alerts: WeatherAlert[];
}
