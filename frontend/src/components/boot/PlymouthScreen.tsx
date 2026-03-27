import { useEffect, useState, useMemo } from 'react';

/**
 * PlymouthScreen Component
 * Cinematic boot sequence with OS and Browser detection.
 */
export default function PlymouthScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing kernel...');
  const [activeStep, setActiveStep] = useState(0);

  // 1. Environment Detection (OS & Browser)
  const envDetails = useMemo(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    
    // OS Detection
    let os = 'tux';
    if (ua.includes('win')) os = 'windows';
    else if (ua.includes('mac')) os = 'apple';
    else if (ua.includes('android')) os = 'android2';

    // Browser Detection
    let browser = 'globe'; // Fallback
    if (ua.includes('edg')) browser = 'browser-edge';
    else if (ua.includes('chrome') && !ua.includes('edg')) browser = 'browser-chrome';
    else if (ua.includes('firefox')) browser = 'browser-firefox';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'browser-safari';

    // Store for global use
    sessionStorage.setItem('detected_os', os);
    sessionStorage.setItem('detected_browser', browser);

    return { os, browser };
  }, []);

  // 2. Boot Sequence Mapping
  const bootSteps = useMemo(() => [
    { msg: 'Loading initial ramdisk...', icon: 'cpu' },
    { msg: 'Detecting hardware modules...', icon: 'wrench-adjustable' },
    { msg: 'Mounting root filesystem...', icon: 'database' },
    { msg: 'Starting systemd services...', icon: 'gear-wide-connected' },
    { msg: 'Web Browser identified...', icon: envDetails.browser }, // New step
    { msg: 'Operation System detected...', icon: envDetails.os },
    { msg: 'Initializing graphics driver...', icon: 'gpu-card' },
    { msg: 'Starting Desktop Manager...', icon: 'display' }
  ], [envDetails]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        // Adjusted increment to account for the extra step
        const next = prev + (100 / (bootSteps.length * 10)); 
        const stepIndex = Math.min(Math.floor((next / 100) * bootSteps.length), bootSteps.length - 1);
        
        setStatus(bootSteps[stepIndex].msg);
        setActiveStep(stepIndex);

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1500);
          return 100;
        }
        return next;
      });
    }, 400); 

    return () => clearInterval(interval);
  }, [onComplete, bootSteps]);

  const renderIcon = (index: number, position: 'left' | 'center' | 'right') => {
    if (index < 0 || index >= bootSteps.length) return <div className="w-12" />;

    const styles = {
      left: 'opacity-40 scale-75 -translate-x-16 text-[#B87C00]',
      center: 'opacity-100 scale-125 z-10 text-[#FCF87C] drop-shadow-[0_0_25px_rgba(252,248,124,0.7)]',
      right: 'opacity-40 scale-75 translate-x-16 text-[#B87C00]'
    };

    return (
      <i 
        key={`${index}-${position}`}
        className={`bi bi-${bootSteps[index].icon} text-5xl transition-all duration-1000 ease-in-out ${styles[position]}`} 
      />
    );
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center select-none font-sans overflow-hidden">
      
      {/* 1. Master Logo & Spinner */}
      <div className="mb-20 relative">
        <div className="w-36 h-36 border-2 border-[#B87C00]/20 border-t-[#FCF87C] rounded-full animate-spin shadow-[0_0_30px_rgba(184,124,0,0.15)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/logo-dognew-white-gold.svg" 
            alt="D-VirtOS" 
            className="w-24 h-24 object-contain drop-shadow-[0_0_12px_rgba(228,200,68,0.5)]" 
          />
        </div>
      </div>

      {/* 2. OS/Hardware Icon Carousel */}
      <div className="h-28 flex items-center justify-center gap-16 mb-12 relative">
        {renderIcon(activeStep - 1, 'left')}
        {renderIcon(activeStep, 'center')}
        {renderIcon(activeStep + 1, 'right')}
      </div>

      {/* 3. Progress Track & Status */}
      <div className="w-80 space-y-8 text-center">
        <div className="h-1.5 w-full bg-[#B87C00]/10 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-[#B87C00] via-[#FCF87C] to-[#B87C00] transition-all duration-500 shadow-[0_0_12px_rgba(252,248,124,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-3">
          <p className="text-[#E4C844] font-mono text-[11px] uppercase tracking-[0.4em] h-4 animate-pulse">
            {status}
          </p>
          <div className="flex justify-between items-center px-1">
            <span className="text-white/10 font-mono text-[9px] uppercase tracking-widest">
              D-VirtOS Kernel Initialization
            </span>
            <span className="text-[#FCF87C]/40 font-mono text-[9px]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Minimalist Footer Branding */}
      <div className="absolute bottom-10 flex flex-col items-center gap-3">
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#D0980C]/30 to-transparent" />
        <span className="text-[10px] text-white/20 font-mono tracking-[0.5em] uppercase text-center">
          D-VIRTOS <br /> <span className="text-[#D0980C]/40">Environment Discovery</span>
        </span>
      </div>
    </div>
  );
}