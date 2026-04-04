import { useState, useEffect } from 'react';

/**
 * ClockApplet Component
 * Responsibility: Real-time clock display for the System Tray.
 */
export const ClockApplet = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right border-l border-white/5 pl-4 select-none">
      <p className="text-white/80 text-[11px] font-mono leading-none">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className="text-[9px] text-white/20 uppercase tracking-tighter">
        {time.toLocaleDateString([], { day: '2-digit', month: 'short' })}
      </p>
    </div>
  );
};