export function reportError(error: unknown, context: string) {
  const name = error instanceof Error ? error.name : 'UnknownError';
  const description = `${context}: ${name}`.slice(0, 120);
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'exception', { description, fatal: false });
  }
  if (import.meta.env.DEV) console.error(description, error);
}
