"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 2000,
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.RESEND_FROM || 'noreply@jobilo.com',
    },
    cors: {
        origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    },
    rateLimit: {
        ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
        max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    },
    app: {
        url: process.env.APP_URL || 'http://localhost:3000',
        apiUrl: process.env.API_URL || 'http://localhost:4000',
    },
});
//# sourceMappingURL=app.config.js.map