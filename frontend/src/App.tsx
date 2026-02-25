import { useState } from 'react';
import BiosScreen from './components/boot/BiosScreen';

type BootStage = 'BIOS' | 'GRUB' | 'DESKTOP';

export default function App() {
  const [stage, setStage] = useState<BootStage>('BIOS');

  return (
    <div className="bg-black min-h-screen text-white font-mono overflow-hidden">
      {/* O componente só existe enquanto o estado for BIOS */}
      {stage === 'BIOS' && <BiosScreen onComplete={() => setStage('GRUB')} />}
      
      {stage === 'GRUB' && (
        <div className="p-10">
          <p className="text-blue-400">GNU GRUB version 2.06</p>
          <p className="mt-4">Carregando DogNew WebOS...</p>
          <button 
            onClick={() => setStage('DESKTOP')} 
            className="mt-6 border border-white px-2 hover:bg-white hover:text-black transition-colors"
          >
            [ ENTER ]
          </button>
        </div>
      )}
    </div>
  );
}