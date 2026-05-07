import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weather Dashboard | Recallr AI",
  description: "Responsive weather dashboard with forecasts, geolocation, favorites, and theme controls.",
};

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
