import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Smartphone,
  LogIn,
  UserPlus,
  KeyRound,
  LayoutDashboard,
  Search,
  BookMarked,
  Clock,
  History,
  Bookmark,
  Star,
  Bell,
  User,
  ShieldAlert,
  FolderGit2,
  Download,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Play,
  Pause,
  Layers,
  CheckCircle2,
  Eye,
  SlidersHorizontal,
  Menu,
  Settings,
  Award,
  BookPlus,
} from 'lucide-react';

export type MockupId =
  | 'splash'
  | 'login'
  | 'register'
  | 'forgot'
  | 'drawer'
  | 'dashboard'
  | 'catalog'
  | 'book_detail'
  | 'loans'
  | 'history'
  | 'reservations'
  | 'favorites'
  | 'notifications'
  | 'profile'
  | 'config'
  | 'credits'
  | 'admin_books'
  | 'admin_add_book'
  | 'admin_students'
  | 'admin_loans'
  | 'apk_modal';

export interface MockupItem {
  id: MockupId;
  title: string;
  shortTitle: string;
  category: 'Acceso' | 'Menú Lateral' | 'Estudiante' | 'Biblioteca' | 'Administrador' | 'Android';
  icon: React.ElementType;
  badge: string;
  description: string;
  color: string;
}

export const MOCKUP_LIST: MockupItem[] = [
  {
    id: 'splash',
    title: 'Splash Screen Inicial',
    shortTitle: 'Splash',
    category: 'Acceso',
    icon: Sparkles,
    badge: 'Pantalla 1',
    description: 'Logotipo oficial de Future Path, lema institucional y barra de carga.',
    color: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'login',
    title: 'Iniciar Sesión',
    shortTitle: 'Login',
    category: 'Acceso',
    icon: LogIn,
    badge: 'Auth Firebase',
    description: 'Correo institucional, contraseña con botón de visibilidad y acceso con roles.',
    color: 'from-slate-700 to-slate-900',
  },
  {
    id: 'register',
    title: 'Crear Cuenta',
    shortTitle: 'Crear Cuenta',
    category: 'Acceso',
    icon: UserPlus,
    badge: 'Rol Estudiante',
    description: 'Registro institucional directo con nombre, documento, grado escolar y clave.',
    color: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'forgot',
    title: 'Recuperar Contraseña',
    shortTitle: 'Recuperar',
    category: 'Acceso',
    icon: KeyRound,
    badge: 'Seguridad',
    description: 'Envío de enlace de recuperación mediante Firebase Authentication.',
    color: 'from-amber-600 to-orange-700',
  },
  {
    id: 'drawer',
    title: 'Menú Plegable Lateral (Drawer)',
    shortTitle: 'Menú Lateral',
    category: 'Menú Lateral',
    icon: Menu,
    badge: 'Drawer Lateral',
    description: 'Menú desplegable con logo oficial, usuario, 8 opciones y colores institucionales.',
    color: 'from-orange-600 to-amber-600',
  },
  {
    id: 'dashboard',
    title: 'Dashboard Estudiante',
    shortTitle: 'Dashboard',
    category: 'Estudiante',
    icon: LayoutDashboard,
    badge: 'Principal',
    description: 'Tarjetas de métricas (disponibles, prestados, activos), banner y recomendados.',
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: 'catalog',
    title: 'Catálogo de Libros',
    shortTitle: 'Catálogo',
    category: 'Biblioteca',
    icon: Search,
    badge: 'Portadas Reales',
    description: 'Diseño tipo biblioteca digital, portadas grandes y filtros interactivos.',
    color: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'book_detail',
    title: 'Detalle de Libro',
    shortTitle: 'Ficha Libro',
    category: 'Biblioteca',
    icon: BookMarked,
    badge: 'Ficha Técnica',
    description: 'Portada grande, ubicación física en estantería, ISBN, páginas y solicitud.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'loans',
    title: 'Mis Préstamos Activos',
    shortTitle: 'Préstamos',
    category: 'Estudiante',
    icon: Clock,
    badge: 'En Curso',
    description: 'Fechas de entrega, estado del préstamo y botón para renovar 7 días.',
    color: 'from-indigo-600 to-violet-800',
  },
  {
    id: 'history',
    title: 'Historial de Préstamos',
    shortTitle: 'Historial',
    category: 'Estudiante',
    icon: History,
    badge: 'Leídos',
    description: 'Registro histórico de libros devueltos y cumplimiento de plazos.',
    color: 'from-slate-600 to-slate-800',
  },
  {
    id: 'reservations',
    title: 'Módulo de Reservas',
    shortTitle: 'Reservas',
    category: 'Estudiante',
    icon: Bookmark,
    badge: 'Fila de Espera',
    description: 'Libros reservados, posición en la fila de espera y opción de cancelar.',
    color: 'from-purple-600 to-indigo-800',
  },
  {
    id: 'favorites',
    title: 'Libros Favoritos',
    shortTitle: 'Favoritos',
    category: 'Estudiante',
    icon: Star,
    badge: 'Guardados',
    description: 'Colección de libros marcados como favoritos por el estudiante.',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'notifications',
    title: 'Centro de Notificaciones',
    shortTitle: 'Avisos',
    category: 'Estudiante',
    icon: Bell,
    badge: 'Alertas',
    description: 'Recordatorios de devolución, alertas de vencimiento y disponibilidad.',
    color: 'from-rose-500 to-red-700',
  },
  {
    id: 'profile',
    title: 'Perfil de Usuario',
    shortTitle: 'Perfil',
    category: 'Menú Lateral',
    icon: User,
    badge: 'Ficha y Clave',
    description: 'Foto, nombre, documento, grado, editar información y cambiar contraseña.',
    color: 'from-blue-700 to-slate-800',
  },
  {
    id: 'config',
    title: 'Configuración de la App',
    shortTitle: 'Configuración',
    category: 'Menú Lateral',
    icon: Settings,
    badge: 'Tema y Ajustes',
    description: 'Modo oscuro/claro, selector de idioma, tamaño de letra y alertas.',
    color: 'from-slate-600 to-slate-900',
  },
  {
    id: 'credits',
    title: 'Créditos de la Aplicación',
    shortTitle: 'Créditos',
    category: 'Menú Lateral',
    icon: Award,
    badge: 'Luz Elena M.',
    description: '“Aplicación realizada por: Luz Elena Merchancano Benítez” · Future Path v1.0',
    color: 'from-orange-500 to-amber-700',
  },
  {
    id: 'admin_books',
    title: 'Gestión de Libros (Admin)',
    shortTitle: 'Inventario Admin',
    category: 'Administrador',
    icon: BookMarked,
    badge: 'CRUD Libros',
    description: 'Visualización de catálogo de libros, edición y exportación a CSV.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'admin_add_book',
    title: 'Agregar Libros Físicos (Admin)',
    shortTitle: 'Agregar Libros',
    category: 'Administrador',
    icon: BookPlus,
    badge: 'Firebase Storage',
    description: 'Carga de portada con Storage, título, autor, editorial, ISBN, páginas y estantería.',
    color: 'from-orange-600 to-red-700',
  },
  {
    id: 'admin_students',
    title: 'Directorio de Estudiantes (Admin)',
    shortTitle: 'Estudiantes',
    category: 'Administrador',
    icon: User,
    badge: 'Consulta & Edición',
    description: 'Directorio y edición de alumnos registrados mediante la opción "Crear cuenta".',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'admin_loans',
    title: 'Gestión de Préstamos (Admin)',
    shortTitle: 'Admin Préstamos',
    category: 'Administrador',
    icon: Layers,
    badge: 'Devoluciones',
    description: 'Aprobación de solicitudes de alumnos, registro directo y control de entregas.',
    color: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'apk_modal',
    title: 'Compilador APK Android',
    shortTitle: 'Exportar APK',
    category: 'Android',
    icon: Download,
    badge: 'Flutter & Dart',
    description: 'Arquitectura completa Flutter, archivos Dart y generador de APK Android.',
    color: 'from-green-600 to-emerald-700',
  },
];

interface MockupShowcaseProps {
  currentMockup: MockupId;
  onSelectMockup: (id: MockupId) => void;
}

export const MockupShowcase: React.FC<MockupShowcaseProps> = ({
  currentMockup,
  onSelectMockup,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = ['Todas', 'Menú Lateral', 'Acceso', 'Estudiante', 'Biblioteca', 'Administrador', 'Android'];

  const filteredMockups =
    selectedCategory === 'Todas'
      ? MOCKUP_LIST
      : MOCKUP_LIST.filter((m) => m.category === selectedCategory);

  const currentIndex = MOCKUP_LIST.findIndex((m) => m.id === currentMockup);
  const currentItem = MOCKUP_LIST[currentIndex] || MOCKUP_LIST[0];

  useEffect(() => {
    if (!isAutoTour) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % MOCKUP_LIST.length;
      onSelectMockup(MOCKUP_LIST[nextIndex].id);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoTour, currentIndex, onSelectMockup]);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + MOCKUP_LIST.length) % MOCKUP_LIST.length;
    onSelectMockup(MOCKUP_LIST[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % MOCKUP_LIST.length;
    onSelectMockup(MOCKUP_LIST[nextIndex].id);
  };

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector(`[data-mockup-id="${currentMockup}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentMockup]);

  return (
    <div className="w-full max-w-5xl mb-3 flex flex-col gap-2.5">
      {/* Barra Principal de Control de Interfaces */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-xl text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          {/* Título e Identificador del Mockup Activo */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentItem.color} flex items-center justify-center shadow-md shadow-orange-500/10`}>
              <currentItem.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Mockup Activo en Celular
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {currentIndex + 1} de {MOCKUP_LIST.length}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{currentItem.title}</span>
                <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                  — {currentItem.description}
                </span>
              </h2>
            </div>
          </div>

          {/* Botones de Navegación Rápida y Modos */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoTour(!isAutoTour)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isAutoTour
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isAutoTour ? 'Pausar Tour Automático' : 'Reproducir Tour de Pantallas'}
            >
              {isAutoTour ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Pausar Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Tour Automático</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showGrid
                  ? 'bg-orange-500 text-white border-orange-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Ver todas las interfaces en mosaico"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{showGrid ? 'Ocultar Mosaico' : 'Ver Todas (Mosaico)'}</span>
            </button>

            <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5">
              <button
                onClick={handlePrev}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                title="Mockup Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-bold px-2 text-slate-400">
                {currentIndex + 1}/{MOCKUP_LIST.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                title="Siguiente Mockup"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros por Categoría */}
        <div className="flex items-center justify-between gap-2 pt-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-orange-400" />
              Filtrar:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 shrink-0 hidden md:inline">
            Toca una pantalla para cargarla al instante dentro del celular
          </span>
        </div>

        {/* Carrusel Horizontal de Interfaces */}
        {!showGrid && (
          <div
            ref={scrollRef}
            className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80 overflow-x-auto pb-1 scroll-smooth"
          >
            {filteredMockups.map((mockup) => {
              const isActive = mockup.id === currentMockup;
              const Icon = mockup.icon;
              return (
                <button
                  key={mockup.id}
                  data-mockup-id={mockup.id}
                  onClick={() => {
                    setIsAutoTour(false);
                    onSelectMockup(mockup.id);
                  }}
                  className={`group shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all border ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 border-orange-500 text-white shadow-md shadow-orange-500/10'
                      : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                      isActive
                        ? 'bg-orange-500 text-white scale-105'
                        : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold whitespace-nowrap leading-none">
                        {mockup.shortTitle}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px] mt-0.5">
                      {mockup.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Vista en Mosaico Desplegable */}
      {showGrid && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                Mosaico Completo de Interfaces ({filteredMockups.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Selecciona una tarjeta para proyectar la interfaz dentro del celular
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {filteredMockups.map((mockup, idx) => {
              const isActive = mockup.id === currentMockup;
              const Icon = mockup.icon;
              return (
                <div
                  key={mockup.id}
                  onClick={() => {
                    setIsAutoTour(false);
                    onSelectMockup(mockup.id);
                  }}
                  className={`group relative p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-800/90 border-orange-500 ring-2 ring-orange-500/30 shadow-lg shadow-orange-500/10'
                      : 'bg-slate-800/40 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-tr ${mockup.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-900/80 text-slate-300 border border-slate-700">
                      #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                      {mockup.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                      {mockup.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {mockup.category}
                    </span>
                    {isActive ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        En Celular
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-200 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3 h-3" /> Ver
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
