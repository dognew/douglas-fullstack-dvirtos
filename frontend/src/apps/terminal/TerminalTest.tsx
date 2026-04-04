import { Window } from '../../system/window/Window';

/**
 * TerminalTest Component
 * Bridges the Window Manager state to the Window Engine with Z-Index support
 */
export const TerminalTest = ({ 
  onClose, 
  onMinimize,
  isMinimized = false,
  zIndex = 10 // Prop to receive depth from Manager
}: { 
  onClose?: () => void; 
  onMinimize?: () => void; 
  isMinimized?: boolean;
  zIndex?: number;
}) => {
  return (
    <Window 
      title="System Terminal" 
      initialX={150} 
      initialY={120} 
      onClose={onClose}
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      zIndex={zIndex} // Applied to Window Engine
    >
      <div className="space-y-2 select-text">
        <p className="text-[#FCF87C]">[system@dvirtos ~]$ uptime</p>
        <p>08:10:00 up 5 min, 1 user, load average: 0.01, 0.05, 0.05</p>
        <p className="text-[#FCF87C]">[system@dvirtos ~]$ _</p>
      </div>
    </Window>
  );
};