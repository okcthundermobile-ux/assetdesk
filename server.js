const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT) || 8080;
const buildDir = path.join(__dirname, 'build');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function sendFile(res, filePath) {
  const contentType = contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const filePath = path.resolve(buildDir, relativePath);

  if (filePath.startsWith(buildDir)) {
    fs.stat(filePath, (error, stats) => {
      if (!error && stats.isFile()) {
        sendFile(res, filePath);
        return;
      }

      sendFile(res, path.join(buildDir, 'index.html'));
    });
    return;
  }

  sendFile(res, path.join(buildDir, 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Asset Desk listening on port ${port}`);
});
