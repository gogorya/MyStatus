"use client";

// Clerk
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

// Next-themes
import { useTheme } from "next-themes";

export default function ClerkThemeProvider({ children }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider appearance={resolvedTheme === "dark" && { baseTheme: dark }}>
      {children}
    </ClerkProvider>
  );
}
