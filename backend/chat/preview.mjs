// Local-only static preview + same-origin API proxy, never a production server.
import { createServer, request as proxyRequest } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';

const root = fileURLToPath(new URL('../../chat/', import.meta.url));
const mime = {'.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2'};
export function createPreviewServer({backendPort = 3002} = {}) {
  return createServer(async (req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (path === '/api/chat/leads') {
      const upstream = proxyRequest({hostname:'127.0.0.1', port:backendPort, path, method:req.method,
        headers:{...req.headers, 'x-real-ip':req.socket.remoteAddress, 'x-forwarded-for':req.socket.remoteAddress}}, response => {
        res.writeHead(response.statusCode, response.headers);
        response.pipe(res);
      });
      upstream.setTimeout(40000, () => upstream.destroy());
      upstream.on('error', () => {
        if (res.headersSent) return res.destroy();
        res.writeHead(503, {'Content-Type':'application/json', 'Cache-Control':'no-store'});
        res.end(JSON.stringify({ok:false, code:'unavailable'}));
      });
      req.on('aborted', () => upstream.destroy());
      req.pipe(upstream);
      return;
    }
    // Exercise the same relative asset paths as production at /chat/ as well.
    const staticPath = path.startsWith('/chat/') ? path.slice(5) : path;
    const allowed = ['/', '/index.html', '/script.js', '/styles.css', '/shared-chrome.css'].includes(staticPath) || /^\/assets\/[a-zA-Z0-9_.-]+$/.test(staticPath);
    if (!allowed || !['GET','HEAD'].includes(req.method)) {res.writeHead(404); res.end(); return;}
    const file = resolve(root, staticPath === '/' ? 'index.html' : staticPath.slice(1));
    try {
      const info = await stat(file);
      if (!info.isFile()) throw new Error('not a file');
      res.writeHead(200, {'Content-Type':mime[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'});
      if (req.method === 'HEAD') res.end();
      else createReadStream(file).on('error', () => res.destroy()).pipe(res);
    } catch {res.writeHead(404); res.end();}
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createPreviewServer().listen(4174, '127.0.0.1', () => console.log('Chat preview: http://127.0.0.1:4174'));
}
