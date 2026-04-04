import { useMemo } from 'react';

export default function GrubBackground() {
  const shapes = useMemo(() => {
    // Paleta Gold extraída do seu GIMP Palette
    const goldPalette = [
      'rgba(184, 124, 0, 0.15)',   // #B87C00 (Dunkelgold)
      'rgba(208, 152, 12, 0.15)',  // #D0980C (Classic Gold)
      'rgba(228, 200, 68, 0.15)',  // #E4C844 (Bright Gold)
      'rgba(252, 248, 124, 0.12)', // #FCF87C (Soft Yellow Gold)
    ];

    return Array.from({ length: 6 }).map((_, i) => {
      const size = Math.random() * 600 + 400;
      const x = i % 2 === 0 ? Math.random() * 30 : 70 + Math.random() * 30;
      const y = Math.random() * 100;
      
      return {
        id: i,
        size,
        x: `${x}%`,
        y: `${y}%`,
        rotate: Math.random() * 360,
        color: goldPalette[i % goldPalette.length],
        borderRadius: Math.random() > 0.5 ? '30%' : '0%',
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-[#000000] overflow-hidden">
      {/* Fundo levemente aquecido com o tom mais escuro do seu dourado */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#000000] via-[#0a0700] to-[#1a1200]" />
      
      <svg width="100%" height="100%" className="opacity-90">
        <defs>
          <filter id="blurFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
          </filter>
        </defs>
        
        {shapes.map((s) => (
          <rect
            key={s.id}
            width={s.size}
            height={s.size}
            x={s.x}
            y={s.y}
            fill={s.color}
            rx={s.borderRadius}
            filter="url(#blurFilter)"
            style={{ 
              transformOrigin: 'center', 
              transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
              mixBlendMode: 'screen' 
            }}
          />
        ))}
      </svg>

      {/* Vinheta para manter o foco no centro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}