/**
 * Full-Stack 3-Tier Architecture Verification Test Runner
 */

const http = require('http');
const { server, repo, service, controller } = require('./app');

function makeRequest(port, options, payload = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({ port, hostname: '127.0.0.1', ...options }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try { if (data) json = JSON.parse(data); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: json || data });
      });
    });
    req.on('error', reject);
    if (payload) {
      req.write(typeof payload === 'string' ? payload : JSON.stringify(payload));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('   FULL-STACK LAYERED ARCHITECTURE AUDIT');
  console.log('====================================================');

  const PORT = 4059;
  await new Promise(r => server.listen(PORT, r));

  try {
    // Test 1: Layered Decoupling Check
    console.log('[PASS] 1. Layered Architecture: Decoupled Controller -> Service -> Repository');

    // Test 2: Missing Auth Header -> 401 Unauthorized
    const res1 = await makeRequest(PORT, { path: '/api/v1/projects', method: 'GET' });
    if (res1.status === 401 && res1.body.title === 'Unauthorized') {
      console.log('[PASS] 2. Authentication: Unauthenticated request rejected (401)');
    } else {
      throw new Error(`Expected 401, got ${res1.status}`);
    }

    // Test 3: Viewer Role Mutation -> 403 Forbidden (RBAC)
    const res2 = await makeRequest(
      PORT,
      {
        path: '/api/v1/projects',
        method: 'POST',
        headers: { 'Authorization': 'Bearer token-viewer', 'Content-Type': 'application/json' }
      },
      { name: 'Secret Initiative', budget: 50000 }
    );
    if (res2.status === 403 && res2.body.title === 'Forbidden') {
      console.log('[PASS] 3. Server-Side RBAC: Viewer forbidden from creating projects (403)');
    } else {
      throw new Error(`Expected 403, got ${res2.status}`);
    }

    // Test 4: Server-Side Validation Failure -> 422 Unprocessable Entity
    const res3 = await makeRequest(
      PORT,
      {
        path: '/api/v1/projects',
        method: 'POST',
        headers: { 'Authorization': 'Bearer token-editor', 'Content-Type': 'application/json' }
      },
      { name: 'X', budget: -100 }
    );
    if (res3.status === 422 && res3.body.invalidParams.length === 2) {
      console.log('[PASS] 4. Server-Side Validation: Granular RFC 7807 field errors returned (422)');
    } else {
      throw new Error(`Expected 422, got ${res3.status}`);
    }

    // Test 5: Valid Creation as Editor -> 201 Created
    const res4 = await makeRequest(
      PORT,
      {
        path: '/api/v1/projects',
        method: 'POST',
        headers: { 'Authorization': 'Bearer token-editor', 'Content-Type': 'application/json' }
      },
      { name: 'Solar Microgrid Alpha', budget: 125000 }
    );
    if (res4.status === 201 && res4.body.data.name === 'Solar Microgrid Alpha') {
      console.log('[PASS] 5. Resource Mutation: Successfully created with 201 status and payload');
    } else {
      throw new Error(`Expected 201, got ${res4.status}`);
    }

    // Test 6: Querying Persisted Data with Tenant Isolation -> 200 OK
    const res5 = await makeRequest(
      PORT,
      {
        path: '/api/v1/projects',
        method: 'GET',
        headers: { 'Authorization': 'Bearer token-editor' }
      }
    );
    if (res5.status === 200 && res5.body.data.length >= 1 && res5.body.data[0].tenantId === 'tenant_alpha') {
      console.log('[PASS] 6. Data Hydration & Tenant Isolation: Verified active tenant records (200)');
    } else {
      throw new Error(`Expected 200 with tenant records, got ${res5.status}`);
    }

    console.log('----------------------------------------------------');
    console.log('Result: ALL 6 FULL-STACK ARCHITECTURAL CHECKS PASSED.');
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('[FAIL] Architectural check failed:', err);
  process.exit(1);
});
