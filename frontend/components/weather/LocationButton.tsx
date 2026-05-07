import { LocateFixed, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LocationButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export function LocationButton({ isLoading, onClick }: LocationButtonProps) {
  return (
    <Button type="button" variant="secondary" onClick={onClick} disabled={isLoading} className="w-full sm:w-auto">
      {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
      Use my location
    </Button>
  );
}
