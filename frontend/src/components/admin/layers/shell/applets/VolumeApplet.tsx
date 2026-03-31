import { useState } from 'react';

/**
 * VolumeApplet Component
 * Responsibility: Volume status indicator with toggle simulation.
 */
export const VolumeApplet = () => {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <button 
      onClick={() => setIsMuted(!isMuted)}
      className="flex items-center px-1 text-white/40 hover:text-[#FCF87C] transition-colors cursor-x11-pointer"
    >
      <i className={`bi ${isMuted ? 'bi-volume-mute' : 'bi-volume-up'} text-[14px]`}></i>
    </button>
  );
};