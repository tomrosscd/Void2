import { useState, useEffect, useRef, useCallback } from "react";
import MacOSMode from "@/components/MacOSMode";
import VoidMode from "@/components/VoidMode";

export default function Home() {
  const [mode, setMode] = useState<"void" | "macos">("void");
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
