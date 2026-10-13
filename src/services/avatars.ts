/**
 * Avatares de estilo animado/ilustración vectorial (cartoon) para BiblioNavia.
 * 100% vectoriales, auto-contenidos en SVG Data URIs, sin dependencias externas ni imágenes fotorrealistas.
 */

const createSvgDataUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

export const CARTOON_AVATARS = [
  // 1. Estudiante con gafas y sudadera naranja (chico)
  createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#FFEDD5"/>
      <circle cx="50" cy="46" r="26" fill="#FDBA74"/>
      <!-- Pelo castaño estilo cartoon -->
      <path d="M25 44 C25 24 75 24 75 44 C72 32 60 27 50 27 C40 27 28 32 25 44 Z" fill="#9A3412"/>
      <path d="M24 38 C28 32 40 32 44 38 C35 34 28 35 24 38 Z" fill="#7C2D12"/>
      <!-- Ojos cartoon -->
      <circle cx="41" cy="45" r="4.5" fill="#1E293B"/>
      <circle cx="42.5" cy="43.5" r="1.5" fill="#FFFFFF"/>
      <circle cx="59" cy="45" r="4.5" fill="#1E293B"/>
      <circle cx="60.5" cy="43.5" r="1.5" fill="#FFFFFF"/>
      <!-- Gafas redondas estilo ilustrado -->
      <circle cx="41" cy="45" r="8" fill="none" stroke="#EA580C" stroke-width="2.5"/>
      <circle cx="59" cy="45" r="8" fill="none" stroke="#EA580C" stroke-width="2.5"/>
      <line x1="49" y1="45" x2="51" y2="45" stroke="#EA580C" stroke-width="2.5"/>
      <!-- Sonrisa -->
      <path d="M44 57 Q50 63 56 57" fill="none" stroke="#9A3412" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Mejillas sonrosadas -->
      <circle cx="34" cy="53" r="3.5" fill="#FB923C" opacity="0.6"/>
      <circle cx="66" cy="53" r="3.5" fill="#FB923C" opacity="0.6"/>
      <!-- Sudadera con capucha naranja -->
      <path d="M22 100 C22 75 35 72 50 72 C65 72 78 75 78 100 Z" fill="#F97316"/>
      <path d="M42 72 L50 82 L58 72 Z" fill="#FFFFFF"/>
      <circle cx="50" cy="85" r="2" fill="#EA580C"/>
    </svg>
  `),

  // 2. Estudiante con pelo morado y diadema / auriculares (chica)
  createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#F3E8FF"/>
      <circle cx="50" cy="46" r="26" fill="#FED7AA"/>
      <!-- Pelo cartoon morado con volumen -->
      <path d="M22 50 C20 22 80 22 78 50 C80 65 74 72 68 70 C70 54 68 32 50 32 C32 32 30 54 32 70 C26 72 20 65 22 50 Z" fill="#7E22CE"/>
      <path d="M30 38 Q50 28 70 38 Q50 34 30 38 Z" fill="#6B21A8"/>
      <!-- Ojos grandes estilo anime/cartoon -->
      <ellipse cx="40" cy="46" rx="4" ry="5.5" fill="#0F172A"/>
      <circle cx="41.5" cy="44" r="2" fill="#FFFFFF"/>
      <circle cx="39.5" cy="48" r="1" fill="#FFFFFF"/>
      <ellipse cx="60" cy="46" rx="4" ry="5.5" fill="#0F172A"/>
      <circle cx="61.5" cy="44" r="2" fill="#FFFFFF"/>
      <circle cx="59.5" cy="48" r="1" fill="#FFFFFF"/>
      <!-- Pestañas -->
      <path d="M36 41 Q40 38 44 41" fill="none" stroke="#4C1D95" stroke-width="2"/>
      <path d="M56 41 Q60 38 64 41" fill="none" stroke="#4C1D95" stroke-width="2"/>
      <!-- Sonrisa brillante -->
      <path d="M44 58 Q50 64 56 58" fill="none" stroke="#7E22CE" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Diadema amarilla brillante -->
      <path d="M25 40 C35 23 65 23 75 40" fill="none" stroke="#FBBF24" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="26" cy="42" r="4.5" fill="#F59E0B"/>
      <circle cx="74" cy="42" r="4.5" fill="#F59E0B"/>
      <!-- Camiseta violeta moderna -->
      <path d="M22 100 C22 75 35 72 50 72 C65 72 78 75 78 100 Z" fill="#9333EA"/>
      <path d="M40 72 Q50 80 60 72" fill="none" stroke="#FDE047" stroke-width="2.5"/>
    </svg>
  `),

  // 3. Estudiante con gorra deportiva y sonrisa alegre (chico)
  createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#DBEAFE"/>
      <circle cx="50" cy="48" r="26" fill="#FDBA74"/>
      <!-- Gorra deportiva azul y naranja -->
      <path d="M24 38 C26 20 74 20 76 38 Z" fill="#1D4ED8"/>
      <path d="M20 38 C35 32 65 32 82 36 L76 42 L22 42 Z" fill="#F97316"/>
      <!-- Ojos alegres tipo arco -->
      <circle cx="40" cy="48" r="4.5" fill="#0F172A"/>
      <circle cx="41.5" cy="46.5" r="1.5" fill="#FFFFFF"/>
      <circle cx="60" cy="48" r="4.5" fill="#0F172A"/>
      <circle cx="61.5" cy="46.5" r="1.5" fill="#FFFFFF"/>
      <!-- Gran sonrisa abierta -->
      <path d="M42 59 Q50 69 58 59 Z" fill="#B91C1C"/>
      <path d="M44 59 Q50 63 56 59 Z" fill="#FFFFFF"/>
      <!-- Camiseta deportiva azul rey -->
      <path d="M22 100 C22 76 35 73 50 73 C65 73 78 76 78 100 Z" fill="#2563EB"/>
      <polygon points="50,73 44,85 56,85" fill="#FFFFFF"/>
    </svg>
  `),

  // 4. Estudiante con trenzas y camiseta amarilla (chica)
  createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#FEF3C7"/>
      <!-- Trenzas laterales -->
      <circle cx="20" cy="55" r="7" fill="#78350F"/>
      <circle cx="18" cy="67" r="6" fill="#78350F"/>
      <circle cx="16" cy="78" r="5" fill="#F59E0B"/>
      <circle cx="80" cy="55" r="7" fill="#78350F"/>
      <circle cx="82" cy="67" r="6" fill="#78350F"/>
      <circle cx="84" cy="78" r="5" fill="#F59E0B"/>
      <circle cx="50" cy="46" r="26" fill="#FCD34D"/>
      <!-- Flequillo trenzado -->
      <path d="M24 45 C25 24 75 24 76 45 C65 30 35 30 24 45 Z" fill="#78350F"/>
      <!-- Ojos amigables -->
      <ellipse cx="40" cy="46" rx="4" ry="5" fill="#1E293B"/>
      <circle cx="41.5" cy="44.5" r="1.8" fill="#FFFFFF"/>
      <ellipse cx="60" cy="46" rx="4" ry="5" fill="#1E293B"/>
      <circle cx="61.5" cy="44.5" r="1.8" fill="#FFFFFF"/>
      <!-- Sonrisa dulce -->
      <path d="M43 58 Q50 65 57 58" fill="none" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="34" cy="53" r="3.5" fill="#F43F5E" opacity="0.4"/>
      <circle cx="66" cy="53" r="3.5" fill="#F43F5E" opacity="0.4"/>
      <!-- Camiseta amarilla con cuello redondo -->
      <path d="M22 100 C22 75 35 72 50 72 C65 72 78 75 78 100 Z" fill="#EAB308"/>
      <circle cx="50" cy="78" r="3" fill="#CA8A04"/>
    </svg>
  `),

  // 5. Estudiante lector con suéter turquesa (chico intelectual)
  createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#CCFBF1"/>
      <circle cx="50" cy="46" r="26" fill="#FDBA74"/>
      <!-- Pelo estilo despeinado moderno -->
      <path d="M26 40 C28 20 72 18 74 38 C68 28 58 26 50 28 C42 24 32 28 26 40 Z" fill="#1E293B"/>
      <!-- Ojos concentrados -->
      <circle cx="40" cy="46" r="4.5" fill="#0F172A"/>
      <circle cx="41.5" cy="44.5" r="1.5" fill="#FFFFFF"/>
      <circle cx="60" cy="46" r="4.5" fill="#0F172A"/>
      <circle cx="61.5" cy="44.5" r="1.5" fill="#FFFFFF"/>
      <!-- Gafas cuadradas modernas -->
      <rect x="32" y="39" width="16" height="13" rx="3" fill="none" stroke="#0F766E" stroke-width="2.2"/>
      <rect x="52" y="39" width="16" height="13" rx="3" fill="none" stroke="#0F766E" stroke-width="2.2"/>
      <line x1="48" y1="45" x2="52" y2="45" stroke="#0F766E" stroke-width="2.2"/>
      <!-- Sonrisa calmada -->
      <path d="M45 59 Q50 63 55 59" fill="none" stroke="#0F766E" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Suéter cuello tortuga turquesa -->
      <path d="M22 100 C22 75 35 72 50 72 C65 72 78 75 78 100 Z" fill="#0D9488"/>
      <rect x="42" y="69" width="16" height="7" rx="3" fill="#14B8A6"/>
    </svg>
  `),

  // 6. Bibliotecario / Administrador con corbata y birrete/gafas (estilo ilustrado profesional)
  createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#E0E7FF"/>
      <circle cx="50" cy="47" r="26" fill="#FDBA74"/>
      <!-- Pelo corto formal -->
      <path d="M25 43 C26 23 74 23 75 43 C70 30 58 28 50 28 C42 28 30 30 25 43 Z" fill="#334155"/>
      <!-- Ojos amables de profesor/bibliotecario -->
      <circle cx="41" cy="46" r="4" fill="#0F172A"/>
      <circle cx="42.5" cy="44.5" r="1.5" fill="#FFFFFF"/>
      <circle cx="59" cy="46" r="4" fill="#0F172A"/>
      <circle cx="60.5" cy="44.5" r="1.5" fill="#FFFFFF"/>
      <!-- Gafas elegantes -->
      <circle cx="41" cy="46" r="7.5" fill="none" stroke="#3730A3" stroke-width="2"/>
      <circle cx="59" cy="46" r="7.5" fill="none" stroke="#3730A3" stroke-width="2"/>
      <line x1="48.5" y1="46" x2="51.5" y2="46" stroke="#3730A3" stroke-width="2"/>
      <!-- Sonrisa de guía -->
      <path d="M44 58 Q50 64 56 58" fill="none" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Traje azul marino con corbata naranja institucional -->
      <path d="M22 100 C22 75 35 72 50 72 C65 72 78 75 78 100 Z" fill="#0F2B48"/>
      <polygon points="50,72 43,84 57,84" fill="#FFFFFF"/>
      <polygon points="50,80 47,98 50,100 53,98" fill="#F97316"/>
    </svg>
  `),
];

export const DEFAULT_STUDENT_AVATAR = CARTOON_AVATARS[0];
export const DEFAULT_ADMIN_AVATAR = CARTOON_AVATARS[5];
