import { useEffect, useState } from 'react';

export default function PlymouthScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing kernel...');

  useEffect(() => {
    const messages = [
      'Loading initial ramdisk...',
      'Detecting hardware modules...',
      'Mounting root filesystem...',
      'Starting systemd services...',
      'Initializing graphics driver...',
      'Starting Desktop Manager...'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (messages.length * 5));
        const msgIndex = Math.min(Math.floor((next / 100) * messages.length), messages.length - 1);
        setStatus(messages[msgIndex]);

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800); 
          return 100;
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center select-none font-sans">
      
      {/* Central Logo and Spinner Container */}
      <div className="mb-16 relative">
        {/* Animated Gold Ring */}
        <div className="w-32 h-32 border-2 border-[#B87C00]/20 border-t-[#FCF87C] rounded-full animate-spin shadow-[0_0_20px_rgba(208,152,12,0.2)]"></div>
        
        {/* Placeholder for your Gold Dog Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#E4C844] font-bold text-4xl drop-shadow-[0_0_10px_rgba(228,200,68,0.5)]">D</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-72 space-y-6 text-center">
        <div className="h-1.5 w-full bg-[#B87C00]/10 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-[#B87C00] via-[#FCF87C] to-[#B87C00] transition-all duration-300 ease-out shadow-[0_0_15px_rgba(252,248,124,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text with Gold Palette */}
        <div className="space-y-1">
          <p className="text-[#E4C844] font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
            {status}
          </p>
          <p className="text-white/20 font-mono text-[9px] uppercase tracking-widest">
            System loading {Math.round(progress)}%
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2">
        <div className="h-px w-8 bg-[#B87C00]/30"></div>
        <span className="text-[10px] text-white/30 font-mono tracking-[0.4em] uppercase">
          D-VirtOS <span className="text-[#D0980C]/50">Plymouth</span>
        </span>
      </div>
    </div>
  );
}