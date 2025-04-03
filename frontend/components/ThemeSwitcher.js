"use client";

// UI components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {resolvedTheme === "light" ? (
              <span>&#9728;</span>
            ) : (
              <span>&#9790;</span>
            )}
            Theme
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                setTheme("light");
              }}
            >
              <span>&#9728; Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setTheme("dark");
              }}
            >
              <span>&#9790; Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setTheme("system");
              }}
            >
              <span>&#9881; System</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
