const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { 
    origin: process.env.FRONTEND_URL || '*', 
    methods: ['GET', 'POST'] 
  }
});

app.use(cors());
app.use(express.json());

// Almacenamiento de salas y jugadores
const rooms = {};
const players = {};

// Rutas básicas
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/rooms', (req, res) => {
  res.json(Object.values(rooms));
});

// Eventos de Socket.io
io.on('connection', (socket) => {
  console.log('✅ Jugador conectado:', socket.id);
  players[socket.id] = { id: socket.id, connected: true };

  // Eventos de sala
  socket.on('join-room', (roomId, playerName) => {
    socket.join(roomId);
    console.log(`📍 ${playerName} se une a sala ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        id: roomId,
        players: [],
        gameState: null,
        gameStarted: false,
        createdAt: new Date()
      };
    }

    rooms[roomId].players.push({
      socketId: socket.id,
      name: playerName,
      color: undefined
    });

    // Notificar a todos en la sala
    io.to(roomId).emit('player-joined', {
      players: rooms[roomId].players,
      message: `${playerName} se unió al juego`
    });
  });

  // Lanzamiento de dados
  socket.on('roll-dice', (roomId, diceValues) => {
    console.log(`🎲 Dados en ${roomId}:`, diceValues);
    io.to(roomId).emit('dice-rolled', {
      playerId: socket.id,
      values: diceValues,
      timestamp: new Date()
    });
  });

  // Sincronización de estado del juego
  socket.on('game-action', (roomId, action) => {
    console.log(`🎮 Acción en ${roomId}:`, action);
    socket.broadcast.to(roomId).emit('game-update', action);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('❌ Jugador desconectado:', socket.id);
    delete players[socket.id];

    // Limpiar jugador de todas las salas
    for (const roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(
        p => p.socketId !== socket.id
      );
      
      // Notificar a otros jugadores
      io.to(roomId).emit('player-left', {
        playerId: socket.id,
        remainingPlayers: rooms[roomId].players
      });

      // Eliminar sala si está vacía
      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`🌐 WebSocket escuchando conexiones...`);
});
