import Image from "next/image";

import { Card } from "@/components/ui/card";
import { formatPrecipitation, formatTemperature, getWeatherIcon } from "@/lib/weather-utils";
import type { DailyForecastItem, TemperatureUnit } from "@/types/weather";

interface ForecastCardProps {
  forecast: DailyForecastItem[];
  timezone: number;
  unit: TemperatureUnit;
}

export function ForecastCard({ forecast, timezone, unit }: ForecastCardProps) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">5-day forecast</h2>
        <p className="text-sm text-white/60">Daily highs, lows, humidity, and rain chances.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {forecast.map((day) => (
          <div key={day.dateKey} className="rounded-2xl bg-white/8 p-4 text-white/90">
            <p className="text-sm font-medium text-white">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              }).format(new Date(day.dt * 1000 + timezone * 1000))}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <Image src={getWeatherIcon(day.weather.icon)} alt={day.weather.description} width={56} height={56} />
              <div className="text-right text-sm">
                <p>{formatTemperature(day.tempMax, unit)}</p>
                <p className="text-white/60">{formatTemperature(day.tempMin, unit)}</p>
              </div>
            </div>
            <p className="mt-2 text-sm capitalize text-white/80">{day.weather.main}</p>
            <p className="mt-1 text-xs text-white/60">Rain {formatPrecipitation(day.pop)}</p>
            <p className="mt-1 text-xs text-white/60">Humidity {day.humidity}%</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
