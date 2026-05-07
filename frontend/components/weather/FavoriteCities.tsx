import { Heart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FavoriteCitiesProps {
  favorites: string[];
  activeCity: string;
  onSelect: (city: string) => void | Promise<unknown>;
  onToggleFavorite: (city: string) => void;
}

export function FavoriteCities({ favorites, activeCity, onSelect, onToggleFavorite }: FavoriteCitiesProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2 text-white">
        <Heart className="h-5 w-5" />
        <div>
          <h2 className="text-xl font-semibold">Favorite cities</h2>
          <p className="text-sm text-white/60">Quickly switch between your saved places.</p>
        </div>
      </div>
      {favorites.length === 0 ? (
        <p className="text-sm text-white/70">Star a city to pin it here for quick access.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {favorites.map((city) => {
            const active = city === activeCity;
            return (
              <div key={city} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <Button type="button" variant={active ? "default" : "ghost"} size="sm" onClick={() => onSelect(city)}>
                  {city}
                </Button>
                <button
                  type="button"
                  className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  onClick={() => onToggleFavorite(city)}
                  aria-label={`Remove ${city} from favorites`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
