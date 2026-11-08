export type UniverseHandle = (() => void) & { goTo: (idx: number) => void };
export function mountUniverse(navigateTo: {
  service: (key: string) => string;
  go: (url: string) => void;
  /** Called with the section index the camera is travelling to (0–5). */
  section?: (idx: number) => void;
}): UniverseHandle;
