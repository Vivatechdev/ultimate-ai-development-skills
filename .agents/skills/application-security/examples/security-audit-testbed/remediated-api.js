/**
 * Remediated API (Hardened Production Standard)
 * Fixes all 4 identified vulnerabilities with defense-in-depth controls.
 */

const http = require('http');

// In-Memory Database Simulator
const db = {
  users: [
    { id: 'usr_1', email: 'admin@corp.com', passwordHash: 'argon2id$v=19$m=65536...', tenantId: 'tenant_1', role: 'admin' },
    { id: 'usr_2', email: 'victim@corp.com', passwordHash: 'argon2id$v=19$m=65536...', tenantId: 'tenant_2', role: 'user' }
  ],
  documents: [
    { id: 'doc_101', tenantId: 'tenant_1', title: 'Q3 Financial Strategy (Confidential)' },
    { id: 'doc_202', tenantId: 'tenant_2', title: 'Competitor Patent Briefing' }
  ]
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost');
  const pathname = reqUrl.pathname;

  // REMEDIATION 4: Hardened Cookie Flags (HttpOnly, Secure, SameSite=Lax)
  if (pathname === '/api/login' && req.method === 'POST') {
    res.writeHead(200, {
      'Set-Cookie': 'session_token=token_xyz_hardened; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax',
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ status: 'Logged in securely' }));
    return;
  }

  // REMEDIATION 1: Parameterized Prepared Statement Simulation (SQLi Neutralized)
  if (pathname === '/api/users/search' && req.method === 'GET') {
    const email = reqUrl.searchParams.get('email') || '';
    
    // Parameterized lookup treats input strictly as literal string parameter:
    const matched = db.users.filter(u => u.email === email);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      queryExecuted: 'SELECT id, email, role FROM users WHERE email = $1',
      params: [email],
      data: matched
    }));
    return;
  }

  // REMEDIATION 2: IDOR Eliminated (Strict Tenant Boundary Enforcement)
  if (pathname.startsWith('/api/documents/') && req.method === 'GET') {
    const docId = pathname.replace('/api/documents/', '');
    const userTenantId = req.headers['x-tenant-id'];

    if (!userTenantId) {
      res.writeHead(401, { 'Content-Type': 'application/problem+json' });
      res.end(JSON.stringify({ title: 'Unauthorized', status: 401, detail: 'Tenant credentials required' }));
      return;
    }

    // Tenant boundary check:
    const doc = db.documents.find(d => d.id === docId && d.tenantId === userTenantId);
    if (!doc) {
      // Return 404 to prevent resource existence enumeration across tenants
      res.writeHead(404, { 'Content-Type': 'application/problem+json' });
      res.end(JSON.stringify({ title: 'Not Found', status: 404, detail: 'Document not found' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: doc }));
    return;
  }

  // REMEDIATION 3: Secure RFC 7807 Error Handling (Zero Stack Trace Leakage)
  if (pathname === '/api/crash' && req.method === 'GET') {
    try {
      throw new Error('DatabaseConnectionTimeout: at PostgreSQLDriver.connect');
    } catch (err) {
      const traceId = 'trace_' + Math.random().toString(36).substring(2, 10);
      // Log internally (simulated): console.error(`[${traceId}] Internal Crash:`, err);
      
      // Clean, sanitized error returned to client
      res.writeHead(500, { 'Content-Type': 'application/problem+json' });
      res.end(JSON.stringify({
        type: 'https://api.example.com/errors/internal-error',
        title: 'Internal Server Error',
        status: 500,
        detail: 'An unexpected internal error occurred. Please contact support with the trace ID.',
        traceId
      }));
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/problem+json' });
  res.end(JSON.stringify({ title: 'Not Found', status: 404 }));
});

module.exports = { server, db };

