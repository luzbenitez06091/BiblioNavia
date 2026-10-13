import React, { useEffect, useState } from 'react';
import { BiblioNaviaLogo } from './BiblioNaviaLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 12;
      });
    }, 220);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[640px] h-full w-full bg-[#0F2B48] text-white p-8 select-none">
      {/* Círculos de luz de fondo */}
      <div className="absolute top-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
        {/* Logo Oficial de BiblioNavia */}
        <BiblioNaviaLogo size="xl" withPulse className="mb-6" />

        {/* Nombre de la Aplicación */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-display">
          BiblioNavia
        </h1>

        {/* Texto Requerido */}
        <p className="text-sm font-medium text-slate-300 mb-8 leading-snug">
          Gestión inteligente de biblioteca escolar
        </p>

        {/* Barra de Carga Requerida */}
        <div className="w-56 h-1.5 bg-white/15 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] text-slate-400 font-mono tracking-wider">
          {progress < 40 && 'Iniciando servicios Firebase...'}
          {progress >= 40 && progress < 80 && 'Sincronizando catálogo escolar...'}
          {progress >= 80 && 'Listo para ingresar'}
        </span>
      </div>

      <button
        onClick={onFinish}
        className="absolute bottom-6 text-xs text-white/50 hover:text-white/90 underline transition-colors"
      >
        Saltar introducción
      </button>
    </div>
  );
};
