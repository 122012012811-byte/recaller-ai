"use client";

import { motion } from "framer-motion";

import { getWeatherGradient } from "@/lib/weather-utils";

export function WeatherBackground({ condition }: { condition: string }) {
  const gradient = getWeatherGradient(condition);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-gradient-to-br ${gradient}`} aria-hidden="true">
      <div className="absolute inset-0 bg-black/20" />
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute h-32 w-32 rounded-full bg-white/10 blur-3xl"
          initial={{
            opacity: 0.2,
            x: `${(index * 13) % 90}%`,
            y: `${(index * 17) % 90}%`,
          }}
          animate={{
            opacity: [0.15, 0.3, 0.15],
            x: [`${(index * 13) % 90}%`, `${((index * 13) % 90) + 5}%`, `${(index * 13) % 90}%`],
            y: [`${(index * 17) % 90}%`, `${((index * 17) % 90) + 4}%`, `${(index * 17) % 90}%`],
          }}
          transition={{ duration: 12 + index, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
