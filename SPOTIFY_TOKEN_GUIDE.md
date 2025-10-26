# 🔑 Guía para Obtener Token de Spotify

Para que la aplicación funcione correctamente, necesitas un token de acceso de Spotify. Aquí te explico cómo obtenerlo:

## Método 1: Token Temporal (Recomendado para Pruebas)

### Pasos:

1. **Visita la consola de Spotify:**
   - Ve a: https://developer.spotify.com/console/get-search-item/

2. **Obtén el token:**
   - Haz clic en el botón verde "GET TOKEN" (en la parte superior derecha)
   - Se abrirá una ventana emergente
   - Acepta los permisos solicitados
   - Se generará un token automáticamente

3. **Copia el token:**
   - Copia el token que aparece en el campo "OAuth Token"

4. **Configura la aplicación:**
   - Abre el archivo `src/app/services/spotify.service.ts`
   - Busca la línea: `private readonly accessToken = 'TU_TOKEN_DE_SPOTIFY_AQUI';`
   - Reemplaza `'TU_TOKEN_DE_SPOTIFY_AQUI'` con tu token
   - Ejemplo: `private readonly accessToken = 'BQC4Z...';`

5. **Guarda y ejecuta:**
   - Guarda el archivo
   - Si la aplicación ya está corriendo, se recargará automáticamente

⚠️ **IMPORTANTE:** Este token expira después de **1 hora**. Deberás repetir el proceso cuando expire.

---

## Método 2: Crear una App en Spotify (Para Desarrollo)

Si quieres un token más permanente o planeas desarrollar más:

### Pasos:

1. **Crea una cuenta de desarrollador:**
   - Ve a: https://developer.spotify.com/dashboard
   - Inicia sesión con tu cuenta de Spotify
   - Si es tu primera vez, acepta los términos de servicio

2. **Crea una aplicación:**
   - Haz clic en "Create app"
   - Rellena los campos:
     - **App name:** "Reproductor Angular Test"
     - **App description:** "Aplicación de prueba para buscar música"
     - **Redirect URI:** `http://localhost:4200`
     - Marca la casilla de los términos
   - Haz clic en "Save"

3. **Obtén las credenciales:**
   - En el dashboard de tu app, haz clic en "Settings"
   - Copia el **Client ID** y **Client Secret**

4. **Genera el token:**
   - Opción A: Usa la consola de Spotify (Método 1)
   - Opción B: Implementa OAuth 2.0 (más complejo, para producción)

---

## 🔍 Verificar que funciona

Una vez configurado el token:

1. Ejecuta la aplicación: `npm start`
2. Abre el navegador en `http://localhost:4200`
3. Escribe "Imagine Dragons" en la barra de búsqueda
4. Presiona Enter
5. Deberías ver una lista de canciones en el panel izquierdo

Si ves un error en rojo en la esquina inferior derecha, es probable que:
- El token no esté configurado correctamente
- El token haya expirado
- Haya un error de conexión

---

## 🚨 Solución de Problemas

### Error: "Error al conectar con Spotify"
- ✅ Verifica que el token esté correctamente pegado (sin espacios)
- ✅ Verifica que el token no haya expirado (genera uno nuevo)
- ✅ Asegúrate de tener conexión a internet

### Error: "No se muestran resultados"
- ✅ Verifica que la búsqueda tenga al menos 2 caracteres
- ✅ Intenta con términos de búsqueda en inglés
- ✅ Revisa la consola del navegador (F12) para ver errores

---

## 📚 Recursos Adicionales

- [Documentación de Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Consola de pruebas de Spotify](https://developer.spotify.com/console)
- [Guía de autenticación OAuth 2.0](https://developer.spotify.com/documentation/web-api/tutorials/getting-started)

---

## ⏰ Recordatorio

Los tokens temporales de la consola de Spotify **expiran cada hora**. Si vas a trabajar por más tiempo, considera implementar un flujo OAuth 2.0 completo o simplemente genera un nuevo token cuando sea necesario.
