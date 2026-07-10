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
- Phase 1: Foundation & Gateway (`feat/init-api`)
- Phase 2: Idempotency Implementation (`feat/idempotency-engine`)
- Phase 3: The C++ Transaction Engine (`feat/cpp-ledger-core`)
- Phase 4: Audit Logging & Test Coverage (`feat/audit-and-tests`)

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Replica Set (for ACID transactions)
- C++ Build Tools (Python, `make` or MSVC, and `node-gyp`)

### 1. Build C++ Addon
The custom C++ transaction processing engine must be compiled first:
```bash
npm install
npm install -g node-gyp
node-gyp configure
node-gyp build
```

### 2. Run Tests
We include an integration test suite validating high-concurrency race condition mitigations and idempotency.
```bash
npm test
```

### 3. Start Server
```bash
npm start
```
