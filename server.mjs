import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
]);

export function createApp() {
  return createServer(async (req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    const asset = assets.get(path);
    if (!asset) { res.writeHead(404); res.end('Not found'); return; }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
    }
    try {
      const body = await readFile(new URL(asset[0], import.meta.url));
      res.writeHead(200, {
        'Content-Type': asset[1],
        'Content-Length': body.length,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'",
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.writeHead(500); res.end('Unable to load asset');
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  createApp().listen(port, process.env.HOST || '0.0.0.0', () => {
    console.log(`Cloud Native Guide listening on port ${port}`);
  });
}
