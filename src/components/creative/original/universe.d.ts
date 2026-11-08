export function mountUniverse(navigateTo: { service: (key: string) => string; go: (url: string) => void }): () => void;
