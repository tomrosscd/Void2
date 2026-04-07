export interface Project {
  id: number;
  /** Display title shown in both views */
  title: string;
  description: string;
  /** Background colour used as fallback when no cover image exists */
  color: string;
  /** Accent colour used for glow / gradient overlays */
  accent: string;
  /**
   * External URL for the project.
   * Leave as "#" for disabled entries — click handlers check `disabled` first.
   */
  url: string;
  size: string;
  date: string;
  kind: string;
  /**
   * When true the entry is rendered as non-interactive in both views.
   * No navigation on click/double-click; cursor indicates unavailability.
   */
  disabled?: boolean;
  /**
   * Path to a cover-art image served from /public/coverart/.
   * When set, the image is used instead of the colour gradient in both
   * the CoverFlow card and the Void-mode card thumbnail.
   * Example: "/coverart/standup.png"
   */
  image?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    // "[Coming Soon]" is part of the display title — renders in both views
    title: "Pochi [Coming Soon]",
    description: "A new project — coming soon",
    color: "#1a0a2e",
    accent: "#9d4edd",
    url: "#",
    size: "—",
    date: "Coming Soon",
    kind: "Web App",
    disabled: true,
    image: "/coverart/pochi.png",
  },
  {
    id: 2,
    title: "Standup",
    description: "Daily async standup tool",
    color: "#001a2c",
    accent: "#48cae4",
    url: "http://standup.tomross.work/",
    size: "—",
    date: "2024",
    kind: "Web App",
    image: "/coverart/Standup.png",
  },
  {
    id: 3,
    title: "Sidekick",
    description: "Your AI-powered sidekick",
    color: "#0d1a00",
    accent: "#80b918",
    url: "http://sidekick.tomross.work/",
    size: "—",
    date: "2024",
    kind: "Web App",
    image: "/coverart/Sidekick.png",
  },
  {
    id: 4,
    title: "Sidekick V2",
    description: "Sidekick, redesigned from the ground up",
    color: "#1f0a00",
    accent: "#e85d04",
    url: "http://sidekick2.tomross.work/",
    size: "—",
    date: "2024",
    kind: "Web App",
    image: "/coverart/Sidekick_V2.png",
  },
];
