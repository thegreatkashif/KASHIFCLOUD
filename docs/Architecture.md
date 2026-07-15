# Architecture

## Overview
Kashif Cloud is the infrastructure control plane for the user's homelab.
It is not an AI assistant and not a personal OS — LifeOS (separate project)
consumes Kashif Cloud's APIs for anything infrastructure-related; it never
touches infrastructure directly.

## Request Flow
Internet
  → Caddy (reverse proxy)
  → API Gateway
  → Kashif Cloud Backend (FastAPI)
  → Services: Auth, Monitoring, Storage, Docker, Networking, Automation
  → Debian host
  → Consumers: LifeOS / Admin Dashboard / Voice / future apps

## Design Principles
1. Infrastructure and UI stay separated.
2. Every feature is exposed through an API first — the Admin Dashboard,
   LifeOS, and any future app all consume the same backend.
3. Services are modular and independently deployable.
4. Production-quality architecture over rapid feature sprawl.

## Repo Layout
Kashif-Cloud/
  apps/
    api/       - FastAPI backend
    admin/     - Next.js admin dashboard (admin-only)
    web/       - future user-facing app
  packages/
    ui/        - shared React components
    config/    - shared config (eslint, tsconfig, etc.)
    types/     - shared TypeScript types
  docker/      - compose files, Dockerfiles
  infrastructure/
    homepage/  - existing Homepage dashboard (gethomepage.dev)
  docs/
  scripts/
