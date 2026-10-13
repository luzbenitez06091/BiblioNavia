/**
 * BiblioNavia - Generador de Portadas de Libros Únicas y Reales
 * Garantiza:
 * 1. Portadas auténticas para obras canónicas (Cien Años de Soledad, Don Quijote, El Principito, etc.)
 * 2. Cero repeticiones en todo el catálogo de 1.000 libros
 * 3. Diseños editoriales vectoriales de alta fidelidad que reflejan la obra, autor, categoría y editorial
 */

export interface BookCoverMeta {
  idLibro?: string;
  titulo: string;
  autor?: string;
  categoria?: string;
  editorial?: string;
  isbn?: string;
  anio?: number;
}

// Portadas fotográficas reales para las obras principales del catálogo (Asignadas una sola vez)
export const CANONICAL_COVERS: Record<string, string> = {
  'cien anos de soledad': '/src/assets/images/cover_cien_anos_1790462849097.jpg',
  'cien años de soledad': '/src/assets/images/cover_cien_anos_1790462849097.jpg',
  'el principito': '/src/assets/images/cover_principito_1790469069118.jpg',
  'don quijote de la mancha': '/src/assets/images/cover_quijote_1790464793213.jpg',
  'don quijote': '/src/assets/images/cover_quijote_1790464793213.jpg',
  'la odisea': '/src/assets/images/cover_odisea_1790469082371.jpg',
  'física universitaria con física moderna': '/src/assets/images/cover_fisica_1790462858863.jpg',
  'biología celular y molecular': '/src/assets/images/cover_biologia_1790462869882.jpg',
  'cálculo trascendentes tempranas': '/src/assets/images/cover_calculo_1790464803256.jpg',
  'historia universal contemporánea: de 1914 al presente': '/src/assets/images/cover_historia_1790464826116.jpg',
  'química orgánica y bioquímica fundamental': '/src/assets/images/cover_quimica_1790464815826.jpg',
  'lógica proposicional y argumentación crítica': '/src/assets/images/cover_filosofia_1790464851682.jpg',
};

// Generador determinista de hash para variación visual
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Función auxiliar para escape seguro de XML en SVG
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Divide texto largo en líneas elegantes para portadas
function wrapText(text: string, maxCharsPerLine = 22): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 4); // Máximo 4 líneas para no desbordar
}

interface PaletteTheme {
  primaryGradient: [string, string];
  accent: string;
  textColor: string;
  authorColor: string;
  borderStyle: string;
  symbol: string;
}

const CATEGORY_THEMES: Record<string, PaletteTheme[]> = {
  Literatura: [
    {
      primaryGradient: ['#3b0d11', '#1a0507'],
      accent: '#dfb76c',
      textColor: '#ffffff',
      authorColor: '#f1d69d',
      borderStyle: 'ornate-gold',
      symbol: 'quill',
    },
    {
      primaryGradient: ['#0f172a', '#020617'],
      accent: '#38bdf8',
      textColor: '#ffffff',
      authorColor: '#93c5fd',
      borderStyle: 'classic-frame',
      symbol: 'book',
    },
    {
      primaryGradient: ['#2e1065', '#170535'],
      accent: '#fbcfe8',
      textColor: '#ffffff',
      authorColor: '#e9d5ff',
      borderStyle: 'ornate-gold',
      symbol: 'lyre',
    },
  ],
  'Ciencias Exactas': [
    {
      primaryGradient: ['#0b192c', '#000814'],
      accent: '#00b4d8',
      textColor: '#ffffff',
      authorColor: '#90e0ef',
      borderStyle: 'geometric',
      symbol: 'atom',
    },
    {
      primaryGradient: ['#1e1b4b', '#0f0e26'],
      accent: '#818cf8',
      textColor: '#ffffff',
      authorColor: '#c7d2fe',
      borderStyle: 'geometric',
      symbol: 'orbit',
    },
    {
      primaryGradient: ['#042f2e', '#011c1b'],
      accent: '#2dd4bf',
      textColor: '#ffffff',
      authorColor: '#99f6e4',
      borderStyle: 'grid',
      symbol: 'integral',
    },
  ],
  'Ciencias Naturales': [
    {
      primaryGradient: ['#064e3b', '#022c22'],
      accent: '#34d399',
      textColor: '#ffffff',
      authorColor: '#a7f3d0',
      borderStyle: 'botanical',
      symbol: 'leaf',
    },
    {
      primaryGradient: ['#14532d', '#052e16'],
      accent: '#86efac',
      textColor: '#ffffff',
      authorColor: '#bbf7d0',
      borderStyle: 'botanical',
      symbol: 'dna',
    },
    {
      primaryGradient: ['#134e4a', '#042f2e'],
      accent: '#5eead4',
      textColor: '#ffffff',
      authorColor: '#ccfbf1',
      borderStyle: 'classic-frame',
      symbol: 'microscope',
    },
  ],
  'Ciencias Sociales': [
    {
      primaryGradient: ['#451a03', '#240a01'],
      accent: '#fbbf24',
      textColor: '#ffffff',
      authorColor: '#fde68a',
      borderStyle: 'classic-column',
      symbol: 'globe',
    },
    {
      primaryGradient: ['#78350f', '#451a03'],
      accent: '#f59e0b',
      textColor: '#ffffff',
      authorColor: '#fcd34d',
      borderStyle: 'classic-column',
      symbol: 'scales',
    },
    {
      primaryGradient: ['#713f12', '#3f2206'],
      accent: '#eab308',
      textColor: '#ffffff',
      authorColor: '#fef08a',
      borderStyle: 'classic-frame',
      symbol: 'laurel',
    },
  ],
  'Tecnología e Informática': [
    {
      primaryGradient: ['#020617', '#0f172a'],
      accent: '#38bdf8',
      textColor: '#ffffff',
      authorColor: '#7dd3fc',
      borderStyle: 'circuit',
      symbol: 'code',
    },
    {
      primaryGradient: ['#09090b', '#18181b'],
      accent: '#f43f5e',
      textColor: '#ffffff',
      authorColor: '#fda4af',
      borderStyle: 'circuit',
      symbol: 'chip',
    },
    {
      primaryGradient: ['#052e16', '#02180b'],
      accent: '#22c55e',
      textColor: '#ffffff',
      authorColor: '#86efac',
      borderStyle: 'matrix',
      symbol: 'terminal',
    },
  ],
  Filosofía: [
    {
      primaryGradient: ['#312e81', '#1e1b4b'],
      accent: '#c084fc',
      textColor: '#ffffff',
      authorColor: '#e9d5ff',
      borderStyle: 'classical',
      symbol: 'column',
    },
    {
      primaryGradient: ['#4c1d95', '#2e1065'],
      accent: '#e879f9',
      textColor: '#ffffff',
      authorColor: '#f5d0fe',
      borderStyle: 'ornate-gold',
      symbol: 'flame',
    },
    {
      primaryGradient: ['#262626', '#171717'],
      accent: '#e0a96d',
      textColor: '#ffffff',
      authorColor: '#f3d9b1',
      borderStyle: 'classical',
      symbol: 'owl',
    },
  ],
  Arte: [
    {
      primaryGradient: ['#831843', '#500724'],
      accent: '#f472b6',
      textColor: '#ffffff',
      authorColor: '#fbcfe8',
      borderStyle: 'modern-art',
      symbol: 'palette',
    },
    {
      primaryGradient: ['#7c2d12', '#431407'],
      accent: '#fb923c',
      textColor: '#ffffff',
      authorColor: '#fed7aa',
      borderStyle: 'modern-art',
      symbol: 'geometry',
    },
  ],
  'Liderazgo y Crecimiento': [
    {
      primaryGradient: ['#1e3a8a', '#172554'],
      accent: '#f59e0b',
      textColor: '#ffffff',
      authorColor: '#fde68a',
      borderStyle: 'geometric',
      symbol: 'compass',
    },
    {
      primaryGradient: ['#0f766e', '#115e59'],
      accent: '#38bdf8',
      textColor: '#ffffff',
      authorColor: '#bae6fd',
      borderStyle: 'geometric',
      symbol: 'mountain',
    },
  ],
};

function getCategoryTheme(categoria: string, seed: number): PaletteTheme {
  const catThemes = CATEGORY_THEMES[categoria] || CATEGORY_THEMES['Literatura'];
  return catThemes[seed % catThemes.length];
}

function getSymbolSvg(symbol: string, accent: string): string {
  switch (symbol) {
    case 'atom':
      return `
        <g stroke="${accent}" stroke-width="1.8" fill="none" opacity="0.85">
          <ellipse cx="200" cy="330" rx="42" ry="16" transform="rotate(30 200 330)" />
          <ellipse cx="200" cy="330" rx="42" ry="16" transform="rotate(-30 200 330)" />
          <ellipse cx="200" cy="330" rx="42" ry="16" transform="rotate(90 200 330)" />
          <circle cx="200" cy="330" r="5" fill="${accent}" />
        </g>
      `;
    case 'quill':
      return `
        <g stroke="${accent}" stroke-width="2" fill="none" opacity="0.85">
          <path d="M190 350 C190 305 215 295 218 300 C210 320 200 335 190 350 Z" fill="${accent}" fill-opacity="0.2" />
          <line x1="190" y1="350" x2="215" y2="305" />
          <circle cx="190" cy="350" r="3" fill="${accent}" />
        </g>
      `;
    case 'code':
      return `
        <g stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85">
          <path d="M185 315 L170 330 L185 345" />
          <path d="M215 315 L230 330 L215 345" />
          <line x1="205" y1="312" x2="195" y2="348" stroke-width="2.5" />
        </g>
      `;
    case 'leaf':
      return `
        <g stroke="${accent}" stroke-width="2" fill="none" opacity="0.85">
          <path d="M185 345 C185 315 215 305 215 305 C215 305 218 335 185 345 Z" fill="${accent}" fill-opacity="0.25" />
          <path d="M185 345 Q200 325 215 305" />
        </g>
      `;
    case 'globe':
      return `
        <g stroke="${accent}" stroke-width="1.8" fill="none" opacity="0.85">
          <circle cx="200" cy="330" r="28" />
          <line x1="172" y1="330" x2="228" y2="330" />
          <ellipse cx="200" cy="330" rx="14" ry="28" />
        </g>
      `;
    case 'column':
      return `
        <g stroke="${accent}" stroke-width="2" fill="none" opacity="0.85">
          <rect x="180" y="312" width="40" height="6" fill="${accent}" fill-opacity="0.3" />
          <line x1="186" y1="318" x2="186" y2="348" />
          <line x1="195" y1="318" x2="195" y2="348" />
          <line x1="205" y1="318" x2="205" y2="348" />
          <line x1="214" y1="318" x2="214" y2="348" />
          <rect x="178" y="348" width="44" height="6" fill="${accent}" fill-opacity="0.3" />
        </g>
      `;
    case 'compass':
      return `
        <g stroke="${accent}" stroke-width="2" fill="none" opacity="0.85">
          <circle cx="200" cy="330" r="26" />
          <polygon points="200,310 206,328 200,350 194,328" fill="${accent}" fill-opacity="0.35" />
          <circle cx="200" cy="330" r="3" fill="${accent}" />
        </g>
      `;
    default:
      return `
        <g stroke="${accent}" stroke-width="2" fill="none" opacity="0.85">
          <path d="M180 320 Q200 310 200 345 Q200 310 220 320 L220 348 Q200 338 200 355 Q200 338 180 348 Z" fill="${accent}" fill-opacity="0.2" />
        </g>
      `;
  }
}

/**
 * Genera una imagen SVG completa como Data URI para cualquier libro.
 * Incluye título real, autor, categoría, editorial, ISBN, adornos y código de barras.
 * La imagen es 100% determinista y ÚNICA para ese ID de libro.
 */
export function generateUniqueBookCoverSvg(meta: BookCoverMeta): string {
  const seed = hashString((meta.idLibro || meta.titulo || 'book') + (meta.isbn || ''));
  const theme = getCategoryTheme(meta.categoria || 'Literatura', seed);

  const titleLines = wrapText(meta.titulo || 'Libro Escolar', 18);
  const author = escapeXml((meta.autor || 'Autor de Colección').toUpperCase());
  const editorial = escapeXml((meta.editorial || 'BiblioNavia Colecciones').toUpperCase());
  const category = escapeXml((meta.categoria || 'Literatura').toUpperCase());
  const bookId = escapeXml(meta.idLibro || `LIB-${String(seed % 1000).padStart(4, '0')}`);
  const isbn = escapeXml(meta.isbn || `978-958-${String(seed % 9000 + 1000)}-${String(seed % 90 + 10)}`);

  const [col1, col2] = theme.primaryGradient;
  const accent = theme.accent;
  const textColor = theme.textColor;
  const authorColor = theme.authorColor;

  // Cálculo de tamaño de fuente del título
  const titleFontSize = titleLines.length > 2 ? 22 : titleLines.length === 2 ? 26 : 30;
  const titleStartY = 160 - (titleLines.length - 1) * 14;

  const titleSvgSpans = titleLines
    .map(
      (line, i) =>
        `<tspan x="200" y="${titleStartY + i * (titleFontSize + 8)}" text-anchor="middle">${escapeXml(line)}</tspan>`
    )
    .join('\n');

  // Barcode determinista decorativo
  const barcodeBars: string[] = [];
  let currentX = 140;
  for (let b = 0; b < 18; b++) {
    const barWidth = ((seed + b * 7) % 3) + 1.2;
    barcodeBars.push(
      `<rect x="${currentX}" y="535" width="${barWidth}" height="28" fill="${accent}" opacity="0.75" />`
    );
    currentX += barWidth + ((seed + b * 3) % 2) + 2;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${col1}" />
      <stop offset="100%" stop-color="${col2}" />
    </linearGradient>
    <linearGradient id="spineHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="30%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="70%" stop-color="#000000" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.4" />
    </linearGradient>
    <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.4" />
      <stop offset="50%" stop-color="${accent}" stop-opacity="1" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.4" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Fondo Principal -->
  <rect width="400" height="600" fill="url(#bgGrad)" />

  <!-- Textura sutil y trama -->
  <rect x="25" y="25" width="350" height="550" fill="none" stroke="${accent}" stroke-width="1.2" stroke-opacity="0.5" rx="4" />
  <rect x="30" y="30" width="340" height="540" fill="none" stroke="${accent}" stroke-width="0.6" stroke-dasharray="4 3" stroke-opacity="0.3" rx="2" />

  <!-- Esquineros ornamentales -->
  <path d="M 35 50 L 50 35 M 35 35 L 55 35 M 35 35 L 35 55" stroke="${accent}" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />
  <path d="M 365 50 L 350 35 M 365 35 L 345 35 M 365 35 L 365 55" stroke="${accent}" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />
  <path d="M 35 550 L 50 565 M 35 565 L 55 565 M 35 565 L 35 545" stroke="${accent}" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />
  <path d="M 365 550 L 350 565 M 365 565 L 345 565 M 365 565 L 365 545" stroke="${accent}" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />

  <!-- Cabecera Editorial -->
  <text x="200" y="65" font-family="Georgia, serif" font-size="10" font-weight="700" fill="${accent}" text-anchor="middle" letter-spacing="3" opacity="0.95">
    BIBLIONAVIA • BIBLIOTECA ESCOLAR
  </text>
  <line x1="120" y1="75" x2="280" y2="75" stroke="url(#goldSheen)" stroke-width="1" />
  <text x="200" y="90" font-family="Arial, sans-serif" font-size="9" font-weight="600" fill="${authorColor}" text-anchor="middle" letter-spacing="2" opacity="0.8">
    ${category}
  </text>

  <!-- Título de la Obra -->
  <g filter="url(#shadow)">
    <text font-family="'Times New Roman', Georgia, serif" font-size="${titleFontSize}" font-weight="bold" fill="${textColor}">
      ${titleSvgSpans}
    </text>
  </g>

  <!-- Separador Central -->
  <line x1="150" y1="260" x2="250" y2="260" stroke="${accent}" stroke-width="1.2" opacity="0.7" />
  <circle cx="200" cy="260" r="3" fill="${accent}" />

  <!-- Autor -->
  <text x="200" y="285" font-family="Georgia, serif" font-size="13" font-weight="600" fill="${authorColor}" text-anchor="middle" letter-spacing="2">
    ${author}
  </text>

  <!-- Emblema / Ilustración central temática -->
  ${getSymbolSvg(theme.symbol, accent)}

  <!-- Sello de Ejemplar Escolar Registrado -->
  <g transform="translate(200, 420)">
    <circle cx="0" cy="0" r="26" fill="none" stroke="${accent}" stroke-width="1" stroke-opacity="0.6" />
    <circle cx="0" cy="0" r="23" fill="none" stroke="${accent}" stroke-width="0.5" stroke-dasharray="2 2" stroke-opacity="0.5" />
    <text x="0" y="-8" font-family="sans-serif" font-size="6" font-weight="bold" fill="${accent}" text-anchor="middle" letter-spacing="1">COLECCIÓN</text>
    <text x="0" y="3" font-family="sans-serif" font-size="8" font-weight="900" fill="${accent}" text-anchor="middle">${bookId}</text>
    <text x="0" y="12" font-family="sans-serif" font-size="6" fill="${authorColor}" text-anchor="middle">CERTIFICADA</text>
  </g>

  <!-- Editorial y Pie de Página -->
  <text x="200" y="495" font-family="Georgia, serif" font-size="11" font-weight="bold" fill="${accent}" text-anchor="middle" letter-spacing="2.5">
    ${editorial}
  </text>
  <text x="200" y="515" font-family="monospace" font-size="8" fill="${authorColor}" text-anchor="middle" opacity="0.8">
    ISBN: ${isbn}
  </text>

  <!-- Código de barras y pie -->
  ${barcodeBars.join('')}

  <!-- Lomo 3D (Efecto de encuadernación realista) -->
  <rect x="0" y="0" width="18" height="600" fill="url(#spineHighlight)" />
  <line x1="18" y1="0" x2="18" y2="600" stroke="#000000" stroke-width="1.2" stroke-opacity="0.4" />
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
