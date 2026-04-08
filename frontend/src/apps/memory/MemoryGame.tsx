import { useState, useEffect } from 'react';
import { Window } from '../../system/window/Window';

/**
 * App: MemoryGame (v1.1.5)
 * Responsibility: Memory game using Bootstrap Icons.
 * Updates: Victory debug shortcut (Shift + V) and Loss debug (Shift + G).
 */
const MemoryGame = ({ onClose, onMinimize, isMinimized, zIndex }: any) => {
  const [cards, setCards] = useState<{ id: number, icon: string, flipped: boolean, solved: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const iconPool = [
    'bi-alarm', 'bi-apple', 'bi-archive', 'bi-bandaid', 'bi-bell', 'bi-bicycle', 'bi-book', 'bi-bug',
    'bi-camera', 'bi-cart', 'bi-cloud', 'bi-controller', 'bi-cpu', 'bi-cup', 'bi-diamond', 'bi-dice-5',
    'bi-egg', 'bi-envelope', 'bi-eye', 'bi-fire', 'bi-flower1', 'bi-gear', 'bi-gift', 'bi-globe',
    'bi-heart', 'bi-house', 'bi-image', 'bi-key', 'bi-lamp', 'bi-lightning', 'bi-moon', 'bi-music-note'
  ];

  const initGame = () => {
    const pairs = [...iconPool, ...iconPool].map((icon, index) => ({
      id: index,
      icon: icon,
      flipped: false,
      solved: false
    }));

    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    setCards(pairs);
    setScore(0);
    setSelected([]);
    setGameFinished(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Debug Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + V: Force Victory
      if (e.shiftKey && e.key.toLowerCase() === 'v') {
        setScore(100);
        setGameFinished(true);
      }
      // Shift + G: Force Loss
      if (e.shiftKey && e.key.toLowerCase() === 'g') {
        setScore(-10); // Garante a tela de derrota
        setGameFinished(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFlip = (clickedCard: any) => {
    if (selected.length === 2 || clickedCard.flipped || clickedCard.solved) return;

    const newCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, flipped: true } : card
    );
    setCards(newCards);

    const newSelected = [...selected, clickedCard.id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard?.icon === secondCard?.icon) {
        setTimeout(() => {
          setCards(prev => {
            const updated = prev.map(c => 
              (c.id === firstId || c.id === secondId) ? { ...c, solved: true } : c
            );
            if (updated.every(c => c.solved)) setGameFinished(true);
            return updated;
          });
          setSelected([]);
          setScore(s => s + 1);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setScore(s => s - 1);
        }, 800);
      }
    }
  };

  const isWin = score > 0;
  const modalIcon = isWin ? 'bi-trophy-fill' : 'bi-emoji-frown-fill';
  const modalTitle = isWin ? 'Vitória!' : 'Tente Novamente!';
  const modalColor = isWin ? 'text-[#FCF87C]' : 'text-orange-500';

  return (
    <Window 
      title="Jogo da Memória" 
      initialW={480} 
      initialH={600} 
      onClose={onClose} 
      onMinimize={onMinimize}
      isMinimized={isMinimized} 
      zIndex={zIndex}
      padding={3}
      layout="flex"
      direction="flex-col"
      config={{ 
        hasTitleBar: true,
        canMaximize: false, 
        canResize: false,
        isClosable: true
      }}
    >
      {/* High-Visibility Score Board */}
      <div className="bg-black/60 border border-white/5 p-4 rounded-lg flex justify-between items-center min-h-[70px] shadow-inner w-full mb-4">
        <div className="flex flex-col">
          <span className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Current Score</span>
          <div className="text-[#FCF87C] font-mono text-3xl font-bold leading-none">
            {score < 0 ? score : `+${score}`}
          </div>
        </div>
        <button 
          onClick={initGame} 
          className="bg-white/5 px-4 py-2 rounded border border-white/10 hover:bg-[#FCF87C]/20 transition-all text-white/70 text-[10px] font-black uppercase tracking-widest"
        >
          RESTART
        </button>
      </div>

      {/* 8x8 Grid */}
      <div 
        className="grid gap-1 flex-1 w-full min-h-0 select-none" 
        style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card)}
            className={`flex items-center justify-center rounded border transition-all duration-200 aspect-square
              ${card.flipped || card.solved ? 'bg-[#FCF87C]/10 border-[#FCF87C]/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
          >
            {card.flipped || card.solved ? (
              <i className={`bi ${card.icon} text-[#FCF87C] text-sm md:text-base animate-in zoom-in-50 duration-200`}></i>
            ) : (
              <i className="bi bi-question-circle text-white/5 text-[10px]"></i>
            )}
          </button>
        ))}
      </div>

      {/* Conditional Result Modal */}
      {gameFinished && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-[#1A1A1A] border border-white/10 p-8 rounded-xl shadow-2xl text-center max-w-xs border-t-[#FCF87C]/30">
              <i className={`bi ${modalIcon} text-4xl ${modalColor} mb-4 block`}></i>
              <h2 className="text-white uppercase font-black text-xl mb-1 tracking-tighter">{modalTitle}</h2>
              <div className="bg-black/40 rounded-lg py-2 px-4 mb-6 mt-4 inline-block border border-white/5">
                <span className="text-white/40 text-[9px] uppercase block mb-1">Final Score</span>
                <span className={`text-2xl font-mono font-bold ${modalColor}`}>{score}</span>
              </div>
              <button onClick={initGame} className="w-full bg-[#FCF87C] text-black text-[11px] font-black py-4 rounded-lg hover:bg-white transition-all active:scale-95 uppercase tracking-widest">
                JOGAR NOVAMENTE
              </button>
          </div>
        </div>
      )}
    </Window>
  );
};

export default MemoryGame;