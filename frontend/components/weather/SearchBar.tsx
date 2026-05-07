"use client";

import { Clock3, MapPin, Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { getCityLabel } from "@/lib/weather-utils";
import { searchCities } from "@/lib/weather-api";
import type { City } from "@/types/weather";

interface SearchBarProps {
  onSearch: (city: string) => void | Promise<unknown>;
  recentSearches: string[];
  activeCity: string;
}

export function SearchBar({ onSearch, recentSearches, activeCity }: SearchBarProps) {
  const [query, setQuery] = useState(activeCity);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const nextSuggestions = await searchCities(query);
        setSuggestions(nextSuggestions);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    onSearch(query.trim());
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
        <Input
          aria-label="Search city"
          placeholder="Search for a city"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-11"
        />
      </form>
      {isOpen &&
      ((query.trim().length >= 2 && suggestions.length > 0) || recentSearches.length > 0 || isLoadingSuggestions) ? (
        <div className="absolute z-20 mt-2 w-full rounded-3xl border border-white/15 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-lg">
          {query.trim().length >= 2 && suggestions.length > 0 && (
            <div className="space-y-1">
              {suggestions.map((city) => (
                <button
                  key={`${city.name}-${city.lat}-${city.lon}`}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/10"
                  onClick={() => {
                    const label = getCityLabel(city);
                    setQuery(label);
                    onSearch(label);
                    setIsOpen(false);
                  }}
                >
                  <MapPin className="h-4 w-4 text-white/60" />
                  <span>{getCityLabel(city)}</span>
                </button>
              ))}
            </div>
          )}
          {recentSearches.length > 0 && (
            <div className="mt-2 border-t border-white/10 pt-2">
              <p className="px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/45">Recent searches</p>
              {recentSearches.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/10"
                  onClick={() => {
                    setQuery(city);
                    onSearch(city);
                    setIsOpen(false);
                  }}
                >
                  <Clock3 className="h-4 w-4 text-white/60" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          )}
          {isLoadingSuggestions && <p className="px-3 py-2 text-sm text-white/60">Loading suggestions…</p>}
        </div>
      ) : null}
    </div>
  );
}
