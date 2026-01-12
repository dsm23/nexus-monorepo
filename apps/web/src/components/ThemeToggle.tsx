import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useTheme } from "~/hooks/useTheme";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  const handleSetTheme = (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    theme: "light" | "dark" | "system",
  ) => {
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(theme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const transition = document.startViewTransition(() => {
      setTheme(theme);
    });

    transition.ready.then(() => {
      const root = document.documentElement;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      // Set the custom properties for the animation
      root.style.setProperty("--ripple-x", x + "px");
      root.style.setProperty("--ripple-y", y + "px");
      root.style.setProperty("--ripple-radius", endRadius + "px");

      // Add the class to trigger the animation in CSS
      root.classList.add("is-rippling");

      // Clean up the class after the animation is done
      setTimeout(() => {
        root.classList.remove("is-rippling");
        root.style.removeProperty("--ripple-x");
        root.style.removeProperty("--ripple-y");
        root.style.removeProperty("--ripple-radius");
      }, 600); // Must match animation duration in CSS
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => handleSetTheme(e, "light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleSetTheme(e, "dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleSetTheme(e, "system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
