import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  /** Avoid Hydration Mismatch
   *  https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
   */
  if (!mounted) return null;
  
  return (
    <button
      type="button"
      className={`
        min-w-fit transition duration-500
        ${theme === "dark" ? "opacity-70 grayscale" : ""}
      `}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <img
        src={"/assets/theme-selector-icon.svg"}
        alt="Toggle theme"
        title="Toggle theme"
        width={24}
        height={24}
        className="max-w-24 max-h-24"
      />
    </button>
  );
}
