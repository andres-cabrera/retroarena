# 🎨 OPTIMIZACIÓN DE ASSETS - Retro Arena

## Fondo GIF (rpg-background.gif)

### Optimizaciones aplicadas:

#### CSS
```css
body {
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
                url("./assets/rpg-background.gif");
    background-size: cover;           /* Cubre todo el viewport */
    background-position: center;      /* Centrado */
    background-attachment: fixed;    /* Efecto parallax (escritorio) */
    background-repeat: no-repeat;     /* Sin repetir */
    min-height: 100vh;                /* Al menos altura del viewport */
}

@media (max-width: 480px) {
    body {
        background-attachment: scroll;  /* Móvil: no parallax */
    }
}
```

### Características:
✅ **Responsive** - Se adapta a cualquier tamaño
✅ **Overlay** - Oscurece el GIF (0.3 opacidad) para mejor legibilidad
✅ **Parallax** - Efecto de profundidad en desktop
✅ **Mobile-friendly** - Desactiva parallax en móvil (mejor performance)
✅ **Sin repetición** - El GIF cubre todo sin dividirse

---

## Optimización de Imágenes GIF

### Para mejorar rendimiento del GIF:

#### 1. Comprimir el GIF
```bash
# Usando ImageMagick (instalar: `brew install imagemagick`)
convert rpg-background.gif -fuzz 20% -colors 128 rpg-background-compressed.gif

# O usando gifsicle
gifsicle -O3 rpg-background.gif -o rpg-background-compressed.gif
```

#### 2. Convertir a formato moderno (WebP)
```bash
# Crear versión WebP (más eficiente)
cwebp -gif rpg-background.gif -o rpg-background.webp

# Fallback CSS:
background-image: 
    url("./assets/rpg-background.webp"),
    url("./assets/rpg-background.gif");
```

#### 3. Usar CSS Grid para optimizar
```css
/* Alternativa: usar múltiples elementos si el GIF es muy pesado */
body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("./assets/rpg-background.gif") center/cover fixed;
    z-index: -1;
}
```

---

## Tamaños Recomendados

| Formato | Tamaño Ideal | Compresión |
|---------|--------------|-----------|
| GIF | <2MB | gifsicle -O3 |
| WebP | <500KB | cwebp |
| MP4 (como fondo) | <1MB | ffmpeg |

---

## Alternativas si el GIF es muy pesado

### Opción 1: Usar video MP4 como fondo
```css
body {
    background: #222;
}

body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("./assets/rpg-background-small.jpg") center/cover;
    z-index: -1;
}

/* En HTML -->
<video autoplay muted loop style="...">
    <source src="./assets/rpg-background.mp4" type="video/mp4">
</video>
```

### Opción 2: Usar fondo estático con animación CSS
```css
@keyframes background-pan {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
}

body {
    background: url("./assets/pattern.png");
    animation: background-pan 20s linear infinite;
}
```

### Opción 3: Lazy load del GIF
```javascript
// Cargar GIF solo cuando sea visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.body.style.backgroundImage = 
                'url("./assets/rpg-background.gif")';
        }
    });
});
observer.observe(document.body);
```

---

## Checklist de Optimización

- [ ] GIF comprimido (<2MB)
- [ ] Versión WebP disponible
- [ ] CSS background responsive
- [ ] Parallax en desktop
- [ ] Sin parallax en mobile
- [ ] Overlay para legibilidad
- [ ] Test en conexión lenta (Throttle en DevTools)
- [ ] Test en dispositivos móviles
- [ ] Lighthouse score >80

---

## Testing de Performance

### Chrome DevTools:
1. Abre DevTools (F12)
2. Ir a "Performance"
3. Grabar carga de página
4. Ver: FCP (First Contentful Paint), LCP (Largest Contentful Paint)

### Lighthouse:
1. DevTools → Lighthouse
2. Run audit
3. Ver score de performance

### Network Throttling:
1. DevTools → Network
2. Seleccionar "Slow 3G"
3. Recargar y observar

---

## Código Final Optimizado

```css
/* Body con fondo GIF optimizado */
body {
    font-family: "Press Start 2P", sans-serif;
    
    /* Gradient overlay para oscurecer + GIF */
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
                url("./assets/rpg-background.gif");
    
    /* Propiedades de imagen de fondo */
    background-size: cover;
    background-position: center;
    background-attachment: fixed;    /* Parallax effect */
    background-repeat: no-repeat;
    
    /* Layout */
    min-height: 100vh;
    padding: 50px;
    margin: 0;
}

/* Mobile: Sin parallax para mejor performance */
@media (max-width: 480px) {
    body {
        background-attachment: scroll;
    }
}
```

---

## Próximas Mejoras

- [ ] Agregar WebP fallback
- [ ] Implementar lazy loading
- [ ] Considerar video MP4 si el GIF es muy pesado
- [ ] Agregar caché de navegador
- [ ] Monitorear performance con Analytics

