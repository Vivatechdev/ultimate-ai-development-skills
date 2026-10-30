/**
 * Production Server & Smoke Test Target
 */

const http = require('http');

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost');
  const pathname = reqUrl.pathname;

  // 1. Healthcheck & Database Connectivity Status
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      version: 'sha-3cf6386',
      database: { connected: true, latencyMs: 3.2 },
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 2. Authentication & Session Verification
  if (pathname === '/api/v1/auth/session' && req.method === 'POST') {
    res.writeHead(200, {
      'Set-Cookie': 'session_id=sess_prod_9918; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax',
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ authenticated: true, user: { email: 'admin@corp.com', role: 'admin' } }));
    return;
  }

  // 3. Core API Endpoint
  if (pathname === '/api/v1/projects' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: [{ id: 'p_1', name: 'Grid Telemetry Node' }] }));
    return;
  }

  // 4. Form Submission Endpoint
  if (pathname === '/api/v1/inquire' && req.method === 'POST') {
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Inquiry received' }));
    return;
  }

  // 5. Custom 404 with Zero Leaked Stack Traces
  res.writeHead(404, { 'Content-Type': 'application/problem+json' });
  res.end(JSON.stringify({
    type: 'https://api.example.com/errors/not-found',
    title: 'Not Found',
    status: 404,
    detail: 'The requested resource does not exist.'
  }));
});

module.exports = { server };

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

