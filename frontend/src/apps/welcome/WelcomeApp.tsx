import { Window } from '../../system/window/Window';

/**
 * Layer 5: Welcome App (Developer Manifesto)
 * Responsibility: Provide a warm, high-impact introduction to D-VirtOS.
 * Design: Frameless glassmorphism with premium typography.
 */
export const WelcomeApp = ({ 
  onClose, 
  zIndex = 500 
}: { 
  onClose?: () => void; 
  zIndex?: number;
}) => {
  return (
    <Window 
      title="Welcome to D-VirtOS" 
      initialW={600} 
      initialH={520} 
      initialX={window.innerWidth / 2 - 300} 
      initialY={window.innerHeight / 2 - 280}
      zIndex={zIndex}
      onClose={onClose}
      config={{
        hasTitleBar: false, // Hidden for manifesto look
        canResize: false,
        canMaximize: false,
        canMinimize: false,
        isClosable: true,
        isFrameless: true   // Full immersion[cite: 18]
      }}
    >
      <div className="h-full flex flex-col p-8 bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] relative overflow-hidden group">
        
        {/* Abstract Background Decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FCF87C]/5 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Header Section */}
        <header className="mb-8 z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-1 bg-[#FCF87C] rounded-full" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#E4C844]">
              System.Manifesto
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">
            Welcome to <span className="text-[#FCF87C]">D-VirtOS</span>
          </h1>
        </header>

        {/* Content Section: Your Personal Message */}
        <main className="flex-1 z-10 space-y-6">
          <div className="relative">
            <i className="bi bi-quote absolute -left-6 -top-2 text-4xl text-white/5 pointer-events-none"></i>
            <p className="text-[13px] leading-relaxed text-white/70 italic font-ubuntu">
              "Durante anos nunca estive satisfeito com meus sites pessoais, sempre mudando pois nenhum conseguia transmitir toda a minha paixão por tecnologia e bagagem de conhecimento. Mas finalmente, com o D-VirtOS isso se tornou possível, porque nada melhor do que todo o ciclo de um sistema operacional para dar a liberdade de eu demonstrar todas as minhas capacidades."
            </p>
          </div>

          <p className="text-[12px] leading-relaxed text-white/50 font-ubuntu border-l border-[#FCF87C]/20 pl-4">
            Este projeto ainda está no começo, ainda tenho muitos planos para ele... ele é meu portfólio, minha bagagem, um resumo da minha experiência, mas também o meu maior laboratório. É aqui que conseguirei demonstrar, de uma forma tão fora da curva, a capacidade criativa e alma de um desenvolvedor.
          </p>
        </main>

        {/* Footer Section: Interactive CTA */}
        <footer className="mt-8 flex flex-col items-center gap-4 z-10">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <button 
            onClick={onClose}
            className="group relative px-10 py-3 bg-transparent overflow-hidden border border-[#FCF87C]/30 hover:border-[#FCF87C] transition-all duration-500 cursor-x11-pointer"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-[#FCF87C]/0 group-hover:bg-[#FCF87C]/5 transition-all duration-500" />
            
            <span className="relative text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#FCF87C] group-hover:text-white transition-colors">
              Initialize Environment
            </span>
          </button>
          
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
            Douglas Fiedler // Creative Technologist
          </p>
        </footer>

        {/* Subtle Decorative Frame */}
        <div className="absolute inset-1 border border-white/5 pointer-events-none rounded-sm" />
      </div>
    </Window>
  );
};