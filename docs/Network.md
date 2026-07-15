# Networking Module

## Planned Capabilities
- Connected devices list
- Router statistics
- DHCP lease info
- DNS management
- IP address management
- Port forwarding overview
- Wi-Fi monitoring

## Notes
- Data source(s) TBD: router API vs. SNMP vs. scraping admin UI.
- This module is read-only to start; write access (e.g. DHCP reservations)
  comes later once auth/audit logging is solid.
