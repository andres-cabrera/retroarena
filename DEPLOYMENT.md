# GUÍA DE DESPLIEGUE - Retro Arena

## Opción 1: Heroku (Recomendado - Gratis hasta 550 horas/mes)

### Requisitos:
- Heroku CLI instalado
- Cuenta en Heroku (gratuita)
- Git configurado

### Pasos:

1. **Instalar Heroku CLI**
   - Descargar: https://devcenter.heroku.com/articles/heroku-cli
   - Verificar: `heroku --version`

2. **Login en Heroku**
   ```bash
   heroku login
   ```

3. **Crear aplicación**
   ```bash
   cd retroarena
   heroku create tu-app-name
   # Ejemplo: heroku create retro-arena-game
   ```

4. **Desplegar**
   ```bash
   git push heroku main
   ```

5. **Abrir en navegador**
   ```bash
   heroku open
   # O manualmente: https://tu-app-name.herokuapp.com
   ```

### Monitorear logs:
```bash
heroku logs --tail
```

### Variables de entorno:
```bash
heroku config:set NODE_ENV=production
heroku config:set PLAYER_TIMEOUT=300000
```

---

## Opción 2: Railway.app (Alternativa moderna)

### Requisitos:
- Cuenta en Railway (gratuita)
- GitHub conectado

### Pasos:

1. **Ir a Railway**
   - https://railway.app

2. **Conectar GitHub**
   - Click en "New Project"
   - Seleccionar "Deploy from GitHub repo"
   - Autorizar y seleccionar `retroarena`

3. **Configurar**
   - Railway detecta Node.js automáticamente
   - Variables de entorno en Settings

4. **Desplegar**
   - Automático en cada push a main

5. **Obtener URL**
   - En "Public Networking" → Compartir URL pública

### Variables de entorno en Railway:
```
NODE_ENV=production
PLAYER_TIMEOUT=300000
PORT=8080
```

---

## Opción 3: Render.com

### Requisitos:
- Cuenta en Render (gratuita)
- GitHub conectado

### Pasos:

1. **Ir a Render**
   - https://render.com

2. **Crear Web Service**
   - "New Web Service"
   - Conectar repositorio GitHub

3. **Configurar**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

4. **Variables de entorno**
   - `NODE_ENV=production`
   - `PLAYER_TIMEOUT=300000`

5. **Deploy**
   - Automático en cada push

---

## Opción 4: DigitalOcean

### Requisitos:
- Cuenta DigitalOcean ($5/mes)
- Git configurado

### Pasos:

1. **Crear Droplet**
   - Seleccionar Node.js app
   - Ubuntu 22.04
   - Tamaño mínimo: $5/mes

2. **SSH al servidor**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Clonar repositorio**
   ```bash
   cd /var/www
   git clone https://github.com/andres-cabrera/retroarena.git
   cd retroarena
   npm install
   ```

4. **Instalar PM2 (gestor de procesos)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "retro-arena"
   pm2 startup
   pm2 save
   ```

5. **Configurar Nginx (reverse proxy)**
   ```bash
   # Editar: /etc/nginx/sites-available/default
   location / {
     proxy_pass http://localhost:8080;
     proxy_http_version 1.1;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection 'upgrade';
     proxy_cache_bypass $http_upgrade;
   }
   ```

6. **Reiniciar Nginx**
   ```bash
   systemctl restart nginx
   ```

7. **Obtener dominio**
   - Usar IP del droplet o configurar dominio

---

## Verificación Post-Despliegue

### Checklist:
```
✓ El servidor está corriendo
✓ Accesible desde navegador
✓ /join retorna playerId
✓ /opponents funciona
✓ Dos usuarios se pueden emparejar
✓ Las posiciones se sincronizan
✓ El combate funciona correctamente
```

### Test rápido:
```bash
curl https://tu-app.herokuapp.com/join
# Debería retornar: player_xxxxx
```

---

## Configuración de Dominio Personalizado

### Heroku:
```bash
heroku domains:add www.tudominio.com
# Luego configurar DNS CNAME hacia Heroku
```

### Railway/Render:
- Desde dashboard → "Custom Domain"
- Configurar CNAME en tu proveedor de DNS

---

## Escalabilidad Futura

Si necesitas escalar:

### Base de Datos:
```bash
# Cambiar en server.js:
# De: const players = {} (en memoria)
# A: MongoDB/PostgreSQL
```

### Ejemplo con MongoDB:
```javascript
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  id: String,
  champion: Object,
  position: Object,
  pairedWith: String,
  createdAt: Date
});

const Player = mongoose.model('Player', playerSchema);
```

### Redis para caché:
```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
// Usar Redis para posiciones actualizadas frecuentemente
```

### WebSocket para tiempo real:
```javascript
const io = require('socket.io')(server);
// Cambiar polling por WebSocket (latencia mínima)
```

---

## Monitoreo y Mantenimiento

### Heroku Dashboard:
- https://dashboard.heroku.com
- Ver recursos, logs, reiniciar dynos

### Railway Dashboard:
- https://railway.app/dashboard
- Monitoreo en tiempo real

### Upgrades sugeridos:
- Pasar de memoria a base de datos (>100 usuarios)
- Agregar Redis para caché (>500 usuarios)
- Implementar WebSocket (mejor UX)
- Usar CDN para assets (mejores tiempos)

---

## Troubleshooting

### "Application error" en Heroku
```bash
heroku logs --tail
# Ver qué salió mal
```

### Puerto incorrecto
- El servidor usa `process.env.PORT` automáticamente
- Heroku asigna dinámicamente

### CORS error
- Ya está configurado en `server.js`
- Si persiste: revisar headers

### Jugadores no se encuentran
- Revisar que ambos llamaron a `/join`
- Revisar que tienen champion seleccionado
- Revisar logs del servidor

---

## Costos Aproximados (2025)

| Servicio | Costo | Límite | Notas |
|----------|-------|--------|-------|
| Heroku | Gratis | 550h/mes | Suficiente para demo |
| Railway | $5/mes | Ilimitado | Muy recomendado |
| Render | Gratis | 750h/mes | Buena alternativa |
| DigitalOcean | $5/mes | Ilimitado | Más control |

