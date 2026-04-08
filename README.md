# 📰 News Synth | Sintetizador de Noticias IA Local

**News Synth** es una aplicación web progresiva (PWA) de alto rendimiento diseñada para sintetizar noticias al máximo, respetando al 100% tu privacidad y sin costes de servidor. Utiliza IA de última generación que se ejecuta íntegramente en tu navegador.

![Icono representativo](https://cdn-icons-png.flaticon.com/512/21/21601.png)

## ✨ Características Principales

- **🧠 IA local y privada**: Todo el procesamiento (resúmenes y OCR) se realiza en tu dispositivo usando `Transformers.js`. Tus datos nunca abandonan tu navegador.
- **📸 OCR de Capturas**: Pega una captura de pantalla de una noticia y la app extraerá el texto automáticamente.
- **🔗 Web Share Target**: Comparte una URL directamente desde tu navegador móvil hacia News Synth para procesarla al instante.
- **⚡ Síntesis Extrema**: Obtén la esencia de la noticia en segundos.
- **🎭 Detección de Tono**: Identifica rápidamente si la noticia es positiva, neutral o crítica/negativa.
- **🕵️‍♂️ Respuesta a Clickbait**: Si el titular es una pregunta, la IA intenta encontrar la respuesta real en el contenido.
- **📱 Mobile First & Instalable**: Diseño premium con glassmorphism, optimizado para ser instalado como una app nativa.

## 🚀 Cómo empezar

### Para Usuarios (Uso Directo)
Si la app ya está desplegada en GitHub Pages:
1. Abre la URL en tu móvil.
2. Añade la app a tu pantalla de inicio (Instalar PWA).
3. ¡Ya puedes compartir noticias desde Chrome/Safari directamente a la app!

### Para Desarrolladores (Local)
1. Clona este repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Para generar la versión de producción (carpeta `docs/` para GitHub Pages):
   ```bash
   npm run build
   ```

## 🛠️ Tecnologías utilizadas

- **Vite**: Entorno de desarrollo ultrarrápido.
- **@xenova/transformers**: Ejecución de modelos de Hugging Face (distilbart-cnn) en el navegador.
- **Tesseract.js**: Motor de OCR para lectura de imágenes.
- **Lucide Icons**: Iconografía moderna y limpia.
- **Vanilla CSS**: Sistema de diseño personalizado con efectos de cristal oscuro.

## 📦 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse fácilmente desde la carpeta `/docs` en la rama `main`. Ideal para usar con **GitHub Desktop**.

1. Sube el repositorio a GitHub.
2. Ve a **Settings > Pages**.
3. Selecciona la rama `main` y la carpeta `/docs`.
4. ¡Listo!

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Eres libre de usarlo, modificarlo y distribuirlo.

---
*Desarrollado con ❤️ para un internet más rápido y privado.*
