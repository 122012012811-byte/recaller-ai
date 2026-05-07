"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { FavoriteCities } from "@/components/weather/FavoriteCities";
import { ForecastCard } from "@/components/weather/ForecastCard";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { LocationButton } from "@/components/weather/LocationButton";
import { SearchBar } from "@/components/weather/SearchBar";
import { ThemeToggle } from "@/components/weather/ThemeToggle";
import { WeatherBackground } from "@/components/weather/WeatherBackground";
import { WeatherDetails } from "@/components/weather/WeatherDetails";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/useFavorites";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";

export function WeatherDashboard() {
  const weather = useWeather();
  const location = useGeolocation();
  const favorites = useFavorites();
  const data = weather.data;
  const condition = data?.current.weather[0]?.main ?? "Night";

  const handleLocationSearch = async () => {
    try {
      const coordinates = await location.getLocation();
      await weather.searchByCoordinates(coordinates.lat, coordinates.lon);
    } catch {
      // handled in hook state
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <WeatherBackground condition={condition} />
      <div className="relative z-10 min-h-screen px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">Recallr AI weather</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Modern weather dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                Real-time weather, 5-day outlooks, hourly trends, favorites, and location-aware search in a responsive glass-morphism UI.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start lg:self-auto">
              <ThemeToggle />
              <Button
                type="button"
                variant={weather.unit === "metric" ? "default" : "secondary"}
                size="sm"
                onClick={() => weather.setUnit(weather.unit === "metric" ? "imperial" : "metric")}
                aria-label="Toggle between Celsius and Fahrenheit"
              >
                {weather.unit === "metric" ? "°C / switch to °F" : "°F / switch to °C"}
              </Button>
            </div>
          </header>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchBar
              key={weather.activeCity}
              onSearch={weather.searchByCity}
              recentSearches={weather.recentSearches}
              activeCity={weather.activeCity}
            />
            <LocationButton isLoading={location.isLoading} onClick={handleLocationSearch} />
          </div>

          {weather.error || location.error ? (
            <Card className="flex items-start gap-3 bg-red-500/20 text-white">
              <AlertTriangle className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-medium">{weather.error ?? location.error}</p>
                <p className="text-sm text-white/75">If your API key is invalid, add OPENWEATHER_API_KEY to frontend/.env.local and restart the dev server.</p>
              </div>
            </Card>
          ) : null}

          {weather.isLoading || !data ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <Skeleton className="h-[320px] lg:col-span-2" />
              <Skeleton className="h-[320px]" />
              <Skeleton className="h-[240px] lg:col-span-3" />
              <Skeleton className="h-[240px] lg:col-span-3" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <CurrentWeather
                    current={data.current}
                    unit={weather.unit}
                    onToggleFavorite={() => favorites.toggleFavorite(data.current.name)}
                    isFavorite={favorites.isFavorite(data.current.name)}
                  />
                </div>
                <FavoriteCities
                  favorites={favorites.favorites}
                  activeCity={weather.activeCity}
                  onSelect={weather.searchByCity}
                  onToggleFavorite={favorites.toggleFavorite}
                />
              </div>

              <WeatherDetails current={data.current} unit={weather.unit} uvIndex={data.uvIndex} />
              <HourlyForecast hourly={data.hourly} timezone={data.current.timezone} unit={weather.unit} />
              <ForecastCard forecast={data.daily} timezone={data.current.timezone} unit={weather.unit} />

              {data.alerts.length > 0 ? (
                <Card className="space-y-3 border-amber-200/30 bg-amber-500/15">
                  <h2 className="text-xl font-semibold text-white">Weather alerts</h2>
                  {data.alerts.map((alert) => (
                    <div key={`${alert.event}-${alert.start}`} className="rounded-2xl bg-black/20 p-4">
                      <p className="font-medium text-white">{alert.event}</p>
                      <p className="mt-1 text-sm text-white/75">{alert.description}</p>
                    </div>
                  ))}
                </Card>
              ) : null}
            </>
          )}

          <footer className="flex flex-col gap-3 py-4 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>Keyboard accessible, responsive, and optimized for secure server-side weather API access.</p>
            <Link href="/" className="underline underline-offset-4 transition hover:text-white">
              Back to app home
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
