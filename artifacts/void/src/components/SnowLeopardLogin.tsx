import { useState, useRef, useEffect } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// This is a soft client-side gate — not cryptographic security.
// Change the value below to set your password.
const GATE_PASSWORD = "leopard";
// ─────────────────────────────────────────────────────────────────────────────

interface SnowLeopardLoginProps {
  onUnlock: () => void;
}

export default function SnowLeopardLogin({ onUnlock }: SnowLeopardLoginProps) {
  const [password, setPassword] = useState("");
  const [shaking, setShaking] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the password field on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const attempt = () => {
    if (password === GATE_PASSWORD) {
      // Begin the "login" dismiss animation
      setDismissing(true);
      // Hand off to parent after the CSS transition completes
      setTimeout(onUnlock, 700);
    } else {
      // Wrong password — shake the dialog and clear the field
      setShaking(true);
      setPassword("");
      setTimeout(() => setShaking(false), 500);
      inputRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") attempt();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        // Snow Leopard login background: deep blue-grey radial gradient
        background: `
          radial-gradient(ellipse at 50% 35%, #3d5a80 0%, #1c2e4a 40%, #0d1b2e 100%)
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Lucida Grande', 'Lucida Sans Unicode', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        // Fade the entire overlay out when dismissing
        opacity: dismissing ? 0 : 1,
        transition: dismissing ? "opacity 0.7s ease" : "none",
        pointerEvents: dismissing ? "none" : "auto",
      }}
    >
      {/* Subtle noise / grain overlay to mimic brushed-metal texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      {/* Login dialog — centred card */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          // Shake keyframe is applied via a className trick via inline style + animation
          animation: shaking ? "snl-shake 0.5s ease" : "none",
        }}
      >
        {/* User avatar tile */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            // A simple placeholder avatar — replace with an <img> if desired
            background: "linear-gradient(145deg, #6b8fb5 0%, #2c5282 60%, #1a365d 100%)",
            border: "3px solid rgba(255,255,255,0.25)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            overflow: "hidden",
          }}
        >
          {/* Generic user silhouette */}
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="16" r="8" fill="rgba(255,255,255,0.6)" />
            <ellipse cx="22" cy="38" rx="14" ry="10" fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>

        {/* User name */}
        <p
          style={{
            color: "rgba(255,255,255,0.92)",
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.01em",
            marginBottom: 18,
            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          }}
        >
          Tom Ross
        </p>

        {/* Password input — Snow Leopard rounded field */}
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Password"
          style={{
            width: 200,
            height: 26,
            borderRadius: 13,
            border: "1px solid rgba(0,0,0,0.45)",
            // Snow Leopard input field: slight gradient, inset shadow
            background: "linear-gradient(180deg, #e8edf5 0%, #f4f6fa 100%)",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.1)",
            padding: "0 12px",
            fontSize: "0.82rem",
            color: "#111",
            outline: "none",
            textAlign: "center",
            letterSpacing: "0.02em",
            // The glowing blue focus ring is handled via the :focus pseudo-class
            // We add it via the onFocus/onBlur inline style trick below
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow =
              "inset 0 1px 3px rgba(0,0,0,0.15), 0 0 0 3px rgba(74,144,226,0.55)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow =
              "inset 0 1px 3px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.1)";
          }}
        />

        {/* Login button */}
        <button
          onClick={attempt}
          style={{
            marginTop: 14,
            width: 200,
            height: 26,
            borderRadius: 13,
            border: "1px solid #2a6496",
            // Classic Aqua button gradient — blue pill
            background: "linear-gradient(180deg, #6ab0f5 0%, #4a90e2 45%, #2a72c3 46%, #3a84d8 100%)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
            color: "#fff",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            cursor: "pointer",
            textShadow: "0 1px 1px rgba(0,0,0,0.3)",
            outline: "none",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(180deg, #3a84d8 0%, #2a72c3 100%)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(180deg, #6ab0f5 0%, #4a90e2 45%, #2a72c3 46%, #3a84d8 100%)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(180deg, #6ab0f5 0%, #4a90e2 45%, #2a72c3 46%, #3a84d8 100%)";
          }}
        >
          Log In
        </button>
      </div>

      {/* Keyframe for the wrong-password shake */}
      <style>{`
        @keyframes snl-shake {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-8px); }
          30%  { transform: translateX(8px); }
          45%  { transform: translateX(-6px); }
          60%  { transform: translateX(6px); }
          75%  { transform: translateX(-3px); }
          90%  { transform: translateX(3px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
