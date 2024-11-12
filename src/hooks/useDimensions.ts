import { RefObject, useEffect, useState } from "react";

export const useDimensions = <T extends HTMLElement>(ref: RefObject<T>) => {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 800, height: 650 });

  useEffect(() => {
    // Function to update dimensions
    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Set initial dimensions on mount
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Cleanup the resize listener on unmount
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [ref]);

  return dimensions;
};
