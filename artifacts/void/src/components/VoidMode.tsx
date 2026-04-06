import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";

interface VoidModeProps {
  onToggle: () => void;
}

function LeopardStyleButton({ onClick, label }: { onClick: () => void; label: string }) {
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
        borderRadius: 6,
        padding: "5px 16px",
        height: 26,
        fontSize: "0.78rem",
        color: "#222",
        cursor: "none",
        fontFamily: "-apple-system, 'Lucida Grande', 'Helvetica Neue', Arial, sans-serif",
        fontWeight: 400,
        letterSpacing: "0.01em",
        boxShadow: pressed
          ? "inset 0 1px 3px rgba(0,0,0,0.18)"
          : "0 1px 3px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.75)",
        outline: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

export default function VoidMode({ onToggle }: VoidModeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPosRef = useRef({ x: -200, y: -200 });
  const targetPosRef = useRef({ x: -200, y: -200 });
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", resize);

    let t = 0;
    let raf: number;

    const draw = () => {
      t += 0.003;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#060610";
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        { x: 0.2 + 0.1 * Math.sin(t * 0.7), y: 0.3 + 0.1 * Math.cos(t * 0.5), r: 0.45, color: "rgba(70,30,100,0.55)" },
        { x: 0.75 + 0.12 * Math.cos(t * 0.6), y: 0.65 + 0.1 * Math.sin(t * 0.8), r: 0.38, color: "rgba(20,60,80,0.5)" },
        { x: 0.5 + 0.15 * Math.sin(t * 0.4), y: 0.5 + 0.12 * Math.cos(t * 0.55), r: 0.3, color: "rgba(50,30,70,0.4)" },
        { x: 0.1 + 0.08 * Math.cos(t * 0.9), y: 0.8 + 0.08 * Math.sin(t * 0.7), r: 0.25, color: "rgba(20,50,60,0.38)" },
        { x: 0.88 + 0.06 * Math.sin(t * 1.1), y: 0.15 + 0.08 * Math.cos(t * 0.65), r: 0.28, color: "rgba(80,40,90,0.42)" },
      ];

      for (const blob of blobs) {
        const gx = blob.x * w;
        const gy = blob.y * h;
        const gr = blob.r * Math.max(w, h);
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, blob.color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(gx, gy, gr, gr * 0.85, t * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      cursorPosRef.current.x = lerp(cursorPosRef.current.x, targetPosRef.current.x, 0.1);
      cursorPosRef.current.y = lerp(cursorPosRef.current.y, targetPosRef.current.y, 0.1);
      if (cursor) {
        cursor.style.transform = `translate(${cursorPosRef.current.x - 24}px, ${cursorPosRef.current.y - 24}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCards((prev) => new Set([...prev, idx]));
            }, idx * 80);
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflowX: "hidden",
        overflowY: "auto",
        cursor: "none",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 48,
          height: 48,
          borderRadius: "50%",
          backdropFilter: "blur(8px) saturate(1.4)",
          WebkitBackdropFilter: "blur(8px) saturate(1.4)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.18)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen",
          boxShadow: "0 0 20px rgba(180,140,255,0.15)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "0 0 80px 0",
        }}
      >
        <header
          style={{
            padding: "60px 80px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1,
                margin: 0,
              }}
            >
              Void
            </h1>
            <p
              style={{
                fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
                color: "rgba(255,255,255,0.35)",
                marginTop: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              random web experiments &amp; apps
            </p>
          </div>

          <LeopardStyleButton onClick={onToggle} label="Switch to Mac OS X" />
        </header>

        <main
          style={{
            padding: "20px 80px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {projects.map((project, i) => {
            const visible = visibleCards.has(i);
            return (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                data-idx={i}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(32px)",
                  transition: `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`,
                }}
              >
                <a
                  href={project.url}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: 16,
                      overflow: "hidden",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      transition: "all 0.3s ease",
                      cursor: "none",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = "rgba(255,255,255,0.08)";
                      el.style.borderColor = "rgba(255,255,255,0.18)";
                      el.style.transform = "translateY(-4px)";
                      el.style.boxShadow = `0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = "rgba(255,255,255,0.04)";
                      el.style.borderColor = "rgba(255,255,255,0.09)";
                      el.style.transform = "translateY(0)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        height: 180,
                        background: `linear-gradient(135deg, ${project.color} 0%, #060610 100%)`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `radial-gradient(circle at 30% 40%, ${project.accent}33 0%, transparent 60%)`,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 16,
                          right: 16,
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: project.accent,
                          opacity: 0.4,
                          filter: "blur(4px)",
                        }}
                      />
                    </div>
                    <div style={{ padding: "20px 24px 24px" }}>
                      <h2
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.88)",
                          margin: 0,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {project.title}
                      </h2>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.38)",
                          marginTop: 6,
                          lineHeight: 1.5,
                        }}
                      >
                        {project.description}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
