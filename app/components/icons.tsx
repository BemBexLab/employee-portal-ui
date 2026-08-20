import type { IconName } from "@/app/lib/mock-data";

type IconProps = { name: IconName; size?: number; strokeWidth?: number; className?: string };

export function Icon({ name, size = 20, strokeWidth = 1.8, className }: IconProps) {
  const common = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth };
  const content = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" {...common} /><rect x="14" y="3" width="7" height="7" rx="1" {...common} /><rect x="3" y="14" width="7" height="7" rx="1" {...common} /><rect x="14" y="14" width="7" height="7" rx="1" {...common} /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2" {...common} /><path d="M16 2.5v4M8 2.5v4M3 9.5h18" {...common} /><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" {...common} /></>,
    file: <><path d="M14 2.8H6a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.8z" {...common} /><path d="M14 2.8v6h6M8 13h8M8 17h5" {...common} /></>,
    settings: <><path d="M12 15.3a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Z" {...common} /><path d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.2a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A2 2 0 0 0 1.7 12a2 2 0 0 1 2-2h.2a2 2 0 0 0 1.4-3.4l-.1-.1A2 2 0 1 1 8 3.7l.1.1A2 2 0 0 0 11.5 2.4h.2a2 2 0 0 1 2 2v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A2 2 0 0 0 21.3 12a2 2 0 0 1-2 2h-.2a2 2 0 0 0 .3 1Z" {...common} /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" {...common} /><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" {...common} /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" {...common} />, close: <path d="M6 6l12 12M18 6 6 18" {...common} />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" {...common} /></>,
    chevronRight: <path d="m9 18 6-6-6-6" {...common} />, clock: <><circle cx="12" cy="12" r="9" {...common} /><path d="M12 7v5l3 2" {...common} /></>,
    check: <><circle cx="12" cy="12" r="9" {...common} /><path d="m8 12 2.7 2.7L16.5 9" {...common} /></>,
    wallet: <><path d="M4 7.5h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v1" {...common} /><path d="M16 13h5" {...common} /></>,
    arrowUp: <><path d="m7 15 5-5 5 5" {...common} /><path d="M12 10v9" {...common} /></>, arrowDown: <><path d="m7 9 5 5 5-5" {...common} /><path d="M12 14V5" {...common} /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" {...common} /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" {...common} /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" {...common} /><path d="m3 7 9 6 9-6" {...common} /></>, shield: <><path d="M12 21s8-3.8 8-10V5l-8-3-8 3v6c0 6.2 8 10 8 10Z" {...common} /><path d="m9 12 2 2 4-4" {...common} /></>,
    plus: <><path d="M12 5v14M5 12h14" {...common} /></>, more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    help: <><circle cx="12" cy="12" r="9" {...common} /><path d="M9.7 9a2.4 2.4 0 1 1 4.4 1.3c-.8 1-2.1 1.2-2.1 2.7M12 16.5h.01" {...common} /></>,
    sparkles: <><path d="m12 3-1.2 4.8L6 9l4.8 1.2L12 15l1.2-4.8L18 9l-4.8-1.2L12 3ZM19 15l-.6 2.4L16 18l2.4.6L19 21l.6-2.4L22 18l-2.4-.6L19 15Z" {...common} /></>,
    eye: <><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" {...common} /><circle cx="12" cy="12" r="2.2" {...common} /></>,
    eyeOff: <><path d="m3 3 18 18M10.6 6.9A10.3 10.3 0 0 1 12 7c6 0 9.5 5 9.5 5a16 16 0 0 1-3.2 3.5M6.2 6.5C3.8 8.1 2.5 12 2.5 12s3.5 5 9.5 5a9.4 9.4 0 0 0 2-.2" {...common} /><path d="M9.9 9.9a2.2 2.2 0 0 0 3.1 3.1" {...common} /></>,
  }[name];
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24">{content}</svg>;
}
