# Infrastructure Tier Selection Matrix & Budget Guidelines

A senior DevOps engineer designs infrastructure scaled to the project's real traffic, team capabilities, and available budget. Prematurely deploying Kubernetes clusters or multi-region microservices for an early-stage product is an operational failure mode.

---

## 1. The Three Infrastructure Tiers

```
[ Tier 1: Modern VPS + Docker Compose / Caddy ]
  $5 - $40 / month | Single server, automated SSL, lowest complexity
               │ (Traffic scales past 100k req/day or requires HA)
               ▼
[ Tier 2: Managed Container PaaS / Serverless ]
  $20 - $250 / month | Railway, Fly.io, Render, AWS App Runner, Cloud Run
               │ (Strict enterprise VPC compliance, dedicated ops team)
               ▼
[ Tier 3: Managed Orchestration Cluster ]
  $300 - $3,000+ / month | AWS ECS Fargate, GCP GKE, DigitalOcean K8s
```

### Comparative Tier Analysis

| Dimension | Tier 1: Modern VPS (Hetzner, DO, Linode) | Tier 2: Managed PaaS / Cloud Run | Tier 3: Managed Cluster (ECS / K8s) |
| :--- | :--- | :--- | :--- |
| **Monthly Cost** | **$5 – $40** | **$20 – $250** | **$300 – $3,000+** |
| **Operational Overhead** | Low (Server setup via Ansible/Docker) | **Lowest (Zero server management)** | High (Requires dedicated DevOps) |
| **Scaling Capability** | Vertical (Up to 64 vCPU, 256GB RAM) | Horizontal auto-scaling (0 to N) | Multi-node dynamic clustering |
| **Zero-Downtime Deploys** | Achieved via Docker Compose rolling / Caddy | Native built-in (Blue/Green) | Native rolling updates & canary |
| **Database Setup** | Managed DB or Docker container + volume | Managed DB (Supabase, Neon, RDS) | Managed Cloud DB (RDS Aurora / Cloud SQL) |
| **Best Suited For** | Bootstrapped SaaS, MVPs, internal tools, APIs | Growth-stage startups, fast shipping teams | Enterprise compliance, complex microservices |

---

## 2. Decision Tree: Choosing the Right Hosting Model

```text
Do you have a dedicated full-time DevOps engineer on staff?
├─ NO
│  ├─ Is your monthly infrastructure budget under $50?
│  │  ├─ YES ──> Choose Tier 1: Single VPS (Hetzner / DigitalOcean) + Docker Compose + Caddy.
│  │  └─ NO  ──> Choose Tier 2: Managed PaaS (Railway, Render, Fly.io, or GCP Cloud Run).
│  └─ Focus engineering resources on product delivery, not cluster orchestration.
└─ YES
   ├─ Does the product require dynamic microservice routing, custom service mesh, or strict VPC isolation?
   │  ├─ YES ──> Choose Tier 3: AWS ECS Fargate or GCP GKE.
   │  └─ NO  ──> Choose Tier 2: GCP Cloud Run or AWS ECS with managed databases.
```

---

## 3. Server Hardening Baseline (For VPS Deployments)

When provisioning a Linux server (Ubuntu/Debian) for Tier 1 deployments, apply these baseline hardening steps:

1. **SSH Key-Only Authentication:**
   ```bash
   # /etc/ssh/sshd_config
   PasswordAuthentication no
   PermitRootLogin no
   PubkeyAuthentication yes
   ```
2. **Uncomplicated Firewall (UFW):**
   ```bash
   ufw default deny incoming
   ufw default allow outgoing
   ufw allow ssh
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```
3. **Automated Security Updates & Fail2ban:**
   - Install `unattended-upgrades` for automated security patches.
   - Install `fail2ban` to ban IP addresses exhibiting repeated SSH brute-force failures.
4. **Automated SSL via Caddy or Certbot:**
   - Caddy handles automatic Let's Encrypt / ZeroSSL certificate issuance, renewal, and HTTP-to-HTTPS redirects with zero manual cron configuration.

