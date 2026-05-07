import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Recallr AI",
  description: "Recallr AI weather dashboard with secure weather API proxying and responsive forecasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-slate-950 font-sans text-white">{children}</body>
    </html>
  );
}
