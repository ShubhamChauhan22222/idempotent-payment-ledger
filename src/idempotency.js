// Mocking a Redis/MongoDB based cache for idempotency
const idempotencyCache = new Map();

const idempotencyMiddleware = async (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
        return res.status(400).json({ success: false, message: 'Idempotency-Key header is required' });
    }

    if (idempotencyCache.has(idempotencyKey)) {
        console.log(`[Idempotency] Cache hit for key: ${idempotencyKey}. Returning cached response.`);
        const cachedResponse = idempotencyCache.get(idempotencyKey);
        return res.status(200).json(cachedResponse);
    }

    // Intercept res.json to cache the response before sending it
    const originalJson = res.json;
    res.json = function(body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[Idempotency] Caching response for key: ${idempotencyKey}`);
            idempotencyCache.set(idempotencyKey, body);
            
            // Simulated 24-hour TTL expiration (simplified)
            setTimeout(() => {
                idempotencyCache.delete(idempotencyKey);
            }, 24 * 60 * 60 * 1000); 
        }
        return originalJson.call(this, body);
    };

    next();
};

module.exports = idempotencyMiddleware;
