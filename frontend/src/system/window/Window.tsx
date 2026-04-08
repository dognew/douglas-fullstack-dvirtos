import { type ReactNode, useEffect } from 'react'
import { useWindowInteractions } from '../../hooks/useWindowInteractions';

export interface WindowConfig {
  hasTitleBar?: boolean;
  canResize?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  isClosable?: boolean;
  isFrameless?: boolean;
}

interface WindowProps {
  title: string;
  children: ReactNode;
  initialW?: number;
  initialH?: number;
  initialX?: number;
  initialY?: number;
  isActive?: boolean;
  isMinimized?: boolean;
  zIndex?: number;
  className?: string;
  padding?: number;
  layout?: 'flex' | 'grid' | 'block';
  direction?: 'flex-col' | 'flex-row';
  config?: WindowConfig;
  onClose?: () => void;
  onMinimize?: () => void;
}

/**
 * Layer 3: Window Component (Engine v2.4.1)
 * Responsibility: Handles decorations, geometric states, and dynamic Z-Index depth.
 * Fixed: JSX syntax error in Maximize button and padding initialization.
 */
export const Window = ({ 
  title, 
  children, 
  initialW = 400, 
  initialH = 300, 
  initialX = 100, 
  initialY = 100, 
  isActive = true,
  isMinimized = false,
  zIndex = 10,
  className = "",
  padding = 4,
  layout = 'flex',      // Default flex
  direction = 'flex-col', // Default flex-col
  onClose,
  onMinimize,
  config = {
    hasTitleBar: true,
    canResize: true,
    canMaximize: true,
    canMinimize: true,
    isClosable: true,
    isFrameless: false
  }
}: WindowProps) => {
  const { 
    rect, 
    startDrag, 
    startResize, 
    toggleMaximize, 
    isDragging, 
    isMaximized, 
    isResizing 
  } = useWindowInteractions(initialX, initialY, initialW, initialH);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/dvirtos/usr/share/themes/dvirtos-default/window.css';
    document.head.appendChild(link);
  }, []);

  if (isMinimized) return null;

  const hideDecorations = config.isFrameless;
  const paddingClass = `p-${padding}`;
  const layoutClasses = layout === 'flex' ? `${layout} ${direction}` : layout;

  return (
    <div 
      className={`window-frame absolute flex flex-col shadow-2xl select-none transition-all
        ${isActive ? 'ring-1 ring-[#FCF87C]/30' : 'opacity-80'}
        ${isDragging || isResizing ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-[1.005]' : ''}
        ${isMaximized ? 'rounded-none border-none' : 'rounded-lg overflow-hidden'}
        ${className} cursor-x11-left-ptr
      `}
      style={{
        width: isMaximized ? '100%' : `${rect.w}px`,
        height: isMaximized ? 'calc(100% - 48px)' : `${rect.h}px`,
        left: isMaximized ? '0' : `${rect.x}px`,
        top: isMaximized ? '0' : `${rect.y}px`,
        zIndex: zIndex, 
        backgroundColor: 'var(--win-bg, #1A1A1A)',
        border: hideDecorations ? 'none' : 'var(--win-border, 1px solid rgba(255,255,255,0.1))',
        borderRadius: isMaximized || hideDecorations ? '0px' : 'var(--win-radius, 8px)',
      } as React.CSSProperties}
    >
      {!isMaximized && config.canResize && !hideDecorations && (
        <>
          <div onMouseDown={(e) => startResize(e, 'n')} className="absolute -top-1 inset-x-0 h-2 cursor-x11-size-ver z-40" />
          <div onMouseDown={(e) => startResize(e, 'w')} className="absolute inset-y-0 -left-1 w-2 cursor-x11-size-hor z-30" />
          <div onMouseDown={(e) => startResize(e, 'e')} className="absolute inset-y-0 -right-1 w-2 cursor-x11-size-hor z-30" />
          <div onMouseDown={(e) => startResize(e, 's')} className="absolute -bottom-1 inset-x-0 h-2 cursor-x11-size-ver z-30" />
        </>
      )}

      {config.hasTitleBar && !hideDecorations && (
        <div 
          onMouseDown={startDrag}
          className={`title-bar h-8 flex items-center justify-between px-3 border-b border-white/5 
            ${isMaximized ? 'cursor-x11-default' : 'cursor-x11-default active:cursor-grabbing'}`}
          style={{ background: 'var(--win-title-bg, #2A2A2A)' }}
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <div className="w-3 h-3 rounded-full bg-[#E4C844]/20 border border-[#E4C844]/40" />
            <span className="text-[11px] font-medium text-white/70 uppercase tracking-wide">
              {title}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {config.canMinimize && (
                <button 
                    onClick={onMinimize}
                    className="w-6 h-6 flex items-center justify-center hover:bg-white/5 rounded transition-colors cursor-x11-pointer"
                >
                    <i className="bi bi-dash text-white/40 text-lg"></i>
                </button>
            )}
            
            {config.canMaximize && (
                <button 
                    onClick={toggleMaximize}
                    className="w-6 h-6 flex items-center justify-center hover:bg-white/5 rounded transition-colors cursor-x11-pointer"
                >
                    <i className={`bi ${isMaximized ? 'bi-window-stack' : 'bi-app-indicator'} text-white/40 text-[10px]`}></i>
                </button>
            )}

            {config.isClosable && (
                <button 
                    onClick={onClose}
                    className="w-6 h-6 flex items-center justify-center hover:bg-red-500/80 group rounded transition-colors cursor-x11-pointer"
                >
                    <i className="bi bi-x text-white/40 group-hover:text-white text-lg"></i>
                </button>
            )}
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-auto bg-[#0D0D0D] ${layoutClasses} ${paddingClass} text-xs font-mono text-white/80 select-text cursor-x11-left-ptr`}>
        {children}
      </div>
    </div>
  );
};