import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Context & Admin
import { SessionProvider, useSession } from './context/SessionContext';
// import { AdminShell } from './components/admin/AdminShell';
// import { useAdminKeys } from './hooks/useAdminKeys';
import { AdminShell } from './components/admin/AdminShell';
import { useAdminKeys } from './hooks/useAdminKeys';

// Your Components
import BiosScreen from './components/boot/BiosScreen';
import BiosSetup from './components/bios/BiosSetup';
import BootMenu from './components/boot/BootMenu';
import BootError from './components/boot/BootError';
import GrubScreen from './components/boot/GrubScreen';
import PlymouthScreen from './components/boot/PlymouthScreen';
import LoginScreen from './components/boot/LoginScreen';

function SystemBootstrap() {
  const { state, setStage, setSelectedOS, reboot, logoff } = useSession();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Backdoor trigger: Ctrl + Alt + S
  useAdminKeys(() => setIsAdminOpen(prev => !prev));

  const { stage, selectedOS } = state.boot;
  const { specs, loading } = state.hardware;

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
        <BiosSetup specs={specs} onExit={reboot} />
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
        <GrubScreen onSelect={(osId) => {
          setSelectedOS(osId);
          setStage('PLYMOUTH');
        }} />
      )}

      {stage === 'PLYMOUTH' && (
        <PlymouthScreen
          selectedOS={selectedOS}
          onComplete={() => setStage('LOGIN')} 
        />
      )}

      {stage === 'LOGIN' && (
        <LoginScreen 
          onComplete={() => setStage('DESKTOP')} 
          onReboot={reboot} 
        />
      )}

      {stage === 'DESKTOP' && (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#000000] relative overflow-hidden font-ubuntu">
          {/* ... Seu Layout do Desktop Mantido ... */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B87C00]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D0980C]/50 blur-[120px] rounded-full" />

          <div className="z-10 text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-7xl font-bold text-[#FCF87C] drop-shadow-[0_0_20px_rgba(228,200,68,0.3)] tracking-tighter">
                D-VirtOS
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#E4C844] to-transparent mx-auto" />
            </div>

            <p className="text-[#E4C844]/60 font-mono tracking-[0.5em] uppercase text-sm animate-pulse">
              {selectedOS === 'dvirtos' ? 'Environment Authenticated' : `System Loaded: ${selectedOS}`}
            </p>
            
            <div className="flex gap-4 justify-center mt-12 bg-transparent">
              <button onClick={logoff} className="px-6 py-2 border border-[#B87C00]/40 text-[#B87C00] hover:bg-[#FCF87C] hover:text-black transition-all duration-500 text-xs tracking-widest uppercase rounded-full flex items-center gap-2">
                <i className="bi bi-box-arrow-right"></i> Logoff
              </button>

              <button onClick={reboot} className="px-6 py-2 border border-red-900/40 text-red-500/70 hover:bg-red-700 hover:text-white transition-all duration-500 text-xs tracking-widest uppercase rounded-full flex items-center gap-2">
                <i className="bi bi-arrow-clockwise"></i> Reboot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The Admin Backdoor Layer */}
      <AdminShell isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <SystemBootstrap />
    </SessionProvider>
  );
}