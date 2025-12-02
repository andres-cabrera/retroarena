# Documentación Técnica - Retro Arena

## Arquitectura del Sistema

```
┌─────────────────┐         ┌──────────────────┐
│  Cliente 1      │         │  Cliente 2       │
│  (Browser)      │         │  (Browser)       │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │        HTTP REST API      │
         └──────────────┬────────────┘
                        │
                 ┌──────▼──────┐
                 │   Server    │
                 │  (Node.js)  │
                 └──────┬──────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
     [Players]   [Positions]       [Pairs]
   (En Memoria)  (En Memoria)   (En Memoria)
```

## Flujo del Juego

### 1. Conexión Inicial
```
Usuario abre app
    ↓
/join → Obtiene playerId
    ↓
Interfaz de selección de campeón
```

### 2. Selección de Campeón
```
Usuario selecciona campeón
    ↓
POST /champion/:playerId
    ↓
Pantalla de búsqueda de oponente
```

### 3. Búsqueda y Emparejamiento
```
GET /opponents?playerId=X (cada 500ms)
    ↓
    ├─ Si hay oponentes disponibles:
    │  ├─ Emparejar ambos jugadores
    │  ├─ Guardar pareja en memory
    │  └─ Retornar oponentes
    │
    └─ Si NO hay:
       └─ Agregar a lista de espera
```

### 4. Sincronización en Mapa
```
POST /champion/:playerId/position (cada 50ms)
    ↓
    ├─ Actualizar posición del jugador
    │
    └─ GET /enemies
       ├─ Retornar posición del oponente emparejado
       └─ Mostrar en canvas
```

### 5. Combate
```
Colisión detectada en cliente
    ↓
Usuarios seleccionan 5 ataques
    ↓
POST /attacks para cada usuario
    ↓
GET /attacks de oponente (polling)
    ↓
Una vez ambos enviaron 5 ataques:
    ├─ Comparar resultados
    ├─ Calcular ganador
    └─ Mostrar resultado

```

## Estructura de Datos

### Player Object
```javascript
{
  id: "player_1701518400000_abc123def",
  champion: {
    name: "Warrior",
    photo: "./assets/warrior1.gif",
    life: 5
  },
  position: { x: 0, y: 0 },
  attacks: [],
  pairedWith: "player_1701518500000_xyz789", // null si no está emparejado
  createdAt: 1701518400000
}
```

### Pair Object
```javascript
{
  player1: "player_1701518400000_abc123def",
  player2: "player_1701518500000_xyz789",
  attacks: {
    "player_1701518400000_abc123def": ["FIRE", "WATER", "EARTH", "FIRE", "WATER"],
    "player_1701518500000_xyz789": ["WATER", "WATER", "FIRE", "EARTH", "WATER"]
  },
  createdAt: 1701518400000
}
```

## Endpoints en Detalle

### GET /join
**Propósito**: Crear una nueva sesión de jugador
**Parámetros**: Ninguno
**Response**: 
```
playerId: string (ejemplo: "player_1701518400000_abc123def")
```
**Lado del cliente**:
- Guarda playerId en variable global
- Procede a seleccionar campeón

---

### POST /champion/:playerId
**Propósito**: Asignar campeón al jugador
**Parámetros URL**: 
- `playerId`: ID del jugador
**Body**:
```json
{ "champion": "Warrior" | "Mage" | "Rogue" }
```
**Response**:
```json
{
  "success": true,
  "playerId": "player_1701518400000_abc123def",
  "champion": "Warrior"
}
```
**Lógica servidor**:
- Guarda campeón en objeto player
- Inicializa posición en (0, 0)
- Agrega a lista de oponentes disponibles

---

### GET /opponents
**Propósito**: Obtener lista de oponentes disponibles
**Parámetros URL**:
- `playerId`: ID del jugador que busca
**Query**: `?playerId=player_123`
**Response**:
```json
{
  "opponents": [
    {
      "id": "player_1701518500000_xyz789",
      "champion": {
        "name": "Mage",
        "photo": "./assets/mage1.gif",
        "life": 5
      }
    }
  ]
}
```
**Lógica servidor**:
1. Obtener lista de jugadores con campeón seleccionado
2. Filtrar:
   - No sea el mismo jugador
   - No esté emparejado
   - Lleve >500ms esperando
3. Si hay oponentes:
   - Crear pareja con el primero
   - Marcar ambos como `pairedWith`
4. Retornar oponentes disponibles

---

### POST /champion/:playerId/position
**Propósito**: Sincronizar posición del jugador
**Parámetros URL**: 
- `playerId`: ID del jugador
**Body**:
```json
{
  "x": 150,
  "y": 200
}
```
**Response**:
```json
{
  "enemies": [
    {
      "id": "player_1701518500000_xyz789",
      "x": 450,
      "y": 300,
      "champion": {
        "name": "Mage",
        "photo": "./assets/mage1.gif",
        "life": 5
      }
    }
  ]
}
```
**Lógica servidor**:
1. Guardar posición del jugador
2. Obtener jugador emparejado (si existe)
3. Retornar su posición actual

---

### POST /champion/:playerId/attacks
**Propósito**: Enviar ataques al servidor
**Parámetros URL**: 
- `playerId`: ID del jugador
**Body**:
```json
{
  "attacks": ["FIRE", "WATER", "EARTH", "FIRE", "WATER"]
}
```
**Response**:
```json
{ "success": true }
```
**Lógica servidor**:
1. Encontrar pareja del jugador
2. Guardar ataques en `pairs[pairId].attacks[playerId]`
3. Confirmar recibida

---

### GET /champion/:opponentId/attacks
**Propósito**: Obtener ataques del oponente
**Parámetros URL**: 
- `opponentId`: ID del oponente
**Query**: `?playerId=player_123`
**Response**:
```json
{
  "attacks": ["FIRE", "WATER", "EARTH", "FIRE", "WATER"]
}
```
**Lógica servidor**:
1. Verificar que opponentId y playerId estén emparejados
2. Retornar ataques del opponentId si existen
3. Si no existen, retornar array vacío

---

## Manejo de Errores

### 404 - Player Not Found
```json
{ "error": "Player not found" }
```
**Causa**: El playerId no existe o fue eliminado por timeout

### 400 - Player Not Paired
```json
{ "error": "Player not paired" }
```
**Causa**: El jugador intenta realizar acción de combate pero no está emparejado

## Limpieza Automática

Cada 60 segundos:
- Se revisan todos los jugadores
- Si `Date.now() - player.createdAt > 5 minutos` Y `player.pairedWith === null`
- Se elimina el jugador y su posición

## Consideraciones de Seguridad

### Validaciones
- ✅ Verificar que playerId existe antes de cualquier operación
- ✅ Verificar que ambos jugadores estén emparejados antes de combate
- ✅ Validar estructura de ataques (array de 5 elementos)

### Mejoras Futuras
- [ ] Autenticación con tokens JWT
- [ ] Rate limiting por IP
- [ ] Validación de tipos de ataques
- [ ] Timeout de sesión más inteligente
- [ ] Persistencia en base de datos

## Performance

### Consideraciones
- En memoria: Soporta 1000+ jugadores simultáneos sin problemas
- Polling: 500ms es el mínimo recomendado para no saturar servidor
- Canvas: 50ms de refresco es estándar para juegos web
- API REST: Sin WebSocket, latencia es la limitante principal

### Optimizaciones Futuras
- [ ] Implementar WebSocket para sincronización en tiempo real
- [ ] Usar Redis para persistencia en cluster
- [ ] Implementar load balancing con sticky sessions
- [ ] CDN para assets
