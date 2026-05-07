"use client";

import { useState } from "react";

import { MAX_FAVORITES, STORAGE_KEYS } from "@/lib/constants";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.favorites);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const persist = (nextFavorites: string[]) => {
    setFavorites(nextFavorites);
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(nextFavorites));
  };

  const toggleFavorite = (city: string) => {
    const normalized = city.trim();
    if (!normalized) {
      return;
    }

    if (favorites.includes(normalized)) {
      persist(favorites.filter((item) => item !== normalized));
      return;
    }

    persist([normalized, ...favorites].slice(0, MAX_FAVORITES));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite: (city: string) => favorites.includes(city),
  };
}
