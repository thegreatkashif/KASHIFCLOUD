# Kashif Cloud

> The command center for your homelab.

Self-hosted infrastructure control plane for a personal homelab — monitor,
control, and automate every server, container, and drive you own, from one
dark, restricted-access console.

Kashif Cloud is **not** an AI assistant and **not** a personal OS. It's the
backend platform other things build on top of:
---

## Features

- **Live system monitoring** — CPU, RAM, disk, network, temperature, streamed over WebSocket
- **Docker management** — container list, live stats, start/stop/restart, all through a scoped socket proxy (no raw root access)
- **Storage** — sandboxed file browser across multiple roots (local disk + NAS via Samba/CIFS), with upload/download/delete
- **Network discovery** — ARP-based device scanning with reverse DNS hostname resolution
- **Automation engine** — scheduled jobs for backups, restart-on-failure, and container actions, with run history
- **JWT auth** — single-admin access, CLI-based credential recovery (no email server required)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy |
| Database | PostgreSQL |
| Auth | JWT |
| Containers | Docker, Docker Compose |
| Docker access | tecnativa/docker-socket-proxy (scoped, no raw socket exposure) |
| Scheduling | APScheduler |
| Reverse proxy | Caddy *(planned)* |

---

## Status

Early-stage, actively developed. Phases 1–8 of the roadmap are complete:

- [x] Phase 1 — Repo skeleton, docs, Docker setup
- [x] Phase 2 — FastAPI backend, health endpoint, config system
- [x] Phase 3 — Admin dashboard, JWT auth
- [x] Phase 4 — Live system monitoring (WebSocket)
- [x] Phase 5 — Docker integration
- [x] Phase 6 — Storage module (local + NAS)
- [x] Phase 7 — Networking module (device discovery)
- [x] Phase 8 — Automation engine
- [ ] Phase 9 — Voice integration
- [ ] Phase 10 — AI integration

See [docs/Roadmap.md](docs/Roadmap.md) for details.

---

## Repository Structure

Kashif-Cloud/
├── apps/
│ ├── api/ FastAPI backend
│ ├── admin/ Next.js admin dashboard
│ └── web/ (future)
├── packages/
│ ├── ui/
│ ├── config/
│ └── types/
├── docker/ Compose files
├── infrastructure/
│ └── homepage/ Homepage dashboard (gethomepage.dev)
├── docs/
└── scripts/


---

## Architecture

Internet
→ Caddy (reverse proxy)
→ API Gateway
→ Kashif Cloud Backend (FastAPI)
→ Services: Auth · Monitoring · Storage · Docker · Networking · Automation
→ Debian host
→ Consumers: LifeOS · Admin Dashboard · Voice · future apps


See [docs/Architecture.md](docs/Architecture.md) for the full breakdown.

---

## Running Locally

```bash
cd docker
cp .env.example .env
docker-compose up --build -d
```

The admin dashboard will be available at `http://<host>:3002`, and the API at `http://<host>:8000`.

---

## Docs

- [Architecture](docs/Architecture.md)
- [Services](docs/Services.md)
- [Storage](docs/Storage.md)
- [Network](docs/Network.md)
- [Roadmap](docs/Roadmap.md)

---

## Ecosystem

Kashif Cloud is one of three independent projects:

| Project | Purpose |
|---|---|
| **Kashif Cloud** | Infrastructure control plane (this repo) |
| **LifeOS** | Personal AI operating system, user-facing |
| **Cyber Lab** | Cybersecurity learning, pentesting lab |

LifeOS never manages infrastructure directly — it always goes through the Kashif Cloud API.
