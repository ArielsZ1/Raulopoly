import { useState, useCallback, useEffect, useRef } from "react";

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

  const addLog = useCallback((msg, type = 'normal') => {
    setLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev].slice(0, 30));
  }, []);

  function startGame() {
    const ps = createPlayers(numPlayers);
    ps.forEach((p, i) => { p.name = playerNames[i] || PLAYER_CONFIGS[i].name; });
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
      setActiveCard({ ...card, source: 'chance' });
      setPhase('card');
      return;
    }

    if (sq.type === 'chest') {
      const card = CHAOS_CARDS[Math.floor(Math.random() * CHAOS_CARDS.length)];
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
        setPlayers(prev => prev.map((p, i) => i === currentIdx ? { ...p, jailTurns: p.jailTurns + 1 } : p));
        setPhase('endturn');
        return;
      }
    }

    if (backward) total = -total;

    let newPlayers = players.map(p => ({ ...p }));
    newPlayers[currentIdx].position = ((newPlayers[currentIdx].position + total) % 40 + 40) % 40;
    if (total > 0 && newPlayers[currentIdx].position < players[currentIdx].position) {
      // passed GO
      newPlayers[currentIdx].money += 200;
      addLog(`🚀 ${newPlayers[currentIdx].name} pasa por SALIDA y cobra $200.`, 'money');
    }

    setPlayers(newPlayers);
    landOnSquare(currentIdx, newPlayers[currentIdx].position, Math.abs(total), newPlayers);

    if (d1 !== d2) {
      // not doubles -> next player
      setTimeout(() => nextTurn(newPlayers, currentIdx), 500);
    } else {
      addLog(`🎲 ${player.name} sacó DOBLES y juega de nuevo!`, 'event');
    }
  }

  // Render simplified UI for now (this file is long, original has full UI)
  return (
    <div style={{ padding: 20 }}>
      <h1>Raulopoly</h1>
      {screen === 'menu' && (
        <div>
          <label>Jugadores: </label>
          <input type="number" value={numPlayers} min={2} max={4} onChange={e => setNumPlayers(Number(e.target.value))} />
          <button onClick={startGame}>Empezar</button>
        </div>
      )}
      {screen === 'game' && (
        <div>
          <p>Turno de: {players[currentIdx]?.name || '—'}</p>
          <button onClick={doRoll}>Lanzar Dados</button>
        </div>
      )}
      {screen === 'winner' && (
        <div>
          <h2>Ganador: {winner?.name}</h2>
          <button onClick={() => setScreen('menu')}>Volver al menú</button>
        </div>
      )}
    </div>
  );
}
