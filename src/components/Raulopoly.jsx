import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "../i18n/I18nProvider";
import { clearSavedGame, getSavedGame, getTutorialSeen, setSavedGame, setTutorialSeen } from "../services/storageService";
import { useTurnTimer } from "../hooks/useTurnTimer";
import Board from "./game/Board";
import CenterPanel from "./game/CenterPanel";
import PropertySidebar from "./game/PropertySidebar";

// ========================= GAME DATA =========================

const SQUARE_DATA = [
  { id: 0,  name: 'SALIDA',              type: 'go',        group: null,       icon: '🚀', price: 0 },
  { id: 1,  name: 'C. Peligrosa',        type: 'property',  group: 'brown',    price: 60,  rent: [2,10,30,90,160,250],     houseCost: 50 },
  { id: 2,  name: 'Caja del Caos',       type: 'chest',     group: null,       icon: '📦', price: 0 },
  { id: 3,  name: 'Av. Maldita',         type: 'property',  group: 'brown',    price: 60,  rent: [4,20,60,180,320,450],    houseCost: 50 },
  { id: 4,  name: 'Impuesto Galáctico',  type: 'tax',       group: null,       icon: '💸', price: 0, amount: 200 },
  { id: 5,  name: 'Estación Norte',      type: 'railroad',  group: null,       icon: '🛸', price: 200 },
  { id: 6,  name: 'C. Perdición',        type: 'property',  group: 'lblue',    price: 100, rent: [6,30,90,270,400,550],    houseCost: 50 },
  { id: 7,  name: 'Poder del Caos',      type: 'chance',    group: null,       icon: '⚡', price: 0 },
  { id: 8,  name: 'Blvd. Fantasmal',     type: 'property',  group: 'lblue',    price: 100, rent: [6,30,90,270,400,550],    houseCost: 50 },
  { id: 9,  name: 'Gran Av. Maldita',    type: 'property',  group: 'lblue',    price: 120, rent: [8,40,100,300,450,600],   houseCost: 50 },
  { id: 10, name: 'CÁRCEL / VISITA',     type: 'jail',      group: null,       icon: '⛓️', price: 0 },
  { id: 11, name: 'C. Magenta',          type: 'property',  group: 'pink',     price: 140, rent: [10,50,150,450,625,750],  houseCost: 100 },
  { id: 12, name: 'Cía. Eléctrica',      type: 'utility',   group: null,       icon: '⚡', price: 150 },
  { id: 13, name: 'Av. Rosada',          type: 'property',  group: 'pink',     price: 140, rent: [10,50,150,450,625,750],  houseCost: 100 },
  { id: 14, name: 'C. Desolación',       type: 'property',  group: 'pink',     price: 160, rent: [12,60,180,500,700,900],  houseCost: 100 },
  { id: 15, name: 'Estación Este',       type: 'railroad',  group: null,       icon: '🛸', price: 200 },
  { id: 16, name: 'C. Naranja',          type: 'property',  group: 'orange',   price: 180, rent: [14,70,200,550,750,950],  houseCost: 100 },
  { id: 17, name: 'Caja del Caos',       type: 'chest',     group: null,       icon: '📦', price: 0 },
  { id: 18, name: 'Av. Ardiente',        type: 'property',  group: 'orange',   price: 180, rent: [14,70,200,550,750,950],  houseCost: 100 },
  { id: 19, name: 'Gran Av. Naranja',    type: 'property',  group: 'orange',   price: 200, rent: [16,80,220,600,800,1000], houseCost: 100 },
  { id: 20, name: '¡JACKPOT!',           type: 'freeparking',group: null,      icon: '🎰', price: 0 },
  { id: 21, name: 'C. Apocalipsis',      type: 'property',  group: 'red',      price: 220, rent: [18,90,250,700,875,1050], houseCost: 150 },
  { id: 22, name: 'Poder del Caos',      type: 'chance',    group: null,       icon: '⚡', price: 0 },
  { id: 23, name: 'Av. Sangrienta',      type: 'property',  group: 'red',      price: 220, rent: [18,90,250,700,875,1050], houseCost: 150 },
  { id: 24, name: 'Gran C. Roja',        type: 'property',  group: 'red',      price: 240, rent: [20,100,300,750,925,1100],houseCost: 150 },
  { id: 25, name: 'Estación Sur',        type: 'railroad',  group: null,       icon: '🛸', price: 200 },
  { id: 26, name: 'C. Solar',            type: 'property',  group: 'yellow',   price: 260, rent: [22,110,330,800,975,1150],houseCost: 150 },
  { id: 27, name: 'Av. Radiante',        type: 'property',  group: 'yellow',   price: 260, rent: [22,110,330,800,975,1150],houseCost: 150 },
  { id: 28, name: 'Aguas Tóxicas',       type: 'utility',   group: null,       icon: '☢️', price: 150 },
  { id: 29, name: 'Gran Av. Amarilla',   type: 'property',  group: 'yellow',   price: 280, rent: [24,120,360,850,1025,1200],houseCost: 150 },
  { id: 30, name: 'TELETRANSPORTADOR',   type: 'gotojail',  group: null,       icon: '🌀', price: 0 },
  { id: 31, name: 'C. Venenosa',         type: 'property',  group: 'green',    price: 300, rent: [26,130,390,900,1100,1275],houseCost: 200 },
  { id: 32, name: 'Av. Verde',           type: 'property',  group: 'green',    price: 300, rent: [26,130,390,900,1100,1275],houseCost: 200 },
  { id: 33, name: 'Caja del Caos',       type: 'chest',     group: null,       icon: '📦', price: 0 },
  { id: 34, name: 'Gran Av. Verde',      type: 'property',  group: 'green',    price: 320, rent: [28,150,450,1000,1200,1400],houseCost: 200 },
  { id: 35, name: 'Estación Oeste',      type: 'railroad',  group: null,       icon: '🛸', price: 200 },
  { id: 36, name: 'Poder del Caos',      type: 'chance',    group: null,       icon: '⚡', price: 0 },
  { id: 37, name: 'C. Oscura',           type: 'property',  group: 'dblue',    price: 350, rent: [35,175,500,1100,1300,1500],houseCost: 200 },
  { id: 38, name: 'Impuesto Supremo',    type: 'tax',       group: null,       icon: '💀', price: 0, amount: 100 },
  { id: 39, name: 'Gran Av. Azul',       type: 'property',  group: 'dblue',    price: 400, rent: [50,200,600,1400,1700,2000],houseCost: 200 },
];

const GROUP_COLORS = {
  brown:  '#8B4513',
  lblue:  '#87CEEB',
  pink:   '#FF69B4',
  orange: '#FF8C00',
  red:    '#DC143C',
  yellow: '#FFD700',
  green:  '#22AA44',
  dblue:  '#1E3FBB',
};

const GROUP_SQUARES = {
  brown:  [1, 3],
  lblue:  [6, 8, 9],
  pink:   [11, 13, 14],
  orange: [16, 18, 19],
  red:    [21, 23, 24],
  yellow: [26, 27, 29],
  green:  [31, 32, 34],
  dblue:  [37, 39],
};

const RAILROADS = [5, 15, 25, 35];
const UTILITIES = [12, 28];

const PLAYER_CONFIGS = [
  { name: 'Jugador 1', color: '#FF4444', glow: '#FF000088', emoji: '🚀' },
  { name: 'Jugador 2', color: '#4488FF', glow: '#0044FF88', emoji: '💎' },
  { name: 'Jugador 3', color: '#44FF88', glow: '#00FF4488', emoji: '🔥' },
  { name: 'Jugador 4', color: '#FFAA00', glow: '#FF880088', emoji: '💀' },
];

const CHAOS_CARDS = [
  { id: 'allLoseHalf',     emoji: '🌪️', title: '¡TORMENTA GALÁCTICA!',     text: 'TODOS los jugadores pierden la MITAD de su dinero. Ni el banco se salva.' },
  { id: 'swapWithRichest', emoji: '🔀', title: '¡INVERSIÓN CUÁNTICA!',      text: 'Intercambias POSICIÓN EN EL TABLERO con el jugador más rico. ¡Surpresa!' },
  { id: 'destroyHouses',   emoji: '☄️', title: '¡METEORITO DESTRUCTOR!',    text: 'Un meteorito destruye TODAS las casas de un grupo de color aleatorio.' },
  { id: 'gain500',         emoji: '🤑', title: '¡LOTERÍA MUTANTE!',         text: '¡El banco te entrega $500! (Sospechosamente sin explicación.)' },
  { id: 'leftLose300',     emoji: '😈', title: '¡MALDICIÓN VIRAL!',         text: 'El jugador a tu IZQUIERDA pierde $300 por "contaminación kármica".' },
  { id: 'goMostExpensive', emoji: '🕳️', title: '¡AGUJERO NEGRO!',          text: 'Eres succionado hasta la PROPIEDAD MÁS CARA del tablero. Buena suerte.' },
  { id: 'doubleRent',      emoji: '🔥', title: '¡REVOLUCIÓN PROLETARIA!',   text: 'TODOS los alquileres se DUPLICAN durante los próximos 2 turnos.' },
  { id: 'steal200each',    emoji: '🦹', title: '¡ROBO CUÁNTICO!',           text: 'Robas $200 de CADA jugador. Solo los fanáticos del caos se alegran.' },
  { id: 'nextDiceX3',      emoji: '🎲', title: '¡MUTACIÓN GENÉTICA!',       text: 'Tu PRÓXIMO dado se multiplica por 3. Prepárate para volar.' },
  { id: 'randomTeleport',  emoji: '🌀', title: '¡TELETRANSPORTE FORZADO!',  text: 'Eres enviado a una casilla COMPLETAMENTE ALEATORIA del tablero.' },
  { id: 'collect100each',  emoji: '✨', title: '¡CARISMA GALÁCTICO!',       text: 'Cobras $100 de CADA jugador gracias a tu aura magnética.' },
  { id: 'payPerProp',      emoji: '💸', title: '¡IMPUESTO KÁRMICO!',        text: 'Pagas $50 por CADA PROPIEDAD que posees. El karma es un boomerang.' },
  { id: 'nextTurnFree',    emoji: '🛡️', title: '¡ESCUDO DIMENSIONAL!',     text: 'Tu próximo turno eres INMUNE a alquileres. Disfruta mientras dura.' },
  { id: 'bankCharge400',   emoji: '🏦', title: '¡CRISIS ECONÓMICA!',        text: 'El banco te cobra $400 en "cuotas de rescate dimensional". Lo sentimos.' },
  { id: 'backToStart',     emoji: '👻', title: '¡BUCLE TEMPORAL!',          text: 'Retrocedes hasta la SALIDA sin cobrar $200. El tiempo se ha roto.' },
  { id: 'ghostSteal',      emoji: '🫀', title: '¡POSESIÓN ESPIRITUAL!',     text: 'Robas UNA PROPIEDAD aleatoria de cualquier jugador. (Elige tú a cuál.)' },
  { id: 'jackpotBonus',    emoji: '🎰', title: '¡BONUS DEL JACKPOT!',       text: 'El Jackpot Galáctico se DUPLICA instantáneamente. El caos es generoso.' },
];

const POWER_CARDS = [
  { id: 'goToGo',       emoji: '🚀', text: 'Avanza hasta la SALIDA. Cobra $200.' },
  { id: 'goTo5',        emoji: '🛸', text: 'Avanza a la Estación Orbital Norte.' },
  { id: 'nextBackward', emoji: '🔄', text: '¡DADO MALDITO! Tu próximo movimiento es en REVERSA.' },
  { id: 'goToJail',     emoji: '⛓️', text: 'Ve directamente a la CÁRCEL. No cobres $200.' },
  { id: 'collect150',   emoji: '💰', text: 'Cobra $150 de todos los jugadores ("consultoría de emergencia").' },
  { id: 'pay200',       emoji: '💸', text: '¡TERREMOTO FISCAL! Paga $200 al banco.' },
  { id: 'outOfJail',    emoji: '🗝️', text: 'Sales gratis de la cárcel. (Guarda esta carta.)' },
  { id: 'gain100',      emoji: '🎁', text: '¡Bonus de productividad cósmica! Cobra $100.' },
  { id: 'back3',        emoji: '⏮️', text: 'Retrocede 3 casillas.' },
  { id: 'nearest',      emoji: '🧲', text: 'Avanza a la propiedad SIN DUEÑO más cercana.' },
];

// ========================= HELPERS =========================

function getGridPos(id) {
  if (id === 0)  return { r: 10, c: 10 };
  if (id === 10) return { r: 10, c: 0 };
  if (id === 20) return { r: 0,  c: 0 };
  if (id === 30) return { r: 0,  c: 10 };
  if (id > 0  && id < 10)  return { r: 10, c: 10 - id };
  if (id > 10 && id < 20)  return { r: 20 - id, c: 0 };
  if (id > 20 && id < 30)  return { r: 0, c: id - 20 };
  if (id > 30 && id < 40)  return { r: id - 30, c: 10 };
  return { r: 0, c: 0 };
}

function rollDie() { return Math.floor(Math.random() * 6) + 1; }

function getSquareRotation(id) {
  if (id === 0 || id === 10 || id === 20 || id === 30) return 0;
  if (id > 0  && id < 10)  return 0;     // bottom row - normal
  if (id > 10 && id < 20)  return 90;    // left col - rotate
  if (id > 20 && id < 30)  return 180;   // top row - upside down
  if (id > 30 && id < 40)  return -90;   // right col - rotate
  return 0;
}

function createPlayers(num) {
  return Array.from({ length: num }, (_, i) => ({
    id: i,
    name: PLAYER_CONFIGS[i].name,
    color: PLAYER_CONFIGS[i].color,
    glow: PLAYER_CONFIGS[i].glow,
    emoji: PLAYER_CONFIGS[i].emoji,
    money: 1500,
    position: 0,
    inJail: false,
    jailTurns: 0,
    isGhost: false,
    alive: true,
    freeJailCards: 0,
    nextTurnFree: false,
    nextTurnBackward: false,
    nextDiceX3: false,
  }));
}

// ========================= MAIN COMPONENT =========================

export default function Raulopoly() {
  const { language, setLanguage, t } = useTranslation();
  // pantalla actual: menu, rules, game, winner
  const [screen, setScreen]             = useState('menu');
  const [numPlayers, setNumPlayers]     = useState(2);
  const [players, setPlayers]           = useState([]);
  const [currentIdx, setCurrentIdx]     = useState(0);
  const [phase, setPhase]               = useState('roll');
  const [dice, setDice]                 = useState([1, 1]);
  const [chaosDie, setChaosDie]         = useState(null);
  const [propOwners, setPropOwners]     = useState({});
  const [propHouses, setPropHouses]     = useState({});
  const [log, setLog]                   = useState([]);
  const [jackpot, setJackpot]           = useState(500);
  const [activeCard, setActiveCard]     = useState(null);
  const [doubleRentTurns, setDoubleRentTurns] = useState(0);
  const [pendingBuy, setPendingBuy]     = useState(null);
  const [pendingRent, setPendingRent]   = useState(null);
  const [winner, setWinner]             = useState(null);
  const [animDice, setAnimDice]         = useState(false);
  const [ghostTarget, setGhostTarget]   = useState(null);
  const [pendingGhostSteal, setPendingGhostSteal] = useState(null);
  const [playerNames, setPlayerNames]   = useState(PLAYER_CONFIGS.map(p => p.name));
  const [initialMoney, setInitialMoney]      = useState(1500);
  const [rentMultiplier, setRentMultiplier]  = useState(1);
  const [chaosChance, setChaoschance]        = useState(0.30);
  const [hasSavedGame, setHasSavedGame]      = useState(!!getSavedGame());
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Función para guardar partida en localStorage
  const saveGame = useCallback(() => {
    const gameState = {
      screen, numPlayers, players, currentIdx, phase, dice, chaosDie,
      propOwners, propHouses, log, jackpot, activeCard, doubleRentTurns,
      pendingBuy, pendingRent, winner, playerNames,
      settings: { initialMoney, rentMultiplier, chaosChance }
    };
    setSavedGame(gameState);
  }, [screen, numPlayers, players, currentIdx, phase, dice, chaosDie, propOwners, propHouses, log, jackpot, activeCard, doubleRentTurns, pendingBuy, pendingRent, winner, playerNames, initialMoney, rentMultiplier, chaosChance]);

  // Función para cargar partida desde localStorage
  const loadGame = useCallback(() => {
    const gameState = getSavedGame();
    if (gameState) {
        setNumPlayers(gameState.numPlayers);
        setPlayers(gameState.players);
        setCurrentIdx(gameState.currentIdx);
        setPhase(gameState.phase);
        setDice(gameState.dice);
        setChaosDie(gameState.chaosDie);
        setPropOwners(gameState.propOwners);
        setPropHouses(gameState.propHouses);
        setLog(gameState.log);
        setJackpot(gameState.jackpot);
        setActiveCard(gameState.activeCard);
        setDoubleRentTurns(gameState.doubleRentTurns);
        setPendingBuy(gameState.pendingBuy);
        setPendingRent(gameState.pendingRent);
        setWinner(gameState.winner);
        setPlayerNames(gameState.playerNames);
        setInitialMoney(gameState.settings?.initialMoney ?? 1500);
        setRentMultiplier(gameState.settings?.rentMultiplier ?? 1);
        setChaoschance(gameState.settings?.chaosChance ?? 0.30);
        setScreen('game');
    }
  }, []);

  // Guardar partida periódicamente durante el juego
  useEffect(() => {
    if (screen === 'game') {
      saveGame();
    }
  }, [screen, players, currentIdx, phase, saveGame]);

  // Función para reproducir sonido simple
  const playSound = useCallback((type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    switch(type) {
      case 'cash':
        oscillator.frequency.value = 800;
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'chaos':
        oscillator.frequency.value = 300;
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'jail':
        for (let i = 0; i < 3; i++) {
          oscillator.frequency.setValueAtTime(600 - i*100, audioContext.currentTime + i*0.1);
        }
        gain.gain.setValueAtTime(0.25, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'success':
        oscillator.frequency.value = 1200;
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
      default: break;
    }
  }, []);

  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !getTutorialSeen());

  const { turnTimer, resetTimer } = useTurnTimer({
    screen,
    phase,
    onTimeout: () => {
      playSound('jail');
      nextTurn(players, currentIdx);
    },
  });

  const features = t('features', { returnObjects: true }) || [];
  const squareInfo = t('squareInfo', { returnObjects: true }) || {};
  const rulesText = t('rulesText', { returnObjects: true }) || [];

  useEffect(() => {
    resetTimer();
  }, [currentIdx, resetTimer]);

  const addLog = useCallback((msg, type = 'normal') => {
    setLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev].slice(0, 30));
  }, []);

  function startGame() {
    const ps = createPlayers(numPlayers);
    ps.forEach((p, i) => { 
      p.name = playerNames[i] || PLAYER_CONFIGS[i].name;
      p.money = initialMoney;  // Usar dinero inicial personalizado
    });
    setPlayers(ps);
    setPropOwners({});
    setPropHouses({});
    setLog([]);
    setJackpot(500);
    setCurrentIdx(0);
    setPhase('roll');
    setActiveCard(null);
    setPendingBuy(null);
    setPendingRent(null);
    setWinner(null);
    setDoubleRentTurns(0);
    setScreen('game');
    playSound('success');
    addLog('¡RAULOPOLY HA COMENZADO! 🚀 ¡Que el caos os acompañe!', 'event');
  }

  function hasMonopoly(playerIdx, group) {
    const squares = GROUP_SQUARES[group] || [];
    return squares.every(id => propOwners[id] === playerIdx);
  }

  function calcRent(squareId, diceTotal, playerIdx) {
    const sq = SQUARE_DATA[squareId];
    if (!sq) return 0;
    const owner = propOwners[squareId];
    if (owner === undefined || owner === playerIdx) return 0;

    let rent = 0;
    if (sq.type === 'property') {
      const houses = propHouses[squareId] || 0;
      rent = sq.rent[houses];
      if (houses === 0 && hasMonopoly(owner, sq.group)) rent *= 2;
    } else if (sq.type === 'railroad') {
      const owned = RAILROADS.filter(r => propOwners[r] === owner).length;
      rent = 25 * Math.pow(2, owned - 1);
    } else if (sq.type === 'utility') {
      const owned = UTILITIES.filter(u => propOwners[u] === owner).length;
      rent = owned === 2 ? diceTotal * 10 : diceTotal * 4;
    }
    if (doubleRentTurns > 0) rent *= 2;
    return rent;
  }

  function doTransfer(fromIdx, toIdx, amount, reason) {
    playSound('cash');
    setPlayers(prev => {
      const next = prev.map(p => ({ ...p }));
      const actual = Math.min(amount, Math.max(0, next[fromIdx].money));
      next[fromIdx].money -= actual;
      if (toIdx === -1) { // to bank/jackpot
        setJackpot(jp => jp + actual);
      } else if (toIdx >= 0) {
        next[toIdx].money += actual;
      }
      addLog(reason || `${next[fromIdx].name} paga $${actual}`, 'money');
      // check bankruptcy
      if (next[fromIdx].money <= 0 && !next[fromIdx].isGhost) {
        next[fromIdx].money = 0;
        next[fromIdx].alive = false;
        next[fromIdx].isGhost = true;
        addLog(`💀 ${next[fromIdx].name} está en BANCARROTA y se convierte en ¡FANTASMA VENGADOR! 👻`, 'event');
        // ghost can still haunt players
      }
      return next;
    });
  }

  function nextTurn(ps, idx) {
    const alive = ps.filter(p => p.alive || p.isGhost);
    const reallyAlive = ps.filter(p => p.alive && !p.isGhost);
    if (reallyAlive.length === 1) {
      setWinner(reallyAlive[0]);
      setScreen('winner');
      return;
    }
    // advance to next alive player
    let next = (idx + 1) % ps.length;
    while (!ps[next].alive && !ps[next].isGhost) {
      next = (next + 1) % ps.length;
      if (next === idx) break;
    }
    setCurrentIdx(next);
    setPhase('roll');
    setActiveCard(null);
    setPendingBuy(null);
    setPendingRent(null);
    setChaosDie(null);
    if (doubleRentTurns > 0) setDoubleRentTurns(d => d - 1);
  }

  function landOnSquare(playerIdx, squareId, diceTotal, newPlayers) {
    const sq = SQUARE_DATA[squareId];
    const player = newPlayers[playerIdx];
    addLog(`${player.emoji} ${player.name} cae en: ${sq.name}`, 'move');

    if (sq.type === 'go') {
      addLog(`🚀 ¡${player.name} pasa por la SALIDA! Cobra $200`, 'money');
      setPlayers(prev => prev.map((p, i) => i === playerIdx ? { ...p, money: p.money + 200 } : p));
      setPhase('endturn');
      return;
    }

    if (sq.type === 'gotojail') {
      addLog(`🌀 ¡TELETRANSPORTE a la CÁRCEL! ${player.name} desaparece de la existencia momentáneamente...`, 'event');
      playSound('jail');
      setPlayers(prev => prev.map((p, i) => i === playerIdx ? { ...p, position: 10, inJail: true, jailTurns: 0 } : p));
      setPhase('endturn');
      return;
    }

    if (sq.type === 'jail' || sq.type === 'freeparking') {
      if (sq.type === 'freeparking') {
        addLog(`🎰 ¡${player.name} cae en el JACKPOT GALÁCTICO! Cobra $${jackpot}!`, 'event');
        setPlayers(prev => prev.map((p, i) => i === playerIdx ? { ...p, money: p.money + jackpot } : p));
        setJackpot(500); // reset
      }
      setPhase('endturn');
      return;
    }

    if (sq.type === 'tax') {
      const amount = sq.amount;
      addLog(`💸 ${player.name} paga $${amount} de impuestos al Jackpot Galáctico.`, 'money');
      setPlayers(prev => prev.map((p, i) => i === playerIdx ? { ...p, money: Math.max(0, p.money - amount) } : p));
      setJackpot(jp => jp + amount);
      setPhase('endturn');
      return;
    }

    if (sq.type === 'chance') {
      const card = POWER_CARDS[Math.floor(Math.random() * POWER_CARDS.length)];
      playSound('success');
      setActiveCard({ ...card, source: 'chance' });
      setPhase('card');
      return;
    }

    if (sq.type === 'chest') {
      const card = CHAOS_CARDS[Math.floor(Math.random() * CHAOS_CARDS.length)];
      playSound('chaos');
      setActiveCard({ ...card, source: 'chest' });
      setPhase('card');
      return;
    }

    if (sq.type === 'property' || sq.type === 'railroad' || sq.type === 'utility') {
      const owner = propOwners[squareId];
      if (owner === undefined) {
        // Can buy
        if (player.money >= sq.price) {
          setPendingBuy({ squareId, price: sq.price });
          setPhase('buydecision');
        } else {
          addLog(`😢 ${player.name} no puede comprar ${sq.name} (le faltan fondos galácticos).`, 'normal');
          setPhase('endturn');
        }
      } else if (owner === playerIdx) {
        addLog(`🏠 ${player.name} está en su propia propiedad. ¡Al menos alguien lo visita!`, 'normal');
        setPhase('endturn');
      } else {
        const rent = calcRent(squareId, diceTotal, playerIdx);
        if (rent > 0 && !player.nextTurnFree) {
          setPendingRent({ squareId, rent, ownerIdx: owner });
          setPhase('payrent');
        } else {
          if (player.nextTurnFree) {
            addLog(`🛡️ ¡${player.name} usa su ESCUDO DIMENSIONAL! Alquiler evitado.`, 'event');
            setPlayers(prev => prev.map((p, i) => i === playerIdx ? { ...p, nextTurnFree: false } : p));
          }
          setPhase('endturn');
        }
      }
      return;
    }

    setPhase('endturn');
  }

  function doRoll() {
    const player = players[currentIdx];
    if (!player.alive) { setPhase('endturn'); return; }

    setAnimDice(true);
    setTimeout(() => setAnimDice(false), 600);

    // Check chaos die (30% chance)
    let d1 = rollDie();
    let d2 = rollDie();
    const isChaosRoll = Math.random() < 0.30;
    const chaosVal = isChaosRoll ? rollDie() : null;
    setChaosDie(chaosVal);

    if (player.nextDiceX3) {
      d1 = Math.min(d1 * 3, 18);
      d2 = Math.min(d2 * 3, 18);
      addLog(`🧬 ¡MUTACIÓN ACTIVA! Dados multiplicados x3!`, 'event');
    }

    setDice([d1, d2]);

    let total = d1 + d2;
    const backward = player.nextTurnBackward;

    setPlayers(prev => prev.map((p, i) => i === currentIdx
      ? { ...p, nextDiceX3: false, nextTurnBackward: false } : p
    ));

    if (player.inJail) {
      if (d1 === d2) {
        addLog(`🎲 ¡DOBLES! ${player.name} escapa de la cárcel.`, 'event');
        setPlayers(prev => prev.map((p, i) => i === currentIdx ? { ...p, inJail: false, jailTurns: 0 } : p));
      } else if (player.jailTurns >= 2) {
        addLog(`⛓️ ${player.name} paga $50 para salir de la cárcel.`, 'money');
        setPlayers(prev => prev.map((p, i) =>
          i === currentIdx ? { ...p, money: Math.max(0, p.money - 50), inJail: false, jailTurns: 0 } : p
        ));
      } else {
        addLog(`⛓️ ${player.name} sigue en la cárcel. (Turno ${player.jailTurns + 1}/3)`, 'normal');
        setPlayers(prev => prev.map((p, i) =>
          i === currentIdx ? { ...p, jailTurns: p.jailTurns + 1 } : p
        ));
        setPhase('endturn');
        return;
      }
    }

    let newPos;
    if (backward) {
      newPos = ((player.position - total) + 40) % 40;
      addLog(`⏮️ ¡DADO MALDITO! ${player.name} retrocede ${total} casillas.`, 'event');
    } else {
      newPos = (player.position + total) % 40;
      if (newPos < player.position && !backward) {
        addLog(`🚀 ${player.name} pasa por la SALIDA. ¡Cobra $200!`, 'money');
        setPlayers(prev => prev.map((p, i) => i === currentIdx ? { ...p, money: p.money + 200 } : p));
      }
    }

    setPlayers(prev => {
      const next = prev.map((p, i) => i === currentIdx ? { ...p, position: newPos } : p);
      addLog(`🎲 ${player.name} saca ${d1}+${d2}=${total}${backward ? ' (¡REVERSA!)' : ''}${chaosVal ? ` + Dado del Caos: ${chaosVal} 😱` : ''}`, 'dice');

      if (chaosVal) {
        // Chaos die effect based on value
        setTimeout(() => applyChaosRoll(chaosVal, currentIdx, next), 800);
      } else {
        setTimeout(() => landOnSquare(currentIdx, newPos, total, next), 300);
      }
      return next;
    });
  }

  function applyChaosRoll(val, pidx, currentPlayers) {
    const p = currentPlayers[pidx];
    switch (val) {
      case 1:
        addLog(`💣 ¡Dado del Caos [1]! ${p.name} pierde $150 adicionales.`, 'chaos');
        setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, money: Math.max(0, pl.money - 150) } : pl));
        break;
      case 2:
        addLog(`🎁 ¡Dado del Caos [2]! ${p.name} recibe $100 del banco galáctico.`, 'chaos');
        setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, money: pl.money + 100 } : pl));
        break;
      case 3:
        const rp = (pidx + 1) % currentPlayers.length;
        addLog(`🔀 ¡Dado del Caos [3]! ${p.name} INTERCAMBIA POSICIÓN con ${currentPlayers[rp].name}!`, 'chaos');
        setPlayers(prev => {
          const next = prev.map(pl => ({ ...pl }));
          const posA = next[pidx].position;
          next[pidx].position = next[rp].position;
          next[rp].position = posA;
          return next;
        });
        break;
      case 4:
        addLog(`⏩ ¡Dado del Caos [4]! ${p.name} avanza 6 casillas extra.`, 'chaos');
        setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, position: (pl.position + 6) % 40 } : pl));
        break;
      case 5:
        addLog(`😇 ¡Dado del Caos [5]! ${p.name} es INMUNE al próximo alquiler.`, 'chaos');
        setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, nextTurnFree: true } : pl));
        break;
      case 6:
        addLog(`🌪️ ¡Dado del Caos [6]! ¡TORMENTA TOTAL! Todos pierden $100.`, 'chaos');
        setPlayers(prev => prev.map(pl => ({ ...pl, money: Math.max(0, pl.money - 100) })));
        setJackpot(jp => jp + 100 * currentPlayers.length);
        break;
    }
    const sq = currentPlayers[pidx];
    setTimeout(() => landOnSquare(pidx, currentPlayers[pidx].position, dice[0] + dice[1], currentPlayers), 500);
  }

  function applyCardEffect(card, pidx) {
    const ps = players;
    const p = ps[pidx];

    if (card.source === 'chance') {
      switch (card.id) {
        case 'goToGo':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, position: 0, money: pl.money + 200 } : pl));
          addLog(`🚀 ${p.name} avanza a la SALIDA y cobra $200.`, 'move');
          break;
        case 'goTo5':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, position: 5 } : pl));
          addLog(`🛸 ${p.name} vuela a la Estación Norte.`, 'move');
          break;
        case 'nextBackward':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, nextTurnBackward: true } : pl));
          addLog(`🔄 ${p.name} recibirá el DADO MALDITO en su próximo turno.`, 'event');
          break;
        case 'goToJail':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, position: 10, inJail: true, jailTurns: 0 } : pl));
          addLog(`⛓️ ${p.name} va directamente a la CÁRCEL.`, 'event');
          break;
        case 'collect150':
          let total150 = 0;
          setPlayers(prev => {
            const next = prev.map((pl, i) => {
              if (i !== pidx) {
                const pay = Math.min(150, pl.money);
                total150 += pay;
                return { ...pl, money: pl.money - pay };
              }
              return pl;
            });
            next[pidx] = { ...next[pidx], money: next[pidx].money + total150 };
            addLog(`💰 ${p.name} cobra $150 de cada jugador. Total: $${total150}`, 'money');
            return next;
          });
          break;
        case 'pay200':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, money: Math.max(0, pl.money - 200) } : pl));
          setJackpot(jp => jp + 200);
          addLog(`💸 ${p.name} paga $200 al banco por "terremoto fiscal".`, 'money');
          break;
        case 'outOfJail':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, freeJailCards: pl.freeJailCards + 1 } : pl));
          addLog(`🗝️ ${p.name} obtiene una carta "Salida Libre de la Cárcel".`, 'event');
          break;
        case 'gain100':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, money: pl.money + 100 } : pl));
          addLog(`🎁 ${p.name} cobra $100 de bonus.`, 'money');
          break;
        case 'back3':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, position: ((pl.position - 3) + 40) % 40 } : pl));
          addLog(`⏮️ ${p.name} retrocede 3 casillas.`, 'move');
          break;
        case 'nearest': {
          let pos = p.position;
          for (let s = 1; s <= 40; s++) {
            const check = (pos + s) % 40;
            const sq = SQUARE_DATA[check];
            if ((sq.type === 'property' || sq.type === 'railroad' || sq.type === 'utility') && propOwners[check] === undefined) {
              setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, position: check } : pl));
              addLog(`🧲 ${p.name} avanza a ${sq.name} (primera propiedad libre).`, 'move');
              break;
            }
          }
          break;
        }
      }
    } else {
      // CHAOS card
      switch (card.id) {
        case 'allLoseHalf':
          setPlayers(prev => prev.map(pl => ({ ...pl, money: Math.floor(pl.money / 2) })));
          addLog(`🌪️ ¡TORMENTA GALÁCTICA! Todos pierden la mitad de su dinero.`, 'chaos');
          break;
        case 'swapWithRichest': {
          const richest = [...players].filter((_, i) => i !== pidx).sort((a, b) => b.money - a.money)[0];
          if (richest) {
            setPlayers(prev => {
              const next = prev.map(pl => ({ ...pl }));
              const posA = next[pidx].position;
              next[pidx].position = next[richest.id].position;
              next[richest.id].position = posA;
              return next;
            });
            addLog(`🔀 ${p.name} intercambia posición con ${richest.name} (el más rico).`, 'chaos');
          }
          break;
        }
        case 'destroyHouses': {
          const groups = Object.keys(GROUP_SQUARES);
          const rndGroup = groups[Math.floor(Math.random() * groups.length)];
          const ids = GROUP_SQUARES[rndGroup];
          setPropHouses(prev => {
            const next = { ...prev };
            ids.forEach(id => { delete next[id]; });
            return next;
          });
          addLog(`☄️ ¡METEORITO! Todas las casas del grupo ${rndGroup} son DESTRUIDAS.`, 'chaos');
          break;
        }
        case 'gain500':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, money: pl.money + 500 } : pl));
          addLog(`🤑 ${p.name} recibe $500 de la Lotería Mutante.`, 'money');
          break;
        case 'leftLose300': {
          const left = (pidx - 1 + players.length) % players.length;
          setPlayers(prev => prev.map((pl, i) => i === left ? { ...pl, money: Math.max(0, pl.money - 300) } : pl));
          addLog(`😈 ${players[left].name} pierde $300 por maldición viral.`, 'money');
          break;
        }
        case 'goMostExpensive': {
          const mostExp = SQUARE_DATA.filter(sq => sq.type === 'property').sort((a, b) => b.price - a.price)[0];
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, position: mostExp.id } : pl));
          addLog(`🕳️ ${p.name} es succionado hasta ${mostExp.name}!`, 'chaos');
          break;
        }
        case 'doubleRent':
          setDoubleRentTurns(2);
          addLog(`🔥 ¡REVOLUCIÓN! Todos los alquileres se DUPLICAN por 2 turnos.`, 'chaos');
          break;
        case 'steal200each': {
          let stolen = 0;
          setPlayers(prev => {
            const next = prev.map((pl, i) => {
              if (i !== pidx) {
                const s = Math.min(200, pl.money);
                stolen += s;
                return { ...pl, money: pl.money - s };
              }
              return pl;
            });
            next[pidx] = { ...next[pidx], money: next[pidx].money + stolen };
            addLog(`🦹 ${p.name} roba $200 de cada jugador. Total: $${stolen}`, 'chaos');
            return next;
          });
          break;
        }
        case 'nextDiceX3':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, nextDiceX3: true } : pl));
          addLog(`🧬 ${p.name} activó MUTACIÓN GENÉTICA. Próximos dados x3!`, 'chaos');
          break;
        case 'randomTeleport': {
          const rnd = Math.floor(Math.random() * 40);
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, position: rnd } : pl));
          addLog(`🌀 ${p.name} es teletransportado a ${SQUARE_DATA[rnd].name}.`, 'chaos');
          break;
        }
        case 'collect100each': {
          let col = 0;
          setPlayers(prev => {
            const next = prev.map((pl, i) => {
              if (i !== pidx) {
                const s = Math.min(100, pl.money);
                col += s;
                return { ...pl, money: pl.money - s };
              }
              return pl;
            });
            next[pidx] = { ...next[pidx], money: next[pidx].money + col };
            addLog(`✨ ${p.name} cobra $100 de cada jugador por carisma galáctico.`, 'money');
            return next;
          });
          break;
        }
        case 'payPerProp': {
          const ownedCount = Object.values(propOwners).filter(o => o === pidx).length;
          const charge = ownedCount * 50;
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, money: Math.max(0, pl.money - charge) } : pl));
          setJackpot(jp => jp + charge);
          addLog(`💸 ${p.name} paga $${charge} (${ownedCount} propiedades × $50 impuesto kármico).`, 'money');
          break;
        }
        case 'nextTurnFree':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, nextTurnFree: true } : pl));
          addLog(`🛡️ ${p.name} activa ESCUDO DIMENSIONAL. Próximo alquiler: gratis.`, 'event');
          break;
        case 'bankCharge400':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, money: Math.max(0, pl.money - 400) } : pl));
          setJackpot(jp => jp + 400);
          addLog(`🏦 ${p.name} paga $400 por "cuotas de rescate dimensional".`, 'money');
          break;
        case 'backToStart':
          setPlayers(prev => prev.map((pl, i) => i === pidx ? { ...pl, position: 0 } : pl));
          addLog(`👻 ${p.name} retrocede al inicio por bucle temporal. Sin cobrar $200.`, 'chaos');
          break;
        case 'ghostSteal':
          if (players.filter((_, i) => i !== pidx && players[i].alive).length > 0) {
            setPendingGhostSteal(pidx);
            setPhase('ghoststeal');
            return;
          }
          break;
        case 'jackpotBonus':
          setJackpot(jp => jp * 2);
          addLog(`🎰 ¡BONUS! El Jackpot Galáctico se DUPLICA a $${jackpot * 2}!`, 'chaos');
          break;
      }
    }
    setActiveCard(null);
    setPhase('endturn');
  }

  function buyProperty(squareId) {
    const sq = SQUARE_DATA[squareId];
    setPlayers(prev => prev.map((p, i) =>
      i === currentIdx ? { ...p, money: p.money - sq.price } : p
    ));
    setPropOwners(prev => ({ ...prev, [squareId]: currentIdx }));
    addLog(`🏠 ${players[currentIdx].name} compra ${sq.name} por $${sq.price}!`, 'buy');
    setPendingBuy(null);
    setPhase('build');
  }

  function skipBuy() {
    addLog(`😒 ${players[currentIdx].name} pasa de comprar. Una oportunidad galáctica perdida.`, 'normal');
    setPendingBuy(null);
    setPhase('endturn');
  }

  function payRent() {
    const { rent, ownerIdx, squareId } = pendingRent;
    const sq = SQUARE_DATA[squareId];
    addLog(`💸 ${players[currentIdx].name} paga $${rent} de alquiler a ${players[ownerIdx].name} por ${sq.name}.`, 'money');
    const actual = Math.min(rent, players[currentIdx].money);
    setPlayers(prev => prev.map((p, i) => {
      if (i === currentIdx) return { ...p, money: Math.max(0, p.money - actual) };
      if (i === ownerIdx)   return { ...p, money: p.money + actual };
      return p;
    }));
    setPendingRent(null);
    setPhase('build');
  }

  function doEndTurn() {
    setPlayers(prev => {
      nextTurn(prev, currentIdx);
      return prev;
    });
  }

  function buildHouse(squareId) {
    const sq = SQUARE_DATA[squareId];
    if (!sq || sq.type !== 'property') return;
    if (propOwners[squareId] !== currentIdx) return;
    if (!hasMonopoly(currentIdx, sq.group)) return;
    const houses = propHouses[squareId] || 0;
    if (houses >= 5) return;
    if (players[currentIdx].money < sq.houseCost) return;
    setPlayers(prev => prev.map((p, i) => i === currentIdx ? { ...p, money: p.money - sq.houseCost } : p));
    setPropHouses(prev => ({ ...prev, [squareId]: houses + 1 }));
    addLog(`🏗️ ${players[currentIdx].name} construye una ${houses === 4 ? 'FORTALEZA' : 'casa'} en ${sq.name}.`, 'buy');
  }


  const CELL_SIZE = 54;
  const BOARD_SIZE = 11 * CELL_SIZE;



  const btnStyle = useCallback((color, small = false) => ({
    background: `${color}22`,
    border: `1px solid ${color}`,
    color: color,
    borderRadius: 4,
    padding: small ? '3px 8px' : '4px 12px',
    fontSize: small ? 9 : 11,
    cursor: 'pointer',
    fontFamily: '"Orbitron", sans-serif',
    boxShadow: `0 0 8px ${color}44`,
    transition: 'all 0.15s',
    margin: 2,
  }), []);

  const buildOptions = useMemo(() => (
    Object.entries(propOwners)
      .filter(([id, o]) => o === currentIdx && SQUARE_DATA[id]?.type === 'property' && hasMonopoly(currentIdx, SQUARE_DATA[id].group) && (propHouses[id] || 0) < 5)
      .map(([id]) => ({ id, color: GROUP_COLORS[SQUARE_DATA[id].group] || '#888', label: SQUARE_DATA[id].name.slice(0, 10) }))
  ), [propOwners, currentIdx, propHouses]);

  const handleExitGame = useCallback(() => {
    if (window.confirm(t('exitConfirmation'))) setScreen('menu');
  }, [t]);


  // ========================= SCREENS =========================

  // Tutorial Screen
  if (showTutorial) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
        color: '#fff',
        padding: 20,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{
          background: 'linear-gradient(135deg, #0a1525 0%, #1a0525 100%)',
          border: '2px solid #44aaff',
          borderRadius: 12,
          padding: 40,
          maxWidth: 700,
          textAlign: 'center',
          boxShadow: '0 0 40px #44aaff44, inset 0 0 20px #44aaff11',
        }}>
          <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 20 }}>🔍</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#44aaff', marginBottom: 12, letterSpacing: 2 }}>
            {t('tutorialIntro')}
          </div>
          <div style={{ fontSize: 14, color: '#8899aa', marginBottom: 30, lineHeight: 1.6 }}>
            {t('tutorialDesc')}
          </div>
          
          {/* Features List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 30 }}>
            {features.map((feature, i) => (
              <div key={i} style={{
                background: '#0a1520',
                border: '1px solid #1a2a3a',
                borderRadius: 8,
                padding: 12,
                fontSize: 11,
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{feature.title.split(' ')[0]}</div>
                <div style={{ color: '#ccc', fontWeight: 'bold', marginBottom: 4 }}>
                  {feature.title.split(' ').slice(1).join(' ')}
                </div>
                <div style={{ color: '#668899', fontSize: 10 }}>{feature.desc}</div>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => {
              setTutorialSeen(true);
              setShowTutorial(false);
              setScreen('rules');
            }} style={{ ...btnStyle('#44ff88'), fontSize: 14, padding: '10px 30px', width: 'auto' }}>
              {t('startGame')}
            </button>
            <button onClick={() => {
              setTutorialSeen(true);
              setShowTutorial(false);
            }} style={{ ...btnStyle('#666'), fontSize: 12, padding: '8px 20px', width: 'auto' }}>
              {t('skipTutorial')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'winner') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#020812',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80 }}>{winner?.emoji}</div>
          <div style={{
            fontSize: 40, fontWeight: 900,
            background: `linear-gradient(90deg, ${winner?.color}, #fff)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginTop: 10,
          }}>¡{winner?.name} GANA!</div>
          <div style={{ color: '#aaa', marginTop: 10, fontSize: 14 }}>
            Con ${winner?.money} en el banco galáctico
          </div>
          <button onClick={() => setScreen('menu')} style={{ ...btnStyle('#44aaff'), marginTop: 30, fontSize: 14 }}>
            🚀 Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'menu') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
        flexDirection: 'column',
        gap: 30,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 10 }}>
          <button onClick={() => setLanguage('es')} style={{ ...btnStyle(language === 'es' ? '#44ff88' : '#334455'), fontSize: 12 }}>ES</button>
          <button onClick={() => setLanguage('en')} style={{ ...btnStyle(language === 'en' ? '#44ff88' : '#334455'), fontSize: 12 }}>EN</button>
        </div>
        <div style={{
          fontSize: 56, fontWeight: 900,
          background: 'linear-gradient(135deg, #ff4488, #44aaff, #44ff88, #ffdd44)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: 8,
          textShadow: 'none',
          animation: 'pulse 2s infinite',
        }}>
          {t('title')}
        </div>
        <div style={{ color: '#8899aa', fontSize: 13, letterSpacing: 3 }}>
          {t('subtitle')}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 600, fontSize: 11, color: '#667788' }}>
          {features.map(feature => (
            <div key={feature.title} style={{ background: '#0a1520', border: '1px solid #1a2a3a', borderRadius: 8, padding: '8px 12px', width: 160, textAlign: 'center' }}>
              <div style={{ fontSize: 14 }}>{feature.title}</div>
              <div style={{ fontSize: 9, marginTop: 3, color: '#556677' }}>{feature.desc}</div>
            </div>
          ))}
        </div>
        {hasSavedGame && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={loadGame} style={{ ...btnStyle('#44ff88'), fontSize: 14, padding: '8px 20px' }}>
              ⏳ REANUDAR ÚTIMA PARTIDA
            </button>
            <button onClick={() => { clearSavedGame(); setHasSavedGame(false); }} style={{ ...btnStyle('#aa4444'), fontSize: 12, padding: '6px 12px' }}>
              {t('delete')}
            </button>
          </div>
        )}
        <button onClick={() => setScreen('rules')} style={{ ...btnStyle('#44aaff'), fontSize: 16, padding: '10px 30px' }}>
          🚀 {t('play')}
        </button>
        <button onClick={() => setShowTutorial(true)} style={{ ...btnStyle('#ffaa00'), fontSize: 12, padding: '8px 20px' }}>
          {t('tutorial')}
        </button>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.8} }`}</style>
      </div>
    );
  }

  if (screen === 'rules') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
        flexDirection: 'column',
        gap: 20,
        color: '#fff'
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{ fontSize: 36, fontWeight: 900 }}>{t('rules')}</div>
        <div style={{ maxWidth: 600, textAlign: 'left', fontSize: 14 }}>
          <ul style={{ paddingLeft: 20 }}>
            {rulesText.map((r, i) => <li key={i} style={{ marginBottom: 6 }}>{r}</li>)}
          </ul>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setScreen('setup')} style={{ ...btnStyle('#44aaff'), fontSize: 14, padding: '8px 24px' }}>
            {t('understood')}
          </button>
          <button onClick={() => setScreen('menu')} style={{ ...btnStyle('#aa4444'), fontSize: 14, padding: '8px 24px' }}>
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'setup') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
        flexDirection: 'column',
        gap: 20,
        color: '#fff',
        overflowY: 'auto',
        padding: '20px',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#44aaff', letterSpacing: 4 }}>{t('config')}</div>
        <div style={{ fontSize: 12, color: '#8899aa' }}>{t('customize')}</div>
        
        {/* Selección de jugadores */}
        <div style={{ width: 400, background: '#0a1520', border: '1px solid #1a2a3a', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 8 }}>{t('players')}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[2, 3, 4].map(n => (
              <button key={n} onClick={() => setNumPlayers(n)} style={{
                ...btnStyle(numPlayers === n ? '#44aaff' : '#334455'),
                fontSize: 14, padding: '6px 16px',
              }}>
                {n}
              </button>
            ))}
          </div>
        </div>
        
        {/* Nombres de jugadores */}
        <div style={{ width: 400, background: '#0a1520', border: '1px solid #1a2a3a', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 8 }}>{t('names')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from({ length: numPlayers }, (_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{PLAYER_CONFIGS[i].emoji}</span>
                <input
                  value={playerNames[i]}
                  onChange={e => setPlayerNames(prev => prev.map((n, j) => j === i ? e.target.value : n))}
                  style={{
                    flex: 1,
                    background: '#0a1520',
                    border: `1px solid ${PLAYER_CONFIGS[i].color}`,
                    borderRadius: 4,
                    color: PLAYER_CONFIGS[i].color,
                    padding: '4px 8px',
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: 10,
                    outline: 'none',
                  }}
                  placeholder={`Jugador ${i+1}`}
                  maxLength={12}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Botón para mostrar/ocultar configuración avanzada */}
        <button onClick={() => setShowAdvancedSettings(!showAdvancedSettings)} style={{ ...btnStyle('#ffaa00'), fontSize: 12, padding: '6px 16px' }}>
          {showAdvancedSettings ? '⌄' : '⌃'} {t('advancedSettings')}
        </button>
        
        {/* Configuración avanzada */}
        {showAdvancedSettings && (
          <div style={{ width: 400, background: '#0a1520', border: '1px solid #aa6600', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 12, color: '#ff9966', marginBottom: 12, fontWeight: 'bold' }}>Reglas personalizadas:</div>
            
            {/* Dinero inicial */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 4 }}>{t('initialMoney')}: ${initialMoney}</div>
              <input 
                type="range" 
                min="500" 
                max="3000" 
                step="100" 
                value={initialMoney}
                onChange={e => setInitialMoney(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            {/* Multiplicador de alquiler */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 4 }}>{t('rentMultiplier')}: x{rentMultiplier.toFixed(1)}</div>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={rentMultiplier}
                onChange={e => setRentMultiplier(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            {/* Probabilidad de Caos */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 4 }}>{t('chaosChance')}: {(chaosChance*100).toFixed(0)}%</div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={chaosChance}
                onChange={e => setChaoschance(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
        
        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={startGame} style={{ ...btnStyle('#44ff88'), fontSize: 14, padding: '8px 24px' }}>
            🚀 {t('start')}
          </button>
          <button onClick={() => setScreen('rules')} style={{ ...btnStyle('#aa4444'), fontSize: 14, padding: '8px 24px' }}>
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  // ========================= GAME SCREEN =========================

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020812',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      boxSizing: 'border-box',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
      {/* Help Modal */}
      {showHelp && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: '#00000088',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowHelp(false)}>
          <div style={{
            background: '#0a1525',
            border: '2px solid #44aaff',
            borderRadius: 8,
            padding: 20,
            maxWidth: 400,
            maxHeight: '80vh',
            overflowY: 'auto',
            fontFamily: '"Orbitron", sans-serif',
            color: '#fff',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, color: '#44aaff' }}>{t('helpTitle')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 11 }}>
              {Object.entries(squareInfo).map(([key, info]) => (
                <div key={key} style={{ background: '#0a2030', border: '1px solid #1a3a4a', borderRadius: 4, padding: 8 }}>
                  <div style={{ color: '#44ff88', fontWeight: 700, marginBottom: 4 }}>{info.name}</div>
                  <div style={{ color: '#8899aa', fontSize: 9, lineHeight: 1.3 }}>{info.desc}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowHelp(false)} style={{ ...btnStyle('#44aaff'), marginTop: 12, width: '100%' }}>
              {t('close')}
            </button>
          </div>
        </div>
      )}
      {/* Top-right controls */}
      <div style={{ position: 'fixed', top: 10, right: 10, display: 'flex', gap: 8, zIndex: 100 }}>
        <button onClick={() => setShowHelp(!showHelp)} style={{ ...btnStyle('#ffaa00'), fontSize: 14 }}>
          {t('help')}
        </button>
        <button onClick={() => setLanguage('es')} style={{ ...btnStyle(language === 'es' ? '#44ff88' : '#334455'), fontSize: 11 }}>ES</button>
        <button onClick={() => setLanguage('en')} style={{ ...btnStyle(language === 'en' ? '#44ff88' : '#334455'), fontSize: 11 }}>EN</button>
      </div>
      <Board
        boardSize={BOARD_SIZE}
        cellSize={CELL_SIZE}
        squares={SQUARE_DATA}
        players={players}
        propOwners={propOwners}
        propHouses={propHouses}
        groupColors={GROUP_COLORS}
        playerConfigs={PLAYER_CONFIGS}
        centerPanel={(
          <CenterPanel
            cellSize={CELL_SIZE}
            players={players}
            currentIdx={currentIdx}
            doubleRentTurns={doubleRentTurns}
            jackpot={jackpot}
            dice={dice}
            animDice={animDice}
            chaosDie={chaosDie}
            phase={phase}
            turnTimer={turnTimer}
            btnStyle={btnStyle}
            doRoll={doRoll}
            t={t}
            addLog={addLog}
            setPlayers={setPlayers}
            doEndTurn={doEndTurn}
            pendingBuy={pendingBuy}
            squares={SQUARE_DATA}
            buyProperty={buyProperty}
            skipBuy={skipBuy}
            pendingRent={pendingRent}
            payRent={payRent}
            activeCard={activeCard}
            applyCardEffect={applyCardEffect}
            propOwners={propOwners}
            setPropOwners={setPropOwners}
            setActiveCard={setActiveCard}
            setPendingGhostSteal={setPendingGhostSteal}
            setPhase={setPhase}
            buildOptions={buildOptions}
            buildHouse={buildHouse}
            log={log}
          />
        )}
      />

      <PropertySidebar
        boardSize={BOARD_SIZE}
        t={t}
        groupSquares={GROUP_SQUARES}
        groupColors={GROUP_COLORS}
        railroads={RAILROADS}
        utilities={UTILITIES}
        propOwners={propOwners}
        propHouses={propHouses}
        squares={SQUARE_DATA}
        playerConfigs={PLAYER_CONFIGS}
        btnStyle={btnStyle}
        onExit={handleExitGame}
      />
    </div>
  );
}
