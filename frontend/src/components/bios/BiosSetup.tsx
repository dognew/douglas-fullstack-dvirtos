import { useEffect, useState } from 'react';
import ExitModal from './ExitModal';

export default function BiosSetup({ onExit, specs }: { onExit: () => void, specs: any }) {
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowExitModal(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-full bg-[#0000AA] text-gray-300 font-mono flex flex-col uppercase select-none p-1 border-4 border-gray-400">
      {/* Header */}
      <div className="bg-gray-400 text-[#0000AA] font-bold flex justify-between px-4 py-1">
        <span>MEGABIOS SETUP UTILITY</span>
        <span>D-VIRTOS v1.0</span>
      </div>

      {/* Top menu */}
      <div className="flex gap-8 px-4 py-1 bg-gray-400/20 mb-2 border-b border-gray-500">
        <span className="bg-gray-100 text-[#0000AA] px-2">Main</span>
        <span>Advanced</span>
        <span>Security</span>
        <span>Power</span>
        <span>Boot</span>
        <span>Exit</span>
      </div>

      {/* Content Main */}
      <div className="flex flex-1 pt-4 px-4 gap-10">
        <div className="w-2/3 space-y-4">
          <div className="flex justify-between w-[500px]">
            <span>System Time</span>
            <span className="text-white">[{new Date().toLocaleTimeString()}]</span>
          </div>
          <div className="flex justify-between w-[500px]">
            <span>System Date</span>
            <span className="text-white">[{new Date().toLocaleDateString()}]</span>
          </div>
          
          <div className="mt-12 space-y-2 border-t border-gray-600 pt-6">
            <p>BIOS Version: {specs?.bios_name}</p>
            <p>Vendor: {specs?.vendor}</p>
            <p>Processor Type: {specs?.cpu}</p>
            <p>Processor Speed: {specs?.speed}</p>
            <p>System Memory: {specs?.ram}</p>
            <p className="pt-4 text-gray-400">Detected Storage:</p>
            <p className="pl-4">{specs?.storage}</p>
          </div>
        </div>

        {/* Help sidebar */}
        <div className="w-1/3 border-l border-gray-500 pl-6 text-sm">
          <div className="space-y-2">
            <p className="text-white">Help Section</p>
            <p className="text-gray-400 text-xs normal-case mb-6">Use [Enter] to select a sub-screen, or [Esc] to exit.</p>
            
            <p>↑↓ Select Item</p>
            <p>←→ Select Menu</p>
            <p>+- Change Opt.</p>
            <p>F1 General Help</p>
            <p>F10 Save and Exit</p>
            <p className="text-white">ESC Exit</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-500 text-center text-xs">
        (C) Copyright 2026 DogNew Informática, MEI. All rights reserved.
      </div>

      {showExitModal && <ExitModal 
          onConfirm={onExit} 
          onCancel={() => setShowExitModal(false)} 
        />}
    </div>
  );
}