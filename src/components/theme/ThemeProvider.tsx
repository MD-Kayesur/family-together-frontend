"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Suppress React 19 / Next.js false-positive warning for next-themes SSR inline script
function suppressScriptTagWarning() {
  if (process.env.NODE_ENV === "development") {
    const orig = console.error;
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
        return;
      }
      orig.apply(console, args);
    };
  }
}

suppressScriptTagWarning();

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  React.useEffect(() => {
    suppressScriptTagWarning();
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
