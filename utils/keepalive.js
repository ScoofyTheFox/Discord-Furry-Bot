const http = require('http');

module.exports = function keepAlive() {
  const port = process.env.PORT || 3000;

  const server = http.createServer((_, res) => { res.writeHead(200); res.end('🐾 alive'); });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} already in use — keep-alive server skipped`);
    } else {
      console.error('Keep-alive server error:', err.message);
    }
  });

  server.listen(port, () => console.log(`🌐 Keep-alive on :${port}`));

  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (domain) {
    setInterval(() => http.get(`https://${domain}`, () => {}).on('error', () => {}), 5 * 60 * 1000);
    console.log(`🏓 Self-ping → https://${domain}`);
  }
};
