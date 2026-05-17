import React from "react";

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    // Handle test environment where matchMedia might not be available
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const result = matchMedia(query);
    if (result && typeof result.addEventListener === "function") {
      result.addEventListener("change", onChange);
      setValue(result.matches);

      return () => {
        if (typeof result.removeEventListener === "function") {
          result.removeEventListener("change", onChange);
        }
      };
    }
  }, [query]);

  return value;
}
