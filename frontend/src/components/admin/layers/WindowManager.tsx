import { type ReactNode } from 'react';

interface WindowManagerProps {
  children: ReactNode;
}

/**
 * Layer 3: Window Manager
 * Responsibility: Orchestrates window positions, focus, and state.
 */
export const WindowManager = ({ children }: WindowManagerProps) => {
  return (
    <div className="window-manager-root w-full h-full relative overflow-hidden pointer-events-auto">
      {children}
    </div>
  );
};