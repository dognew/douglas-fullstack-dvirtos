import { useState, useEffect } from 'react';
import BootTimer from '../shared/BootTimer';

export default function LoginScreen({ onComplete, onReboot }: {
  onComplete: () => void;
  onReboot: () => void;
}) {
  const [bgUrl, setBgUrl] = useState('');

  const profiles = [
    { id: 'recruiter', name: 'Recrutador / Empresa', icon: 'bi-briefcase' },
    { id: 'developer', name: 'Desenvolvedor / Parceiro', icon: 'bi-code-slash' },
    { id: 'student', name: 'Aluno / Pesquisador', icon: 'bi-mortarboard' },
    { id: 'visitor', name: 'Visitante Casual', icon: 'bi-person' },
  ];

  useEffect(() => {
    // Voltando para o Picsum que é estável e funciona
    const randomId = Math.floor(Math.random() * 1000);
    setBgUrl(`https://picsum.photos/seed/${randomId}/1920/1080`);
  }, []);

  const handleProfileSelect = (profileId: string) => {
    sessionStorage.setItem('selected_visitor_type', profileId);
    onComplete();
  };

  return (
    <div
      // Aplicando a fonte Ubuntu via classe Tailwind que você configurou
      className="h-screen w-full flex flex-col items-center justify-center font-ubuntu relative overflow-hidden bg-black text-white px-4"
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay escuro sutil */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Container Principal - Glassmorphism */}
      <div className="z-10 w-full max-w-4xl bg-black/20 backdrop-blur-md border border-white/10 p-6 md:p-12 rounded-2xl shadow-2xl flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 md:mb-12 text-center">
          <img
            src="/logo-dognew-white-gold.svg"
            alt="D-VirtOS"
            className="w-16 h-16 md:w-20 md:h-20 mb-4 drop-shadow-lg"
          />
          <h1 className="text-3xl md:text-4xl font-medium text-[#FCF87C] mb-3 tracking-tight">
            Bem-vindo ao D-VirtOS
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-md font-light">
            Identifique seu perfil de acesso para personalizar sua experiência.
          </p>
        </div>

        {/* Profiles Grid - Transparente */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full mb-10 md:mb-16 bg-transparent">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile.id)}
              className="flex flex-col items-center group transition-all duration-300 bg-transparent border-none p-0 outline-none"
            >
              {/* Círculo do Ícone */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#B87C00]/40 flex items-center justify-center mb-4 group-hover:border-[#FCF87C] group-hover:bg-[#FCF87C]/10 transition-all duration-300 bg-transparent">
                <i className={`bi ${profile.icon} text-3xl md:text-4xl text-[#E4C844] group-hover:text-[#FCF87C] drop-shadow-md`}></i>
              </div>
              
              {/* Nome do Perfil */}
              <span className="text-[11px] md:text-[13px] font-normal text-white/70 group-hover:text-[#FCF87C] text-center leading-tight transition-colors bg-transparent">
                {profile.name}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10 bg-transparent">
          <button
            onClick={onReboot}
            className="text-xs text-white/40 hover:text-[#B87C00] transition-colors flex items-center gap-2 font-light bg-transparent border-none outline-none"
          >
            <i className="bi bi-arrow-clockwise"></i> Reiniciar sistema
          </button>
          
          <div className="text-[#E4C844]/60 text-xs font-mono bg-transparent">
            <BootTimer
              seconds={30}
              onComplete={() => handleProfileSelect('visitor')}
              message="Login automático em"
            />
          </div>
        </div>
      </div>
    </div>
  );
}