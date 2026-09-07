import { useEffect, useRef } from "react";
import { AppState } from "react-native";

// 5 minutes timeout (5 minutes * 60 seconds * 1000 milliseconds)
const BACKGROUND_TIMEOUT = 5 * 60 * 1000;

export const useAutoLogout = (logout) => {
  const appState = useRef(AppState.currentState);
  const backgroundTimestamp = useRef(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // Save timestamp when app enters background
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        backgroundTimestamp.current = Date.now();
      }

      // Check elapsed time when app comes back to foreground
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (backgroundTimestamp.current) {
          const elapsedTime = Date.now() - backgroundTimestamp.current;

          if (elapsedTime >= BACKGROUND_TIMEOUT && typeof logout === "function") {
            logout();
          }
        }
        backgroundTimestamp.current = null;
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [logout]);
};