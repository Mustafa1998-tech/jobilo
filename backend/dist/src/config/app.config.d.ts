declare const _default: () => {
    port: number;
    nodeEnv: string;
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiry: string;
        refreshExpiry: string;
    };
    database: {
        url: string;
    };
    stripe: {
        secretKey: string;
        webhookSecret: string;
    };
    openai: {
        apiKey: string;
        model: string;
        maxTokens: number;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    resend: {
        apiKey: string;
        from: string;
    };
    cors: {
        origins: string[];
    };
    rateLimit: {
        ttl: number;
        max: number;
    };
    app: {
        url: string;
        apiUrl: string;
    };
};
export default _default;
