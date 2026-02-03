"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center p-2 transition-all duration-150 cursor-pointer
       hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-full"
    >
      <Sun className=" scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute  scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
