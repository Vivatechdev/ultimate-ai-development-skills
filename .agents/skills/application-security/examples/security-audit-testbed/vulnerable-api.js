/**
 * Vulnerable API Testbed (For Application Security Audit Testing)
 * Contains intentional vulnerabilities for security validation.
 */

const http = require('http');

// In-Memory Database Simulator
const db = {
  users: [
    { id: 'usr_1', email: 'admin@corp.com', passwordHash: 'plain_md5_hash', tenantId: 'tenant_1', role: 'admin' },
    { id: 'usr_2', email: 'victim@corp.com', passwordHash: 'plain_md5_hash', tenantId: 'tenant_2', role: 'user' }
  ],
  documents: [
    { id: 'doc_101', tenantId: 'tenant_1', title: 'Q3 Financial Strategy (Confidential)' },
    { id: 'doc_202', tenantId: 'tenant_2', title: 'Competitor Patent Briefing' }
  ]
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost');
  const pathname = reqUrl.pathname;

  // VULNERABILITY 4 (CVSS 3.5 - Low): Insecure Cookie (Missing HttpOnly & SameSite)
  if (pathname === '/api/login' && req.method === 'POST') {
    res.writeHead(200, {
      'Set-Cookie': 'session_token=token_xyz_insecure; Path=/',
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ status: 'Logged in' }));
    return;
  }

  // VULNERABILITY 1 (CVSS 9.8 - Critical): Simulated SQL Injection
  if (pathname === '/api/users/search' && req.method === 'GET') {
    const email = reqUrl.searchParams.get('email') || '';
    
    // Insecure string concatenation simulator:
    // If input contains "' OR '1'='1", it dumps all users!
    if (email.includes("' OR '1'='1") || email.includes("' OR 1=1")) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ queryExecuted: `SELECT * FROM users WHERE email = '${email}'`, data: db.users }));
      return;
    }

    const matched = db.users.filter(u => u.email === email);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ queryExecuted: `SELECT * FROM users WHERE email = '${email}'`, data: matched }));
    return;
  }

  // VULNERABILITY 2 (CVSS 7.5 - High): IDOR (Broken Object-Level Authorization)
  // Request header passes tenantId: 'tenant_2', but requests 'doc_101' (which belongs to tenant_1)
  if (pathname.startsWith('/api/documents/') && req.method === 'GET') {
    const docId = pathname.replace('/api/documents/', '');
    const doc = db.documents.find(d => d.id === docId);

    // Insecure: Missing ownership check (doc.tenantId === req.headers['x-tenant-id'])
    if (doc) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: doc }));
      return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  // VULNERABILITY 3 (CVSS 5.3 - Medium): Information Disclosure on Error
  if (pathname === '/api/crash' && req.method === 'GET') {
    try {
      throw new Error('DatabaseConnectionTimeout: at PostgreSQLDriver.connect (pg_driver.js:42:15) with db_user="pg_admin_internal"');
    } catch (err) {
      // Insecure: Leaks raw internal stack trace and internal user to client
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: err.message,
        stack: err.stack,
        internalEnv: { DB_HOST: '10.0.1.45', DB_USER: 'pg_admin_internal' }
      }));
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

module.exports = { server, db };

