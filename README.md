# High-Performance Idempotent Payment Ledger API

**Architected a double-entry accounting ledger API using Node.js and Express, delegating high-throughput transaction processing to a custom C++ backend engine.**

## Features
- Engineered robust idempotency mechanisms using caching to prevent duplicate API requests and ensure safe retries within a 24-hour window.
- Enforced ACID compliance and mitigated race conditions through strict database locking, alongside immutable audit logging for all account balance transitions.

## Tech Stack
- **API Layer**: Node.js, Express.js
- **Core Processing Engine**: C++ (Node-API)
- **Database**: MongoDB (Multi-document ACID transactions)

## Project Phases
- Phase 1: Foundation & Gateway 
- Phase 2: Idempotency Implementation
- Phase 3: The C++ Transaction Engine 
- Phase 4: Audit Logging & Test Coverage
