import Image from "next/image";
import { MapPin, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getWeatherIcon, formatDateTime, formatTemperature } from "@/lib/weather-utils";
import type { TemperatureUnit, WeatherData } from "@/types/weather";

interface CurrentWeatherProps {
  current: WeatherData;
  unit: TemperatureUnit;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export function CurrentWeather({ current, unit, onToggleFavorite, isFavorite }: CurrentWeatherProps) {
  const weather = current.weather[0];

  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4" />
            <span>
              {current.name}, {current.sys.country}
            </span>
          </div>
          <div>
            <p className="text-6xl font-semibold tracking-tight text-white sm:text-7xl">
              {formatTemperature(current.main.temp, unit)}
            </p>
            <p className="mt-2 text-lg text-white/80 capitalize">{weather.description}</p>
            <p className="mt-1 text-sm text-white/60">
              Feels like {formatTemperature(current.main.feels_like, unit)} • {formatDateTime(current.dt, current.timezone)}
            </p>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4 lg:flex-col lg:items-end">
          <button
            type="button"
            onClick={onToggleFavorite}
            className="rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={isFavorite ? "Remove city from favorites" : "Add city to favorites"}
          >
            <Star className={`h-5 w-5 ${isFavorite ? "fill-current text-yellow-300" : "text-white"}`} />
          </button>
          <div className="rounded-3xl bg-white/10 p-4">
            <Image
              src={getWeatherIcon(weather.icon)}
              alt={weather.description}
              width={112}
              height={112}
              priority
              className="h-20 w-20 sm:h-28 sm:w-28"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
