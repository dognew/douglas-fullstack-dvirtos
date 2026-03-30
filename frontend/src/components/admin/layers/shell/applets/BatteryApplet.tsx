/**
 * BatteryApplet Component
 * Responsibility: Power/Battery status indicator for the System Tray.
 */
export const BatteryApplet = () => {
  return (
    <div className="flex items-center px-1 text-white/40 hover:text-[#FCF87C] transition-colors cursor-x11-pointer">
      <i className="bi bi-battery-full text-[14px] rotate-[-90deg]"></i>
    </div>
  );
};