# 🎮 RETRO ARENA - Guía Rápida

Bienvenido al proyecto Retro Arena. Esta es una guía rápida para empezar.

## 📂 Estructura del Proyecto

```
retroarena/
├── 📄 Frontend (Cliente)
│   ├── index.html              (HTML principal)
│   ├── retro-arena.js          (Lógica del juego)
│   ├── styles.css              (Estilos CSS)
│   └── assets/                 (Imágenes y recursos)
│
├── 🖥️ Backend (Servidor)
│   ├── server.js               (Servidor Node.js)
│   ├── config.js               (Configuración)
│   └── package.json            (Dependencias)
│
├── 📚 Documentación
│   ├── README.md               (Descripción general)
│   ├── DEPLOYMENT.md           (Cómo desplegar)
│   ├── ARCHITECTURE.md         (Escalabilidad)
│   ├── TECHNICAL.md            (Detalle técnico)
│   ├── API_TESTING.md          (Testing)
│   └── COMPLETION_REPORT.md    (Resumen)
│
├── 🛠️ Configuración
│   ├── package.json            (npm scripts)
│   ├── Procfile                (Para Heroku)
│   ├── railway.json            (Para Railway)
│   ├── .env.example            (Variables de entorno)
│   └── .gitignore              (Git ignore)
│
└── ⚙️ Instalación
    ├── install.sh              (Linux/Mac)
    └── install.bat             (Windows)
```

## 🚀 Empezar en 3 Pasos

### 1. Clonar y entrar
```bash
cd retroarena
```

### 2. Instalar
```bash
npm install
```

### 3. Ejecutar
```bash
npm start
```

Luego abre: **http://localhost:8080**

## 🎮 Cómo Jugar

1. Abre en dos navegadores (o ventanas incógnito)
2. Selecciona un campeón en cada uno
3. El servidor te busca automáticamente otro jugador
4. Ambos aparecen en el mismo mapa
5. Navega con flechas o WASD
6. Choca con el otro jugador para iniciar combate
7. Selecciona 5 ataques (Fuego 🔥, Agua 💧, Tierra 🌱)
8. Gana si tienes más victorias

## 📖 Documentación

### Para Jugadores
- Instrucciones en [README.md](README.md)

### Para Desarrolladores
- **Primera lectura**: [TECHNICAL.md](TECHNICAL.md)
- **Si necesitas desplegar**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Para escalar**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Para testing**: [API_TESTING.md](API_TESTING.md)

## 🌍 Desplegar en Producción

### Opción 1: Heroku (Recomendado - Gratis)
```bash
heroku create tu-app-name
git push heroku main
heroku open
```

### Opción 2: Railway (Muy Fácil)
1. Ir a https://railway.app
2. Conectar GitHub
3. Seleccionar repositorio
4. Deploy automático ✨

### Opción 3: DigitalOcean ($5/mes)
Ver [DEPLOYMENT.md](DEPLOYMENT.md) para detalles

## 🛠️ Desarrollo Local

### Scripts disponibles
```bash
npm start      # Iniciar servidor en puerto 8080
npm run dev    # Iniciar con auto-reload (si está instalado nodemon)
```

### Estructura de la API
```
GET    /join                              → Nuevo jugador
POST   /champion/:playerId                → Seleccionar campeón
GET    /opponents?playerId=X              → Buscar oponentes
POST   /champion/:playerId/position       → Actualizar posición
POST   /champion/:playerId/attacks        → Enviar ataques
GET    /champion/:opponentId/attacks      → Obtener ataques
```

## 🎯 Próximas Mejoras

- [ ] Agregar persistencia con Base de Datos
- [ ] Implementar WebSocket para tiempo real
- [ ] Sistema de ranking y estadísticas
- [ ] Chat entre jugadores
- [ ] Modo de torneo
- [ ] Skins y customización
- [ ] Mobile app

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
```bash
npm install
```

### Error: "Port 8080 already in use"
```bash
PORT=3000 npm start
```

### Error: "Connection refused"
- Verificar que el servidor está corriendo: `npm start`
- Verificar que navegadores usan `http://` no `https://`

## 📊 Arquitectura Actual

```
Browser 1  ←→  REST API  ←→  Node.js Server  ←→  Memoria
Browser 2  ←→  REST API  ←→  (port 8080)     ←→  JSON
```

**Escalable a:**
- Redis (caché)
- MongoDB/PostgreSQL (base de datos)
- WebSocket (tiempo real)
- Load Balancer (múltiples servidores)

Ver [ARCHITECTURE.md](ARCHITECTURE.md) para plan completo.

## 👥 Colaboradores

- **andres-cabrera** - Creador original

## 📞 Soporte

Para preguntas o problemas:
1. Revisar la [documentación](TECHNICAL.md)
2. Revisar [API_TESTING.md](API_TESTING.md)
3. Crear un issue en GitHub

---

**Estado**: ✅ Completamente funcional y listo para producción

Última actualización: Diciembre 2025
