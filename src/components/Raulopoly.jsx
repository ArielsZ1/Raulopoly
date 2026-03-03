import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "../i18n/I18nProvider";
import { getTutorialSeen, setTutorialSeen } from "../services/storageService";
import Board from "./game/Board";
import CenterPanel from "./game/CenterPanel";
import PropertySidebar from "./game/PropertySidebar";

// ========================= GAME DATA =========================

const SQUARE_DATA = [
  { id: 0, name: "SALIDA", type: "go", group: null, icon: "🚀", price: 0 },
  {
    id: 1,
    name: "C. Peligrosa",
    type: "property",
    group: "brown",
    price: 60,
    rent: [2, 10, 30, 90, 160, 250],
    houseCost: 50,
  },
  {
    id: 2,
    name: "Caja del Caos",
    type: "chest",
    group: null,
    icon: "📦",
    price: 0,
  },
  {
    id: 3,
    name: "Av. Maldita",
    type: "property",
    group: "brown",
    price: 60,
    rent: [4, 20, 60, 180, 320, 450],
    houseCost: 50,
  },
  {
    id: 4,
    name: "Impuesto Galáctico",
    type: "tax",
    group: null,
    icon: "💸",
    price: 0,
    amount: 200,
  },
  {
    id: 5,
    name: "Estación Norte",
    type: "railroad",
    group: null,
    icon: "🛸",
    price: 200,
  },
  {
    id: 6,
    name: "C. Perdición",
    type: "property",
    group: "lblue",
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
  },
  {
    id: 7,
    name: "Poder del Caos",
    type: "chance",
    group: null,
    icon: "⚡",
    price: 0,
  },
  {
    id: 8,
    name: "Blvd. Fantasmal",
    type: "property",
    group: "lblue",
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
  },
  {
    id: 9,
    name: "Gran Av. Maldita",
    type: "property",
    group: "lblue",
    price: 120,
    rent: [8, 40, 100, 300, 450, 600],
    houseCost: 50,
  },
  {
    id: 10,
    name: "CÁRCEL / VISITA",
    type: "jail",
    group: null,
    icon: "⛓️",
    price: 0,
  },
  {
    id: 11,
    name: "C. Magenta",
    type: "property",
    group: "pink",
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
  },
  {
    id: 12,
    name: "Cía. Eléctrica",
    type: "utility",
    group: null,
    icon: "⚡",
    price: 150,
  },
  {
    id: 13,
    name: "Av. Rosada",
    type: "property",
    group: "pink",
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
  },
  {
    id: 14,
    name: "C. Desolación",
    type: "property",
    group: "pink",
    price: 160,
    rent: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
  },
  {
    id: 15,
    name: "Estación Este",
    type: "railroad",
    group: null,
    icon: "🛸",
    price: 200,
  },
  {
    id: 16,
    name: "C. Naranja",
    type: "property",
    group: "orange",
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
  },
  {
    id: 17,
    name: "Caja del Caos",
    type: "chest",
    group: null,
    icon: "📦",
    price: 0,
  },
  {
    id: 18,
    name: "Av. Ardiente",
    type: "property",
    group: "orange",
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
  },
  {
    id: 19,
    name: "Gran Av. Naranja",
    type: "property",
    group: "orange",
    price: 200,
    rent: [16, 80, 220, 600, 800, 1000],
    houseCost: 100,
  },
  {
    id: 20,
    name: "¡JACKPOT!",
    type: "freeparking",
    group: null,
    icon: "🎰",
    price: 0,
  },
  {
    id: 21,
    name: "C. Apocalipsis",
    type: "property",
    group: "red",
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
  },
  {
    id: 22,
    name: "Poder del Caos",
    type: "chance",
    group: null,
    icon: "⚡",
    price: 0,
  },
  {
    id: 23,
    name: "Av. Sangrienta",
    type: "property",
    group: "red",
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
  },
  {
    id: 24,
    name: "Gran C. Roja",
    type: "property",
    group: "red",
    price: 240,
    rent: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
  },
  {
    id: 25,
    name: "Estación Sur",
    type: "railroad",
    group: null,
    icon: "🛸",
    price: 200,
  },
  {
    id: 26,
    name: "C. Solar",
    type: "property",
    group: "yellow",
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
  },
  {
    id: 27,
    name: "Av. Radiante",
    type: "property",
    group: "yellow",
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
  },
  {
    id: 28,
    name: "Aguas Tóxicas",
    type: "utility",
    group: null,
    icon: "☢️",
    price: 150,
  },
  {
    id: 29,
    name: "Gran Av. Amarilla",
    type: "property",
    group: "yellow",
    price: 280,
    rent: [24, 120, 360, 850, 1025, 1200],
    houseCost: 150,
  },
  {
    id: 30,
    name: "TELETRANSPORTADOR",
    type: "gotojail",
    group: null,
    icon: "🌀",
    price: 0,
  },
  {
    id: 31,
    name: "C. Venenosa",
    type: "property",
    group: "green",
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
  },
  {
    id: 32,
    name: "Av. Verde",
    type: "property",
    group: "green",
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
  },
  {
    id: 33,
    name: "Caja del Caos",
    type: "chest",
    group: null,
    icon: "📦",
    price: 0,
  },
  {
    id: 34,
    name: "Gran Av. Verde",
    type: "property",
    group: "green",
    price: 320,
    rent: [28, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
  },
  {
    id: 35,
    name: "Estación Oeste",
    type: "railroad",
    group: null,
    icon: "🛸",
    price: 200,
  },
  {
    id: 36,
    name: "Poder del Caos",
    type: "chance",
    group: null,
    icon: "⚡",
    price: 0,
  },
  {
    id: 37,
    name: "C. Oscura",
    type: "property",
    group: "dblue",
    price: 350,
    rent: [35, 175, 500, 1100, 1300, 1500],
    houseCost: 200,
  },
  {
    id: 38,
    name: "Impuesto Supremo",
    type: "tax",
    group: null,
    icon: "💀",
    price: 0,
    amount: 100,
  },
  {
    id: 39,
    name: "Gran Av. Azul",
    type: "property",
    group: "dblue",
    price: 400,
    rent: [50, 200, 600, 1400, 1700, 2000],
    houseCost: 200,
  },
];

const GROUP_COLORS = {
  brown: "#8B4513",
  lblue: "#87CEEB",
  pink: "#FF69B4",
  orange: "#FF8C00",
  red: "#DC143C",
  yellow: "#FFD700",
  green: "#22AA44",
  dblue: "#1E3FBB",
};

const GROUP_SQUARES = {
  brown: [1, 3],
  lblue: [6, 8, 9],
  pink: [11, 13, 14],
  orange: [16, 18, 19],
  red: [21, 23, 24],
  yellow: [26, 27, 29],
  green: [31, 32, 34],
  dblue: [37, 39],
};

const RAILROADS = [5, 15, 25, 35];
const UTILITIES = [12, 28];

const PLAYER_CONFIGS = [
  { name: "Jugador 1", color: "#FF4444", glow: "#FF000088", emoji: "🚀" },
  { name: "Jugador 2", color: "#4488FF", glow: "#0044FF88", emoji: "💎" },
  { name: "Jugador 3", color: "#44FF88", glow: "#00FF4488", emoji: "🔥" },
  { name: "Jugador 4", color: "#FFAA00", glow: "#FF880088", emoji: "💀" },
];

const CHAOS_CARDS = [
  { id: "allLoseHalf", emoji: "🌪️" },
  { id: "swapWithRichest", emoji: "🔀" },
  { id: "destroyHouses", emoji: "☄️" },
  { id: "gain500", emoji: "🤑" },
  { id: "leftLose300", emoji: "😈" },
  { id: "goMostExpensive", emoji: "🕳️" },
  { id: "doubleRent", emoji: "🔥" },
  { id: "steal200each", emoji: "🦹" },
  { id: "nextDiceX3", emoji: "🎲" },
  { id: "randomTeleport", emoji: "🌀" },
  { id: "collect100each", emoji: "✨" },
  { id: "payPerProp", emoji: "💸" },
  { id: "nextTurnFree", emoji: "🛡️" },
  { id: "bankCharge400", emoji: "🏦" },
  { id: "backToStart", emoji: "👻" },
  { id: "ghostSteal", emoji: "🫀" },
  { id: "jackpotBonus", emoji: "🎰" },
];

const POWER_CARDS = [
  { id: "goToGo", emoji: "🚀" },
  { id: "goTo5", emoji: "🛸" },
  { id: "nextBackward", emoji: "🔄" },
  { id: "goToJail", emoji: "⛓️" },
  { id: "collect150", emoji: "💰" },
  { id: "pay200", emoji: "💸" },
  { id: "outOfJail", emoji: "🗝️" },
  { id: "gain100", emoji: "🎁" },
  { id: "back3", emoji: "⏮️" },
  { id: "nearest", emoji: "🧲" },
];

// ========================= HELPERS =========================

function getGridPos(id) {
  if (id === 0) return { r: 10, c: 10 };
  if (id === 10) return { r: 10, c: 0 };
  if (id === 20) return { r: 0, c: 0 };
  if (id === 30) return { r: 0, c: 10 };
  if (id > 0 && id < 10) return { r: 10, c: 10 - id };
  if (id > 10 && id < 20) return { r: 20 - id, c: 0 };
  if (id > 20 && id < 30) return { r: 0, c: id - 20 };
  if (id > 30 && id < 40) return { r: id - 30, c: 10 };
  return { r: 0, c: 0 };
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function getSquareRotation(id) {
  if (id === 0 || id === 10 || id === 20 || id === 30) return 0;
  if (id > 0 && id < 10) return 0; // bottom row - normal
  if (id > 10 && id < 20) return 90; // left col - rotate
  if (id > 20 && id < 30) return 180; // top row - upside down
  if (id > 30 && id < 40) return -90; // right col - rotate
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
  const [screen, setScreen] = useState("menu");
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState("roll");
  const [dice, setDice] = useState([1, 1]);
  const [chaosDie, setChaosDie] = useState(null);
  const [propOwners, setPropOwners] = useState({});
  const [propHouses, setPropHouses] = useState({});
  const [log, setLog] = useState([]);
  const [jackpot, setJackpot] = useState(500);
  const [activeCard, setActiveCard] = useState(null);
  const [doubleRentTurns, setDoubleRentTurns] = useState(0);
  const [pendingBuy, setPendingBuy] = useState(null);
  const [pendingRent, setPendingRent] = useState(null);
  const [winner, setWinner] = useState(null);
  const [animDice, setAnimDice] = useState(false);
  const [ghostTarget, setGhostTarget] = useState(null);
  const [pendingGhostSteal, setPendingGhostSteal] = useState(null);
  const [playerNames, setPlayerNames] = useState(
    PLAYER_CONFIGS.map((p) => p.name),
  );
  const [initialMoney, setInitialMoney] = useState(1500);
  const [rentMultiplier, setRentMultiplier] = useState(1);
  const [chaosChance, setChaoschance] = useState(0.3);
  const [hasSavedGame, setHasSavedGame] = useState(() => {
    try {
      return !!localStorage.getItem("raulopolyGame");
    } catch (_) {
      return false;
    }
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Función para guardar partida en localStorage
  const saveGame = useCallback(() => {
    const gameState = {
      screen,
      numPlayers,
      players,
      currentIdx,
      phase,
      dice,
      chaosDie,
      propOwners,
      propHouses,
      log,
      jackpot,
      activeCard,
      doubleRentTurns,
      pendingBuy,
      pendingRent,
      winner,
      playerNames,
      settings: { initialMoney, rentMultiplier, chaosChance },
    };
    try {
      localStorage.setItem("raulopolyGame", JSON.stringify(gameState));
    } catch (_) {
      // noop: storage unavailable
    }
    setHasSavedGame(true);
  }, [
    screen,
    numPlayers,
    players,
    currentIdx,
    phase,
    dice,
    chaosDie,
    propOwners,
    propHouses,
    log,
    jackpot,
    activeCard,
    doubleRentTurns,
    pendingBuy,
    pendingRent,
    winner,
    playerNames,
    initialMoney,
    rentMultiplier,
    chaosChance,
  ]);

  // Función para cargar partida desde localStorage
  const loadGame = useCallback(() => {
    let saved = null;
    try {
      saved = localStorage.getItem('raulopolyGame');
    } catch (_) {
      saved = null;
    }
    if (saved) {
      try {
        const gameState = JSON.parse(saved);
        // NO DECLARAR gameState DE NUEVO aquí
        if (gameState) {
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
      } catch (error) {
        console.log('No saved game found');
      }
    }
  }, []);

  // Guardar partida periódicamente durante el juego
  useEffect(() => {
    if (screen === "game") {
      saveGame();
    }
  }, [screen, players, currentIdx, phase, saveGame]);

  // Función para reproducir sonido simple
  const playSound = useCallback((type) => {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    switch (type) {
      case "cash":
        oscillator.frequency.value = 800;
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1,
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case "chaos":
        oscillator.frequency.value = 300;
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3,
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case "jail":
        for (let i = 0; i < 3; i++) {
          oscillator.frequency.setValueAtTime(
            600 - i * 100,
            audioContext.currentTime + i * 0.1,
          );
        }
        gain.gain.setValueAtTime(0.25, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3,
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case "success":
        oscillator.frequency.value = 1200;
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.15,
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
      default:
        break;
    }
  }, []);

  const [turnTimer, setTurnTimer] = useState(60);
  const [showHelp, setShowHelp] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(() => {
    try {
      const seen = localStorage.getItem("raulopolyTutorialSeen");
      return !seen; // Mostrar solo si no ha sido visto
    } catch (e) {
      return false; // Si hay error, no mostrar tutorial
    }
  });
  // Usamos el servicio de almacenamiento para inicializar el estado
  const [showTutorial, setShowTutorial] = useState(() => !getTutorialSeen());

  // Refs para focus management en diálogos
  const helpCloseButtonRef = useRef(null);
  const tutorialCloseButtonRef = useRef(null);

  const features = t("features", { returnObjects: true }) || [];
  const squareInfo = t("squareInfo", { returnObjects: true }) || {};
  const rulesText = t("rulesText", { returnObjects: true }) || [];
  const getCardI18nPrefix = (card) =>
    card?.source === "chest" ? "chaosCards" : "powerCards";

  useEffect(() => {
    if (
      screen !== "game" ||
      phase === "card" ||
      phase === "buydecision" ||
      phase === "payrent" ||
      phase === "endturn"
    ) {
      return;
    }
    const timer = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          playSound("jail"); // sonido de alerta
          nextTurn(players, currentIdx);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, phase, players, currentIdx, playSound, nextTurn]);

  // Resetear timer al cambiar de turno
  useEffect(() => {
    setTurnTimer(60);
  }, [currentIdx]);

  const addLog = useCallback((keyOrMessage, params = {}, type = "normal") => {
    if (typeof params === "string") {
      setLog((prev) =>
        [
          {
            message: keyOrMessage,
            type: params,
            id: Date.now() + Math.random(),
          },
          ...prev,
        ].slice(0, 30),
      );
      return;
    }
    setLog((prev) =>
      [
        { key: keyOrMessage, params, type, id: Date.now() + Math.random() },
        ...prev,
      ].slice(0, 30),
    );
  }, []);

  function startGame() {
    const ps = createPlayers(numPlayers);
    ps.forEach((p, i) => {
      p.name = playerNames[i] || PLAYER_CONFIGS[i].name;
      p.money = initialMoney; // Usar dinero inicial personalizado
    });
    setPlayers(ps);
    setPropOwners({});
    setPropHouses({});
    setLog([]);
    setJackpot(500);
    setCurrentIdx(0);
    setPhase("roll");
    setActiveCard(null);
    setPendingBuy(null);
    setPendingRent(null);
    setWinner(null);
    setDoubleRentTurns(0);
    setScreen("game");
    playSound("success");
    addLog("events.gameStarted", {}, "event");
  }

  function hasMonopoly(playerIdx, group) {
    const squares = GROUP_SQUARES[group] || [];
    return squares.every((id) => propOwners[id] === playerIdx);
  }

  function calcRent(squareId, diceTotal, playerIdx) {
    const sq = SQUARE_DATA[squareId];
    if (!sq) return 0;
    const owner = propOwners[squareId];
    if (owner === undefined || owner === playerIdx) return 0;

    let rent = 0;
    if (sq.type === "property") {
      const houses = propHouses[squareId] || 0;
      rent = sq.rent[houses];
      if (houses === 0 && hasMonopoly(owner, sq.group)) rent *= 2;
    } else if (sq.type === "railroad") {
      const owned = RAILROADS.filter((r) => propOwners[r] === owner).length;
      rent = 25 * Math.pow(2, owned - 1);
    } else if (sq.type === "utility") {
      const owned = UTILITIES.filter((u) => propOwners[u] === owner).length;
      rent = owned === 2 ? diceTotal * 10 : diceTotal * 4;
    }
    if (doubleRentTurns > 0) rent *= 2;
    return rent;
  }

  function doTransfer(fromIdx, toIdx, amount, reason) {
    playSound("cash");
    setPlayers((prev) => {
      const next = prev.map((p) => ({ ...p }));
      const actual = Math.min(amount, Math.max(0, next[fromIdx].money));
      next[fromIdx].money -= actual;
      if (toIdx === -1) {
        // to bank/jackpot
        setJackpot((jp) => jp + actual);
      } else if (toIdx >= 0) {
        next[toIdx].money += actual;
      }
      const transferKey =
        typeof reason === "string" ? reason : "events.transferToBank";
      const transferParams =
        typeof reason === "object" && reason !== null
          ? reason
          : { player: next[fromIdx].name, amount: actual };
      addLog(transferKey, transferParams, "money");
      addLog(
        reason || "events.transferToBank",
        reason ? {} : { player: next[fromIdx].name, amount: actual },
        "money",
      );
      // check bankruptcy
      if (next[fromIdx].money <= 0 && !next[fromIdx].isGhost) {
        next[fromIdx].money = 0;
        next[fromIdx].alive = false;
        next[fromIdx].isGhost = true;
        addLog("events.bankruptGhost", { player: next[fromIdx].name }, "event");
        // ghost can still haunt players
      }
      return next;
    });
  }

  function nextTurn(ps, idx) {
    const alive = ps.filter((p) => p.alive || p.isGhost);
    const reallyAlive = ps.filter((p) => p.alive && !p.isGhost);
    if (reallyAlive.length === 1) {
      setWinner(reallyAlive[0]);
      setScreen("winner");
      return;
    }
    // advance to next alive player
    let next = (idx + 1) % ps.length;
    while (!ps[next].alive && !ps[next].isGhost) {
      next = (next + 1) % ps.length;
      if (next === idx) break;
    }
    setCurrentIdx(next);
    setPhase("roll");
    setActiveCard(null);
    setPendingBuy(null);
    setPendingRent(null);
    setChaosDie(null);
    if (doubleRentTurns > 0) setDoubleRentTurns((d) => d - 1);
  }

  function landOnSquare(playerIdx, squareId, diceTotal, newPlayers) {
    const sq = SQUARE_DATA[squareId];
    const player = newPlayers[playerIdx];
    addLog(
      "events.landedOnSquare",
      { emoji: player.emoji, player: player.name, square: sq.name },
      "move",
    );

    if (sq.type === "go") {
      addLog(
        "events.passGoCollect",
        { player: player.name, amount: 200 },
        "money",
      );
      setPlayers((prev) =>
        prev.map((p, i) =>
          i === playerIdx ? { ...p, money: p.money + 200 } : p,
        ),
      );
      setPhase("endturn");
      return;
    }

    if (sq.type === "gotojail") {
      addLog("events.teleportToJail", { player: player.name }, "event");
      playSound("jail");
      setPlayers((prev) =>
        prev.map((p, i) =>
          i === playerIdx
            ? { ...p, position: 10, inJail: true, jailTurns: 0 }
            : p,
        ),
      );
      setPhase("endturn");
      return;
    }

    if (sq.type === "jail" || sq.type === "freeparking") {
      if (sq.type === "freeparking") {
        addLog(
          "events.jackpotCollect",
          { player: player.name, amount: jackpot },
          "event",
        );
        setPlayers((prev) =>
          prev.map((p, i) =>
            i === playerIdx ? { ...p, money: p.money + jackpot } : p,
          ),
        );
        setJackpot(500); // reset
      }
      setPhase("endturn");
      return;
    }

    if (sq.type === "tax") {
      const amount = sq.amount;
      addLog(
        "events.payTaxToJackpot",
        { player: player.name, amount },
        "money",
      );
      setPlayers((prev) =>
        prev.map((p, i) =>
          i === playerIdx ? { ...p, money: Math.max(0, p.money - amount) } : p,
        ),
      );
      setJackpot((jp) => jp + amount);
      setPhase("endturn");
      return;
    }

    if (sq.type === "chance") {
      const card = POWER_CARDS[Math.floor(Math.random() * POWER_CARDS.length)];
      playSound("success");
      setActiveCard({ ...card, source: "chance" });
      setPhase("card");
      return;
    }

    if (sq.type === "chest") {
      const card = CHAOS_CARDS[Math.floor(Math.random() * CHAOS_CARDS.length)];
      playSound("chaos");
      setActiveCard({ ...card, source: "chest" });
      setPhase("card");
      return;
    }

    if (
      sq.type === "property" ||
      sq.type === "railroad" ||
      sq.type === "utility"
    ) {
      const owner = propOwners[squareId];
      if (owner === undefined) {
        // Can buy
        if (player.money >= sq.price) {
          setPendingBuy({ squareId, price: sq.price });
          setPhase("buydecision");
        } else {
          addLog(
            "events.cannotBuy",
            { player: player.name, square: sq.name },
            "normal",
          );
          setPhase("endturn");
        }
      } else if (owner === playerIdx) {
        addLog("events.ownProperty", { player: player.name }, "normal");
        setPhase("endturn");
      } else {
        const rent = calcRent(squareId, diceTotal, playerIdx);
        if (rent > 0 && !player.nextTurnFree) {
          setPendingRent({ squareId, rent, ownerIdx: owner });
          setPhase("payrent");
        } else {
          if (player.nextTurnFree) {
            addLog("events.shieldUsed", { player: player.name }, "event");
            setPlayers((prev) =>
              prev.map((p, i) =>
                i === playerIdx ? { ...p, nextTurnFree: false } : p,
              ),
            );
          }
          setPhase("endturn");
        }
      }
      return;
    }

    setPhase("endturn");
  }

  function doRoll() {
    const player = players[currentIdx];
    if (!player.alive) {
      setPhase("endturn");
      return;
    }

    setAnimDice(true);
    setTimeout(() => setAnimDice(false), 600);

    // Check chaos die (30% chance)
    let d1 = rollDie();
    let d2 = rollDie();
    const isChaosRoll = Math.random() < 0.3;
    const chaosVal = isChaosRoll ? rollDie() : null;
    setChaosDie(chaosVal);

    if (player.nextDiceX3) {
      d1 = Math.min(d1 * 3, 18);
      d2 = Math.min(d2 * 3, 18);
      addLog("events.mutationActive", {}, "event");
    }

    setDice([d1, d2]);

    let total = d1 + d2;
    const backward = player.nextTurnBackward;

    setPlayers((prev) =>
      prev.map((p, i) =>
        i === currentIdx
          ? { ...p, nextDiceX3: false, nextTurnBackward: false }
          : p,
      ),
    );

    if (player.inJail) {
      if (d1 === d2) {
        addLog("events.jailEscapeDoubles", { player: player.name }, "event");
        setPlayers((prev) =>
          prev.map((p, i) =>
            i === currentIdx ? { ...p, inJail: false, jailTurns: 0 } : p,
          ),
        );
      } else if (player.jailTurns >= 2) {
        addLog(
          "events.payJailFine",
          { player: player.name, amount: 50 },
          "money",
        );
        setPlayers((prev) =>
          prev.map((p, i) =>
            i === currentIdx
              ? {
                  ...p,
                  money: Math.max(0, p.money - 50),
                  inJail: false,
                  jailTurns: 0,
                }
              : p,
          ),
        );
      } else {
        addLog(
          "events.stayInJail",
          { player: player.name, turn: player.jailTurns + 1 },
          "normal",
        );
        setPlayers((prev) =>
          prev.map((p, i) =>
            i === currentIdx ? { ...p, jailTurns: p.jailTurns + 1 } : p,
          ),
        );
        setPhase("endturn");
        return;
      }
    }

    let newPos;
    if (backward) {
      newPos = (player.position - total + 40) % 40;
      addLog(
        "events.cursedDieBackwards",
        { player: player.name, steps: total },
        "event",
      );
    } else {
      newPos = (player.position + total) % 40;
      if (newPos < player.position && !backward) {
        addLog(
          "events.passGoCollect",
          { player: player.name, amount: 200 },
          "money",
        );
        setPlayers((prev) =>
          prev.map((p, i) =>
            i === currentIdx ? { ...p, money: p.money + 200 } : p,
          ),
        );
      }
    }

    setPlayers((prev) => {
      const next = prev.map((p, i) =>
        i === currentIdx ? { ...p, position: newPos } : p,
      );
      addLog(
        "events.rollResult",
        {
          player: player.name,
          d1,
          d2,
          total,
          backward: backward ? t("events.reverseTag") : "",
          chaos: chaosVal ? t("events.chaosTag", { chaosVal }) : "",
        },
        "dice",
      );

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
        addLog(
          "events.chaosDieLose150",
          { player: p.name, amount: 150 },
          "chaos",
        );
        setPlayers((prev) =>
          prev.map((pl, i) =>
            i === pidx ? { ...pl, money: Math.max(0, pl.money - 150) } : pl,
          ),
        );
        break;
      case 2:
        addLog(
          "events.chaosDieGain100",
          { player: p.name, amount: 100 },
          "chaos",
        );
        setPlayers((prev) =>
          prev.map((pl, i) =>
            i === pidx ? { ...pl, money: pl.money + 100 } : pl,
          ),
        );
        break;
      case 3:
        const rp = (pidx + 1) % currentPlayers.length;
        addLog(
          "events.chaosDieSwap",
          { player: p.name, target: currentPlayers[rp].name },
          "chaos",
        );
        setPlayers((prev) => {
          const next = prev.map((pl) => ({ ...pl }));
          const posA = next[pidx].position;
          next[pidx].position = next[rp].position;
          next[rp].position = posA;
          return next;
        });
        break;
      case 4:
        addLog(
          "events.chaosDieAdvance6",
          { player: p.name, steps: 6 },
          "chaos",
        );
        setPlayers((prev) =>
          prev.map((pl, i) =>
            i === pidx ? { ...pl, position: (pl.position + 6) % 40 } : pl,
          ),
        );
        break;
      case 5:
        addLog("events.chaosDieShield", { player: p.name }, "chaos");
        setPlayers((prev) =>
          prev.map((pl, i) =>
            i === pidx ? { ...pl, nextTurnFree: true } : pl,
          ),
        );
        break;
      case 6:
        addLog("events.chaosDieStorm", { amount: 100 }, "chaos");
        setPlayers((prev) =>
          prev.map((pl) => ({ ...pl, money: Math.max(0, pl.money - 100) })),
        );
        setJackpot((jp) => jp + 100 * currentPlayers.length);
        break;
    }
    const sq = currentPlayers[pidx];
    setTimeout(
      () =>
        landOnSquare(
          pidx,
          currentPlayers[pidx].position,
          dice[0] + dice[1],
          currentPlayers,
        ),
      500,
    );
  }

  function applyCardEffect(card, pidx) {
    const ps = players;
    const p = ps[pidx];

    if (card.source === "chance") {
      switch (card.id) {
        case "goToGo":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, position: 0, money: pl.money + 200 } : pl,
            ),
          );
          addLog(
            "events.cardAdvanceGo",
            { player: p.name, amount: 200 },
            "move",
          );
          break;
        case "goTo5":
          setPlayers((prev) =>
            prev.map((pl, i) => (i === pidx ? { ...pl, position: 5 } : pl)),
          );
          addLog("events.cardGoNorthStation", { player: p.name }, "move");
          break;
        case "nextBackward":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, nextTurnBackward: true } : pl,
            ),
          );
          addLog("events.cardNextBackward", { player: p.name }, "event");
          break;
        case "goToJail":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx
                ? { ...pl, position: 10, inJail: true, jailTurns: 0 }
                : pl,
            ),
          );
          addLog("events.cardGoJail", { player: p.name }, "event");
          break;
        case "collect150":
          let total150 = 0;
          setPlayers((prev) => {
            const next = prev.map((pl, i) => {
              if (i !== pidx) {
                const pay = Math.min(150, pl.money);
                total150 += pay;
                return { ...pl, money: pl.money - pay };
              }
              return pl;
            });
            next[pidx] = { ...next[pidx], money: next[pidx].money + total150 };
            addLog(
              "events.cardCollect150Each",
              { player: p.name, total: total150, amount: 150 },
              "money",
            );
            return next;
          });
          break;
        case "pay200":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, money: Math.max(0, pl.money - 200) } : pl,
            ),
          );
          setJackpot((jp) => jp + 200);
          addLog("events.cardPay200", { player: p.name, amount: 200 }, "money");
          break;
        case "outOfJail":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, freeJailCards: pl.freeJailCards + 1 } : pl,
            ),
          );
          addLog("events.cardOutOfJail", { player: p.name }, "event");
          break;
        case "gain100":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, money: pl.money + 100 } : pl,
            ),
          );
          addLog(
            "events.cardGain100",
            { player: p.name, amount: 100 },
            "money",
          );
          break;
        case "back3":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx
                ? { ...pl, position: (pl.position - 3 + 40) % 40 }
                : pl,
            ),
          );
          addLog("events.cardBack3", { player: p.name, steps: 3 }, "move");
          break;
        case "nearest": {
          let pos = p.position;
          for (let s = 1; s <= 40; s++) {
            const check = (pos + s) % 40;
            const sq = SQUARE_DATA[check];
            if (
              (sq.type === "property" ||
                sq.type === "railroad" ||
                sq.type === "utility") &&
              propOwners[check] === undefined
            ) {
              setPlayers((prev) =>
                prev.map((pl, i) =>
                  i === pidx ? { ...pl, position: check } : pl,
                ),
              );
              addLog(
                "events.cardNearestProperty",
                { player: p.name, square: sq.name },
                "move",
              );
              break;
            }
          }
          break;
        }
      }
    } else {
      // CHAOS card
      switch (card.id) {
        case "allLoseHalf":
          setPlayers((prev) =>
            prev.map((pl) => ({ ...pl, money: Math.floor(pl.money / 2) })),
          );
          addLog("events.chaosCardAllLoseHalf", {}, "chaos");
          break;
        case "swapWithRichest": {
          const richest = [...players]
            .filter((_, i) => i !== pidx)
            .sort((a, b) => b.money - a.money)[0];
          if (richest) {
            setPlayers((prev) => {
              const next = prev.map((pl) => ({ ...pl }));
              const posA = next[pidx].position;
              next[pidx].position = next[richest.id].position;
              next[richest.id].position = posA;
              return next;
            });
            addLog(
              "events.chaosCardSwapRichest",
              { player: p.name, target: richest.name },
              "chaos",
            );
          }
          break;
        }
        case "destroyHouses": {
          const groups = Object.keys(GROUP_SQUARES);
          const rndGroup = groups[Math.floor(Math.random() * groups.length)];
          const ids = GROUP_SQUARES[rndGroup];
          setPropHouses((prev) => {
            const next = { ...prev };
            ids.forEach((id) => {
              delete next[id];
            });
            return next;
          });
          addLog("events.chaosCardDestroyHouses", { group: rndGroup }, "chaos");
          break;
        }
        case "gain500":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, money: pl.money + 500 } : pl,
            ),
          );
          addLog(
            "events.chaosCardGain500",
            { player: p.name, amount: 500 },
            "money",
          );
          break;
        case "leftLose300": {
          const left = (pidx - 1 + players.length) % players.length;
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === left ? { ...pl, money: Math.max(0, pl.money - 300) } : pl,
            ),
          );
          addLog(
            "events.chaosCardLeftLose300",
            { player: players[left].name, amount: 300 },
            "money",
          );
          break;
        }
        case "goMostExpensive": {
          const mostExp = SQUARE_DATA.filter(
            (sq) => sq.type === "property",
          ).sort((a, b) => b.price - a.price)[0];
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, position: mostExp.id } : pl,
            ),
          );
          addLog(
            "events.chaosCardGoMostExpensive",
            { player: p.name, square: mostExp.name },
            "chaos",
          );
          break;
        }
        case "doubleRent":
          setDoubleRentTurns(2);
          addLog("events.chaosCardDoubleRent", { turns: 2 }, "chaos");
          break;
        case "steal200each": {
          let stolen = 0;
          setPlayers((prev) => {
            const next = prev.map((pl, i) => {
              if (i !== pidx) {
                const s = Math.min(200, pl.money);
                stolen += s;
                return { ...pl, money: pl.money - s };
              }
              return pl;
            });
            next[pidx] = { ...next[pidx], money: next[pidx].money + stolen };
            addLog(
              "events.chaosCardSteal200Each",
              { player: p.name, total: stolen, amount: 200 },
              "chaos",
            );
            return next;
          });
          break;
        }
        case "nextDiceX3":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, nextDiceX3: true } : pl,
            ),
          );
          addLog("events.chaosCardNextDiceX3", { player: p.name }, "chaos");
          break;
        case "randomTeleport": {
          const rnd = Math.floor(Math.random() * 40);
          setPlayers((prev) =>
            prev.map((pl, i) => (i === pidx ? { ...pl, position: rnd } : pl)),
          );
          addLog(
            "events.chaosCardRandomTeleport",
            { player: p.name, square: SQUARE_DATA[rnd].name },
            "chaos",
          );
          break;
        }
        case "collect100each": {
          let col = 0;
          setPlayers((prev) => {
            const next = prev.map((pl, i) => {
              if (i !== pidx) {
                const s = Math.min(100, pl.money);
                col += s;
                return { ...pl, money: pl.money - s };
              }
              return pl;
            });
            next[pidx] = { ...next[pidx], money: next[pidx].money + col };
            addLog(
              "events.chaosCardCollect100Each",
              { player: p.name, amount: 100 },
              "money",
            );
            return next;
          });
          break;
        }
        case "payPerProp": {
          const ownedCount = Object.values(propOwners).filter(
            (o) => o === pidx,
          ).length;
          const charge = ownedCount * 50;
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx
                ? { ...pl, money: Math.max(0, pl.money - charge) }
                : pl,
            ),
          );
          setJackpot((jp) => jp + charge);
          addLog(
            "events.chaosCardPayPerProp",
            { player: p.name, charge, ownedCount },
            "money",
          );
          break;
        }
        case "nextTurnFree":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, nextTurnFree: true } : pl,
            ),
          );
          addLog("events.chaosCardNextTurnFree", { player: p.name }, "event");
          break;
        case "bankCharge400":
          setPlayers((prev) =>
            prev.map((pl, i) =>
              i === pidx ? { ...pl, money: Math.max(0, pl.money - 400) } : pl,
            ),
          );
          setJackpot((jp) => jp + 400);
          addLog(
            "events.chaosCardBankCharge400",
            { player: p.name, amount: 400 },
            "money",
          );
          break;
        case "backToStart":
          setPlayers((prev) =>
            prev.map((pl, i) => (i === pidx ? { ...pl, position: 0 } : pl)),
          );
          addLog("events.chaosCardBackToStart", { player: p.name }, "chaos");
          break;
        case "ghostSteal":
          if (
            players.filter((_, i) => i !== pidx && players[i].alive).length > 0
          ) {
            setPendingGhostSteal(pidx);
            setPhase("ghoststeal");
            return;
          }
          break;
        case "jackpotBonus":
          setJackpot((jp) => jp * 2);
          addLog(
            "events.chaosCardJackpotBonus",
            { amount: jackpot * 2 },
            "chaos",
          );
          break;
      }
    }
    setActiveCard(null);
    setPhase("endturn");
  }

  function buyProperty(squareId) {
    const sq = SQUARE_DATA[squareId];
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === currentIdx ? { ...p, money: p.money - sq.price } : p,
      ),
    );
    setPropOwners((prev) => ({ ...prev, [squareId]: currentIdx }));
    addLog(
      "events.buyProperty",
      { player: players[currentIdx].name, square: sq.name, price: sq.price },
      "buy",
    );
    setPendingBuy(null);
    setPhase("build");
  }

  function skipBuy() {
    addLog("events.skipBuy", { player: players[currentIdx].name }, "normal");
    setPendingBuy(null);
    setPhase("endturn");
  }

  function payRent() {
    const { rent, ownerIdx, squareId } = pendingRent;
    const sq = SQUARE_DATA[squareId];
    addLog(
      "events.payRent",
      {
        player: players[currentIdx].name,
        rent,
        owner: players[ownerIdx].name,
        square: sq.name,
      },
      "money",
    );
    const actual = Math.min(rent, players[currentIdx].money);
    setPlayers((prev) =>
      prev.map((p, i) => {
        if (i === currentIdx)
          return { ...p, money: Math.max(0, p.money - actual) };
        if (i === ownerIdx) return { ...p, money: p.money + actual };
        return p;
      }),
    );
    setPendingRent(null);
    setPhase("build");
  }

  function doEndTurn() {
    setPlayers((prev) => {
      nextTurn(prev, currentIdx);
      return prev;
    });
  }

  function buildHouse(squareId) {
    const sq = SQUARE_DATA[squareId];
    if (!sq || sq.type !== "property") return;
    if (propOwners[squareId] !== currentIdx) return;
    if (!hasMonopoly(currentIdx, sq.group)) return;
    const houses = propHouses[squareId] || 0;
    if (houses >= 5) return;
    if (players[currentIdx].money < sq.houseCost) return;
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === currentIdx ? { ...p, money: p.money - sq.houseCost } : p,
      ),
    );
    setPropHouses((prev) => ({ ...prev, [squareId]: houses + 1 }));
    addLog(
      "events.buildHouse",
      {
        player: players[currentIdx].name,
        houseType: houses === 4 ? t("events.fortress") : t("events.house"),
        square: sq.name,
      },
      "buy",
    );
  }

  const CELL_SIZE = 54;
  const BOARD_SIZE = 11 * CELL_SIZE;

  function renderSquare(sq) {
    const { r, c } = getGridPos(sq.id);
    const rotation = getSquareRotation(sq.id);
    const isCorner = [0, 10, 20, 30].includes(sq.id);
    const owner = propOwners[sq.id];
    const ownerColor = owner !== undefined ? PLAYER_CONFIGS[owner].color : null;
    const houses = propHouses[sq.id] || 0;
    const groupColor = sq.group ? GROUP_COLORS[sq.group] : null;

    const playersHere = players.filter((p) => p.position === sq.id && p.alive);
    const ghostsHere = players.filter((p) => p.position === sq.id && p.isGhost);

    return (
      <div
        key={sq.id}
        style={{
          position: "absolute",
          left: c * CELL_SIZE,
          top: r * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE,
          border: "1px solid #1a2a3a",
          boxSizing: "border-box",
          background: ownerColor ? `${ownerColor}22` : "#0a1520",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "default",
        }}
      >
        {/* Color stripe */}
        {groupColor && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: groupColor,
              boxShadow: `0 0 6px ${groupColor}`,
            }}
          />
        )}
        {/* Owner dot */}
        {ownerColor && (
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: ownerColor,
              boxShadow: `0 0 5px ${ownerColor}`,
            }}
          />
        )}
        {/* Houses */}
        {houses > 0 && (
          <div
            style={{
              position: "absolute",
              top: 9,
              left: 2,
              fontSize: 8,
              color: "#0f0",
            }}
          >
            {houses === 5 ? "🏰" : "🏠".repeat(houses)}
          </div>
        )}
        {/* Content */}
        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            textAlign: "center",
            padding: "0 2px",
            marginTop: groupColor ? 6 : 0,
            width: "100%",
          }}
        >
          {isCorner ? (
            <div style={{ fontSize: 18 }}>{sq.icon || sq.name.slice(0, 2)}</div>
          ) : (
            <>
              <div
                style={{
                  fontSize: 6,
                  color: "#8899aa",
                  lineHeight: 1.1,
                  wordBreak: "break-word",
                }}
              >
                {sq.name}
              </div>
              {sq.price > 0 && (
                <div style={{ fontSize: 7, color: "#44ccff", marginTop: 1 }}>
                  ${sq.price}
                </div>
              )}
            </>
          )}
        </div>
        {/* Player tokens */}
        {playersHere.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 2,
              left: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {playersHere.map((p) => (
              <div
                key={p.id}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: p.color,
                  boxShadow: `0 0 4px ${p.glow}`,
                  fontSize: 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p.emoji}
              </div>
            ))}
            {ghostsHere.map((p) => (
              <div key={`g${p.id}`} style={{ fontSize: 8, opacity: 0.6 }}>
                👻
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const getSquareInfo = (squareType) => {
    return (
      squareInfo[squareType] || t("unknownSquare", { returnObjects: true })
    );
  };

  function renderCenter() {
    const p = players[currentIdx];
    if (!p) return null;
    const logColors = {
      normal: "#8899aa",
      money: "#44ffaa",
      event: "#ff9944",
      chaos: "#ff4488",
      dice: "#44aaff",
      move: "#aaffaa",
      buy: "#ffdd44",
    };

    return (
      <div
        style={{
          position: "absolute",
          left: CELL_SIZE + 1,
          top: CELL_SIZE + 1,
          width: 9 * CELL_SIZE - 2,
          height: 9 * CELL_SIZE - 2,
          background: "#060e18",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 2 }}>
          <div
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 22,
              fontWeight: 900,
              background: "linear-gradient(90deg, #ff4488, #44aaff, #44ff88)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 3,
              textShadow: "none",
            }}
          >
            RAULOPOLY
          </div>
          {doubleRentTurns > 0 && (
            <div
              style={{ fontSize: 9, color: "#ff4444", fontFamily: "monospace" }}
            >
              🔥 ALQUILERES x2 ({doubleRentTurns} turnos)
            </div>
          )}
        </div>

        {/* Players */}
        <div
          style={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {players.map((pl, i) => (
            <div
              key={pl.id}
              style={{
                background: i === currentIdx ? `${pl.color}22` : "#0a1520",
                border: `1px solid ${i === currentIdx ? pl.color : "#1a2a3a"}`,
                borderRadius: 6,
                padding: "3px 6px",
                textAlign: "center",
                minWidth: 58,
                boxShadow: i === currentIdx ? `0 0 8px ${pl.glow}` : "none",
                opacity: pl.alive ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: 13 }}>{pl.isGhost ? "👻" : pl.emoji}</div>
              <div
                style={{
                  fontSize: 8,
                  color: pl.color,
                  fontFamily: '"Orbitron", sans-serif',
                }}
              >
                {pl.name.slice(0, 8)}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#44ffaa",
                  fontFamily: "monospace",
                }}
              >
                ${pl.money}
              </div>
              {pl.freeJailCards > 0 && (
                <div style={{ fontSize: 7, color: "#ffdd44" }}>
                  🗝️x{pl.freeJailCards}
                </div>
              )}
              {pl.nextTurnFree && (
                <div style={{ fontSize: 7, color: "#44ffaa" }}>🛡️</div>
              )}
            </div>
          ))}
        </div>

        {/* Dice */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[dice[0], dice[1]].map((d, i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 32,
                background: "#0a2030",
                border: "2px solid #44aaff",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: animDice ? "0 0 15px #44aaff" : "0 0 4px #44aaff44",
                transition: "all 0.2s",
                transform: animDice
                  ? "rotate(20deg) scale(1.2)"
                  : "rotate(0deg) scale(1)",
              }}
            >
              {["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][d]}
            </div>
          ))}
          {chaosDie !== null && (
            <div
              style={{
                width: 32,
                height: 32,
                background: "#2a0a20",
                border: "2px solid #ff4488",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 0 12px #ff4488",
              }}
            >
              {["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][chaosDie]}
            </div>
          )}
          {chaosDie !== null && (
            <div style={{ fontSize: 8, color: "#ff4488" }}>
              ¡Dado
              <br />
              del Caos!
            </div>
          )}
        </div>

        {/* ACTION AREA */}
        <div style={{ textAlign: "center", width: "100%" }}>
          {phase === "roll" && !p.isGhost && (
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: p.color,
                  marginBottom: 4,
                  fontFamily: '"Orbitron", sans-serif',
                }}
              >
                Turno de {p.emoji} {p.name}
              </div>
              {/* Timer bar */}
              <div
                style={{
                  width: "100%",
                  marginBottom: 6,
                  background: "#000",
                  border: "1px solid #444",
                  borderRadius: 2,
                  height: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(turnTimer / 60) * 100}%`,
                    height: "100%",
                    background:
                      turnTimer > 20
                        ? "#44ff88"
                        : turnTimer > 10
                          ? "#ffaa00"
                          : "#ff4444",
                    transition: "width 0.3s, background 0.3s",
                  }}
                ></div>
              </div>
              <div style={{ fontSize: 8, color: "#8899aa", marginBottom: 6 }}>
                {t("turnTime")} {turnTimer}s
              </div>
              <button onClick={doRoll} style={btnStyle("#44aaff")}>
                🎲 {t("rollDice")}
              </button>
            </div>
          )}
          {phase === "roll" && p.isGhost && (
            <div>
              <div style={{ fontSize: 10, color: "#ff8888" }}>
                👻 {p.name} es un FANTASMA. Elige a quién molestar:
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                {players
                  .filter((_, i) => i !== currentIdx && players[i].alive)
                  .map((pl) => (
                    <button
                      key={pl.id}
                      style={btnStyle(pl.color, true)}
                      onClick={() => {
                        addLog(
                          "events.ghostHaunt",
                          { ghost: p.name, target: pl.name, amount: 150 },
                          "chaos",
                        );
                        setPlayers((prev) =>
                          prev.map((x, i) =>
                            i === pl.id
                              ? { ...x, money: Math.max(0, x.money - 150) }
                              : x,
                          ),
                        );
                        doEndTurn();
                      }}
                    >
                      {pl.emoji} {pl.name}
                    </button>
                  ))}
                <button style={btnStyle("#666", true)} onClick={doEndTurn}>
                  Pasar
                </button>
              </div>
            </div>
          )}
          {phase === "buydecision" && pendingBuy && (
            <div>
              <div style={{ fontSize: 10, color: "#ffdd44", marginBottom: 4 }}>
                ¿Comprar{" "}
                <strong>{SQUARE_DATA[pendingBuy.squareId].name}</strong> por $
                {pendingBuy.price}?
              </div>
              <div
                style={{ display: "flex", gap: 6, justifyContent: "center" }}
              >
                <button
                  onClick={() => buyProperty(pendingBuy.squareId)}
                  style={btnStyle("#44ffaa")}
                >
                  💰 COMPRAR
                </button>
                <button onClick={skipBuy} style={btnStyle("#ff4444")}>
                  ❌ Pasar
                </button>
              </div>
            </div>
          )}
          {phase === "payrent" && pendingRent && (
            <div>
              <div style={{ fontSize: 10, color: "#ff8888", marginBottom: 4 }}>
                {t("events.payRentPrompt", {
                  rent: pendingRent.rent,
                  owner: players[pendingRent.ownerIdx]?.name,
                })}
                {players[currentIdx].freeJailCards > 0 &&
                  ` ${t("events.jailShieldNoUse")}`}
              </div>
              <button onClick={payRent} style={btnStyle("#ff4488")}>
                💸 {t("events.payRentButton")}
              </button>
            </div>
          )}
          {phase === "card" && activeCard && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>{activeCard.emoji}</div>
              <div
                style={{
                  fontSize: 10,
                  color: activeCard.source === "chest" ? "#ff4488" : "#44aaff",
                  fontFamily: '"Orbitron", sans-serif',
                }}
              >
                {t(`${getCardI18nPrefix(activeCard)}.${activeCard.id}.title`)}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#ccc",
                  margin: "2px 0",
                  lineHeight: 1.3,
                }}
              >
                {t(`${getCardI18nPrefix(activeCard)}.${activeCard.id}.text`)}
              </div>
              <button
                onClick={() => applyCardEffect(activeCard, currentIdx)}
                style={btnStyle("#ff9944")}
              >
                ⚡ EJECUTAR EFECTO
              </button>
            </div>
          )}
          {phase === "ghoststeal" && (
            <div>
              <div style={{ fontSize: 10, color: "#ff4488" }}>
                👻 {t("events.ghostStealPrompt")}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                {players
                  .filter(
                    (_, i) =>
                      i !== currentIdx &&
                      players[i].alive &&
                      Object.values(propOwners).some((o) => o === i),
                  )
                  .map((pl) => (
                    <button
                      key={pl.id}
                      style={btnStyle(pl.color, true)}
                      onClick={() => {
                        const theirProps = Object.entries(propOwners).filter(
                          ([, o]) => o === pl.id,
                        );
                        if (theirProps.length > 0) {
                          const [stolenId] =
                            theirProps[
                              Math.floor(Math.random() * theirProps.length)
                            ];
                          setPropOwners((prev) => ({
                            ...prev,
                            [stolenId]: currentIdx,
                          }));
                          addLog(
                            "events.ghostStealProperty",
                            {
                              player: players[currentIdx].name,
                              square: SQUARE_DATA[stolenId].name,
                              target: pl.name,
                            },
                            "chaos",
                          );
                        }
                        setActiveCard(null);
                        setPendingGhostSteal(null);
                        setPhase("endturn");
                      }}
                    >
                      {pl.emoji} {pl.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
          {phase === "build" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#aaffaa", marginBottom: 3 }}>
                🏗️ ¿Construir en alguna propiedad? (Si tienes monopolio)
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  maxHeight: 40,
                  overflowY: "auto",
                }}
              >
                {Object.entries(propOwners)
                  .filter(
                    ([id, o]) =>
                      o === currentIdx &&
                      SQUARE_DATA[id]?.type === "property" &&
                      hasMonopoly(currentIdx, SQUARE_DATA[id].group) &&
                      (propHouses[id] || 0) < 5,
                  )
                  .map(([id]) => (
                    <button
                      key={id}
                      style={{
                        ...btnStyle(
                          GROUP_COLORS[SQUARE_DATA[id].group] || "#888",
                          true,
                        ),
                        fontSize: 8,
                        padding: "2px 6px",
                      }}
                      onClick={() => buildHouse(Number(id))}
                    >
                      🏠 {SQUARE_DATA[id].name.slice(0, 10)}
                    </button>
                  ))}
              </div>
              <button onClick={doEndTurn} style={btnStyle("#666")}>
                ➡️ Fin del Turno
              </button>
            </div>
          )}
          {phase === "endturn" && (
            <button onClick={doEndTurn} style={btnStyle("#666")}>
              ➡️ Terminar Turno
            </button>
          )}
        </div>

        {/* Log */}
        <div
          style={{
            width: "100%",
            height: 55,
            overflowY: "auto",
            background: "#050d15",
            borderRadius: 4,
            padding: "2px 4px",
            boxSizing: "border-box",
          }}
        >
          {log.slice(0, 8).map((entry, i) => (
            <div
              key={entry.id}
              style={{
                fontSize: 8,
                color: logColors[entry.type] || "#8899aa",
                lineHeight: 1.3,
                opacity: 1 - i * 0.08,
              }}
            >
              {entry.key ? t(entry.key, entry.params) : entry.message}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const btnStyle = (color, small = false) => ({
    background: `${color}22`,
    border: `1px solid ${color}`,
    color: color,
    borderRadius: 4,
    padding: small ? "3px 8px" : "4px 12px",
    fontSize: small ? 9 : 11,
    cursor: "pointer",
    fontFamily: '"Orbitron", sans-serif',
    boxShadow: `0 0 8px ${color}44`,
    transition: "all 0.15s",
    margin: 2,
  });

  const buildOptions = useMemo(
    () =>
      Object.entries(propOwners)
        .filter(
          ([id, o]) =>
            o === currentIdx &&
            SQUARE_DATA[id]?.type === "property" &&
            hasMonopoly(currentIdx, SQUARE_DATA[id].group) &&
            (propHouses[id] || 0) < 5,
        )
        .map(([id]) => ({
          id,
          color: GROUP_COLORS[SQUARE_DATA[id].group] || "#888",
          label: SQUARE_DATA[id].name.slice(0, 10),
        })),
    [propOwners, currentIdx, propHouses],
  );

  const handleExitGame = useCallback(() => {
    if (window.confirm(t("exitConfirmation"))) setScreen("menu");
  }, [t]);

  useEffect(() => {
    if (!showHelp) return;

    helpCloseButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowHelp(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showHelp]);

  useEffect(() => {
    if (!showTutorial) return;

    tutorialCloseButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setTutorialSeen(true);
        setShowTutorial(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showTutorial]);

  // ========================= SCREENS =========================

  // Tutorial Screen
  if (tutorialVisible) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Orbitron", sans-serif',
          color: "#fff",
          padding: 20,
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <style>{`button:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 2px #44aaff;}`}</style>
        <div
          style={{
            background: "linear-gradient(135deg, #0a1525 0%, #1a0525 100%)",
            border: "2px solid #44aaff",
            borderRadius: 12,
            padding: 40,
            maxWidth: 700,
            textAlign: "center",
            boxShadow: "0 0 40px #44aaff44, inset 0 0 20px #44aaff11",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tutorial-dialog-title"
        >
          <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 20 }}>
            🔍
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#44aaff",
              marginBottom: 12,
              letterSpacing: 2,
            }}
          >
            {t("tutorialIntro")}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#8899aa",
              marginBottom: 30,
              lineHeight: 1.6,
            }}
          >
            {t("tutorialDesc")}
          </div>

          {/* Features List */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 30,
            }}
          >
            {features.map((feature, i) => (
              <div
                key={i}
                style={{
                  background: "#0a1520",
                  border: "1px solid #1a2a3a",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 11,
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>
                  {feature.title.split(" ")[0]}
                </div>
                <div
                  style={{ color: "#ccc", fontWeight: "bold", marginBottom: 4 }}
                >
                  {feature.title.split(" ").slice(1).join(" ")}
                </div>
                <div style={{ color: "#668899", fontSize: 10 }}>
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => {
                localStorage.setItem("raulopolyTutorialSeen", "true");
                setTutorialVisible(false);
                setTutorialSeen(true);
                setShowTutorial(false);
                setScreen("rules");
              }}
              style={{
                ...btnStyle("#44ff88"),
                fontSize: 14,
                padding: "10px 30px",
                width: "auto",
              }}
            >
              {t("startGame")}
            </button>
            <button
              onClick={() => {
                localStorage.setItem("raulopolyTutorialSeen", "true");
                setTutorialVisible(false);
                setTutorialSeen(true);
                setShowTutorial(false);
              }}
              style={{
                ...btnStyle("#666"),
                fontSize: 12,
                padding: "8px 20px",
                width: "auto",
              }}
            >
              {t("skipTutorial")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "winner") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020812",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Orbitron", sans-serif',
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <style>{`button:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 2px #44aaff;}`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 80 }}>{winner?.emoji}</div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              background: `linear-gradient(90deg, ${winner?.color}, #fff)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginTop: 10,
            }}
          >
            ¡{winner?.name} GANA!
          </div>
          <div style={{ color: "#aaa", marginTop: 10, fontSize: 14 }}>
            Con ${winner?.money} en el banco galáctico
          </div>
          <button
            onClick={() => setScreen("menu")}
            style={{ ...btnStyle("#44aaff"), marginTop: 30, fontSize: 14 }}
          >
            🚀 Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  if (screen === "menu") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Orbitron", sans-serif',
          flexDirection: "column",
          gap: 30,
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <style>{`button:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 2px #44aaff;}`}</style>
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={() => setLanguage("es")}
            style={{
              ...btnStyle(language === "es" ? "#44ff88" : "#334455"),
              fontSize: 12,
            }}
            aria-label="Cambiar idioma a español"
            title="Cambiar idioma a español"
          >
            ES
          </button>
          <button
            onClick={() => setLanguage("en")}
            style={{
              ...btnStyle(language === "en" ? "#44ff88" : "#334455"),
              fontSize: 12,
            }}
            aria-label="Switch language to English"
            title="Switch language to English"
          >
            EN
          </button>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            background:
              "linear-gradient(135deg, #ff4488, #44aaff, #44ff88, #ffdd44)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 8,
            textShadow: "none",
            animation: "pulse 2s infinite",
          }}
        >
          {t("title")}
        </div>
        <div style={{ color: "#8899aa", fontSize: 13, letterSpacing: 3 }}>
          {t("subtitle")}
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 600,
            fontSize: 11,
            color: "#667788",
          }}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              style={{
                background: "#0a1520",
                border: "1px solid #1a2a3a",
                borderRadius: 8,
                padding: "8px 12px",
                width: 160,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 14 }}>{feature.title}</div>
              <div style={{ fontSize: 9, marginTop: 3, color: "#556677" }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
        {hasSavedGame && (
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={loadGame}
              style={{
                ...btnStyle("#44ff88"),
                fontSize: 14,
                padding: "8px 20px",
              }}
            >
              ⏳ REANUDAR ÚTIMA PARTIDA
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("raulopolyGame");
                setHasSavedGame(false);
              }}
              style={{
                ...btnStyle("#aa4444"),
                fontSize: 12,
                padding: "6px 12px",
              }}
            >
              {t("delete")}
            </button>
          </div>
        )}
        <button
          onClick={() => setScreen("rules")}
          style={{ ...btnStyle("#44aaff"), fontSize: 16, padding: "10px 30px" }}
        >
          🚀 {t("play")}
        </button>
        <button
          onClick={() => setTutorialVisible(true)}
          style={{ ...btnStyle("#ffaa00"), fontSize: 12, padding: "8px 20px" }}
        >
          {t("tutorial")}
        </button>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.8} }`}</style>
      </div>
    );
  }

  if (screen === "rules") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Orbitron", sans-serif',
          flexDirection: "column",
          gap: 20,
          color: "#fff",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <div style={{ fontSize: 36, fontWeight: 900 }}>{t("rules")}</div>
        <div style={{ maxWidth: 600, textAlign: "left", fontSize: 14 }}>
          <ul style={{ paddingLeft: 20 }}>
            {rulesText.map((r, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setScreen("setup")}
            style={{
              ...btnStyle("#44aaff"),
              fontSize: 14,
              padding: "8px 24px",
            }}
          >
            {t("understood")}
          </button>
          <button
            onClick={() => setScreen("menu")}
            style={{
              ...btnStyle("#aa4444"),
              fontSize: 14,
              padding: "8px 24px",
            }}
          >
            {t("back")}
          </button>
        </div>
      </div>
    );
  }

  if (screen === "setup") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Orbitron", sans-serif',
          flexDirection: "column",
          gap: 20,
          color: "#fff",
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#44aaff",
            letterSpacing: 4,
          }}
        >
          {t("config")}
        </div>
        <div style={{ fontSize: 12, color: "#8899aa" }}>{t("customize")}</div>

        {/* Selección de jugadores */}
        <div
          style={{
            width: 400,
            background: "#0a1520",
            border: "1px solid #1a2a3a",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 8 }}>
            {t("players")}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setNumPlayers(n)}
                style={{
                  ...btnStyle(numPlayers === n ? "#44aaff" : "#334455"),
                  fontSize: 14,
                  padding: "6px 16px",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Nombres de jugadores */}
        <div
          style={{
            width: 400,
            background: "#0a1520",
            border: "1px solid #1a2a3a",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 8 }}>
            {t("names")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Array.from({ length: numPlayers }, (_, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span style={{ fontSize: 14 }}>{PLAYER_CONFIGS[i].emoji}</span>
                <input
                  value={playerNames[i]}
                  onChange={(e) =>
                    setPlayerNames((prev) =>
                      prev.map((n, j) => (j === i ? e.target.value : n)),
                    )
                  }
                  style={{
                    flex: 1,
                    background: "#0a1520",
                    border: `1px solid ${PLAYER_CONFIGS[i].color}`,
                    borderRadius: 4,
                    color: PLAYER_CONFIGS[i].color,
                    padding: "4px 8px",
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: 10,
                    outline: "none",
                  }}
                  placeholder={`Jugador ${i + 1}`}
                  maxLength={12}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botón para mostrar/ocultar configuración avanzada */}
        <button
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          style={{ ...btnStyle("#ffaa00"), fontSize: 12, padding: "6px 16px" }}
        >
          {showAdvancedSettings ? "⌄" : "⌃"} {t("advancedSettings")}
        </button>

        {/* Configuración avanzada */}
        {showAdvancedSettings && (
          <div
            style={{
              width: 400,
              background: "#0a1520",
              border: "1px solid #aa6600",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#ff9966",
                marginBottom: 12,
                fontWeight: "bold",
              }}
            >
              Reglas personalizadas:
            </div>

            {/* Dinero inicial */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#8899aa", marginBottom: 4 }}>
                {t("initialMoney")}: ${initialMoney}
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={initialMoney}
                onChange={(e) => setInitialMoney(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            {/* Multiplicador de alquiler */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#8899aa", marginBottom: 4 }}>
                {t("rentMultiplier")}: x{rentMultiplier.toFixed(1)}
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rentMultiplier}
                onChange={(e) => setRentMultiplier(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            {/* Probabilidad de Caos */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, color: "#8899aa", marginBottom: 4 }}>
                {t("chaosChance")}: {(chaosChance * 100).toFixed(0)}%
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={chaosChance}
                onChange={(e) => setChaoschance(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={startGame}
            style={{
              ...btnStyle("#44ff88"),
              fontSize: 14,
              padding: "8px 24px",
            }}
          >
            🚀 {t("start")}
          </button>
          <button
            onClick={() => setScreen("rules")}
            style={{
              ...btnStyle("#aa4444"),
              fontSize: 14,
              padding: "8px 24px",
            }}
          >
            {t("back")}
          </button>
        </div>
      </div>
    );
  }

  // ========================= GAME SCREEN =========================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020812",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        boxSizing: "border-box",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
        rel="stylesheet"
      />
      <style>{`button:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 2px #44aaff;}`}</style>
      {/* Help Modal */}
      {showHelp && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#00000088",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{
              background: "#0a1525",
              border: "2px solid #44aaff",
              borderRadius: 8,
              padding: 20,
              maxWidth: 400,
              maxHeight: "80vh",
              overflowY: "auto",
              fontFamily: '"Orbitron", sans-serif',
              color: "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                marginBottom: 12,
                color: "#44aaff",
              }}
            >
              {t("helpTitle")}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                fontSize: 11,
              }}
            >
              {Object.entries(squareInfo).map(([key, info]) => (
                <div
                  key={key}
                  style={{
                    background: "#0a2030",
                    border: "1px solid #1a3a4a",
                    borderRadius: 4,
                    padding: 8,
                  }}
                >
                  <div
                    style={{
                      color: "#44ff88",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    {info.name}
                  </div>
                  <div
                    style={{ color: "#a8b8cc", fontSize: 10, lineHeight: 1.35 }}
                  >
                    {info.desc}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowHelp(false)}
              style={{ ...btnStyle("#44aaff"), marginTop: 12, width: "100%" }}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
      {/* Top-right controls */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          display: "flex",
          gap: 8,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setShowHelp(!showHelp)}
          style={{ ...btnStyle("#ffaa00"), fontSize: 14 }}
        >
          {t("help")}
        </button>
        <button
          onClick={() => setLanguage("es")}
          style={{
            ...btnStyle(language === "es" ? "#44ff88" : "#334455"),
            fontSize: 11,
          }}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage("en")}
          style={{
            ...btnStyle(language === "en" ? "#44ff88" : "#334455"),
            fontSize: 11,
          }}
        >
          EN
        </button>
      </div>
      <div
        style={{
          position: "relative",
          width: BOARD_SIZE,
          height: BOARD_SIZE,
          flexShrink: 0,
        }}
      >
        {/* Board border glow */}
        <div
          style={{
            position: "absolute",
            inset: -2,
            border: "2px solid #44aaff",
            boxShadow: "0 0 20px #44aaff44, inset 0 0 20px #44aaff11",
            borderRadius: 4,
            pointerEvents: "none",
          }}
        />
        {/* Squares */}
        {SQUARE_DATA.map((sq) => renderSquare(sq))}
        {/* Center panel */}
        {renderCenter()}
      </div>

      {/* Right panel - property list */}
      <div
        style={{
          marginLeft: 12,
          width: 200,
          height: BOARD_SIZE,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 10,
            color: "#44aaff",
            marginBottom: 4,
          }}
        >
          {t("propertyMap")}
        </div>
        {Object.entries(GROUP_SQUARES).map(([group, ids]) => (
          <div
            key={group}
            style={{
              background: "#0a1520",
              border: `1px solid ${GROUP_COLORS[group]}44`,
              borderLeft: `3px solid ${GROUP_COLORS[group]}`,
              borderRadius: 4,
              padding: "4px 6px",
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: GROUP_COLORS[group],
                fontFamily: '"Orbitron", sans-serif',
                marginBottom: 2,
              }}
            >
              {group.toUpperCase()}
            </div>
            {ids.map((id) => {
              const owner = propOwners[id];
              const houses = propHouses[id] || 0;
              const sq = SQUARE_DATA[id];
              return (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    marginBottom: 1,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background:
                        owner !== undefined
                          ? PLAYER_CONFIGS[owner].color
                          : "#333",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 7,
                      color: owner !== undefined ? "#ccc" : "#445566",
                      flex: 1,
                    }}
                  >
                    {sq.name}
                  </div>
                  {houses > 0 && (
                    <div style={{ fontSize: 7, color: "#44ff88" }}>
                      {houses === 5 ? "🏰" : `🏠${houses}`}
                    </div>
                  )}
                  {owner !== undefined && (
                    <div style={{ fontSize: 9 }}>
                      {PLAYER_CONFIGS[owner].emoji}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {/* Railroads + Utilities */}
        <div
          style={{
            background: "#0a1520",
            border: "1px solid #334455",
            borderRadius: 4,
            padding: "4px 6px",
          }}
        >
          <div
            style={{
              fontSize: 8,
              color: "#888",
              fontFamily: '"Orbitron", sans-serif',
              marginBottom: 2,
            }}
          >
            {t("otherProperties")}
          </div>
          {[...RAILROADS, ...UTILITIES].map((id) => {
            const owner = propOwners[id];
            const sq = SQUARE_DATA[id];
            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  marginBottom: 1,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      owner !== undefined
                        ? PLAYER_CONFIGS[owner].color
                        : "#333",
                  }}
                />
                <div
                  style={{
                    fontSize: 7,
                    color: owner !== undefined ? "#ccc" : "#445566",
                    flex: 1,
                  }}
                >
                  {sq.name}
                </div>
                {owner !== undefined && (
                  <div style={{ fontSize: 9 }}>
                    {PLAYER_CONFIGS[owner].emoji}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => {
            if (window.confirm(t("exitConfirmation"))) setScreen("menu");
          }}
          style={{ ...btnStyle("#333", true), marginTop: 8, width: "100%" }}
        >
          {t("exit")}
        </button>
        <button
          onClick={() => setLanguage("es")}
          style={{
            ...btnStyle(language === "es" ? "#44ff88" : "#334455"),
            fontSize: 11,
          }}
          aria-label="Cambiar idioma a español"
          title="Cambiar idioma a español"
        >
          ES
        </button>
        <button
          onClick={() => setLanguage("en")}
          style={{
            ...btnStyle(language === "en" ? "#44ff88" : "#334455"),
            fontSize: 11,
          }}
          aria-label="Switch language to English"
          title="Switch language to English"
        >
          EN
        </button>
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
        centerPanel={
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
        }
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
