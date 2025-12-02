# EJEMPLOS DE API - Retro Arena

## Testing Manual con cURL

### 1. Conectar jugador
```bash
curl -X GET http://localhost:8080/join
# Response: player_1701518400000_abc123def
```

### 2. Seleccionar campeón
```bash
curl -X POST http://localhost:8080/champion/player_1701518400000_abc123def \
  -H "Content-Type: application/json" \
  -d '{"champion":"Warrior"}'

# Response:
# {
#   "success": true,
#   "playerId": "player_1701518400000_abc123def",
#   "champion": "Warrior"
# }
```

### 3. Buscar oponentes
```bash
curl -X GET "http://localhost:8080/opponents?playerId=player_1701518400000_abc123def"

# Response:
# {
#   "opponents": [
#     {
#       "id": "player_1701518500000_xyz789",
#       "champion": {
#         "name": "Mage",
#         "photo": "./assets/mage1.gif",
#         "life": 5
#       }
#     }
#   ]
# }
```

### 4. Enviar posición
```bash
curl -X POST http://localhost:8080/champion/player_1701518400000_abc123def/position \
  -H "Content-Type: application/json" \
  -d '{"x":150,"y":200}'

# Response:
# {
#   "enemies": [
#     {
#       "id": "player_1701518500000_xyz789",
#       "x": 450,
#       "y": 300,
#       "champion": {
#         "name": "Mage",
#         "photo": "./assets/mage1.gif",
#         "life": 5
#       }
#     }
#   ]
# }
```

### 5. Enviar ataques
```bash
curl -X POST http://localhost:8080/champion/player_1701518400000_abc123def/attacks \
  -H "Content-Type: application/json" \
  -d '{"attacks":["FIRE","WATER","EARTH","FIRE","WATER"]}'

# Response:
# { "success": true }
```

### 6. Obtener ataques del oponente
```bash
curl -X GET "http://localhost:8080/champion/player_1701518500000_xyz789/attacks?playerId=player_1701518400000_abc123def"

# Response:
# {
#   "attacks": ["WATER","WATER","FIRE","EARTH","WATER"]
# }
```

---

## Testing con JavaScript/Fetch

### Script de prueba completa
```javascript
const API = 'http://localhost:8080';

async function testGameFlow() {
  try {
    // 1. Join
    const joinResponse = await fetch(`${API}/join`);
    const playerId = await joinResponse.text();
    console.log('✅ Joined:', playerId);

    // 2. Select Champion
    const championResponse = await fetch(`${API}/champion/${playerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ champion: 'Warrior' })
    });
    const championData = await championResponse.json();
    console.log('✅ Champion selected:', championData);

    // 3. Search opponent
    const opponentsResponse = await fetch(`${API}/opponents?playerId=${playerId}`);
    const opponentsData = await opponentsResponse.json();
    console.log('✅ Opponents:', opponentsData);

    // 4. Send position
    const positionResponse = await fetch(`${API}/champion/${playerId}/position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: 100, y: 150 })
    });
    const positionData = await positionResponse.json();
    console.log('✅ Position updated:', positionData);

    // 5. Send attacks
    const attacksResponse = await fetch(`${API}/champion/${playerId}/attacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attacks: ['FIRE', 'WATER', 'EARTH', 'FIRE', 'WATER'] })
    });
    const attacksData = await attacksResponse.json();
    console.log('✅ Attacks sent:', attacksData);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar
testGameFlow();
```

---

## Testing con Postman

### Colección JSON para Postman

```json
{
  "info": {
    "name": "Retro Arena API",
    "description": "API testing collection for Retro Arena game",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Join Game",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:8080/join",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["join"]
        }
      }
    },
    {
      "name": "2. Select Champion",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"champion\":\"Warrior\"}"
        },
        "url": {
          "raw": "http://localhost:8080/champion/{{playerId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["champion", "{{playerId}}"]
        }
      }
    },
    {
      "name": "3. Get Opponents",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:8080/opponents?playerId={{playerId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["opponents"],
          "query": [
            {
              "key": "playerId",
              "value": "{{playerId}}"
            }
          ]
        }
      }
    },
    {
      "name": "4. Send Position",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"x\":100,\"y\":150}"
        },
        "url": {
          "raw": "http://localhost:8080/champion/{{playerId}}/position",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["champion", "{{playerId}}", "position"]
        }
      }
    },
    {
      "name": "5. Send Attacks",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"attacks\":[\"FIRE\",\"WATER\",\"EARTH\",\"FIRE\",\"WATER\"]}"
        },
        "url": {
          "raw": "http://localhost:8080/champion/{{playerId}}/attacks",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["champion", "{{playerId}}", "attacks"]
        }
      }
    },
    {
      "name": "6. Get Enemy Attacks",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:8080/champion/{{enemyId}}/attacks?playerId={{playerId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["champion", "{{enemyId}}", "attacks"],
          "query": [
            {
              "key": "playerId",
              "value": "{{playerId}}"
            }
          ]
        }
      }
    }
  ]
}
```

### Importar en Postman:
1. Abre Postman
2. Click en "Import"
3. Selecciona "Paste Raw Text"
4. Pega el JSON anterior
5. Usa `{{playerId}}` como variable de entorno

---

## Verificar que todo funciona

### Checklist:

```
✓ Node.js instalado (verificar: node -v)
✓ npm instalado (verificar: npm -v)
✓ Dependencias instaladas (npm install)
✓ Servidor iniciado (npm start)
✓ Servidor escucha en puerto 8080
✓ GET /join retorna ID
✓ POST /champion/:playerId funciona
✓ GET /opponents retorna oponentes
✓ POST /position actualiza posición
✓ POST /attacks guarda ataques
✓ GET /attacks retorna ataques

```

### Errores comunes y soluciones

**Error: "Cannot find module 'express'"**
- Solución: Ejecutar `npm install`

**Error: "Port 8080 already in use"**
- Solución: Usar otro puerto: `PORT=3000 npm start`

**Error: "CORS error"**
- Solución: El CORS está habilitado en el servidor, debería funcionar

**Error: "Connection refused"**
- Solución: Verificar que el servidor está corriendo: `npm start`

---

## Monitoreo del servidor

### Ver logs activos:
```bash
npm start
```

### Información de salida:
- Cada conexión: `Player joined: player_123...`
- Emparejamiento: `Players paired: player_123 vs player_456`
- Limpieza: `Removing inactive player: player_123`

---

## Performance

### Casos de prueba

**1. Usuario solo (búsqueda sin encontrar)**
```
GET /opponents cada 500ms durante 120 segundos
Total: 240 peticiones
Esperado: Sin error, retorna []
```

**2. Dos usuarios emparejándose**
```
Player 1 → GET /opponents
Player 2 → GET /opponents  
Esperado: Se emparejan, retornan mutuamente
```

**3. Combate completo**
```
5 POST /position (sync)
5 POST /attacks (ambos)
5 GET /attacks (polling)
Esperado: Sincronización correcta
```

