# ARQUITECTURA Y ESCALABILIDAD - Retro Arena

## Arquitectura Actual (MVP)

```
┌─────────────────────────────────────────────────┐
│          GitHub Pages / Local Browsers           │
│         (Static HTML + JavaScript)              │
└────────────────┬────────────────────────────────┘
                 │
         HTTP REST API (Fetch)
                 │
┌────────────────▼────────────────────────────────┐
│         Node.js + Express Server                 │
│           (puerto 8080 / Heroku)                │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Players (En Memoria - Object Map)       │  │
│  │  - ID, Champion, Position, Status        │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Pairs (En Memoria - Emparejamientos)   │  │
│  │  - Player1, Player2, Ataques            │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Positions (En Memoria - Sincronización)│  │
│  │  - X, Y, Champion Info                   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Características:
- ✅ Almacenamiento en memoria (rápido)
- ✅ Soporte para ~1000 usuarios simultáneos
- ✅ Latencia: 50-200ms
- ✅ Fácil de desplegar (Heroku/Railway)

### Limitaciones:
- ❌ Se pierde data al reiniciar servidor
- ❌ No soporta múltiples instancias (sin sincronización)
- ❌ Alto uso de memoria con muchos usuarios

---

## Arquitectura v2 (Escalabilidad Media)

Para 5,000 - 50,000 usuarios simultáneos:

```
┌─────────────────────────────────────────────────┐
│              Load Balancer (Nginx)              │
│   (Distribuye peticiones entre múltiples)       │
└──────────────┬─────────────────────────────────┘
               │
      ┌────────┼────────┐
      │        │        │
┌─────▼─┐┌────▼──┐┌────▼──┐
│Node.js││Node.js││Node.js │
│  Inst │ Inst  │ Inst  │
│   1   │   2   │   3   │
└─────┬─┘└────┬──┘└────┬──┘
      │       │        │
      └───────┼────────┘
              │
      ┌───────▼────────┐
      │   Redis Cache  │  (Sesiones, Posiciones)
      │  (En Memoria)  │
      └───────┬────────┘
              │
      ┌───────▼────────────┐
      │   MongoDB/Postgres │  (Persistencia)
      │   (Base de Datos)  │
      └────────────────────┘
```

### Cambios necesarios:
1. **Redis** para posiciones (acceso rápido)
2. **Base de datos** para persistencia
3. **Load balancer** para distribuir carga
4. **Sticky sessions** para mantener pareja

### Ventajas:
- ✅ Soporta 50,000+ usuarios
- ✅ Data persiste
- ✅ Escalable horizontalmente
- ✅ Mejor confiabilidad

### Desventajas:
- ❌ Complejidad aumentada
- ❌ Costos más altos
- ❌ Más difícil de mantener

---

## Arquitectura v3 (Realtime - WebSocket)

Para máxima interactividad:

```
┌──────────────────────────────────────┐
│  Client (Browser)                     │
│  ┌────────────────────────────────┐  │
│  │ WebSocket Connection (Bidireccional)
│  │ - Mensajes en tiempo real       │  │
│  │ - Actualizaciones instantáneas │  │
│  └────────────────────────────────┘  │
└────────────────┬─────────────────────┘
                 │
        Socket.IO / ws
                 │
┌────────────────▼─────────────────────┐
│  Node.js + Express + Socket.IO        │
│  ┌────────────────────────────────┐  │
│  │ Namespaces:                     │  │
│  │ - /game (partidas activas)      │  │
│  │ - /lobby (búsqueda)             │  │
│  │ - /chat (comunicación)          │  │
│  └────────────────────────────────┘  │
└────────────────┬─────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
┌─────▼──────┐     ┌───────▼──┐
│   Redis    │     │ Database  │
│ (Estado)   │     │ (Persist) │
└────────────┘     └───────────┘
```

### Ventajas:
- ✅ Latencia: <50ms
- ✅ Experiencia fluida
- ✅ Multiplayer simultáneo
- ✅ Broadcast de eventos

### Implementación (Socket.IO):
```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  // Jugador conecta
  socket.on('move', (data) => {
    // Broadcast a otros en la pareja
    socket.broadcast.emit('opponent-moved', data);
  });
});
```

---

## Plan de Migración

### Fase 1 (Ahora): MVP Producción
- ✅ Servidores: Heroku/Railway
- ✅ Storage: Memoria
- ✅ Usuarios: ~1000
- ✅ Costo: Gratis - $10/mes

### Fase 2 (1000+ usuarios)
- ⬜ Agregar Redis para posiciones
- ⬜ Base de datos para rankings
- ⬜ CDN para assets
- ⬜ Costo: $50-100/mes

### Fase 3 (5000+ usuarios)
- ⬜ Load balancing
- ⬜ WebSocket para realtime
- ⬜ Múltiples instancias Node
- ⬜ Costo: $200-500/mes

### Fase 4 (10000+ usuarios)
- ⬜ Kubernetes
- ⬜ Microservicios
- ⬜ GraphQL
- ⬜ Costo: $1000+/mes

---

## Pasos para Escalar

### 1. Agregar Redis

```javascript
// server.js
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// En lugar de: playerPositions[playerId] = {x, y}
// Usar:
await client.set(`pos:${playerId}`, JSON.stringify({x, y}));
```

### 2. Agregar Base de Datos

```javascript
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  id: String,
  username: String,
  champion: String,
  wins: Number,
  losses: Number,
  elo: Number,
});

const Player = mongoose.model('Player', playerSchema);
```

### 3. Implementar WebSocket

```javascript
// Cambiar REST polling por eventos WebSocket
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('player-moved', (data) => {
    io.to(data.room).emit('opponent-position', data);
  });
});
```

### 4. Load Balancer

```nginx
# nginx.conf
upstream backend {
  server instance1:8080;
  server instance2:8080;
  server instance3:8080;
  least_conn; # Algoritmo de distribución
}

server {
  listen 80;
  location / {
    proxy_pass http://backend;
  }
}
```

---

## Monitoreo en Producción

### Métricas importantes:
```
- Jugadores activos
- Tiempo promedio de emparejamiento
- Latencia P95
- Errores por minuto
- Memoria utilizada
- CPU utilizada
```

### Tools recomendadas:
- **Sentry.io** - Error tracking
- **New Relic** - Performance monitoring
- **DataDog** - Infrastructure monitoring
- **Grafana** - Dashboards visuales

---

## Consideraciones de Seguridad

### Actual (MVP):
- ✅ CORS configurado
- ✅ Input validation
- ✅ Sin autenticación (OK para demo)

### Futuro (Producción):
- ⬜ JWT Authentication
- ⬜ Rate limiting
- ⬜ HTTPS/SSL
- ⬜ DDOS protection
- ⬜ Input sanitization
- ⬜ SQL injection prevention

---

## Ejemplo: Agregar MongoDB

### 1. Instalar dependencia
```bash
npm install mongoose
```

### 2. Crear modelo
```javascript
const playerSchema = new mongoose.Schema({
  id: String,
  champion: Object,
  wins: Number,
  createdAt: { type: Date, default: Date.now }
});
const Player = mongoose.model('Player', playerSchema);
```

### 3. Usar en API
```javascript
app.post('/champion/:playerId', async (req, res) => {
  const player = await Player.findByIdAndUpdate(
    playerId,
    { champion: req.body.champion },
    { new: true }
  );
  res.json(player);
});
```

---

## Roadmap Sugerido

**Mes 1-3**: MVP con Heroku
- ✅ Funcionalidad básica
- ✅ Jugar en localhost
- ✅ Desplegar en Heroku

**Mes 4-6**: Primeras optimizaciones
- Redis para posiciones
- Tracking de estadísticas
- Interfaz mejorada

**Mes 7-12**: Escalabilidad
- Load balancing
- WebSocket
- Base de datos robusta

**Año 2+**: Features avanzadas
- Matchmaking por skill
- Torneos
- In-game chat
- Mobile app

---

