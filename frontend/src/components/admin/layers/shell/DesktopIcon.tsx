/**
 * DesktopIcon Configuration Interface
 */
export interface DesktopIconConfig {
  id: string;
  label: string;
  icon: string; // Bootstrap Icon class
  action: () => void;
}

/**
 * Component: DesktopIcon
 * Responsibility: Renders a transparent desktop shortcut with OS-like label wrapping.
 * Fix: Removed tracking-wider and adjusted padding to prevent premature text wrapping.
 */
export const DesktopIcon = ({ config }: { config: DesktopIconConfig }) => {
  return (
    <button 
      onClick={config.action}
      /* Changed padding to px-1 to maximize text area */
      className="w-24 h-auto min-h-[96px] py-2 px-1 flex flex-col items-center justify-start gap-1 
                 bg-transparent border-none outline-none focus:outline-none focus:ring-0
                 hover:bg-white/5 transition-all group cursor-x11-left-ptr 
                 active:scale-95 border border-transparent hover:border-white/10 rounded-lg"
    >
      {/* Icon Container */}
      <div className="w-12 h-12 flex items-center justify-center transition-all mb-1">
        <i className={`bi ${config.icon} text-4xl text-[#FCF87C]/60 group-hover:text-[#FCF87C] group-hover:drop-shadow-[0_0_8px_rgba(252,248,124,0.3)] transition-all`}></i>
      </div>
      
      {/* 
          Label: Desktop-like text wrapping logic
          - Removed tracking-wider to save horizontal space.
          - Added break-all for extremely long strings without spaces.
      */}
      <span className="text-[11px] text-white/50 font-medium uppercase 
                       group-hover:text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] 
                       text-center w-full leading-tight overflow-hidden 
                       display-webkit-box webkit-line-clamp-2 webkit-box-orient-vertical 
                       break-all line-clamp-2">
        {config.label}
      </span>
    </button>
  );
};