const express = require('express');
const idempotencyMiddleware = require('./idempotency');
const router = express.Router();

// Mock models for Phase 1
const mockCreateAccount = async (accountData) => {
    return { id: `acc_${Date.now()}`, ...accountData, balance: 0 };
};

// Load C++ addon (with mock fallback if not built)
let cppEngine;
try {
    cppEngine = require('../build/Release/ledger_core');
} catch (e) {
    console.warn('[Warning] C++ addon not built. Using JS fallback.');
    cppEngine = {
        processTransaction: (accountId, amount) => ({
            success: true,
            processedBy: 'js_fallback',
            accountId
        })
    };
}

const mockProcessTransaction = async (txData) => {
    // Delegate processing to the C++ core engine
    const cppResult = cppEngine.processTransaction(txData.accountId || 'acc_default', txData.amount || 0);
    return { txId: `tx_${Date.now()}`, status: 'processed', amount: txData.amount, engineResult: cppResult };
};

router.post('/accounts', async (req, res, next) => {
    try {
        const account = await mockCreateAccount(req.body);
        res.status(201).json({ success: true, data: account });
    } catch (error) {
        next(error);
    }
});

// Apply idempotency middleware to the payment transaction endpoint
router.post('/transactions', idempotencyMiddleware, async (req, res, next) => {
    try {
        const transaction = await mockProcessTransaction(req.body);
        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
