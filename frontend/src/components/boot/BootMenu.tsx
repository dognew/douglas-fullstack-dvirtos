import { useEffect, useState, useMemo } from 'react';

/**
 * Hardware Specifications Interface
 */
export interface HardwareSpecs {
  storage?: string;
  cpu?: string;
  ram?: string;
  motherboard?: string;
}

/**
 * Boot Menu Component
 * Responsibility: Handles boot device selection logic (BIOS Stage).
 */
export default function BootMenu({ 
  specs, 
  onBootSuccess, 
  onBootError, 
  onExit 
}: { 
  specs: HardwareSpecs, // Fixed: Removed duplicate 'specs: any'
  onBootSuccess: () => void, 
  onBootError: () => void,
  onExit: () => void
}) {
  /**
   * Memoized device list to prevent unnecessary re-renders in useEffect
   */
  const bootDevices = useMemo(() => [
    { id: 'removable', name: 'Removable Dev.' },
    { id: 'hard_drive', name: `+Hard Drive: ${specs?.storage || 'Unknown Disk'}` },
    { id: 'cdrom', name: 'CD-ROM Drive' },
    { id: 'network', name: 'Network Boot' }
  ], [specs?.storage]);

  const [selectedIndex, setSelectedIndex] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page scrolling
      if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : bootDevices.length - 1));
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev < bootDevices.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        // Boot Validation logic
        if (bootDevices[selectedIndex].id === 'hard_drive') {
          onBootSuccess();
        } else {
          onBootError();
        }
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onBootSuccess, onBootError, onExit, bootDevices]);

  return (
    <div className="h-screen w-full bg-black/80 flex items-center justify-center font-mono select-none">
      <div className="bg-[#0000AA] border-4 border-gray-400 p-2 w-[500px] shadow-[10px_10px_0px_rgba(0,0,0,0.5)]">
        <div className="bg-gray-400 text-[#0000AA] font-bold text-center py-1 mb-4 uppercase">
          Please select boot device:
        </div>

        <div className="space-y-1 px-4 text-white uppercase">
          {bootDevices.map((device, index) => (
            <div 
              key={device.id}
              className={`flex items-center px-2 py-0.5 ${index === selectedIndex ? 'bg-gray-100 text-[#0000AA]' : ''}`}
            >
              <span>{device.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-400 pt-2 text-xs text-center text-gray-300">
          Use [↑/↓] to select, [ENTER] to boot, [ESC] to reboot.
        </div>
      </div>
    </div>
  );
}