export async function getAlias(url: string): Promise<string | null> {
  await Promise.resolve();
  try {
    const pathname = new URL(url).pathname;
    const lastSegment = pathname.split('/').pop();

    if (!lastSegment) return null;

    const parts = lastSegment.split('-');
    if (parts.length < 2) return null;

    parts.shift();
    return parts.join('-');
  } catch {
    return null;
  }
}

export function getAnimeAliasSync(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const lastSegment = pathname.split('/').pop();

    if (!lastSegment) return null;

    const parts = lastSegment.split('-');
    if (parts.length < 2) return null;

    parts.shift();
    return parts.join('-');
  } catch {
    return null;
  }
}
