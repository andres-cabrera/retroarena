const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configuración
const CONFIG = {
  PLAYER_TIMEOUT: parseInt(process.env.PLAYER_TIMEOUT) || 5 * 60 * 1000, // 5 minutos
  CLEANUP_INTERVAL: parseInt(process.env.CLEANUP_INTERVAL) || 60 * 1000, // Cada minuto
  MIN_WAIT_TIME: parseInt(process.env.MIN_WAIT_TIME) || 500, // Tiempo mínimo antes de ser visible
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Logging
if (NODE_ENV === 'development') {
  console.log(`🎮 Starting Retro Arena Server`);
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🔧 Config:`, CONFIG);
}

// ============ DATOS EN MEMORIA ============
// Estructura de jugadores
const players = {};
// Estructura: {
//   playerId: {
//     id: playerId,
//     champion: { name: 'Warrior', ... },
//     position: { x: 0, y: 0 },
//     attacks: [],
//     pairedWith: null,
//     createdAt: timestamp
//   }
// }

const playerPositions = {};
// Estructura: {
//   playerId: {
//     x: number,
//     y: number,
//     champion: { name: 'Warrior', ... }
//   }
// }

const pairs = {};
// Estructura: {
//   pairId: {
//     player1: playerId,
//     player2: playerId,
//     attacks: {
//       player1: [],
//       player2: []
//     },
//     createdAt: timestamp
//   }
// }

// Generar ID único
function generateId() {
  return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generar Pair ID
function generatePairId(playerId1, playerId2) {
  return 'pair_' + [playerId1, playerId2].sort().join('_');
}

// Limpiar jugadores inactivos
setInterval(() => {
  const now = Date.now();

  Object.keys(players).forEach(playerId => {
    if (now - players[playerId].createdAt > CONFIG.PLAYER_TIMEOUT && !players[playerId].pairedWith) {
      console.log(`Removing inactive player: ${playerId}`);
      delete players[playerId];
      delete playerPositions[playerId];
    }
  });
}, CONFIG.CLEANUP_INTERVAL);

// ============ ENDPOINTS ============

// 1. JOIN - Nuevo jugador se une
app.get('/join', (req, res) => {
  const playerId = generateId();
  players[playerId] = {
    id: playerId,
    champion: null,
    position: { x: 0, y: 0 },
    attacks: [],
    pairedWith: null,
    createdAt: Date.now()
  };

  console.log(`Player joined: ${playerId}`);
  res.send(playerId);
});

// 2. SELECT CHAMPION - Jugador selecciona campeón
app.post('/champion/:playerId', (req, res) => {
  const { playerId } = req.params;
  const { champion } = req.body;

  if (!players[playerId]) {
    return res.status(404).json({ error: 'Player not found' });
  }

  players[playerId].champion = {
    name: champion,
    photo: `./assets/${champion.toLowerCase()}1.gif`,
    life: 5
  };

  playerPositions[playerId] = {
    x: 0,
    y: 0,
    champion: players[playerId].champion
  };

  console.log(`Player ${playerId} selected ${champion}`);
  res.json({ success: true, playerId, champion });
});

// 3. GET OPPONENTS - Obtener lista de oponentes disponibles
app.get('/opponents', (req, res) => {
  const { playerId } = req.query;

  if (!playerId || !players[playerId]) {
    return res.status(404).json({ error: 'Player not found', opponents: [] });
  }

  // Obtener jugadores disponibles (sin emparejar y con campeón seleccionado)
  const availableOpponents = Object.values(players)
    .filter(p => 
      p.id !== playerId && // No a sí mismo
      !p.pairedWith && // No ya emparejado
      p.champion && // Tiene campeón seleccionado
      Date.now() - p.createdAt > CONFIG.MIN_WAIT_TIME // Ha estado esperando al menos MIN_WAIT_TIME
    )
    .map(p => ({
      id: p.id,
      champion: p.champion
    }));

  // Si hay oponentes disponibles, emparejar automáticamente
  if (availableOpponents.length > 0) {
    const selectedOpponent = availableOpponents[0];
    const opponentPlayerId = selectedOpponent.id;

    // Crear pareja
    const pairId = generatePairId(playerId, opponentPlayerId);
    pairs[pairId] = {
      player1: playerId,
      player2: opponentPlayerId,
      attacks: {
        [playerId]: [],
        [opponentPlayerId]: []
      },
      createdAt: Date.now()
    };

    // Marcar como emparejados
    players[playerId].pairedWith = opponentPlayerId;
    players[opponentPlayerId].pairedWith = playerId;

    console.log(`Players paired: ${playerId} vs ${opponentPlayerId}`);
  }

  res.json({ opponents: availableOpponents });
});

// 4. SEND POSITION - Actualizar posición y obtener enemigos cercanos
app.post('/champion/:playerId/position', (req, res) => {
  const { playerId } = req.params;
  const { x, y } = req.body;

  if (!players[playerId]) {
    return res.status(404).json({ error: 'Player not found' });
  }

  playerPositions[playerId] = {
    x,
    y,
    champion: players[playerId].champion
  };

  // Obtener todos los oponentes emparejados
  const pairedWith = players[playerId].pairedWith;
  const enemies = [];

  if (pairedWith && playerPositions[pairedWith]) {
    enemies.push({
      id: pairedWith,
      x: playerPositions[pairedWith].x,
      y: playerPositions[pairedWith].y,
      champion: playerPositions[pairedWith].champion
    });
  }

  res.json({ enemies });
});

// 5. SEND ATTACKS - Enviar ataques
app.post('/champion/:playerId/attacks', (req, res) => {
  const { playerId } = req.params;
  const { attacks } = req.body;

  if (!players[playerId]) {
    return res.status(404).json({ error: 'Player not found' });
  }

  const pairedWith = players[playerId].pairedWith;
  if (!pairedWith) {
    return res.status(400).json({ error: 'Player not paired' });
  }

  const pairId = generatePairId(playerId, pairedWith);
  if (pairs[pairId]) {
    pairs[pairId].attacks[playerId] = attacks;
    console.log(`Player ${playerId} sent attacks:`, attacks);
  }

  res.json({ success: true });
});

// 6. GET ATTACKS - Obtener ataques del oponente
app.get('/champion/:opponentId/attacks', (req, res) => {
  const { opponentId } = req.params;
  const { playerId } = req.query;

  if (!players[opponentId]) {
    return res.status(404).json({ error: 'Opponent not found', attacks: [] });
  }

  const pairedWith = players[opponentId].pairedWith;
  if (!pairedWith || pairedWith !== playerId) {
    return res.status(400).json({ error: 'Not paired', attacks: [] });
  }

  const pairId = generatePairId(playerId, opponentId);
  const attacks = pairs[pairId]?.attacks[opponentId] || [];

  res.json({ attacks });
});

// ============ RUTAS ESTÁTICAS ============
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/retro-arena.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'retro-arena.js'));
});

// ============ INICIAR SERVIDOR ============
app.listen(PORT, () => {
  console.log(`🎮 Retro Arena Server running at http://localhost:${PORT}`);
  console.log(`🌍 Open http://localhost:${PORT} in your browser`);
  console.log(`⚙️  Configuration:`, CONFIG);
});
