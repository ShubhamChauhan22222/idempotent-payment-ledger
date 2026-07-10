// Mock append-only audit log collection
const auditLog = [];

const appendAuditLog = async (transaction) => {
    const entry = {
        _id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        accountId: transaction.accountId,
        txId: transaction.txId,
        amount: transaction.amount,
        type: 'BALANCE_TRANSITION',
        status: 'COMMITTED',
        hash: 'mock_sha256_hash_for_immutability_check'
    };

    // In a real system, this is written via MongoDB within the same ACID transaction
    auditLog.push(entry);
    console.log(`[Audit] Immutable ledger entry appended for tx: ${transaction.txId}`);
    return entry;
};

module.exports = { appendAuditLog, getLogs: () => auditLog };
