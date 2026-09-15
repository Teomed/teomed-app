const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#07145c"/><path fill="#fff" d="M13 16h38v9H37v24H27V25H13z"/><path fill="#57a4ff" d="M42 34h9v15h-9z"/></svg>`;

export function GET() {
  return new Response(favicon, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
