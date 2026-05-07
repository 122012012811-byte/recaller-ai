import Image from "next/image";

import { Card } from "@/components/ui/card";
import { formatHour, formatPrecipitation, formatTemperature, getWeatherIcon } from "@/lib/weather-utils";
import type { HourlyForecastItem, TemperatureUnit } from "@/types/weather";

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  timezone: number;
  unit: TemperatureUnit;
}

export function HourlyForecast({ hourly, timezone, unit }: HourlyForecastProps) {
  const entries = hourly.slice(0, 24);
  if (entries.length === 0) {
    return (
      <Card className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Hourly forecast</h2>
        <p className="text-sm text-white/70">Hourly forecast data is not available for this location yet.</p>
      </Card>
    );
  }
  const maxTemp = Math.max(...entries.map((item) => item.temp));
  const minTemp = Math.min(...entries.map((item) => item.temp));
  const range = Math.max(maxTemp - minTemp, 1);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Hourly forecast</h2>
        <p className="text-sm text-white/60">Next 24 hours with temperature trend and conditions.</p>
      </div>
      <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-1">
        {entries.map((item) => {
          const height = 40 + ((item.temp - minTemp) / range) * 80;
          return (
            <div
              key={item.dt}
              className="min-w-[92px] rounded-2xl bg-white/8 p-3 text-center text-white"
              aria-label={`${formatHour(item.dt, timezone)}, ${formatTemperature(item.temp, unit)}, ${item.weather[0].description}`}
            >
              <p className="text-xs text-white/70">{formatHour(item.dt, timezone)}</p>
              <div className="mt-3 flex h-24 items-end justify-center">
                <div className="w-8 rounded-full bg-white/25" style={{ height }} />
              </div>
              <Image
                src={getWeatherIcon(item.weather[0].icon)}
                alt={item.weather[0].description}
                width={48}
                height={48}
                className="mx-auto mt-2"
              />
              <p className="mt-1 text-sm font-semibold">{formatTemperature(item.temp, unit)}</p>
              <p className="mt-1 text-[11px] text-white/65">Rain {formatPrecipitation(item.pop ?? 0)}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
