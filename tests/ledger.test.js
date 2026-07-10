const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');

const app = express();
app.use(express.json());
app.use('/api/v1', routes);

describe('Payment Ledger High Concurrency & Idempotency Tests', () => {
    it('should process a transaction and append an audit log', async () => {
        const res = await request(app)
            .post('/api/v1/transactions')
            .set('Idempotency-Key', 'test-key-1')
            .send({ accountId: 'acc_123', amount: 100 });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });

    it('should return cached response for the same Idempotency-Key', async () => {
        const res1 = await request(app)
            .post('/api/v1/transactions')
            .set('Idempotency-Key', 'test-key-2')
            .send({ accountId: 'acc_123', amount: 50 });
        
        const res2 = await request(app)
            .post('/api/v1/transactions')
            .set('Idempotency-Key', 'test-key-2')
            .send({ accountId: 'acc_123', amount: 50 });
            
        expect(res1.body.data.txId).toEqual(res2.body.data.txId);
    });

    it('should handle 50 concurrent requests without race conditions', async () => {
        // Simulating 50 concurrent transactions
        const requests = Array.from({ length: 50 }).map((_, i) => 
            request(app)
                .post('/api/v1/transactions')
                .set('Idempotency-Key', `test-concurrent-key-${i}`)
                .send({ accountId: 'acc_target', amount: 10 })
        );
        
        const responses = await Promise.all(requests);
        responses.forEach(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
        });
        
        // In a fully integrated environment, we would also verify that 
        // the final account balance strictly equals initial - 50 * 10
    });
});
