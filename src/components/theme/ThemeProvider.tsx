"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import Cookies from 'js-cookie';

const THEME_COOKIE = 'typing_spot_theme';

function ThemeHandler() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      Cookies.set(THEME_COOKIE, theme, {
        expires: 365,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
    }
  }, [theme]);

  return null;
}

export function ThemeProvider({ children, ...props }: { children: React.ReactNode } & Parameters<typeof NextThemesProvider>[0]) {
  return (
    <NextThemesProvider
      {...props}
      storageKey={THEME_COOKIE}
      enableSystem
      attribute="class"
      defaultTheme="system"
      enableColorScheme
    >
      <ThemeHandler />
      {children}
    </NextThemesProvider>
  );
} 