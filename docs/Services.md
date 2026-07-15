# Services

## Backend Services (apps/api)
- auth        - JWT-based authentication
- monitoring  - CPU/RAM/disk/temp/network stats via psutil, systemd
- docker      - container/image/network/volume mgmt via Docker Engine API
- storage     - NAS, file browser, backups, snapshots
- networking  - connected devices, DHCP, DNS, Wi-Fi
- automation  - scheduled jobs, event-based workflows

## External / Already Running
- infrastructure/homepage - Homepage dashboard (gethomepage.dev), separate
  from the FastAPI backend; a general-purpose start page / widget dashboard.

## Consumers
- Admin Dashboard (apps/admin) - full access, project owner only
- LifeOS (separate repo) - infra-relevant subset via API only
- Voice (Google Nest Mini) - future client, subset of read + safe actions
