/**
 * Production 3-Tier Full-Stack Architecture Demonstration
 * - Repository: Data Access & Persistence
 * - Service: Business Rules, Validation & RBAC
 * - Controller: HTTP Transport & RFC 7807 Problem Details
 */

const http = require('http');

// ================= 1. DATA ACCESS / REPOSITORY LAYER =================
class ProjectRepository {
  constructor() {
    this.projects = new Map();
  }

  async findByTenant(tenantId) {
    const results = [];
    for (const proj of this.projects.values()) {
      if (proj.tenantId === tenantId) {
        results.push({ ...proj });
      }
    }
    return results.sort((a, b) => b.createdAt - a.createdAt);
  }

  async create({ tenantId, name, budget }) {
    const id = 'proj_' + Math.random().toString(36).substring(2, 9);
    const newProj = {
      id,
      tenantId,
      name,
      budget: Number(budget),
      createdAt: Date.now()
    };
    this.projects.set(id, newProj);
    return { ...newProj };
  }
}

// ================= 2. DOMAIN / SERVICE LAYER =================
class ProjectService {
  constructor(projectRepo) {
    this.projectRepo = projectRepo;
  }

  async listProjects(user) {
    if (!user || !user.tenantId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
    return this.projectRepo.findByTenant(user.tenantId);
  }

  async createProject(user, payload) {
    // 1. Server-Side Authorization Check (RBAC)
    if (!user || !user.permissions || !user.permissions.includes('projects:create')) {
      const err = new Error(`Role '${user ? user.role : 'anonymous'}' lacks 'projects:create' permission`);
      err.statusCode = 403;
      err.title = 'Forbidden';
      throw err;
    }

    // 2. Server-Side Input Schema Validation
    const invalidParams = [];
    if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 3) {
      invalidParams.push({ name: 'name', reason: 'Project name must be a string of at least 3 characters.' });
    }
    if (payload.budget === undefined || isNaN(Number(payload.budget)) || Number(payload.budget) <= 0) {
      invalidParams.push({ name: 'budget', reason: 'Budget must be a positive numerical value.' });
    }

    if (invalidParams.length > 0) {
      const err = new Error('Validation failed for one or more fields.');
      err.statusCode = 422;
      err.title = 'Unprocessable Entity';
      err.invalidParams = invalidParams;
      throw err;
    }

    // 3. Persist via Repository
    return this.projectRepo.create({
      tenantId: user.tenantId,
      name: payload.name.trim(),
      budget: payload.budget
    });
  }
}

// ================= 3. HTTP CONTROLLER & API LAYER =================
class ProjectController {
  constructor(projectService) {
    this.projectService = projectService;
  }

  sendProblemDetails(res, statusCode, title, detail, invalidParams = null) {
    res.writeHead(statusCode, { 'Content-Type': 'application/problem+json' });
    const response = {
      type: `https://api.example.com/errors/${statusCode}`,
      title,
      status: statusCode,
      detail
    };
    if (invalidParams) response.invalidParams = invalidParams;
    res.end(JSON.stringify(response));
  }

  async handleList(req, res, user) {
    try {
      const projects = await this.projectService.listProjects(user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: projects }));
    } catch (err) {
      this.sendProblemDetails(res, err.statusCode || 500, err.title || 'Internal Server Error', err.message);
    }
  }

  async handleCreate(req, res, user, body) {
    try {
      const project = await this.projectService.createProject(user, body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: project }));
    } catch (err) {
      this.sendProblemDetails(
        res,
        err.statusCode || 500,
        err.title || 'Internal Server Error',
        err.message,
        err.invalidParams
      );
    }
  }
}

// ================= 4. AUTHENTICATION MOCK & SERVER SETUP =================
const repo = new ProjectRepository();
const service = new ProjectService(repo);
const controller = new ProjectController(service);

const MOCK_USERS = {
  'token-viewer': { id: 'u_1', tenantId: 'tenant_alpha', role: 'viewer', permissions: ['projects:read'] },
  'token-editor': { id: 'u_2', tenantId: 'tenant_alpha', role: 'editor', permissions: ['projects:read', 'projects:create'] }
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost');
  const pathname = reqUrl.pathname;
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.replace('Bearer ', '').trim() : null;
  const user = token ? MOCK_USERS[token] : null;

  // Frontend HTML view
  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head><title>Fullstack Management Console</title></head>
<body>
  <h1>Production Full-Stack Console</h1>
  <p>Connected to 3-Tier Layered Architecture API.</p>
</body>
</html>`);
    return;
  }

  // API Route: GET /api/v1/projects
  if (req.method === 'GET' && pathname === '/api/v1/projects') {
    if (!user) {
      controller.sendProblemDetails(res, 401, 'Unauthorized', 'Valid Authorization token is required.');
      return;
    }
    controller.handleList(req, res, user);
    return;
  }

  // API Route: POST /api/v1/projects
  if (req.method === 'POST' && pathname === '/api/v1/projects') {
    let bodyRaw = '';
    req.on('data', chunk => { bodyRaw += chunk; });
    req.on('end', () => {
      let body = {};
      try {
        if (bodyRaw) body = JSON.parse(bodyRaw);
      } catch (e) {
        controller.sendProblemDetails(res, 400, 'Bad Request', 'Malformed JSON payload.');
        return;
      }
      controller.handleCreate(req, res, user, body);
    });
    return;
  }

  // 404
  controller.sendProblemDetails(res, 404, 'Not Found', 'The requested resource does not exist.');
});

module.exports = { server, repo, service, controller };

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
