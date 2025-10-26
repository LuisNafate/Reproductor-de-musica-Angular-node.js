# Reproductor Angular - Spotify Integration

Un reproductor de música moderno construido con Angular 18+ y Tailwind CSS, conectado a la API de Spotify.

## 🎨 Características

- ✅ Diseño moderno con degradado azul oscuro
- ✅ Búsqueda de canciones en tiempo real con Spotify API
- ✅ Lista de reproducción con scroll suave
- ✅ Carátula de álbum grande en el centro
- ✅ Controles de reproducción visuales (no funcionales)
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Componentes standalone de Angular 18

## 📋 Requisitos previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Spotify Developer (para obtener el token de acceso)

## 🚀 Instalación

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar token de Spotify:**

   Para usar la API de Spotify, necesitas un token de acceso:

   a. Ve a [Spotify Developer Console](https://developer.spotify.com/console/get-search-item/)
   
   b. Haz clic en "Get Token" y autoriza la aplicación
   
   c. Copia el token generado
   
   d. Abre el archivo `src/app/services/spotify.service.ts`
   
   e. Reemplaza `'TU_TOKEN_DE_SPOTIFY_AQUI'` con tu token:

   ```typescript
   private readonly accessToken = 'TU_TOKEN_AQUI';
   ```

   **Nota:** Los tokens de Spotify expiran después de 1 hora. Para producción, deberías implementar OAuth 2.0.

## 🏃‍♂️ Ejecutar la aplicación

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🎯 Uso

1. Escribe el nombre de una canción o artista en la barra de búsqueda
2. Presiona Enter para buscar
3. Los resultados aparecerán en el panel izquierdo
4. Haz clic en cualquier canción para mostrarla en el reproductor central
5. Los controles de reproducción son solo visuales (no reproducen música real)

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── search-bar/
│   │   │   └── search-bar.component.ts
│   │   ├── track-list/
│   │   │   └── track-list.component.ts
│   │   └── player/
│   │       └── player.component.ts
│   ├── services/
│   │   └── spotify.service.ts
│   └── app.component.ts
├── styles.css
├── index.html
└── main.ts
```

## 🎨 Paleta de colores

- **Azul oscuro:** `#0b2545`
- **Azul medio:** `#1e3d59`
- **Azul claro:** `#2e5266`
- **Texto:** Blanco con opacidades variables

## 🛠️ Tecnologías utilizadas

- Angular 18.2
- Tailwind CSS 3.4
- RxJS 7.8
- Spotify Web API
- TypeScript 5.5

## ⚠️ Limitaciones

- Los botones de reproducción son solo visuales
- No hay reproducción de audio real
- El token de Spotify debe renovarse manualmente cada hora
- No incluye autenticación de usuario con Spotify

## 📝 Notas de desarrollo

Este proyecto fue creado como una práctica de integración con APIs externas y diseño de interfaces modernas. No está pensado para producción sin implementar:

- Sistema de autenticación OAuth 2.0 con Spotify
- Reproducción de audio real
- Manejo de estado global (NgRx o similar)
- Tests unitarios y e2e

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado como proyecto de práctica con Angular y Spotify API.
