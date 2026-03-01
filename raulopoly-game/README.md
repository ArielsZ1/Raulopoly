# 🚀 RAULOPOLY - El Monopoly del Caos Galáctico

Bienvenido a **RAULOPOLY**, un juego de Monopoly completamente personalizado con un toque futurista y caótico. ¡Prepárate para una experiencia galáctica única!

## 🎮 ¿Qué es RAULOPOLY?

Es una versión extremadamente modificada del Monopoly clásico con:

- **🎲 Dado del Caos**: 30% de probabilidad de efectos salvajes en cada turno
- **👻 Modo Fantasma**: Los jugadores arruinados se convierten en espectros vengadores
- **🎰 Jackpot Galáctico**: El parking libre acumula dinero real
- **☄️ Meteoritos**: Las casas pueden ser destruidas aleatoriamente
- **🔀 Teletransportadores**: Puedes ser enviado a casillas inesperadas
- **🦹 Robo Cuántico**: Roba dinero y propiedades de otros jugadores
- **🌪️ Tormentas Galáctica**: Efectos caóticos que afectan a todos

## 📋 Características del Juego

### Propiedades
- 8 grupos de colores (marrón, azul claro, rosa, naranja, rojo, amarillo, verde, azul oscuro)
- Estaciones de transporte (4)
- Servicios (2)
- Casas y Hoteles (hasta Fortalezas)

### Cartas Especiales
- **Cartas de Poder** (Chance): 10 efectos diferentes
- **Cartas de Caos** (Caja del Caos): 17 efectos caóticos salvajes

### Dinero y Economía
- Cada jugador comienza con $1,500
- Impuestos galácticos a pagar
- Alquileres que pueden duplicarse
- Jackpot que se acumula

## 🚀 Cómo Empezar

### 1. **Requisitos Previos**
- Node.js 16+ instalado en tu PC
- npm (viene con Node.js)

### 2. **Instalación**

```bash
# El proyecto ya está creado en: C:\Users\Usuario\raulopoly-game
cd C:\Users\Usuario\raulopoly-game

# Instalar dependencias (si no lo hiciste ya)
npm install
```

### 3. **Ejecutar el Juego**

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173/`

Se abrirá automáticamente en tu navegador. Si no lo hace:
1. Abre tu navegador (Chrome, Firefox, Edge, Safari)
2. Ve a `http://localhost:5173/`
3. ¡Disfruta el caos galáctico!

## 🎮 Cómo Jugar

### Inicio
1. Haz clic en **"🚀 JUGAR"** en el menú principal
2. Selecciona el número de jugadores (2, 3 o 4)
3. Personaliza los nombres de cada jugador
4. ¡Haz clic en "🚀 ¡EMPEZAR CAOS!"**

### Durante el Juego
- **Lanzar Dados**: Haz clic en "🎲 ¡LANZAR DADOS!" para tu turno
- **Comprar Propiedades**: Decide si compras cuando caes en una propiedad libre
- **Construir**: Después de tu movimiento, puedes construir casas si tienes monopolio
- **Pagar Alquileres**: Cuando caes en propiedades de otros
- **Cartas**: Ejecuta efectos cuando caes en casillas especiales

### Sistema de Dados
- **Dados Normales**: 1-6 cada uno
- **Dado del Caos** (30% de probabilidad): Efecto especial:
  - 1️⃣ Pierde $150 extra
  - 2️⃣ Gana $100
  - 3️⃣ Intercambia posición con siguiente jugador
  - 4️⃣ Avanza 6 casillas extra
  - 5️⃣ Inmune al próximo alquiler
  - 6️⃣ ¡Tormenta! Todos pierden $100

## 💾 Estructura del Proyecto

```
raulopoly-game/
├── src/
│   ├── components/
│   │   └── Raulopoly.jsx       # Componente principal del juego
│   ├── App.jsx                 # Componente raíz
│   └── main.jsx                # Punto de entrada
├── index.html                  # HTML principal
├── vite.config.js              # Configuración de Vite
├── package.json                # Dependencias del proyecto
└── README.md                   # Este archivo
```

## 🛠️ Desarrollo

### Comandos Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm build

# Previsualizar compilación
npm preview
```

### Tecnologías Usadas
- **React 18**: Framework UI
- **Vite**: Build tool rápido
- **JavaScript (ES6+)**: Lógica del juego
- **CSS-in-JS**: Estilos en línea

## 🌐 Próximas Características: Multiplayer en Red

El plan futuro incluye:

### Backend
- **WebSockets con Socket.io** + **Node.js** para comunicación en tiempo real
- O **Cloudflare Workers** para una solución sin servidor

### Frontend
- Sincronización del estado del juego entre jugadores
- Chat en tiempo real
- Sistema de salas/lobbies

### Hosting
- **Vercel** o **Netlify** para el frontend (gratis)
- **Railway**, **Render** o **Heroku** para el backend

## 🎯 Planes de Mejora

- [ ] Multiplayer online
- [ ] Persistencia de datos
- [ ] Sistema de puntuaciones globales
- [ ] Más cartas y efectos
- [ ] Sonidos y animaciones mejoradas
- [ ] Modo oscuro/claro (actualmente es oscuro)
- [ ] Móvil responsivo

## 🐛 Solución de Problemas

### El juego no carga
1. Verifica que `npm run dev` está ejecutándose
2. Abre http://localhost:5173/ en tu navegador
3. Abre la consola (F12) y busca errores

### El puerto 5173 está en uso
```bash
# Cambiar el puerto en vite.config.js
# O usar el flag --port
npm run dev -- --port 3000
```

### Node.js no instalado
1. Descarga desde https://nodejs.org/
2. Instala la versión LTS recomendada
3. Reinicia tu terminal
4. Verifica: `node --version`

## 📧 Contacto y Feedback

¿Errores? ¿Sugerencias? Tu feedback es bienvenido para mejorar RAULOPOLY.

## 📜 Licencia

Proyecto personal de juego - ¡Disfruta y que gane el caos!

---

**¡Bienvenido al caos galáctico! 🌀🚀**
