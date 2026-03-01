# 🌐 Plan de Migración a Multiplayer Online

Guía detallada para convertir RAULOPOLY en un juego multiplayer en red.

## Fase 1: Arquitectura General

```
┌─────────────────┐                          ┌──────────────────┐
│   Frontend      │  ◄──── WebSocket ────►  │   Backend        │
│   (Vite+React)  │                          │   (Node.js)      │
│  En Vercel      │                          │  En Railway      │
└─────────────────┘                          └──────────────────┘
       ▲                                              ▲
       │                                              │
       └──────────► Base de Datos (MongoDB) ◄────────┘
                  En MongoDB Atlas (gratis)
```

## Fase 2: Stack Propuesto (MÁS FÁCIL) ✅ RECOMENDADO

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **WebSockets**: Socket.io
- **Base de Datos**: MongoDB (Atlas - gratis)
- **Hosting**: Railway.app o Render.com (ambos gratuitos)

### Frontend
- **Mantener**: React + Vite (actual)
- **WebSocket Cliente**: socket.io-client
- **Hosting**: Vercel (gratis con GitHub)

### Por qué esta stack:
- Very easy to set up
- Real-time communication with Socket.io
- Free hosting options
- Great documentation

## Fase 3: Pasos de Implementación

### 1. CREAR SERVIDOR BACKEND

#### A. Crear proyecto Node.js

```bash
mkdir raulopoly-backend
cd raulopoly-backend
npm init -y
npm install express socket.io cors mongoose dotenv
```

#### B. Estructura básica (server.js)

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());

const rooms = {}; // Store game rooms
const players = {}; // Store active players

// When player connects
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  // Player joins room
  socket.on('join-room', (roomId, playerName) => {
    socket.join(roomId);
    
    if (!rooms[roomId]) {
      rooms[roomId] = {
        id: roomId,
        players: [],
        gameState: null,
        gameStarted: false
      };
    }
    
    rooms[roomId].players.push({
      id: socket.id,
      name: playerName,
      color: undefined // Assign color
    });
    
    // Notify all players in room
    io.to(roomId).emit('player-joined', {
      players: rooms[roomId].players,
      message: `${playerName} se unió al juego`
    });
  });
  
  // Game state sync
  socket.on('game-action', (roomId, action) => {
    io.to(roomId).emit('game-update', action);
  });
  
  // Dice roll - broadcast to all
  socket.on('roll-dice', (roomId, diceValues) => {
    io.to(roomId).emit('dice-rolled', {
      playerId: socket.id,
      values: diceValues
    });
  });
  
  // Player disconnects
  socket.on('disconnect', () => {
    // Clean up and notify others
    console.log('Player disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('🚀 Servidor en puerto 3001');
});
```

### 2. MODIFICAR FRONTEND (React)

#### A. Instalar Socket.io client

```bash
cd raulopoly-game
npm install socket.io-client
```

#### B. Crear hook para sincronización

```javascript
// src/hooks/useGameSocket.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useGameSocket = (roomId, playerName) => {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('join-room', roomId, playerName);
    });

    newSocket.on('player-joined', (data) => {
      setPlayers(data.players);
    });

    newSocket.on('game-update', (action) => {
      // Update game state
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [roomId, playerName]);

  return { socket, players, connected };
};
```

#### C. Modificar Raulopoly.jsx

```javascript
import { useGameSocket } from '../hooks/useGameSocket';

export default function Raulopoly() {
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomId, setRoomId] = useState('');
  const { socket, players: networkPlayers, connected } = useGameSocket(roomId, playerNames[0]);

  // Si es multijugador, sincronizar dados/acciones
  function doRoll() {
    // ... lógica existente ...
    
    if (isMultiplayer && socket) {
      socket.emit('roll-dice', roomId, [d1, d2]);
    }
  }

  // Screen for choosing multiplayer or local
  if (screen === 'menu') {
    return (
      <div>
        <button onClick={() => { setIsMultiplayer(false); setScreen('setup'); }}>
          🎮 Jugar Local
        </button>
        <button onClick={() => { setIsMultiplayer(true); setScreen('room'); }}>
          🌐 Jugar Online
        </button>
      </div>
    );
  }
}
```

### 3. CONFIGURAR BASE DE DATOS (OPCIONAL)

#### A. Crear cuenta en MongoDB Atlas
1. Ir a https://www.mongodb.com/cloud/atlas
2. Crear cuenta gratuita
3. Crear cluster (gratis)
4. Obtener connection string

#### B. Guardar partidas (mongoose)

```javascript
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  roomId: String,
  players: Array,
  moves: Array,
  createdAt: { type: Date, default: Date.now },
  winner: String,
  duration: Number
});

const Game = mongoose.model('Game', gameSchema);

// Guardar cuando termina
socket.on('game-ended', async (roomId, winner) => {
  const game = new Game({
    roomId,
    winner,
    players: rooms[roomId].players,
    moves: rooms[roomId].moves
  });
  await game.save();
});
```

## Fase 4: Hosting Recomendado

### Frontend (Vercel) - GRATUITO
```bash
# En raulopoly-game/
npm install -g vercel
vercel
# Sigue las instrucciones
```

### Backend (Railway.app) - GRATUITO
1. Sube el código a GitHub
2. Ve a https://railway.app
3. Conecta tu repo
4. Deploy automático
5. Constructor configurará variables ENV

### Base de Datos (MongoDB Atlas) - GRATUITO
- 512MB de almacenamiento
- 500 conexiones simultáneas
- Suficiente para 100+ partidas

## Fase 5: Características a Implementar

### Nivel 1 (Básico)
- [x] Crear salas/lobbies
- [x] Sincronizar lanzamientos de dados
- [x] Sincronizar posiciones
- [ ] Chat en tiempo real

### Nivel 2 (Intermedio)
- [ ] Ranking/Leaderboard
- [ ] Historial de partidas
- [ ] Espectadores
- [ ] Sistema de amigos

### Nivel 3 (Avanzado)
- [ ] Sistema de apuestas
- [ ] Torneos
- [ ] Cosmetics/Skins
- [ ] Sistema de logros

## Fase 6: Variables de Entorno

### .env (Backend)
```
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/raulopoly
JWT_SECRET=your_secret_key
NODE_ENV=production
FRONTEND_URL=https://tu-vercel-app.vercel.app
```

## Testing

### Prueba Local Multiplayer

```bash
# Terminal 1: Backend
cd raulopoly-backend
npm start

# Terminal 2: Frontend
cd raulopoly-game
npm run dev

# Terminal 3: Otra instancia (simular segundo jugador)
cd raulopoly-game
npm run dev -- --port 5174
```

## Instalador Alternativo: Cloudflare Workers

Si prefieres sin servidor:

```javascript
// workers/index.js
export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      const data = await request.json();
      // Procesar acción del juego
      return new Response(JSON.stringify({ success: true }));
    }
  }
};
```

## Checklist de Migración

- [ ] Crear repositorio GitHub
- [ ] Configurar backend en Railway
- [ ] Configurar MongoDB Atlas
- [ ] Deploy frontend en Vercel
- [ ] Pruebas de conexión
- [ ] Sincronización de dados
- [ ] Sincronización de dinero/propiedades
- [ ] Sistema de chat
- [ ] Leaderboard

## Costos Estimados

| Servicio | Costo | Notas |
|----------|-------|-------|
| Vercel | $0 | Plan gratuito |
| Railway | $5-10/mes | Plan pagado mínimo |
| MongoDB Atlas | $0 | Tier gratuito suficiente |
| **Total** | **$5-10/mes** | Muy económico |

## Documentación Útil

- Socket.io: https://socket.io/docs/
- Express: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- Vercel: https://vercel.com/docs
- Railway: https://railway.app/docs

---

**¡Próximo paso: Publicar RAULOPOLY al mundo! 🚀**
