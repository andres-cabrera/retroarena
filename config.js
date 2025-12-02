// config.js - Configuración centralizada para fácil escalado

module.exports = {
  // Servidor
  server: {
    port: process.env.PORT || 8080,
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },

  // Jugadores
  players: {
    timeout: parseInt(process.env.PLAYER_TIMEOUT) || 5 * 60 * 1000, // 5 minutos
    cleanupInterval: parseInt(process.env.CLEANUP_INTERVAL) || 60 * 1000, // 1 minuto
    minWaitTime: parseInt(process.env.MIN_WAIT_TIME) || 500, // 500ms
  },

  // Storage (cambiar a DB en producción)
  storage: {
    type: process.env.STORAGE_TYPE || 'memory', // 'memory' | 'mongodb' | 'postgresql'
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/retroarena',
    postgresUri: process.env.DATABASE_URL || 'postgresql://user:pass@localhost/retroarena',
    redisUri: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // WebSocket (para futuros upgrades)
  websocket: {
    enabled: process.env.WEBSOCKET_ENABLED === 'true' || false,
    port: process.env.WEBSOCKET_PORT || 8081,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info', // 'debug' | 'info' | 'warn' | 'error'
    format: process.env.LOG_FORMAT || 'simple', // 'simple' | 'json'
  },

  // Matchmaking
  matchmaking: {
    maxWaitTime: parseInt(process.env.MAX_WAIT_TIME) || 2 * 60 * 1000, // 2 minutos
    skillBased: process.env.SKILL_BASED_MATCHING === 'true' || false,
  },

  // Rate limiting (para producción)
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === 'true' || false,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutos
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX) || 100, // requests por ventana
  },

  // Analytics
  analytics: {
    enabled: process.env.ANALYTICS_ENABLED === 'true' || false,
    provider: process.env.ANALYTICS_PROVIDER || 'none', // 'google' | 'mixpanel' | 'none'
  },
};
