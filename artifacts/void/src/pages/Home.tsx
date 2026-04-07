import { useState, useEffect, useRef, useCallback } from "react";
import MacOSMode from "@/components/MacOSMode";
import VoidMode from "@/components/VoidMode";

export default function Home() {
  // Default to the macOS Leopard view on first load.
  // Toggle still works — users can switch to "void" and back freely.
  const [mode, setMode] = useState<"void" | "macos">("macos");
  const [transitioning, setTransitioning] = useState(false);

  const toggleMode = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setMode((m) => (m === "void" ? "macos" : "void"));
      setTransitioning(false);
    }, 350);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        transition: "opacity 0.35s ease",
        opacity: transitioning ? 0 : 1,
      }}
      key={transitioning ? "transitioning" : "stable"}
    >
      {mode === "void" ? (
        <VoidMode onToggle={toggleMode} />
      ) : (
        <MacOSMode onToggle={toggleMode} />
      )}
    </div>
  );
}
