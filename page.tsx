'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Users, Shield, Search, IndianRupee, ArrowRight, Copy, Check, User, Info, AlertCircle, Bus, Car, TrainFront } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAP_LOCATIONS, TRANSPORT_COSTS, REVEAL_ROUNDS } from '@/lib/game-data';

// Types
type Screen = 'splash' | 'intro' | 'mode' | 'player-count' | 'lobby' | 'rules' | 'game';

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function BengaluruYard() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerIds, setPlayerIds] = useState<string[]>([]);
  const [role, setRole] = useState<'detective' | 'mr_x'>('detective');
  const [playerCount, setPlayerCount] = useState(2);
  const [isJoined, setIsJoined] = useState(false);
  const [hubNames, setHubNames] = useState<string[]>(['']);

  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => setScreen('intro'), 5000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const generateRoom = async () => {
    const res = await fetch('/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostName: 'Hub Host', playerCount })
    });
    const data = await res.json();
    setRoomCode(data.roomCode);
    setPlayerIds([data.playerId]);
    setPlayerName('Hub Host');
    setRole('detective');
    setScreen('lobby');
  };

  const joinRoom = async () => {
    const body = role === 'mr_x' 
      ? { name: playerName, role }
      : { names: hubNames.filter(n => n.trim() !== ''), role };
      
    const res = await fetch(`/api/room/${roomCode}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    setPlayerIds(data.playerId ? [data.playerId] : data.playerIds);
    setIsJoined(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-serif overflow-hidden selection:bg-red-900 selection:text-white">
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-screen relative"
          >
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 border border-red-900 rotate-12 opacity-50" />
              <div className="absolute bottom-20 right-20 w-48 h-48 border border-red-900 -rotate-12 opacity-50" />
              <div className="absolute top-1/2 left-1/4 w-1 h-20 bg-red-900 opacity-30" />
            </div>

            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-bold text-[#8B0000] tracking-tighter drop-shadow-[0_0_15px_rgba(139,0,0,0.5)]"
            >
              BENGALURU YARD
            </motion.h1>
          </motion.div>
        )}

        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-screen p-6"
          >
            <div className="max-w-2xl w-full bg-black/60 backdrop-blur-md border border-red-900/30 p-12 rounded-lg shadow-[0_0_50px_rgba(139,0,0,0.2)]">
              <TypewriterText 
                text={`Bengaluru is in chaos.\n\nA notorious criminal known only as Mr. X has disappeared into the city.\n\nUsing Bengaluru's transport network, he continues to evade capture.\n\nA team of detectives has been assembled to track his movements.\n\nEvery clue matters.\n\nEvery decision counts.\n\nFind Mr. X before he vanishes forever.`}
                onComplete={() => {}}
              />
              <div className="mt-12 flex justify-end">
                <button
                  onClick={() => setScreen('mode')}
                  className="group flex items-center gap-2 text-[#8B0000] border border-[#8B0000] px-6 py-2 hover:bg-[#8B0000] hover:text-white transition-all duration-300"
                >
                  NEXT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'mode' && (
          <motion.div
            key="mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center h-screen gap-8"
          >
            <div className="flex flex-col gap-4">
               <button
                 onClick={() => setScreen('player-count')}
                 className="w-80 h-20 bg-black border border-red-900/50 hover:border-red-600 hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] transition-all rounded-md text-2xl tracking-widest uppercase flex items-center justify-center"
               >
                 Create Room
               </button>
               <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="ROOM CODE" 
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-black border border-red-900/30 p-4 text-white uppercase font-mono"
                  />
                  <button 
                    onClick={() => setScreen('lobby')}
                    className="bg-red-900/20 border border-red-900/50 px-6 uppercase font-bold text-xs"
                  >
                    Join
                  </button>
               </div>
            </div>
            <button
              disabled
              className="w-80 h-20 bg-black/50 border border-gray-800 text-gray-600 cursor-not-allowed rounded-md text-2xl tracking-widest uppercase flex items-center justify-center"
            >
              Single Player
            </button>
          </motion.div>
        )}

        {screen === 'player-count' && (
          <motion.div
            key="player-count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-screen gap-12"
          >
            <h2 className="text-4xl text-[#8B0000] font-bold tracking-widest">HOW MANY PLAYERS?</h2>
            
            <div className="flex flex-col items-center gap-4">
               <input 
                 type="range" 
                 min="2" 
                 max="15" 
                 value={playerCount} 
                 onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                 className="w-64 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-700"
               />
               <span className="text-6xl font-bold text-white">{playerCount}</span>
            </div>

            <button
              onClick={generateRoom}
              className="border border-[#8B0000] px-12 py-3 text-xl hover:bg-[#8B0000] transition-colors"
            >
              CREATE ROOM
            </button>
          </motion.div>
        )}

        {screen === 'lobby' && (
          <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
            {/* Left Panel: Join */}
            <div className="flex flex-col justify-center p-12 border-r border-red-900/20">
               <h3 className="text-3xl text-[#8B0000] mb-8 uppercase tracking-widest">Join Investigation</h3>
               <div className="space-y-6 max-w-sm">
                  {role === 'mr_x' ? (
                    <div>
                      <label className="block text-sm uppercase text-gray-500 mb-2 font-mono">Player Name</label>
                      <input 
                        type="text" 
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full bg-black border border-red-900/30 p-3 text-white focus:border-red-600 outline-none font-mono"
                        placeholder="ENTER NAME..."
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                       <label className="block text-sm uppercase text-gray-500 mb-2 font-mono">Detective Names</label>
                       {hubNames.map((n, i) => (
                         <input 
                           key={i}
                           type="text"
                           value={n}
                           onChange={(e) => {
                             const newNames = [...hubNames];
                             newNames[i] = e.target.value;
                             setHubNames(newNames);
                           }}
                           className="w-full bg-black border border-red-900/30 p-2 text-white font-mono text-sm"
                           placeholder={`Detective ${i+1}...`}
                         />
                       ))}
                       <button 
                         onClick={() => setHubNames([...hubNames, ''])}
                         className="text-[10px] uppercase font-bold text-red-900"
                       >
                         + Add Another Detective
                       </button>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm uppercase text-gray-500 mb-2 font-mono">Role</label>
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full bg-black border border-red-900/30 p-3 text-white focus:border-red-600 outline-none font-mono"
                    >
                      <option value="detective">Detective</option>
                      <option value="mr_x">Mr. X</option>
                    </select>
                  </div>
                  <button 
                    onClick={joinRoom}
                    className="w-full py-4 bg-[#8B0000] hover:bg-red-700 transition-colors uppercase font-bold tracking-widest"
                  >
                    Join Room
                  </button>
               </div>
            </div>

            {/* Right Panel: Room Info */}
            <div className="flex flex-col justify-center items-center p-12 bg-zinc-950/50">
               <div className="bg-black border border-red-900/30 p-12 rounded-lg text-center space-y-8">
                  <h3 className="text-xl text-gray-400 uppercase tracking-widest">Investigation Room</h3>
                  <div className="text-6xl font-bold tracking-[0.2em] text-[#8B0000]">{roomCode}</div>
                  <div className="flex gap-4 justify-center">
                    <button className="p-2 border border-red-900/30 hover:bg-red-900/20"><Copy className="w-5 h-5"/></button>
                    <button className="p-2 border border-red-900/30 hover:bg-red-900/20 font-mono text-sm px-4">SHARE QR</button>
                  </div>
                  
                  <div className="pt-8 border-t border-red-900/10">
                    <div className="text-xs text-gray-500 uppercase mb-4 font-mono">Players Connected</div>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <PlayerStatus name="Host" status="connected" />
                      {isJoined && <PlayerStatus name={playerName} status="connected" />}
                    </div>
                  </div>

                  {isJoined && (
                    <button 
                      onClick={() => setScreen('rules')}
                      className="mt-8 px-8 py-2 border border-green-900 text-green-700 hover:bg-green-900 hover:text-white transition-all uppercase text-sm font-bold"
                    >
                      Start Investigation
                    </button>
                  )}
               </div>
            </div>
          </div>
        )}

        {screen === 'rules' && (
          <motion.div
            key="rules"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-screen p-6"
          >
            <div className="max-w-3xl w-full bg-black/80 backdrop-blur-xl border border-red-900/30 p-12 rounded-lg">
              <h2 className="text-3xl text-[#8B0000] mb-8 font-bold uppercase tracking-widest text-center">Rules of the Investigation</h2>
              <div className="space-y-4 font-mono text-sm text-gray-300">
                <TypewriterText 
                  text={`- Detectives must locate and capture Mr. X.\n- Mr. X must survive until the final round.\n- Players earn money by answering questions.\n- Correct answer without options: ₹500.\n- Correct answer with options: ₹200.\n- Taxi costs ₹200, Bus costs ₹300, Metro costs ₹500.\n- If a player cannot afford transport, they skip movement.\n- Mr. X's location remains hidden except during reveal rounds.\n- Use clues wisely.`}
                  speed={20}
                />
              </div>
              <div className="mt-12 flex justify-center">
                 <button
                   onClick={() => setScreen('game')}
                   className="px-12 py-3 bg-[#8B0000] text-white hover:bg-red-700 transition-colors uppercase font-bold tracking-widest"
                 >
                   Game Begins
                 </button>
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'game' && (
          <GameView role={role} roomCode={roomCode} playerName={playerName} playerIds={playerIds} />
        )}
      </AnimatePresence>
    </div>
  );
}

function TypewriterText({ text, onComplete, speed = 40 }: { text: string; onComplete?: () => void; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <pre className="whitespace-pre-wrap font-mono leading-relaxed">{displayedText}</pre>;
}

function PlayerStatus({ name, status }: { name: string; status: 'connected' | 'waiting' | 'disconnected' }) {
  const colors = {
    connected: 'bg-green-500',
    waiting: 'bg-yellow-500',
    disconnected: 'bg-red-500',
  };
  return (
    <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded border border-white/5">
      <div className={cn("w-2 h-2 rounded-full", colors[status])} />
      <span className="text-xs uppercase font-mono">{name}</span>
    </div>
  );
}

function GameView({ role, roomCode, playerName, playerIds }: { role: 'detective' | 'mr_x', roomCode: string, playerName: string, playerIds: string[] }) {
  const [gameState, setGameState] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchState = async () => {
    try {
      const res = await fetch(`/api/room/${roomCode}`);
      const data = await res.json();
      setGameState(data);
    } catch (e) {
      console.error(e);
    }
  };

  useInterval(fetchState, 3000);
  useEffect(() => { fetchState(); }, []);

  if (!gameState) return <div className="h-screen flex items-center justify-center text-red-900 font-mono">ESTABLISHING CONNECTION...</div>;

  const { room, players: allPlayers, logs, currentQuestion } = gameState;
  const isMrX = role === 'mr_x';
  
  // Which player of mine is it? 
  // If one of my playerIds is the current turn, use that. Otherwise first one.
  const activePlayerId = playerIds.find(id => id === room.currentTurnPlayerId) || playerIds[0];
  const currentPlayer = allPlayers.find((p: any) => p.id === activePlayerId);
  const isMyTurn = playerIds.includes(room.currentTurnPlayerId);
  // The actual playerId to use for the action is the current turn one
  const actionPlayerId = room.currentTurnPlayerId;
  
  const themeClass = isMrX ? "bg-black text-white" : "bg-[#fdfdfd] text-black";

  const handleStart = async () => {
    setLoading(true);
    await fetch(`/api/room/${roomCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: actionPlayerId, actionType: 'start' })
    });
    fetchState();
    setLoading(false);
  };

  const handleAnswer = async (usedOptions: boolean) => {
    setLoading(true);
    await fetch(`/api/room/${roomCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: actionPlayerId, actionType: 'answer', data: { questionId: currentQuestion.id, answer, usedOptions } })
    });
    setAnswer('');
    setShowOptions(false);
    fetchState();
    setLoading(false);
  };

  const handleMove = async (to: string, transport: string) => {
    setLoading(true);
    await fetch(`/api/room/${roomCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: actionPlayerId, actionType: 'move', data: { to, transport } })
    });
    setSelectedTransport(null);
    fetchState();
    setLoading(false);
  };

  const isRevealRound = REVEAL_ROUNDS.includes(room.currentRound);
  const mrXPlayer = allPlayers.find((p: any) => p.role === 'mr_x');
  
  if (room.status === 'finished') {
    const winningTeam = room.gameData?.winningTeam;
    const isWin = winningTeam === role || (role === 'detective' && winningTeam === 'detectives');

    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center overflow-auto">
         <motion.h1 
           initial={{ scale: 0.5, opacity: 0 }} 
           animate={{ scale: 1, opacity: 1 }}
           className="text-8xl font-bold text-[#8B0000] mb-4 tracking-tighter"
         >
           CASE {winningTeam === 'detectives' ? 'CLOSED' : 'UNSOLVED'}
         </motion.h1>
         <h2 className="text-2xl font-mono uppercase tracking-widest mb-12">
           {winningTeam === 'detectives' ? 'MR. X HAS BEEN CAPTURED' : 'MR. X HAS ESCAPED'}
         </h2>

         <div className="max-w-2xl w-full grid grid-cols-2 gap-8 mb-12">
            <div className="bg-zinc-900/50 p-6 border border-red-900/30">
               <h3 className="text-xs uppercase text-gray-500 mb-4 font-mono">Investigation Summary</h3>
               <div className="space-y-2 text-left font-mono">
                  <div>Rounds: {room.currentRound} / 24</div>
                  <div>Mr. X Final Loc: {room.gameData.mrXLocation}</div>
               </div>
            </div>
            <div className="bg-zinc-900/50 p-6 border border-red-900/30">
               <h3 className="text-xs uppercase text-gray-500 mb-4 font-mono">Performance</h3>
               <div className="space-y-2 text-left font-mono">
                  {allPlayers.map((p: any) => (
                    <div key={p.id} className="text-xs">{p.name}: ₹{p.balance}</div>
                  ))}
               </div>
            </div>
         </div>

         <button 
           onClick={() => window.location.reload()}
           className="px-12 py-3 border border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white transition-all font-bold uppercase tracking-widest"
         >
           Return to Main Menu
         </button>
      </div>
    );
  }

  return (
    <div className={cn("h-screen w-full flex flex-col transition-colors duration-700", themeClass)}>
      {/* HUD Top Bar */}
      <div className={cn("px-6 py-4 border-b flex justify-between items-center z-10", isMrX ? "border-red-900/30 bg-black" : "border-zinc-300 bg-white")}>
        <div className="flex items-center gap-12">
          <div className="text-3xl font-bold tracking-tighter text-[#8B0000]">ROUND {String(room.currentRound).padStart(2, '0')} / 24</div>
          <div className="flex gap-6">
             <div className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded">
                <IndianRupee className="w-4 h-4 text-green-600" />
                <span className="font-mono font-bold text-lg">₹{currentPlayer?.balance || 0}</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-mono text-sm">{allPlayers.length} Active</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
             <div className="font-mono text-[10px] uppercase opacity-50">{role}</div>
             <div className="font-bold uppercase tracking-widest">{playerName}</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center border border-red-900/40">
              {role === 'mr_x' ? <Search className="w-5 h-5 text-red-600" /> : <Shield className="w-5 h-5 text-red-600" />}
           </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex">
        {/* Main Map Area */}
        <div className="flex-1 relative bg-zinc-900/5 overflow-auto p-20 cursor-grab active:cursor-grabbing">
           {/* Bengaluru Grid Background */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #8B0000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <svg className="absolute inset-0 w-[1200px] h-[1000px] pointer-events-none">
              {Object.values(MAP_LOCATIONS).map(loc => 
                loc.connections.map(conn => {
                  const to = MAP_LOCATIONS[conn.to];
                  const color = conn.type === 'metro' ? '#ef4444' : conn.type === 'bus' ? '#3b82f6' : '#eab308';
                  return (
                    <line 
                      key={`${loc.id}-${conn.to}-${conn.type}`}
                      x1={loc.x} y1={loc.y} x2={to.x} y2={to.y}
                      stroke={color} strokeWidth={conn.type === 'metro' ? 4 : 2}
                      strokeOpacity={0.2}
                    />
                  );
                })
              )}
           </svg>

           <div className="relative w-[1200px] h-[1000px]">
              {Object.values(MAP_LOCATIONS).map(loc => {
                const pAtLoc = allPlayers.filter((p: any) => p.location === loc.id);
                const isMrXHere = isMrX ? mrXPlayer?.location === loc.id : (isRevealRound && mrXPlayer?.location === loc.id);
                const canMoveHere = selectedTransport && isMyTurn && room.phase === 'movement' && 
                                   currentPlayer.location && MAP_LOCATIONS[currentPlayer.location].connections.some(c => c.to === loc.id && c.type === selectedTransport);

                return (
                  <div 
                    key={loc.id} 
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: loc.x, top: loc.y }}
                  >
                    <button 
                      disabled={!canMoveHere}
                      onClick={() => handleMove(loc.id, selectedTransport!)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center relative",
                        canMoveHere ? "border-green-500 bg-green-500/20 scale-150 shadow-[0_0_15px_rgba(34,197,94,0.5)] cursor-pointer" : "border-zinc-400 bg-white/80 group-hover:scale-110",
                        isMrXHere && "border-red-600 bg-red-600/40 ring-4 ring-red-600/20"
                      )}
                    >
                       {isMrXHere && <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />}
                       
                       {/* Detective Markers */}
                       {!isMrX && pAtLoc.filter((p:any) => p.role === 'detective').map((p:any, i:number) => (
                         <div key={p.id} className="absolute -top-8 w-4 h-4 bg-blue-600 rounded-full border border-white shadow-sm" style={{ left: i * 8 }} />
                       ))}
                    </button>
                    <div className={cn(
                      "mt-2 text-[8px] font-bold uppercase text-center whitespace-nowrap px-1 rounded",
                      isMrX ? "bg-zinc-900 text-zinc-500" : "bg-zinc-200 text-zinc-600"
                    )}>
                      {loc.name}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Side Info Panel */}
        <div className={cn("w-96 border-l flex flex-col p-8 space-y-10 z-10", isMrX ? "border-red-900/30 bg-zinc-950" : "border-zinc-300 bg-white")}>
           <div>
             <h4 className="text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50 font-bold border-b border-red-900/20 pb-2">Investigation History</h4>
             <div className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                {logs.length === 0 && <div className="text-xs font-mono italic opacity-40">No entries yet.</div>}
                {logs.slice().reverse().map((log: any) => (
                  <div key={log.id} className="text-[10px] font-mono p-3 bg-black/5 border-l-2 border-red-900/50">
                     <div className="flex justify-between mb-1">
                        <span className="text-red-900 font-bold">ROUND {log.round}</span>
                        <span className="opacity-50 uppercase">{log.transport}</span>
                     </div>
                     <div className="opacity-80">
                        {log.role === 'mr_x' ? 'MR. X' : log.playerName} moved {log.role === 'mr_x' ? 'secretly' : `to ${log.toLocation}`}
                     </div>
                  </div>
                ))}
             </div>
           </div>

           <div>
             <h4 className="text-[10px] uppercase tracking-[0.3em] mb-4 opacity-50 font-bold">Active Suspects</h4>
             <div className="space-y-3">
                {allPlayers.map((p: any) => (
                  <div key={p.id} className={cn("flex items-center gap-3 p-2 rounded", room.currentTurnPlayerId === p.id ? "bg-red-900/10 border border-red-900/20" : "")}>
                     <div className={cn("w-2 h-2 rounded-full", p.role === 'mr_x' ? "bg-red-600" : "bg-blue-600")} />
                     <div className="flex-1">
                        <div className="text-[10px] font-bold uppercase">{p.name}</div>
                        <div className="text-[8px] font-mono opacity-50">{p.role === 'mr_x' ? (isRevealRound ? p.location : 'UNKNOWN') : p.location}</div>
                     </div>
                     {room.currentTurnPlayerId === p.id && <div className="text-[8px] animate-pulse text-red-900 font-bold">ACTIVE</div>}
                  </div>
                ))}
             </div>
           </div>

           <div className="mt-auto">
             {room.status === 'waiting' && currentPlayer?.isHost && (
               <button 
                 disabled={loading}
                 onClick={handleStart}
                 className="w-full py-4 bg-[#8B0000] text-white font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
               >
                 Start Operation
               </button>
             )}
             
             <div className="p-4 border border-red-900/30 rounded bg-red-900/5">
                <div className="flex items-center gap-2 mb-2">
                   <AlertCircle className="w-4 h-4 text-[#8B0000]" />
                   <h4 className="text-[10px] uppercase font-bold text-[#8B0000]">System Update</h4>
                </div>
                <p className="text-[10px] font-mono opacity-80 leading-relaxed uppercase">
                  {room.status === 'waiting' ? 'Waiting for host to initiate sequence...' : 
                   isMyTurn ? `Your turn: ${room.phase}` : `Waiting for ${allPlayers.find((p:any) => p.id === room.currentTurnPlayerId)?.name}...`}
                </p>
             </div>
           </div>
        </div>
      </div>

      {/* Action Overlay */}
      <AnimatePresence>
        {isMyTurn && room.status === 'playing' && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-20"
          >
            <div className={cn(
              "backdrop-blur-xl border-t-4 p-8 rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]",
              isMrX ? "bg-black/90 border-red-900 border-x border-b" : "bg-white/95 border-red-700 border-x border-b shadow-2xl"
            )}>
              {room.phase === 'question' && (
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B0000] mb-2 font-mono">Sequence: Knowledge Extraction</div>
                      <h3 className="text-2xl font-bold font-serif italic text-[#8B0000]">{currentQuestion?.question}</h3>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] uppercase font-mono opacity-50 mb-1">Potential Yield</div>
                       <div className="text-xl font-bold text-green-600 font-mono">₹{showOptions ? '200' : '500'}</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                     {showOptions ? (
                        <div className="grid grid-cols-2 gap-4">
                           {currentQuestion.options.map((opt: string) => (
                             <button 
                               key={opt}
                               disabled={loading}
                               onClick={() => { setAnswer(opt); handleAnswer(true); }}
                               className={cn(
                                 "p-4 border text-left font-mono text-xs hover:bg-red-900/10 transition-colors uppercase tracking-widest",
                                 isMrX ? "border-red-900/30 hover:border-red-600" : "border-zinc-300 hover:border-red-700"
                               )}
                             >
                               {opt}
                             </button>
                           ))}
                        </div>
                     ) : (
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnswer(false)}
                            placeholder="TYPE YOUR RESPONSE..."
                            className={cn(
                              "flex-1 bg-transparent border-b-2 p-3 outline-none font-mono text-xl uppercase placeholder:opacity-20",
                              isMrX ? "border-red-900/30 text-white" : "border-zinc-300 text-black"
                            )}
                            autoFocus
                          />
                          <button 
                            disabled={loading}
                            onClick={() => handleAnswer(false)}
                            className="bg-[#8B0000] text-white px-8 py-2 font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            Submit
                          </button>
                        </div>
                     )}
                     {!showOptions && (
                        <button 
                          onClick={() => setShowOptions(true)}
                          className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 hover:text-[#8B0000] transition-colors flex items-center gap-2"
                        >
                          <Info className="w-3 h-3" /> Reveal Options (₹200 limit)
                        </button>
                     )}
                  </div>
                </div>
              )}

              {room.phase === 'movement' && (
                <div>
                   <div className="mb-6">
                      <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B0000] mb-2 font-mono">Sequence: Strategic Displacement</div>
                      <h3 className="text-2xl font-bold font-serif italic text-[#8B0000]">Select Transport Mode</h3>
                      <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Current Location: {currentPlayer?.location}</p>
                   </div>

                   <div className="grid grid-cols-3 gap-6">
                      <TransportButton 
                        type="taxi" 
                        cost={200} 
                        balance={currentPlayer?.balance} 
                        active={selectedTransport === 'taxi'}
                        onClick={() => setSelectedTransport('taxi')}
                        icon={<Car className="w-8 h-8" />}
                        dark={isMrX}
                      />
                      <TransportButton 
                        type="bus" 
                        cost={300} 
                        balance={currentPlayer?.balance} 
                        active={selectedTransport === 'bus'}
                        onClick={() => setSelectedTransport('bus')}
                        icon={<Bus className="w-8 h-8" />}
                        dark={isMrX}
                      />
                      <TransportButton 
                        type="metro" 
                        cost={500} 
                        balance={currentPlayer?.balance} 
                        active={selectedTransport === 'metro'}
                        onClick={() => setSelectedTransport('metro')}
                        icon={<TrainFront className="w-8 h-8" />}
                        dark={isMrX}
                      />
                   </div>
                   
                   {selectedTransport && (
                     <div className="mt-8 p-4 border border-dashed border-red-900/50 rounded flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-red-900 font-bold animate-pulse">Select target node on map</span>
                        <button onClick={() => setSelectedTransport(null)} className="text-[8px] uppercase font-bold opacity-50 hover:opacity-100">Cancel</button>
                     </div>
                   )}

                   {currentPlayer?.balance < 200 && (
                     <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="text-xs font-mono text-red-900 uppercase font-bold text-center">Insufficient Funds for Displacement</div>
                        <button 
                          onClick={() => handleMove(currentPlayer.location, 'taxi')}
                          className="px-8 py-2 border border-red-900/30 hover:bg-red-900/10 text-[10px] uppercase font-bold"
                        >
                          Skip Movement
                        </button>
                     </div>
                   )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TransportButton({ type, cost, balance, active, onClick, icon, dark }: any) {
  const disabled = balance < cost;
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-6 border-2 transition-all rounded-lg group gap-3 relative",
        disabled ? "opacity-30 grayscale cursor-not-allowed border-zinc-800" : "cursor-pointer",
        active ? "border-[#8B0000] bg-red-900/10 shadow-[0_0_20px_rgba(139,0,0,0.2)]" : "border-zinc-800 hover:border-zinc-600",
        dark ? "" : (disabled ? "bg-zinc-100 border-zinc-200" : "")
      )}
    >
      <div className={cn("transition-transform group-hover:scale-110", active ? "text-[#8B0000]" : "text-zinc-500")}>
        {icon}
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest">{type}</div>
        <div className="text-[12px] font-mono font-bold">₹{cost}</div>
      </div>
      {disabled && (
        <div className="absolute top-2 right-2 text-[8px] font-bold text-red-600 border border-red-600 px-1 rounded uppercase">Locked</div>
      )}
    </button>
  );
}

