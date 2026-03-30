/**
 * NetworkApplet Component
 * Responsibility: Visual indicator for network connectivity status.
 */
export const NetworkApplet = () => {
  return (
    <div className="flex items-center px-1 text-white/40 hover:text-[#FCF87C] transition-colors cursor-x11-pointer">
      <i className="bi bi-wifi text-[14px]"></i>
    </div>
  );
};