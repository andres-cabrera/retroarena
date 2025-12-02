# Retro Arena - Multiplayer Game

Un juego retro multijugador en tiempo real donde los jugadores se encuentran automáticamente en un mapa compartido.

## Características

- ✨ Búsqueda automática de oponentes (máximo 2 minutos de espera)
- 🗺️ Mapa compartido en tiempo real
- ⚔️ Sistema de combate por turnos con 3 tipos de ataques
- 🎮 3 campeones diferentes (Warrior, Mage, Rogue)
- ⌨️ Controles con flechas o WASD
- 🎯 Colisión automática para iniciar combate
- 🚀 **Preparado para escalar** a millones de usuarios
- 📊 Arquitectura production-ready

## Instalación

### Requisitos
- Node.js 14+ instalado
- npm

### Pasos

1. **Clonar el repositorio**
```bash
cd retroarena
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:8080`

### Desarrollo (con auto-reload)
```bash
npm run dev
```

## Cómo Jugar

1. **Abre el juego** en tu navegador: `http://localhost:8080`
2. **Selecciona un campeón**: Warrior, Mage o Rogue
3. **Espera un oponente**: El servidor busca automáticamente otro jugador (máximo 2 minutos)
4. **Navega por el mapa**: Usa las flechas o WASD
5. **Colisiona con el enemigo**: Se iniciará automáticamente un combate
6. **Selecciona ataques**: 🔥 Fuego, 💧 Agua, 🌱 Tierra
7. **Gana** el combate (mejor de 5 ataques)

## Mecánicas del Juego

### Campeones
- **Warrior**: 3 Agua, 1 Fuego, 1 Tierra
- **Mage**: 3 Tierra, 1 Agua, 1 Fuego
- **Rogue**: 3 Fuego, 1 Agua, 1 Tierra

### Sistema de Combate
- Fuego 🔥 vence a Tierra 🌱
- Tierra 🌱 vence a Agua 💧
- Agua 💧 vence a Fuego 🔥
- Empate = sin puntos
- Mejor de 5 ataques gana

## Estructura del Servidor

### Endpoints

#### 1. JOIN - Conectar jugador
```
GET /join
Response: playerId
```

#### 2. SELECT CHAMPION - Seleccionar campeón
```
POST /champion/:playerId
Body: { champion: "Warrior" | "Mage" | "Rogue" }
Response: { success: true, playerId, champion }
```

#### 3. GET OPPONENTS - Buscar oponentes
```
GET /opponents?playerId=<playerId>
Response: { opponents: [{ id, champion }] }
```

#### 4. SEND POSITION - Actualizar posición
```
POST /champion/:playerId/position
Body: { x, y }
Response: { enemies: [{ id, x, y, champion }] }
```

#### 5. SEND ATTACKS - Enviar ataques
```
POST /champion/:playerId/attacks
Body: { attacks: ["FIRE", "WATER", ...] }
Response: { success: true }
```

#### 6. GET ATTACKS - Obtener ataques del enemigo
```
GET /champion/:opponentId/attacks?playerId=<playerId>
Response: { attacks: ["FIRE", "WATER", ...] }
```

## Características del Servidor

- **Emparejamiento automático**: Los jugadores se emparejan cuando ambos tienen campeón seleccionado
- **Sincronización en tiempo real**: Las posiciones se sincronizan entre jugadores
- **Limpieza automática**: Los jugadores inactivos (>5 min) se eliminan
- **CORS habilitado**: Permite peticiones desde cualquier origen

## Tecnología

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Node.js + Express
- **Comunicación**: REST API con JSON

## Desarrollador

andres-cabrera

## Documentación Completa

- 📖 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía para desplegar en Heroku, Railway, DigitalOcean
- 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** - Plan de escalabilidad y evolución
- 📚 **[TECHNICAL.md](TECHNICAL.md)** - Documentación técnica detallada
- 🧪 **[API_TESTING.md](API_TESTING.md)** - Ejemplos de testing con cURL y Postman

## Licencia

ISC
