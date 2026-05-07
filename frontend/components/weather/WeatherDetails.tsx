import {
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ThermometerSun,
  Waves,
  Wind,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  formatTemperature,
  formatTime,
  formatVisibility,
  formatWindSpeed,
  getUvLabel,
  getWindDirection,
} from "@/lib/weather-utils";
import type { TemperatureUnit, WeatherData } from "@/types/weather";

interface WeatherDetailsProps {
  current: WeatherData;
  unit: TemperatureUnit;
  uvIndex: number | null;
}

const detailItems = (
  current: WeatherData,
  unit: TemperatureUnit,
  uvIndex: number | null,
) => [
  {
    icon: ThermometerSun,
    label: "Feels like",
    value: formatTemperature(current.main.feels_like, unit),
    helper: "RealFeel temperature",
  },
  {
    icon: Waves,
    label: "Humidity",
    value: `${current.main.humidity}%`,
    helper: "Moisture in the air",
  },
  {
    icon: Wind,
    label: "Wind",
    value: formatWindSpeed(current.wind.speed, unit),
    helper: `${getWindDirection(current.wind.deg)} • ${current.wind.deg}°`,
  },
  {
    icon: Gauge,
    label: "Pressure",
    value: `${current.main.pressure} hPa`,
    helper: "Atmospheric pressure",
  },
  {
    icon: Eye,
    label: "Visibility",
    value: formatVisibility(current.visibility),
    helper: "Current surface visibility",
  },
  {
    icon: ThermometerSun,
    label: "UV Index",
    value: uvIndex === null ? "Unavailable" : uvIndex.toFixed(1),
    helper: getUvLabel(uvIndex),
  },
  {
    icon: Sunrise,
    label: "Sunrise",
    value: formatTime(current.sys.sunrise, current.timezone),
    helper: "Local sunrise time",
  },
  {
    icon: Sunset,
    label: "Sunset",
    value: formatTime(current.sys.sunset, current.timezone),
    helper: "Local sunset time",
  },
];

export function WeatherDetails({ current, unit, uvIndex }: WeatherDetailsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {detailItems(current, unit, uvIndex).map(({ icon: Icon, label, value, helper }) => (
        <Card key={label} className="space-y-3">
          <div className="flex items-center gap-3 text-white/70">
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{value}</p>
            <p className="text-sm text-white/60">{helper}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
