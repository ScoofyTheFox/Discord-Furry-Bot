const http = require('http');

module.exports = function keepAlive() {
  const port = process.env.PORT || 3000;

  http.createServer((_, res) => { res.writeHead(200); res.end('🐾 alive'); })
    .listen(port, () => console.log(`🌐 Keep-alive on :${port}`));

  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (domain) {
    setInterval(() => http.get(`https://${domain}`, () => {}).on('error', () => {}), 5 * 60 * 1000);
    console.log(`🏓 Self-ping → https://${domain}`);
  }
};
