const express = require('express');
const router = express.Router();

// Mock models for Phase 1
const mockCreateAccount = async (accountData) => {
    return { id: `acc_${Date.now()}`, ...accountData, balance: 0 };
};

const mockProcessTransaction = async (txData) => {
    return { txId: `tx_${Date.now()}`, status: 'processed', amount: txData.amount };
};

router.post('/accounts', async (req, res, next) => {
    try {
        const account = await mockCreateAccount(req.body);
        res.status(201).json({ success: true, data: account });
    } catch (error) {
        next(error);
    }
});

router.post('/transactions', async (req, res, next) => {
    try {
        const transaction = await mockProcessTransaction(req.body);
        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
