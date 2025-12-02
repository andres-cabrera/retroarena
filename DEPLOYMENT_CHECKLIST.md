# ✅ DEPLOYMENT CHECKLIST - Retro Arena

Usa este checklist antes de hacer un push a producción.

## Pre-Deployment

### Código
- [ ] Todos los `console.log()` de debug removidos
- [ ] Sin `TODO` o `FIXME` pendientes
- [ ] Código testeado localmente
- [ ] Sin errores en la consola del navegador
- [ ] Sin warnings en Node.js

### Variables de Entorno
- [ ] Copiar `.env.example` a `.env`
- [ ] Llenar todas las variables requeridas
- [ ] NO hacer commit de `.env`
- [ ] `.gitignore` incluye `node_modules/` y `.env`

### Dependencias
- [ ] `npm install` ejecutado
- [ ] `package.json` actualizado
- [ ] Sin versiones "latest" (usar semver ^x.y.z)

### Documentación
- [ ] README.md actualizado
- [ ] Cambios documentados
- [ ] Links funcionales en docs

## Local Testing

### Setup
- [ ] Clonar repositorio fresh
- [ ] `npm install` funciona
- [ ] `npm start` inicia sin errores
- [ ] Servidor escucha en puerto correcto

### Funcionalidad
- [ ] `/join` retorna ID válido
- [ ] `/champion/:playerId` acepta POST
- [ ] `/opponents` retorna lista
- [ ] `/position` actualiza posición
- [ ] `/attacks` guarda ataques
- [ ] Dos navegadores se pueden emparejar

### UI/UX
- [ ] Botones funcionales
- [ ] Sin console errors
- [ ] Responsivo en mobile
- [ ] Animaciones suaves
- [ ] Mensajes de error claros

## Pre-Deployment Final

### Git
- [ ] Código commiteado
- [ ] rama main está limpia
- [ ] Versión actualizada en `package.json`
- [ ] Tag creado (opcional): `git tag v1.0.0`

### Heroku Setup (si aplica)
- [ ] Heroku account creado
- [ ] CLI instalado: `heroku --version`
- [ ] Logeado: `heroku login`
- [ ] App creada: `heroku create app-name`
- [ ] Procfile presente y correcto

### Railway Setup (si aplica)
- [ ] Railway account creado
- [ ] GitHub conectado
- [ ] Repositorio seleccionado
- [ ] Variables de entorno configuradas

## Deployment Checklist

### Heroku
```bash
# Verificar que está listo
git status  # Sin cambios sin commitear
npm test    # Si tienes tests

# Hacer push
git push heroku main

# Verificar deployment
heroku logs --tail
```

- [ ] `git push heroku main` exitoso
- [ ] Logs muestran "Server running"
- [ ] `heroku open` abre el juego

### Railway
- [ ] Push a GitHub main
- [ ] Railway detecta cambios
- [ ] Deployment automático
- [ ] URL pública accesible

### DigitalOcean
- [ ] SSH conectado
- [ ] `git pull` actualiza código
- [ ] `npm install` completado
- [ ] PM2 reiniciado: `pm2 restart retro-arena`
- [ ] Nginx funciona: `curl localhost`

## Post-Deployment

### Testing
- [ ] Accesible desde navegador
- [ ] `/join` funciona
- [ ] Dos usuarios se emparejan
- [ ] Posiciones se sincronizan
- [ ] Combate funciona

### Monitoreo
- [ ] Logs limpios (sin errores)
- [ ] Sin memoria memory leak
- [ ] CPU < 50%
- [ ] Response time < 200ms

### Performance
- [ ] Página carga en < 3s
- [ ] Juego sin lag
- [ ] Sincronización en tiempo real

## Issues Comunes

| Problema | Solución |
|----------|----------|
| Port already in use | `lsof -i :8080` y kill, o usar PORT=3000 |
| Module not found | `npm install` |
| CORS error | Verificar headers en server.js |
| 404 endpoints | Verificar rutas en server.js |
| Players no se sync | Revisar API_BASE en retro-arena.js |

## Rollback Plan

Si algo sale mal:

### Heroku
```bash
heroku rollback
# Volver a versión anterior
```

### Railway
```bash
git revert HEAD
git push
# Railway redeploya automáticamente
```

### DigitalOcean
```bash
git revert HEAD
git push
ssh servidor
cd /var/www/retroarena
git pull
pm2 restart retro-arena
```

## Monitoreo Post-Deploy (Primeros 24h)

- [ ] Logs sin errores cada hora
- [ ] Usuarios conectados y activos
- [ ] Matchmaking funcionando
- [ ] Sin crashes o restarts inesperados
- [ ] Performance estable

## Métricas a Monitorear

```
✓ Jugadores activos
✓ Emparejamientos exitosos
✓ Tiempo promedio de matching
✓ Errores por minuto
✓ Response time promedio
✓ Memoria utilizada
✓ CPU utilizado
✓ Uptime
```

## Después de Deployment

- [ ] Documentar cambios realizados
- [ ] Actualizar CHANGELOG (si existe)
- [ ] Notificar a usuarios si aplica
- [ ] Monitorear primeras 24 horas
- [ ] Preparar plan B si hay issues

---

## Checklist de Seguridad

- [ ] No hay tokens en código
- [ ] `.env` no está en git
- [ ] CORS configurado apropiadamente
- [ ] Input validation en todos los endpoints
- [ ] Error messages no revelan detalles internos
- [ ] Rate limiting considerado
- [ ] HTTPS habilitado (en producción)

## Escalabilidad Futura

Si llega el momento de escalar:

- [ ] Leer [ARCHITECTURE.md](ARCHITECTURE.md)
- [ ] Considerar agregar Redis
- [ ] Considerar agregar Base de datos
- [ ] Considerar WebSocket
- [ ] Considerar Load Balancer

---

**Estado**: Listo para deployment ✅

Última revisión: Diciembre 2025
