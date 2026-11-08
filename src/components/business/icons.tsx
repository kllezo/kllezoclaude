/* Line icons for the Business experience — 24px grid, 1.6 stroke, currentColor. */
type P = { size?: number; className?: string };
const S = ({ size = 22, className, children }: P & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
);

export const IconMegaphone = (p: P) => (
  <S {...p}>
    <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" />
    <path d="M15 9a3 3 0 0 1 0 6M18 6a7 7 0 0 1 0 12" />
  </S>
);
export const IconBrowser = (p: P) => (
  <S {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
  </S>
);
export const IconChat = (p: P) => (
  <S {...p}>
    <path d="M4 5h16v11H9l-5 4V5Z" />
    <path d="M8 10h8M8 13h5" />
  </S>
);
export const IconPhone = (p: P) => (
  <S {...p}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </S>
);
export const IconSearch = (p: P) => (
  <S {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-4.5-4.5" />
  </S>
);
export const IconLayers = (p: P) => (
  <S {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </S>
);
export const IconRocket = (p: P) => (
  <S {...p}>
    <path d="M5 15c-1 1-1.5 3.5-1.5 5.5C5.5 20.5 8 20 9 19" />
    <path d="M9 15 6 12c1-4 5-8 13-9-1 8-5 12-9 13l-1-1Z" />
    <circle cx="14.5" cy="9.5" r="1.5" />
  </S>
);
export const IconChart = (p: P) => (
  <S {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="m7 15 4-4 3 3 5-6" />
  </S>
);
export const IconCheck = (p: P) => (
  <S {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </S>
);
export const IconX = (p: P) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
);
export const IconCalendar = (p: P) => (
  <S {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </S>
);
export const IconBolt = (p: P) => (
  <S {...p}>
    <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />
  </S>
);
