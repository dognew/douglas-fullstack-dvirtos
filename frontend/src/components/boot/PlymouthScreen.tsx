import { useEffect, useState, useMemo } from 'react';

/**
 * PlymouthScreen Component
 * Cinematic boot sequence with OS and Browser detection.
 * Refined for a premium, sophisticated aesthetic with balanced spacing.
 */
export default function PlymouthScreen({ onComplete, selectedOS }: { onComplete: () => void, selectedOS: string }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing kernel...');
  const [activeStep, setActiveStep] = useState(0);

  // 1. Environment Detection (OS & Browser)
  const envDetails = useMemo(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    
    // Mapping of GRUB IDs to Bootstrap/Custom Icons and Display Names
    const osConfigs: Record<string, { icon: string; name: string }> = {
      'windows': { icon: 'windows', name: 'Windows 11' },
      'mac': { icon: 'apple', name: 'macOS Tahoe' },
      'debian': { icon: 'debian', name: 'Debian 13' },
      'mint': { icon: 'linuxmint', name: 'Linux Mint' },
      'biglinux': { icon: 'biglinux', name: 'Big Linux' },
      'uefi': { icon: 'gear-wide-connected', name: 'UEFI System' },
      'dvirtos': { icon: 'cpu', name: 'D-VirtOS' }
    };

    let osIcon = 'tux';
    let osName = 'Linux Kernel';

    // Logic: If user selected a specific OS in GRUB (other than the main D-VirtOS), 
    // we use that info. Otherwise, we perform hardware detection.
    if (selectedOS && selectedOS !== 'dvirtos') {
      osIcon = osConfigs[selectedOS]?.icon || 'tux';
      osName = osConfigs[selectedOS]?.name || 'Linux Kernel';
    } else {
      // Auto-detection fallback for D-VirtOS / Default
      if (ua.includes('win')) { osIcon = 'windows'; osName = 'Windows Subsystem'; }
      else if (ua.includes('mac')) { osIcon = 'apple'; osName = 'Darwin Kernel'; }
      else if (ua.includes('android')) { osIcon = 'android2'; osName = 'Android Kernel'; }
    }

    // Browser Detection
    let browser = 'globe'; 
    if (ua.includes('edg')) browser = 'browser-edge';
    else if (ua.includes('chrome') && !ua.includes('edg')) browser = 'browser-chrome';
    else if (ua.includes('firefox')) browser = 'browser-firefox';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'browser-safari';

    // Store for global use
    sessionStorage.setItem('detected_os', osIcon);
    sessionStorage.setItem('detected_browser', browser);

    return { osIcon, osName, browser };
  }, [selectedOS]);

  // 2. Boot Sequence Mapping
  const bootSteps = useMemo(() => [
    { msg: 'Loading initial ramdisk...', icon: 'cpu' },
    { msg: 'Detecting hardware modules...', icon: 'wrench-adjustable' },
    { msg: 'Mounting root filesystem...', icon: 'database' },
    { msg: 'Starting systemd services...', icon: 'gear-wide-connected' },
    { msg: 'Web Browser identified...', icon: envDetails.browser },
    { msg: `${envDetails.osName} detected...`, icon: envDetails.osIcon },
    { msg: 'Initializing graphics driver...', icon: 'gpu-card' },
    { msg: 'Starting Desktop Manager...', icon: 'display' }
  ], [envDetails]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
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
    if (index < 0 || index >= bootSteps.length) return <div className="w-10 md:w-12" />;

    const styles = {
      left: 'opacity-30 scale-75 -translate-x-8 md:-translate-x-12 text-[#B87C00]',
      center: 'opacity-100 scale-100 z-10 text-[#FCF87C] drop-shadow-[0_0_15px_rgba(252,248,124,0.5)]',
      right: 'opacity-30 scale-75 translate-x-8 md:translate-x-12 text-[#B87C00]'
    };

    return (
      <i 
        key={`${index}-${position}`}
        className={`bi bi-${bootSteps[index].icon} text-3xl md:text-5xl flex items-center justify-center transition-all duration-1000 ease-in-out ${styles[position]}`} 
      />
    );
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center select-none font-sans overflow-hidden p-6">
      
      {/* 1. Master Logo & Spinner */}
      <div className="mb-8 md:mb-16 relative">
        <div className="w-28 h-28 md:w-36 md:h-36 border-2 border-[#B87C00]/20 border-t-[#FCF87C] rounded-full animate-spin shadow-[0_0_30px_rgba(184,124,0,0.1)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/logo-dognew-white-gold.svg" 
            alt="D-VirtOS" 
            className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_0_10px_rgba(228,200,68,0.4)]" 
          />
        </div>
      </div>

      {/* 2. OS/Browser Icon Carousel */}
      <div className="h-20 md:h-28 flex items-center justify-center gap-8 md:gap-16 mb-8 md:mb-12 relative text-[#FCF87C]">
        {renderIcon(activeStep - 1, 'left')}
        {renderIcon(activeStep, 'center')}
        {renderIcon(activeStep + 1, 'right')}
      </div>

      {/* 3. Progress Track & Status */}
      <div className="w-full max-w-md space-y-4 md:space-y-8 text-center">
        <div className="h-1 md:h-1.5 w-full bg-[#B87C00]/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#B87C00] via-[#FCF87C] to-[#B87C00] transition-all duration-500 shadow-[0_0_10px_rgba(252,248,124,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2 md:space-y-4">
          <p className="text-[#FCF87C]/90 font-mono text-[11px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] min-h-[1.2rem] animate-pulse">
            {status}
          </p>
          
          <div className="flex justify-between items-center px-1">
            <span className="text-white/30 font-mono text-[9px] md:text-xs uppercase tracking-widest">
              D-VirtOS Kernel Initializing
            </span>
            <span className="text-[#FCF87C]/50 font-mono text-[10px] md:text-sm tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Footer Branding */}
      <div className="absolute bottom-6 md:bottom-10 flex flex-col items-center gap-2 md:gap-3 w-full">
        <div className="h-[1px] w-10 md:w-16 bg-gradient-to-r from-transparent via-[#D0980C]/20 to-transparent" />
        <span className="text-[9px] md:text-xs text-white/20 font-mono tracking-[0.3em] md:tracking-[0.5em] uppercase text-center leading-relaxed">
          D-VIRTOS SYSTEM ARCHITECTURE <br /> 
          <span className="text-[#D0980C]/40 text-[7px] md:text-[10px] tracking-widest">Environment Discovery Stage</span>
        </span>
      </div>
    </div>
  );
}