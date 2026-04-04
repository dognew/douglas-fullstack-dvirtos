import { useEffect, useState, useRef } from 'react';

export default function BootError({ onReboot }: { onReboot: () => void }) {
  const [bootAttempts, setBootAttempts] = useState<number[]>([1]);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom on every new boot attempt
   */
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [bootAttempts]);

  /**
   * Keyboard event listeners for system reboot (ESC) and retry loop (ENTER)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onReboot();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setBootAttempts(prev => [...prev, prev.length + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReboot]);

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full bg-black text-gray-300 font-mono flex flex-col p-20 select-none overflow-y-auto hide-scrollbar"
    >
      <div className="flex justify-between w-full border-b border-gray-600 pb-1 mb-8">
        <span>MEGABIOS DOGNEW (C) 2026</span>
        <span>BIOS v1.2</span>
      </div>

      <div className="space-y-6 text-xl">
        <p className="font-bold">
          DOGNEW PXE-2.0 Virt-Boot (build 012)
        </p>
        <p>
          Copyright (C) 2026 DogNew Informática, MEI. All rights reserved.
        </p>
        
        <div className="pt-10 space-y-2">
          <p className="font-bold text-white text-lg">
            Network Boot...
          </p>
          <p className="pl-4">
            PXE-E61: Media test failure, check cable
          </p>
          <p className="pl-4">
            PXE-M0F: Exiting DogNew PXE ROM.
          </p>
        </div>

        <div className="space-y-12 pt-16">
          {bootAttempts.map((attempt) => (
            <div key={attempt} className="border-t border-gray-800 pt-6 space-y-2 text-white font-bold text-center">
              <p>
                DOGNEW Virt-Boot {attempt}: Reboot and select proper boot device
              </p>
              <p>
                or insert boot media in selected boot device and press a key.
              </p>
              <p className="text-gray-400 pt-4 text-base">
                Use Enter for retry | Or press Esc key for reboot system
              </p>
            </div>
          ))}
        </div>

        <div className="h-20 w-full" />
      </div>
    </div>
  );
}