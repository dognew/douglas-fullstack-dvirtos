import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Context & Admin
import { SessionProvider, useSession } from './context/SessionContext';
import { AdminShell } from './system/admin/AdminShell';
import { useAdminKeys } from './hooks/useAdminKeys';

// Layers (Camadas 0 e 1)
import { SessionManager } from './kernel/SessionManager';
import { XServer } from './kernel/XServer';

// Layer 3
import { WindowManager } from './kernel/WindowManager';
import { DesktopShell } from './shell/DesktopShell';

// Your Components
import BiosScreen from './boot/bios/BiosScreen';
import BiosSetup from './boot/bios/BiosSetup';
import BootMenu from './boot/bios/BootMenu';
import BootError from './boot/bios/BootError';
import GrubScreen from './boot/grub/GrubScreen';
import PlymouthScreen from './boot/plymouth/PlymouthScreen';
import LoginScreen from './boot/login/LoginScreen';

function SystemBootstrap() {
  const { state, setStage, setSelectedOS, reboot } = useSession();
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

      {/* Stage: Desktop Environment (Full Layer Stack) */}
      {stage === 'DESKTOP' && (
        /* Layer 0: Session Orchestration & Kernel Logic */
        <SessionManager>
          {/* Layer 1: X11 Graphic Server (Canvas & Cursors) */}
          <XServer>
            {/* Layer 3: Window Manager (Window Decors & Z-Index) */}
            <WindowManager>
              {/* Layer 4: Desktop Shell (Wallpaper & System UI) */}
              <DesktopShell>
                {/* 
                   Layer 5: User Space
                   Future applications will be rendered here via Window instances.
                */}
              </DesktopShell>
            </WindowManager>
          </XServer>
        </SessionManager>
      )}

      {/* The Admin Backdoor Layer (Always on top) */}
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