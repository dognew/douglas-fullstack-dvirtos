import { useState } from 'react';
import { useHardware } from './hooks/useHardware';
import BiosScreen from './components/boot/BiosScreen';
import BiosSetup from './components/bios/BiosSetup';
import BootMenu from './components/boot/BootMenu';
import BootError from './components/boot/BootError';

type BootStage = 'BIOS' | 'SETUP' | 'BOOT_MENU' | 'BOOT_ERROR' | 'GRUB' | 'DESKTOP';

export default function App() {
  const [stage, setStage] = useState<BootStage>('BIOS');
  const { specs, loading } = useHardware();

  // Function to simulate Reboot (reset state)
  const reboot = () => {
    setStage('BIOS');
    // Trigger a full page refresh to clear memory/cache
    window.location.reload();
  };

  // Show black screen while loading hardware specs
  if (loading) {
    return <div className="bg-black min-h-screen" />;
  }

  return (
    <div className="bg-black min-h-screen text-white font-mono overflow-hidden">
      
      {stage === 'BIOS' && (
        <BiosScreen
          specs={specs}
          onComplete={() => setStage('GRUB')} 
          onEnterSetup={() => setStage('SETUP')}
          onEnterBootMenu={() => setStage('BOOT_MENU')}
        />
      )}

      {stage === 'SETUP' && (
        <BiosSetup
          specs={specs}
          onExit={reboot} 
        />
      )}

      {stage === 'BOOT_MENU' && (
        <BootMenu
          specs={specs}
          onBootSuccess={() => setStage('GRUB')}
          onBootError={() => setStage('BOOT_ERROR')}
          onExit={reboot}
        />
      )}

      {stage === 'BOOT_ERROR' && (
        <BootError onReboot={reboot} />
      )}

      {stage === 'GRUB' && (
        <div className="p-10 animate-crt-flicker">
          <p className="text-blue-400">GNU GRUB version 2.06</p>
          <p className="mt-4">Carregando D-VirtOS...</p>
          <button 
            onClick={() => setStage('DESKTOP')} 
            className="mt-6 border border-white px-2 hover:bg-white hover:text-black transition-colors"
            >
            [ ENTER ]
          </button>
        </div>
      )}

      {stage === 'DESKTOP' && (
        <div className="p-20 text-center">
          <h1 className="text-4xl text-lime-500">D-VirtOS Loaded</h1>
          <p className="mt-4 text-gray-500">Work in Progress...</p>
        </div>
      )}
    </div>
  );
}