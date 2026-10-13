import React from 'react';

export const BIBLIONAVIA_LOGO_SRC = '/src/assets/images/biblionavia_logo_1790462838534.jpg';
export const FUTURE_PATH_LOGO_SRC = BIBLIONAVIA_LOGO_SRC;

export interface BiblioNaviaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withPulse?: boolean;
  alt?: string;
}

export type FuturePathLogoProps = BiblioNaviaLogoProps;

const sizeConfig = {
  xs: {
    container: 'w-6 h-6 rounded-lg p-[1.5px] shadow-xs',
    img: 'rounded-[6px]',
    pulse: 'rounded-lg -inset-1',
  },
  sm: {
    container: 'w-8 h-8 rounded-xl p-0.5 shadow-md shadow-orange-500/20',
    img: 'rounded-[10px]',
    pulse: 'rounded-xl -inset-1',
  },
  md: {
    container: 'w-10 h-10 rounded-2xl p-0.5 shadow-lg shadow-orange-500/25',
    img: 'rounded-[14px]',
    pulse: 'rounded-2xl -inset-1.5',
  },
  lg: {
    container: 'w-16 h-16 rounded-2xl p-1 shadow-lg shadow-orange-500/30',
    img: 'rounded-[14px]',
    pulse: 'rounded-2xl -inset-2',
  },
  xl: {
    container: 'w-24 h-24 rounded-3xl p-1 shadow-xl shadow-orange-500/20',
    img: 'rounded-[22px]',
    pulse: 'rounded-3xl -inset-2',
  },
};

/**
 * Logotipo oficial único de BiblioNavia.
 * Utiliza exactamente el mismo recurso gráfico y proporciones de la pantalla de carga.
 */
export const BiblioNaviaLogo: React.FC<BiblioNaviaLogoProps> = ({
  size = 'md',
  className = '',
  withPulse = false,
  alt = 'Logo Oficial BiblioNavia',
}) => {
  const cfg = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <div
        className={`${cfg.container} bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center overflow-hidden transition-transform duration-200`}
      >
        <img
          src={BIBLIONAVIA_LOGO_SRC}
          alt={alt}
          className={`w-full h-full object-cover ${cfg.img}`}
          onError={(e) => {
            // Fallback en caso de demora en cargar
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Fallback de respaldo interno */}
        <div className={`absolute inset-0 flex items-center justify-center bg-[#0F2B48] ${cfg.img} -z-10`}>
          <svg className="w-1/2 h-1/2 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
      </div>

      {withPulse && (
        <div
          className={`absolute ${cfg.pulse} border border-orange-500/30 animate-ping opacity-30 pointer-events-none`}
        />
      )}
    </div>
  );
};

export const FuturePathLogo = BiblioNaviaLogo;
export default BiblioNaviaLogo;
