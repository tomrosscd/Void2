import { useState, useEffect, useRef, useCallback } from "react";
import { projects } from "@/data/projects";
import leopardWallpaper from "@assets/OSCleoparddefaultdesktop_1775484245631.jpg";

interface MacOSModeProps {
  onToggle: () => void;
}

export default function MacOSMode({ onToggle }: MacOSModeProps) {
  const [windowPos, setWindowPos] = useState({ x: 60, y: 30 });
  const [windowSize, setWindowSize] = useState({ w: 860, h: 580 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(2);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [coverFlowH, setCoverFlowH] = useState(300);
  const dividerDragging = useRef(false);
  const dividerStartY = useRef(0);
  const dividerStartH = useRef(0);

  const startDrag = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - windowPos.x,
      y: e.clientY - windowPos.y,
    };
    e.preventDefault();
  }, [windowPos]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      setWindowPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const startDivider = useCallback((e: React.MouseEvent) => {
    dividerDragging.current = true;
    dividerStartY.current = e.clientY;
    dividerStartH.current = coverFlowH;
    e.preventDefault();
  }, [coverFlowH]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dividerDragging.current) return;
      const delta = e.clientY - dividerStartY.current;
      setCoverFlowH(Math.max(160, Math.min(420, dividerStartH.current + delta)));
    };
    const onUp = () => { dividerDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const selectProject = (i: number) => {
    setSelectedIndex(i);
    setActiveIndex(i);
  };

  const prev = () => {
    const ni = Math.max(0, activeIndex - 1);
    setActiveIndex(ni);
    setSelectedIndex(ni);
  };
  const next = () => {
    const ni = Math.min(projects.length - 1, activeIndex + 1);
    setActiveIndex(ni);
    setSelectedIndex(ni);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        fontFamily: "'-apple-system', 'Lucida Grande', 'Helvetica Neue', Arial, sans-serif",
        backgroundImage: `url(${leopardWallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        userSelect: dragging ? "none" : "auto",
      }}
    >
      <LeopardMenuBar onToggle={onToggle} />

      <div
        ref={windowRef}
        style={{
          position: "absolute",
          left: windowPos.x,
          top: windowPos.y,
          width: windowSize.w,
          height: windowSize.h,
          display: "flex",
          flexDirection: "column",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow:
            "0 28px 80px rgba(0,0,0,0.85), 0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
          border: "1px solid rgba(0,0,0,0.8)",
          minWidth: 500,
          minHeight: 320,
        }}
      >
        <LeopardTitleBar onMouseDown={startDrag} />
        <LeopardToolbar />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <LeopardSidebar selectedIndex={selectedIndex} onSelect={selectProject} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#2e2e2e" }}>
            <LeopardCoverFlow
              activeIndex={activeIndex}
              setActiveIndex={(i) => { setActiveIndex(i); setSelectedIndex(i); }}
              onPrev={prev}
              onNext={next}
              height={coverFlowH}
            />
            <LeopardDivider onMouseDown={startDivider} />
            <LeopardListView
              selectedIndex={selectedIndex}
              onSelect={selectProject}
            />
          </div>
        </div>
        <LeopardStatusBar selectedIndex={selectedIndex} />
      </div>

      <LeopardDock onToggle={onToggle} />
    </div>
  );
}

function LeopardButton({ onClick, label, small }: { onClick: () => void; label: string; small?: boolean }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: pressed
          ? "linear-gradient(180deg, #b8d4ee 0%, #9bbde0 100%)"
          : "linear-gradient(180deg, #f0f6fd 0%, #c8dff4 55%, #b0cfe8 56%, #c2d8ef 100%)",
        border: "1px solid #7aabcc",
        borderRadius: 5,
        padding: small ? "0 7px" : "0 12px",
        height: small ? 16 : 20,
        fontSize: small ? "0.63rem" : "0.72rem",
        color: "#222",
        cursor: "pointer",
        fontFamily: "-apple-system, 'Lucida Grande', 'Helvetica Neue', Arial, sans-serif",
        fontWeight: 400,
        letterSpacing: "0.01em",
        boxShadow: pressed
          ? "inset 0 1px 3px rgba(0,0,0,0.15)"
          : "0 1px 2px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
        outline: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function LeopardMenuBar({ onToggle }: { onToggle: () => void }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 22,
        background: "linear-gradient(180deg, rgba(195,195,195,0.96) 0%, rgba(168,168,168,0.96) 50%, rgba(155,155,155,0.96) 51%, rgba(162,162,162,0.96) 100%)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        borderBottom: "1px solid rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 14, color: "#000", fontWeight: 900 }}>&#63743;</span>
        {["Finder", "File", "Edit", "View", "Go", "Window", "Help"].map((label) => (
          <span key={label} style={{ fontSize: "0.72rem", fontWeight: label === "Finder" ? 700 : 400, color: "#000", cursor: "default", padding: "1px 5px" }}>
            {label}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <LeopardButton onClick={onToggle} label="Switch Mode" />
        <span style={{ fontSize: "0.7rem", color: "#000", letterSpacing: "0.02em" }}>
          {time.toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

function TrafficLight({ color, darkColor }: { color: string; darkColor: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 13, height: 13, borderRadius: "50%",
        background: `radial-gradient(circle at 38% 38%, ${lighten(color, 22)} 0%, ${color} 55%, ${darken(color, 18)} 100%)`,
        border: `0.5px solid ${darkColor}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 1px rgba(0,0,0,0.3)`,
        cursor: "default",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {hov && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, color: "rgba(0,0,0,0.5)", fontWeight: 900, lineHeight: 1,
        }}>
          ×
        </div>
      )}
    </div>
  );
}

function YellowLight() {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 13, height: 13, borderRadius: "50%",
        background: "radial-gradient(circle at 38% 38%, #ffeb7a 0%, #f4b700 55%, #c98f00 100%)",
        border: "0.5px solid #a07000",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 1px rgba(0,0,0,0.3)",
        cursor: "default",
      }}
    />
  );
}
function GreenLight() {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 13, height: 13, borderRadius: "50%",
        background: "radial-gradient(circle at 38% 38%, #7efb7e 0%, #28c840 55%, #1a9a2d 100%)",
        border: "0.5px solid #0d7020",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 1px rgba(0,0,0,0.3)",
        cursor: "default",
      }}
    />
  );
}

function lighten(hex: string, pct: number): string {
  const n = parseInt(hex.replace("#",""), 16);
  const r = Math.min(255, (n >> 16) + pct * 2.55);
  const g = Math.min(255, ((n >> 8) & 0xff) + pct * 2.55);
  const b = Math.min(255, (n & 0xff) + pct * 2.55);
  return `rgb(${r|0},${g|0},${b|0})`;
}
function darken(hex: string, pct: number): string {
  const n = parseInt(hex.replace("#",""), 16);
  const r = Math.max(0, (n >> 16) - pct * 2.55);
  const g = Math.max(0, ((n >> 8) & 0xff) - pct * 2.55);
  const b = Math.max(0, (n & 0xff) - pct * 2.55);
  return `rgb(${r|0},${g|0},${b|0})`;
}

function LeopardTitleBar({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        height: 28,
        background: `linear-gradient(180deg,
          #c8c8c8 0%, #b4b4b4 45%,
          #9e9e9e 46%, #ababab 100%
        )`,
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        gap: 6,
        borderBottom: "1px solid rgba(0,0,0,0.45)",
        flexShrink: 0,
        cursor: "move",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <TrafficLight color="#ff5f57" darkColor="#cc2200" />
        <YellowLight />
        <GreenLight />
      </div>

      <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
        {["◀", "▶"].map((ch, i) => (
          <div
            key={i}
            style={{
              width: 26, height: 20,
              background: "linear-gradient(180deg, #d0d0d0 0%, #b4b4b4 45%, #9e9e9e 46%, #ababab 100%)",
              border: "1px solid rgba(0,0,0,0.28)",
              borderRadius: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.5rem", color: "rgba(0,0,0,0.55)",
              cursor: "default",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            {ch}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          fontSize: "0.72rem", color: "rgba(0,0,0,0.7)", fontWeight: 600,
          display: "flex", alignItems: "center", gap: 5,
          pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: "0.85rem" }}>📁</span>
        Void — Projects
      </div>

      <div
        style={{
          marginLeft: "auto",
          width: 14, height: 14, borderRadius: "50%",
          background: "linear-gradient(180deg, #c8c8c8 0%, #aaa 100%)",
          border: "1px solid rgba(0,0,0,0.25)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
          cursor: "default",
          flexShrink: 0,
        }}
      />
    </div>
  );
}

function ViewIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <rect x="1" y="1" width="7" height="6" rx="1" stroke="rgba(0,0,0,0.55)" strokeWidth="1.3" fill="none"/>
      <rect x="12" y="1" width="7" height="6" rx="1" stroke="rgba(0,0,0,0.55)" strokeWidth="1.3" fill="none"/>
      <rect x="1" y="9" width="7" height="6" rx="1" stroke="rgba(0,0,0,0.55)" strokeWidth="1.3" fill="none"/>
      <rect x="12" y="9" width="7" height="6" rx="1" stroke="rgba(0,0,0,0.55)" strokeWidth="1.3" fill="none"/>
    </svg>
  );
}

function QuickLookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.4"/>
      <line x1="11.6" y1="11.6" x2="16" y2="16" stroke="rgba(0,0,0,0.55)" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="5.5" y1="7.5" x2="9.5" y2="7.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7.5" y1="5.5" x2="7.5" y2="9.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function ActionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="3.2" fill="rgba(0,0,0,0.5)"/>
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 9 + 4.2 * Math.cos(rad);
        const y1 = 9 + 4.2 * Math.sin(rad);
        const x2 = 9 + 6.2 * Math.cos(rad);
        const y2 = 9 + 6.2 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.5)" strokeWidth="2.2" strokeLinecap="round"/>;
      })}
    </svg>
  );
}

function DropboxIcon() {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
      <path d="M9 1L17 5.5L9 10L1 5.5L9 1Z" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" fill="rgba(0,0,0,0.08)" strokeLinejoin="round"/>
      <path d="M1 5.5V11.5L9 16L17 11.5V5.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
      <line x1="9" y1="10" x2="9" y2="16" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2"/>
    </svg>
  );
}

const VIEW_ICONS = [
  <svg key="icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="2" width="8" height="8" rx="1.5" fill="rgba(0,0,0,0.5)"/>
    <rect x="12" y="2" width="8" height="8" rx="1.5" fill="rgba(0,0,0,0.5)"/>
    <rect x="2" y="12" width="8" height="8" rx="1.5" fill="rgba(0,0,0,0.5)"/>
    <rect x="12" y="12" width="8" height="8" rx="1.5" fill="rgba(0,0,0,0.5)"/>
  </svg>,
  <svg key="list" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <line x1="3" y1="5" x2="19" y2="5" stroke="rgba(0,0,0,0.55)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="11" x2="19" y2="11" stroke="rgba(0,0,0,0.55)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="17" x2="19" y2="17" stroke="rgba(0,0,0,0.55)" strokeWidth="2" strokeLinecap="round"/>
  </svg>,
  <svg key="col" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="2" width="5" height="18" rx="1" fill="rgba(0,0,0,0.5)"/>
    <rect x="9" y="2" width="5" height="18" rx="1" fill="rgba(0,0,0,0.5)"/>
    <rect x="16" y="2" width="4" height="18" rx="1" fill="rgba(0,0,0,0.5)"/>
  </svg>,
  <svg key="cf" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="7" y="3" width="8" height="10" rx="1" fill="white" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>
    <rect x="2" y="5" width="5" height="8" rx="1" fill="rgba(0,0,0,0.25)" transform="perspective(40) rotateY(30deg)"/>
    <rect x="15" y="5" width="5" height="8" rx="1" fill="rgba(0,0,0,0.25)" transform="perspective(40) rotateY(-30deg)"/>
    <line x1="7" y1="14" x2="15" y2="14" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
    <rect x="6" y="15" width="10" height="4" rx="1" fill="rgba(0,0,0,0.15)"/>
  </svg>,
];

function LeopardToolbar() {
  return (
    <div
      style={{
        height: 56,
        background: `linear-gradient(180deg,
          #e0e0e0 0%, #cecece 45%,
          #b8b8b8 46%, #c4c4c4 100%
        )`,
        borderBottom: "1px solid rgba(0,0,0,0.28)",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        gap: 4,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          background: "linear-gradient(180deg, #d4d4d4 0%, #bebebe 45%, #a8a8a8 46%, #b4b4b4 100%)",
          border: "1px solid rgba(0,0,0,0.25)",
          borderRadius: 5,
          overflow: "hidden",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 1px rgba(0,0,0,0.1)",
        }}
      >
        {VIEW_ICONS.map((icon, i) => (
          <div
            key={i}
            title={["Icon View","List View","Column View","Cover Flow"][i]}
            style={{
              width: 30, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: i === 3
                ? "linear-gradient(180deg, #738eb8 0%, #4a6fa5 45%, #3a5d92 46%, #4a80b8 100%)"
                : "transparent",
              borderRight: i < 3 ? "1px solid rgba(0,0,0,0.18)" : "none",
              cursor: "default",
              position: "relative",
            }}
          >
            <div style={{ transform: "scale(0.75)", opacity: i === 3 ? 1 : 0.7 }}>
              {i === 3
                ? <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="7" y="2" width="8" height="11" rx="1" fill="white" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
                    <rect x="1.5" y="4" width="5.5" height="9" rx="1" fill="rgba(255,255,255,0.35)" />
                    <rect x="15" y="4" width="5.5" height="9" rx="1" fill="rgba(255,255,255,0.35)" />
                    <line x1="6" y1="14" x2="16" y2="14" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
                    <rect x="7" y="15" width="8" height="3" rx="1" fill="rgba(255,255,255,0.25)"/>
                  </svg>
                : icon}
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: 1, height: 36, background: "rgba(0,0,0,0.15)", margin: "0 4px" }} />

      <div style={{ display: "flex", gap: 0 }}>
        {[
          { icon: <ViewIcon />, label: "View" },
          { icon: <QuickLookIcon />, label: "Quick Look" },
          { icon: <ActionIcon />, label: "Action" },
          { icon: <DropboxIcon />, label: "Dropbox" },
        ].map((btn, i) => (
          <ToolbarButton key={btn.label} icon={btn.icon} label={btn.label} />
        ))}
      </div>

      <div style={{ marginLeft: "auto" }}>
        <div
          style={{
            height: 22, width: 160,
            background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(242,242,242,0.85) 100%)",
            border: "1px solid rgba(0,0,0,0.3)",
            borderRadius: 11,
            display: "flex", alignItems: "center", padding: "0 8px", gap: 5,
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="4.5" cy="4.5" r="3.5" stroke="rgba(0,0,0,0.4)" strokeWidth="1.2"/>
            <line x1="7.2" y1="7.2" x2="10" y2="10" stroke="rgba(0,0,0,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: "0.7rem", color: "rgba(0,0,0,0.35)", fontStyle: "italic" }}>Search</span>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "4px 8px", height: 46, minWidth: 52,
        background: hov ? "rgba(0,0,0,0.06)" : "transparent",
        borderRadius: 5,
        cursor: "default",
        gap: 3,
      }}
    >
      <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <span style={{ fontSize: "0.62rem", color: "rgba(0,0,0,0.6)", whiteSpace: "nowrap", letterSpacing: "0.01em" }}>
        {label}
      </span>
    </div>
  );
}

const sidebarGroups = [
  {
    label: "DEVICES",
    items: [
      { icon: "💿", label: "Macintosh HD" },
      { icon: "📀", label: "iDisk" },
    ],
  },
  {
    label: "SHARED",
    items: [
      { icon: "🖥", label: "Castle" },
      { icon: "🖥", label: "ismh15" },
      { icon: "🖥", label: "ismhpro" },
    ],
  },
  {
    label: "PLACES",
    items: [
      { icon: "🏠", label: "Desktop" },
      { icon: "📁", label: "Projects" },
      { icon: "🚀", label: "Applications" },
      { icon: "📄", label: "Documents" },
      { icon: "🎬", label: "Movies" },
      { icon: "🎵", label: "Music" },
      { icon: "🖼", label: "Pictures" },
      { icon: "🔧", label: "Utilities" },
    ],
  },
  {
    label: "SEARCH FOR",
    items: [
      { icon: "🕐", label: "Today" },
      { icon: "🕐", label: "Yesterday" },
      { icon: "🕐", label: "Past Week" },
      { icon: "🖼", label: "All Images" },
      { icon: "🎬", label: "All Movies" },
      { icon: "📄", label: "All Documents" },
    ],
  },
];

function LeopardSidebar({ selectedIndex, onSelect }: { selectedIndex: number; onSelect: (i: number) => void }) {
  const [hovItem, setHovItem] = useState<string | null>(null);
  const activeLabel = "Projects";

  return (
    <div
      style={{
        width: 148,
        flexShrink: 0,
        background: `linear-gradient(180deg, #dcdcdc 0%, #d0d0d0 100%)`,
        borderRight: "1px solid rgba(0,0,0,0.22)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {sidebarGroups.map((group) => (
        <div key={group.label}>
          <div
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              color: "rgba(0,0,0,0.42)",
              padding: "8px 10px 2px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <svg width="7" height="5" viewBox="0 0 7 5" fill="rgba(0,0,0,0.4)">
              <path d="M0 0L7 0L3.5 5Z"/>
            </svg>
            {group.label}
          </div>
          {group.items.map((item, i) => {
            const isActive = item.label === activeLabel;
            const isHov = hovItem === group.label + item.label;
            return (
              <div
                key={item.label}
                onMouseEnter={() => setHovItem(group.label + item.label)}
                onMouseLeave={() => setHovItem(null)}
                onClick={() => {}}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "2px 6px 2px 14px",
                  cursor: "default",
                  borderRadius: 4,
                  margin: "0 3px",
                  background: isActive
                    ? "linear-gradient(180deg, #6a99d8 0%, #3a6db8 100%)"
                    : isHov ? "rgba(0,0,0,0.06)" : "transparent",
                  boxShadow: isActive ? "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.2)" : "none",
                }}
              >
                <span style={{ fontSize: "0.78rem", width: 16, textAlign: "center", lineHeight: 1.2 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: isActive ? "#fff" : "rgba(0,0,0,0.7)",
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textShadow: isActive ? "0 1px 1px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function LeopardCoverFlow({
  activeIndex,
  setActiveIndex,
  onPrev,
  onNext,
  height,
}: {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  height: number;
}) {
  const CARD_W = 140;
  const CARD_H = 130;

  const getCardStyle = (i: number): React.CSSProperties => {
    const offset = i - activeIndex;
    const absOffset = Math.abs(offset);
    if (absOffset > 4) return { display: "none" };
    const sign = offset < 0 ? -1 : 1;
    const rotateY = offset === 0 ? 0 : sign * 65;
    const translateX = offset === 0 ? 0 : sign * (absOffset * 80 + 40);
    const translateZ = offset === 0 ? 30 : -60 - absOffset * 20;
    const scale = offset === 0 ? 1 : Math.max(0.55, 0.75 - absOffset * 0.08);
    const opacity = absOffset > 3 ? 0 : 1;
    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: CARD_W,
      height: CARD_H,
      transform: `translateX(calc(-50% + ${translateX}px)) translateY(-50%) perspective(900px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
      transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s",
      opacity,
      zIndex: 20 - absOffset,
      cursor: "pointer",
    };
  };

  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        height,
        background: "linear-gradient(180deg, #111 0%, #1a1a1a 100%)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          perspective: "900px",
        }}
      >
        {projects.map((project, i) => {
          const offset = i - activeIndex;
          if (Math.abs(offset) > 4) return null;
          return (
            <div
              key={project.id}
              style={getCardStyle(i)}
              onClick={() => {
                if (i === activeIndex) window.open(project.url, "_blank");
                else setActiveIndex(i);
              }}
            >
              <CoverFlowCard project={project} isActive={i === activeIndex} cardW={CARD_W} cardH={CARD_H} />
            </div>
          );
        })}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: "6px 12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          background: "rgba(0,0,0,0.3)",
        }}
      >
        {activeIndex >= 0 && (
          <div style={{ textAlign: "center", lineHeight: 1.2 }}>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.88)", fontWeight: 600 }}>
              {projects[activeIndex].title}
            </div>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.45)" }}>
              {projects[activeIndex].description}
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={onPrev}
            disabled={activeIndex === 0}
            style={{
              width: 16, height: 16, borderRadius: "50%",
              background: "linear-gradient(180deg, #555 0%, #333 100%)",
              border: "1px solid rgba(0,0,0,0.5)",
              color: activeIndex === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
              fontSize: 8, cursor: activeIndex === 0 ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ◀
          </button>

          <div
            ref={sliderRef}
            style={{
              flex: 1, height: 14,
              background: "linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)",
              borderRadius: 7,
              border: "1px solid rgba(0,0,0,0.6)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={(e) => {
              if (!sliderRef.current) return;
              const rect = sliderRef.current.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const idx = Math.round(pct * (projects.length - 1));
              setActiveIndex(Math.max(0, Math.min(projects.length - 1, idx)));
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `${(activeIndex / (projects.length - 1)) * 100}%`,
                transform: "translate(-50%, -50%)",
                width: 16, height: 16, borderRadius: "50%",
                background: "linear-gradient(180deg, #d8d8d8 0%, #b0b0b0 45%, #989898 46%, #a8a8a8 100%)",
                border: "1px solid rgba(0,0,0,0.4)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.4)",
                transition: "left 0.3s",
              }}
            />
          </div>

          <button
            onClick={onNext}
            disabled={activeIndex === projects.length - 1}
            style={{
              width: 16, height: 16, borderRadius: "50%",
              background: "linear-gradient(180deg, #555 0%, #333 100%)",
              border: "1px solid rgba(0,0,0,0.5)",
              color: activeIndex === projects.length - 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
              fontSize: 8, cursor: activeIndex === projects.length - 1 ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

function CoverFlowCard({
  project,
  isActive,
  cardW,
  cardH,
}: {
  project: typeof projects[0];
  isActive: boolean;
  cardW: number;
  cardH: number;
}) {
  return (
    <div style={{ width: cardW, height: cardH * 2, position: "relative" }}>
      <div
        style={{
          width: cardW,
          height: cardH,
          borderRadius: 4,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${project.color} 0%, #0a0a14 100%)`,
          position: "relative",
          border: isActive ? "2px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.12)",
          boxShadow: isActive
            ? "0 6px 20px rgba(0,0,0,0.8)"
            : "0 3px 10px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at 30% 35%, ${project.accent}66 0%, transparent 65%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "20px 8px 6px",
          background: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
          fontSize: "0.58rem", fontWeight: 700, color: "#fff",
          textAlign: "center",
        }}>
          {project.title}
        </div>
      </div>

      <div
        style={{
          width: cardW,
          height: cardH,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${project.color} 0%, #0a0a14 100%)`,
          transform: "scaleY(-1)",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 70%)",
          position: "relative",
          marginTop: 1,
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at 30% 65%, ${project.accent}55 0%, transparent 65%)`,
        }} />
      </div>
    </div>
  );
}

function LeopardDivider({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 10,
        background: `linear-gradient(180deg, #1a1a1a 0%, #282828 40%, #2e2e2e 100%)`,
        borderTop: "1px solid #111",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        cursor: "ns-resize",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div style={{
        display: "flex", gap: 2, alignItems: "center",
      }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: 3, height: 3,
            borderRadius: "50%",
            background: hov ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.18)",
          }} />
        ))}
      </div>
    </div>
  );
}

function LeopardListView({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  const [hovRow, setHovRow] = useState<number | null>(null);
  const [sortCol, setSortCol] = useState<string>("Name");
  const [sortAsc, setSortAsc] = useState(true);

  const cols = [
    { label: "Name", width: "auto" },
    { label: "Date Modified", width: 130 },
    { label: "Size", width: 60 },
    { label: "Kind", width: 120 },
  ];

  const rowData = projects;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(0,0,0,0.15)",
          background: "linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 45%, #d0d0d0 46%, #d8d8d8 100%)",
          flexShrink: 0,
        }}
      >
        {cols.map((col) => (
          <div
            key={col.label}
            onClick={() => {
              if (sortCol === col.label) setSortAsc(!sortAsc);
              else { setSortCol(col.label); setSortAsc(true); }
            }}
            style={{
              padding: "2px 8px",
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "rgba(0,0,0,0.65)",
              borderRight: "1px solid rgba(0,0,0,0.1)",
              cursor: "default",
              flex: col.width === "auto" ? 1 : "none",
              width: col.width !== "auto" ? col.width : undefined,
              display: "flex",
              alignItems: "center",
              gap: 3,
              background: sortCol === col.label ? "rgba(0,0,0,0.04)" : "transparent",
              userSelect: "none",
            }}
          >
            {col.label}
            {sortCol === col.label && (
              <span style={{ fontSize: "0.5rem" }}>{sortAsc ? "▲" : "▼"}</span>
            )}
          </div>
        ))}
        <div style={{ width: 12 }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {rowData.map((row, i) => {
          const isSelected = i === selectedIndex;
          const isHov = hovRow === i;
          return (
            <div
              key={row.id}
              onMouseEnter={() => setHovRow(i)}
              onMouseLeave={() => setHovRow(null)}
              onClick={() => onSelect(i)}
              onDoubleClick={() => window.open(row.url, "_blank")}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "default",
                background: isSelected
                  ? "linear-gradient(180deg, #4a85d8 0%, #2f65c0 100%)"
                  : i % 2 === 0 ? "#fff" : "#f5f5f5",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 5, padding: "3px 8px" }}>
                <div
                  style={{
                    width: 18, height: 18, borderRadius: 3,
                    background: `linear-gradient(135deg, ${row.color} 0%, #1a1a1a 100%)`,
                    flexShrink: 0, overflow: "hidden", position: "relative",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(circle at 30% 35%, ${row.accent}88 0%, transparent 70%)`,
                  }} />
                </div>
                <span style={{ fontSize: "0.72rem", color: isSelected ? "#fff" : "rgba(0,0,0,0.8)", fontWeight: 400 }}>
                  {row.title}
                </span>
              </div>
              <div style={{ width: 130, padding: "3px 8px", fontSize: "0.68rem", color: isSelected ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.55)", flexShrink: 0 }}>
                {row.date}
              </div>
              <div style={{ width: 60, padding: "3px 8px", fontSize: "0.68rem", color: isSelected ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.55)", flexShrink: 0 }}>
                {row.size}
              </div>
              <div style={{ width: 120, padding: "3px 8px", fontSize: "0.68rem", color: isSelected ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.55)", flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {row.kind}
              </div>
              <div style={{ width: 12 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeopardStatusBar({ selectedIndex }: { selectedIndex: number }) {
  return (
    <div
      style={{
        height: 20,
        background: "linear-gradient(180deg, #d8d8d8 0%, #c8c8c8 100%)",
        borderTop: "1px solid rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: "0.67rem", color: "rgba(0,0,0,0.55)" }}>
        1 of {projects.length} selected — {projects[selectedIndex]?.description}
      </span>
    </div>
  );
}

const dockItems = [
  { emoji: "🗂", label: "Finder" },
  { emoji: "🌐", label: "Safari" },
  { emoji: "📧", label: "Mail" },
  { emoji: "🗓", label: "iCal" },
  { emoji: "⚫", label: "Void" },
  { emoji: "📝", label: "TextEdit" },
  { emoji: "⌨️", label: "Terminal" },
  { emoji: "🔧", label: "Utilities" },
];

function LeopardDock({ onToggle }: { onToggle: () => void }) {
  const [hov, setHov] = useState<number | null>(null);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        padding: "6px 14px 0",
        background: "linear-gradient(180deg, rgba(220,228,240,0.18) 0%, rgba(180,195,218,0.28) 100%)",
        backdropFilter: "blur(28px) saturate(1.9) brightness(1.1)",
        WebkitBackdropFilter: "blur(28px) saturate(1.9) brightness(1.1)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderBottom: "none",
        borderRadius: "14px 14px 0 0",
        gap: 5,
        zIndex: 500,
        boxShadow: "0 -2px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.55)",
      }}
    >
      {dockItems.map((item, i) => {
        const dist = hov === null ? 0 : Math.abs(i - hov);
        const scale = hov !== null && dist === 0 ? 1.65 : hov !== null && dist === 1 ? 1.32 : hov !== null && dist === 2 ? 1.1 : 1;
        const isVoid = item.label === "Void";
        return (
          <div
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            onClick={isVoid ? onToggle : undefined}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              transform: `scale(${scale})`,
              transformOrigin: "bottom center",
              transition: "transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)",
              cursor: isVoid ? "pointer" : "default",
              paddingBottom: 4,
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))",
                lineHeight: 1,
              }}
            >
              {item.emoji}
            </div>
            {hov === i && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 2px)",
                  background: "rgba(0,0,0,0.72)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  fontSize: "0.6rem",
                  padding: "2px 6px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                {item.label}
              </div>
            )}
          </div>
        );
      })}

      <div
        style={{
          width: 1, height: 36, background: "rgba(255,255,255,0.25)",
          margin: "0 2px 4px", flexShrink: 0,
        }}
      />
      <div
        onMouseEnter={() => setHov(dockItems.length)}
        onMouseLeave={() => setHov(null)}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          transform: `scale(${hov === dockItems.length ? 1.65 : hov !== null && Math.abs(dockItems.length - (hov ?? 0)) === 1 ? 1.32 : 1})`,
          transformOrigin: "bottom center",
          transition: "transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)",
          cursor: "default",
          paddingBottom: 4,
        }}
      >
        <div style={{ fontSize: "2rem", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))", lineHeight: 1 }}>
          🗑
        </div>
      </div>
    </div>
  );
}
