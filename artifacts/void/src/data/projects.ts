export interface Project {
  id: number;
  title: string;
  description: string;
  color: string;
  accent: string;
  url: string;
  size: string;
  date: string;
  kind: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Chromatic",
    description: "Generative color palettes from audio input",
    color: "#1a0533",
    accent: "#c77dff",
    url: "#",
    size: "3.2 MB",
    date: "Apr 6, 2024, 9:12 AM",
    kind: "Web Experiment",
  },
  {
    id: 2,
    title: "Drift",
    description: "Physics-based particle systems in the browser",
    color: "#001a2c",
    accent: "#48cae4",
    url: "#",
    size: "1.8 MB",
    date: "Mar 28, 2024, 3:45 PM",
    kind: "Web Experiment",
  },
  {
    id: 3,
    title: "Mnemonic",
    description: "Spatial memory palace built with WebXR",
    color: "#0d1a00",
    accent: "#80b918",
    url: "#",
    size: "8.6 MB",
    date: "Mar 15, 2024, 11:22 AM",
    kind: "Web App",
  },
  {
    id: 4,
    title: "Ferrous",
    description: "Real-time rust simulation on the GPU",
    color: "#1f0a00",
    accent: "#e85d04",
    url: "#",
    size: "5.1 MB",
    date: "Feb 20, 2024, 7:58 PM",
    kind: "Web Experiment",
  },
  {
    id: 5,
    title: "Liminal",
    description: "Procedural architecture generator for liminal spaces",
    color: "#0f0f1a",
    accent: "#9d8df1",
    url: "#",
    size: "4.4 MB",
    date: "Jan 30, 2024, 2:14 PM",
    kind: "Web App",
  },
  {
    id: 6,
    title: "Telemetry",
    description: "Live data sculpture from your device sensors",
    color: "#001a1a",
    accent: "#2ec4b6",
    url: "#",
    size: "2.7 MB",
    date: "Jan 5, 2024, 10:30 AM",
    kind: "Web Experiment",
  },
];
