import { useState, useEffect } from 'react';
import GrubBackground from './GrubBackground';
import BootTimer from '../shared/BootTimer';

interface GrubScreenProps {
  onSelect: (osId: string) => void;
}

export default function GrubScreen({ onSelect }: GrubScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(true);
  
  const menuItems = [
    { id: 'dvirtos', name: "D-VirtOS (First Edition LTS)" },
    { id: 'debian', name: "Debian GNU/Linux 13 (Trixie)" },
    { id: 'mint', name: "Linux Mint 22.3 (Zena)" },
    { id: 'biglinux', name: "Big Linux (Manjaro Based)" },
    { id: 'windows', name: "Windows 11 Professional" },
    { id: 'mac', name: "macOS Tahoe 26.4" },
    { id: 'uefi', name: "System Settings (UEFI)" }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        setShowTimer(false);
      }

      if (e.key === 'ArrowUp') {
        setSelectedIndex(p => (p > 0 ? p - 1 : menuItems.length - 1));
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(p => (p < menuItems.length - 1 ? p + 1 : 0));
      } else if (e.key === 'Enter') {
        onSelect(menuItems[selectedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelect]);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center font-sans text-[#FFFFFF]">
      <GrubBackground />

      <div className="z-10 w-full max-w-2xl bg-black/60 backdrop-blur-xl border border-[#E4C844]/20 p-8 rounded-lg shadow-[0_0_50px_rgba(184,124,0,0.2)]">
        {/* Título com Dourado Principal */}
        <h1 className="text-[#E4C844] font-bold text-xl mb-6 tracking-tight uppercase">
          DOG GRUB <span className="text-[#FFFFFF]/50 font-light">version 2.06</span>
        </h1>
        
        <div className="space-y-1 mb-8">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`px-4 py-2 cursor-pointer transition-all duration-150 rounded ${
                index === selectedIndex 
                  ? 'bg-[#B87C00]/30 border-l-4 border-[#FCF87C] text-[#FCF87C] translate-x-1 shadow-[inset_0_0_15px_rgba(228,200,68,0.1)]' 
                  : 'hover:bg-white/5 border-l-4 border-transparent text-white/70'
              }`}
            >
              {item.name}
            </div>
          ))}
        </div>

        <div className="text-sm text-white/40 border-t border-white/10 pt-4 flex justify-between items-center font-mono">
          <p>Use ↑/↓ to navigate. ENTER to boot.</p>
          
          {showTimer && (
            <div className="text-[#E4C844]">
              <BootTimer 
                seconds={5} 
                onComplete={() => onSelect(menuItems[0].id)} 
                message="Auto-boot in" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}