# Kashif Cloud

Self-hosted infrastructure control plane for a personal homelab —
servers, containers, storage, networking, monitoring, and automation,
all behind one set of APIs.

Kashif Cloud is **not** an AI assistant and **not** a personal OS.
It's the backend platform other things build on top of:
## Status
Early foundation phase. See [docs/Roadmap.md](docs/Roadmap.md).

## Structure
See [docs/Architecture.md](docs/Architecture.md).

## Stack
- Backend: FastAPI + PostgreSQL
- Frontend: Next.js + React + Tailwind
- Auth: JWT
- Reverse proxy: Caddy
- Containers: Docker / Docker Compose

## Docs
- [Architecture](docs/Architecture.md)
- [Services](docs/Services.md)
- [Storage](docs/Storage.md)
- [Network](docs/Network.md)
- [Roadmap](docs/Roadmap.md)
