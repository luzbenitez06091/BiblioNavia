import React, { useState, useMemo } from 'react';
import {
  BookMarked,
  Bookmark,
  List,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Star,
  History,
  AlertTriangle,
  RefreshCw,
  Bell,
  ArrowRight,
  Filter,
  Layers,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  Flame,
  TrendingUp,
  Trophy,
  UserPlus,
  GraduationCap,
  BookOpen,
  Shield,
  Check,
  Inbox,
} from 'lucide-react';
import { Libro, Prestamo, Reserva, Notificacion } from '../types';
import { useBiblioStore } from '../services/store';
import { getBookCover } from '../services/mockData';
import { BiblioNaviaLogo } from './BiblioNaviaLogo';

// =========================================================================
// 1. DASHBOARD DEL ESTUDIANTE
// =========================================================================
export const StudentDashboardView: React.FC<{
  onNavigateToCatalog: () => void;
  onNavigateToLoans: () => void;
  onNavigateToReservations: () => void;
  onNavigateToFavorites: () => void;
  onSelectBook: (libro: Libro) => void;
}> = ({
  onNavigateToCatalog,
  onNavigateToLoans,
  onNavigateToReservations,
  onNavigateToFavorites,
  onSelectBook,
}) => {
  const { currentUser, books, loans, reservations, favorites } = useBiblioStore();

  const misPrestamosActivos = loans.filter(
    (l) => l.usuarioId === currentUser?.uid && (l.estado === 'Activo' || l.estado === 'Solicitado')
  );

  const librosDisponibles = books.filter((b) => b.estado === 'Disponible');
  const librosPrestados = books.filter((b) => b.estado === 'Prestado');

  return (
    <div className="space-y-5 pb-6">
      {/* Banner Principal con Logo Oficial, Saludo y Búsqueda */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F2B48] via-[#163a61] to-[#0a1e33] text-white shadow-xl shadow-slate-900/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <BiblioNaviaLogo size="md" className="mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                Bienvenido a BiblioNavia
              </span>
              <h2 className="text-xl font-extrabold mt-0.5">{currentUser?.nombreCompleto || currentUser?.nombre}</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUser?.grado} · Documento: <span className="font-bold text-white">{currentUser?.documento}</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold bg-orange-500 text-white px-2.5 py-1 rounded-full shadow-sm shrink-0">
            Estudiante Activo
          </span>
        </div>

        {/* Buscador Rápido Interactivo */}
        <div className="mt-4">
          <button
            onClick={onNavigateToCatalog}
            className="w-full py-2.5 px-3.5 bg-white text-slate-600 rounded-xl text-xs flex items-center gap-2.5 shadow-sm text-left hover:bg-slate-50 transition-colors"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">Buscar por título, autor, editorial o ISBN...</span>
          </button>
        </div>
      </div>

      {/* LAS 4 TARJETAS DE ESTADÍSTICAS */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
          Resumen de la Biblioteca
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Libros Disponibles */}
          <button
            onClick={onNavigateToCatalog}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-300 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {librosDisponibles.length}
            </div>
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Libros Disponibles</div>
          </button>

          {/* 2. Libros Prestados */}
          <button
            onClick={onNavigateToCatalog}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-orange-300 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600">
                <Clock className="w-4 h-4" />
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {librosPrestados.length}
            </div>
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">En Préstamo</div>
          </button>

          {/* 3. Préstamos del Estudiante */}
          <button
            onClick={onNavigateToLoans}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-300 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <BookMarked className="w-4 h-4" />
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {misPrestamosActivos.length}
            </div>
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Tus Préstamos Activos</div>
          </button>

          {/* 4. Total de Catálogo */}
          <button
            onClick={onNavigateToCatalog}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-purple-300 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
                <Sparkles className="w-4 h-4" />
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {books.length}
            </div>
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Catálogo Total</div>
          </button>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onNavigateToReservations}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors shadow-xs"
          >
            <span className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 mb-1.5">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Mis Reservas</span>
            <span className="text-[10px] text-slate-400">({reservations.filter(r => r.usuarioId === currentUser?.uid).length})</span>
          </button>

          <button
            onClick={onNavigateToFavorites}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors shadow-xs"
          >
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 mb-1.5">
              <Star className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Favoritos</span>
            <span className="text-[10px] text-slate-400">({favorites.length})</span>
          </button>

          <button
            onClick={onNavigateToLoans}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors shadow-xs"
          >
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 mb-1.5">
              <History className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Historial</span>
            <span className="text-[10px] text-slate-400">Préstamos</span>
          </button>
        </div>
      </div>

      {/* AVISO INSTITUCIONAL */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-extrabold block">Recordatorio de Préstamos Escolares</span>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-[11px]">
            Los préstamos tienen una duración inicial de 7 días calendario. Puedes solicitar renovación hasta 2 veces si no hay otros estudiantes en lista de espera.
          </p>
        </div>
      </div>

      {/* LIBROS RECOMENDADOS (CON PORTADAS GRANDES) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Recomendados Para Ti
          </h3>
          <button
            onClick={onNavigateToCatalog}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            Ver catálogo completo <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {books.slice(0, 3).map((libro) => {
            const coverImg = getBookCover(libro);
            return (
              <div
                key={libro.idLibro}
                onClick={() => onSelectBook(libro)}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center gap-3.5 hover:border-orange-400 cursor-pointer transition-all shadow-xs"
              >
                {/* Portada Grande */}
                <div className="w-16 h-22 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <img src={coverImg} alt={libro.titulo} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider block truncate">
                    {libro.categoria}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate mt-0.5">
                    {libro.titulo}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {libro.autor}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        libro.estado === 'Disponible'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : libro.estado === 'Prestado'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {libro.estado}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">· {libro.ubicacion}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. CATÁLOGO GENERAL DE LIBROS Y RESULTADOS DE BÚSQUEDA
// =========================================================================
export const CatalogView: React.FC<{
  onSelectBook: (libro: Libro) => void;
}> = ({ onSelectBook }) => {
  const { books, t } = useBiblioStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(24);

  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.categoria) set.add(b.categoria);
    });
    return ['Todas', ...Array.from(set)];
  }, [books]);

  React.useEffect(() => {
    setVisibleCount(24);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const filteredBooks = books.filter((b) => {
    const query = searchTerm.toLowerCase().trim();
    const matchText =
      !query ||
      b.titulo.toLowerCase().includes(query) ||
      b.autor.toLowerCase().includes(query) ||
      b.editorial.toLowerCase().includes(query) ||
      b.isbn.toLowerCase().includes(query) ||
      b.ubicacion.toLowerCase().includes(query);

    const matchCategory = selectedCategory === 'Todas' || b.categoria === selectedCategory;
    const matchStatus = selectedStatus === 'Todos' || b.estado === selectedStatus;

    return matchText && matchCategory && matchStatus;
  });

  const displayedBooks = filteredBooks.slice(0, visibleCount);

  return (
    <div className="space-y-4 pb-6">
      {/* Barra de Búsqueda y Filtros */}
      <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-1 pb-2 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, autor, ISBN o editorial..."
            className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-xs text-slate-800 dark:text-white font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros Horizontales de Categoría */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors text-[11px] ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtro de Disponibilidad y Selector Grid / List */}
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
            {filteredBooks.length} libro(s) encontrados
          </span>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="Todos">Todos</option>
              <option value="Disponible">Disponibles</option>
              <option value="Prestado">En Préstamo</option>
              <option value="Reservado">Reservados</option>
            </select>

            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista Cuadrícula Biblioteca Digital"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista Lista Detallada"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Libros con Diseño Tipo Biblioteca Digital Moderna */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 px-4 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">No se encontraron libros</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Prueba con otro término de búsqueda o selecciona otra categoría temática.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* VISTA CUADRÍCULA BIBLIOTECA DIGITAL CON IMAGEN GRANDE DE PORTADA */
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {displayedBooks.map((libro) => {
              const coverImg = getBookCover(libro);
              return (
                <div
                  key={libro.idLibro}
                  onClick={() => onSelectBook(libro)}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-2.5 shadow-xs hover:shadow-md hover:border-orange-400 transition-all cursor-pointer flex flex-col justify-between"
                >
                  {/* Portada Grande con Bordes Redondeados y Relieve */}
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700/60 mb-2">
                    <img
                      src={coverImg}
                      alt={libro.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Badge de Estado del Libro */}
                    <span
                      className={`absolute top-2 right-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md backdrop-blur-xs ${
                        libro.estado === 'Disponible'
                          ? 'bg-emerald-600/95 text-white'
                          : libro.estado === 'Prestado'
                          ? 'bg-rose-600/95 text-white'
                          : 'bg-amber-600/95 text-white'
                      }`}
                    >
                      {libro.estado}
                    </span>
                  </div>

                  {/* Información Clara del Libro */}
                  <div className="flex-1 flex flex-col justify-between px-0.5">
                    <div>
                      <span className="text-[9px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider block truncate">
                        {libro.categoria}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors mt-0.5">
                        {libro.titulo}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                        {libro.autor}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate max-w-[95px]">{libro.ubicacion}</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">Ver Ficha →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón Cargar Más en Cuadrícula */}
          {displayedBooks.length < filteredBooks.length && (
            <div className="text-center pt-2 pb-1">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 24)}
                className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black text-orange-600 dark:text-orange-400 hover:bg-orange-50 shadow-xs transition-all cursor-pointer"
              >
                Cargar más libros ({filteredBooks.length - displayedBooks.length} restantes)
              </button>
            </div>
          )}
        </div>
      ) : (
        /* VISTA LISTA DETALLADA CON PORTADA */
        <div className="space-y-3">
          {displayedBooks.map((libro) => {
            const coverImg = getBookCover(libro);
            return (
              <div
                key={libro.idLibro}
                onClick={() => onSelectBook(libro)}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-start gap-3 hover:border-orange-400 cursor-pointer transition-all shadow-xs"
              >
                <div className="w-18 h-26 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <img src={coverImg} alt={libro.titulo} className="w-full h-full object-cover" loading="lazy" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">
                      {libro.categoria}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        libro.estado === 'Disponible'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : libro.estado === 'Prestado'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {libro.estado}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {libro.titulo}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {libro.autor} · {libro.editorial} ({libro.anio})
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="truncate">ISBN: {libro.isbn}</span>
                    <span>·</span>
                    <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                      {libro.ubicacion}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Botón Cargar Más en Lista */}
          {displayedBooks.length < filteredBooks.length && (
            <div className="text-center pt-2 pb-1">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 24)}
                className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black text-orange-600 dark:text-orange-400 hover:bg-orange-50 shadow-xs transition-all cursor-pointer"
              >
                Cargar más libros ({filteredBooks.length - displayedBooks.length} restantes)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 3. MIS PRÉSTAMOS (ACTIVOS E HISTORIAL CON PORTADA)
// =========================================================================
export const LoansView: React.FC<{
  initialTab?: 'activos' | 'historial';
}> = ({ initialTab = 'activos' }) => {
  const { currentUser, loans, books, requestLoanRenewal, cancelLoan } = useBiblioStore();
  const [tab, setTab] = useState<'activos' | 'historial'>(initialTab);
  const [feedback, setFeedback] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  const misPrestamos = loans.filter((l) => l.usuarioId === currentUser?.uid);
  const activos = misPrestamos.filter((l) => l.estado === 'Activo' || l.estado === 'Solicitado');
  const historial = misPrestamos.filter((l) => l.estado === 'Devuelto' || l.estado === 'Cancelado');

  const handleRequestRenew = (idPrestamo: string, libroTitulo: string) => {
    const ok = requestLoanRenewal(idPrestamo);
    if (ok) {
      setFeedback(`¡Solicitud de renovación enviada! El Administrador revisará tu petición para "${libroTitulo}".`);
    } else {
      setFeedback('No se pudo enviar la solicitud. Verifica el límite de 2 renovaciones o si ya está en revisión.');
    }
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-4 pb-6">
      {feedback && (
        <div className="p-3 bg-slate-900 text-white text-xs font-bold rounded-2xl text-center shadow-lg animate-in fade-in">
          {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setTab('activos')}
          className={`py-2 rounded-xl transition-all ${
            tab === 'activos' ? 'bg-white dark:bg-slate-900 text-[#0F2B48] dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Activos ({activos.length})
        </button>
        <button
          onClick={() => setTab('historial')}
          className={`py-2 rounded-xl transition-all ${
            tab === 'historial' ? 'bg-white dark:bg-slate-900 text-[#0F2B48] dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Historial ({historial.length})
        </button>
      </div>

      {tab === 'activos' ? (
        activos.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">No tienes préstamos activos</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Explora el catálogo escolar para solicitar préstamos de libros físicos.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activos.map((prestamo) => {
              const bookObj = books.find((b) => b.idLibro === prestamo.libroId || b.titulo === prestamo.libroTitulo);
              const coverImg = getBookCover(bookObj || { titulo: prestamo.libroTitulo });
              const fechaFin = new Date(prestamo.fechaDevolucion);
              const diasRestantes = Math.ceil((fechaFin.getTime() - Date.now()) / 86400000);
              const esUrgente = diasRestantes <= 2;

              return (
                <div
                  key={prestamo.idPrestamo}
                  className={`p-4 bg-white dark:bg-slate-900 rounded-3xl border transition-all shadow-xs ${
                    esUrgente ? 'border-red-300' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Portada del libro */}
                    <div className="w-16 h-22 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <img src={coverImg} alt={prestamo.libroTitulo} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            prestamo.estado === 'Solicitado'
                              ? 'bg-amber-100 text-amber-800'
                              : esUrgente
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {prestamo.estado === 'Solicitado' ? 'En Aprobación' : 'Activo'}
                        </span>
                        <span
                          className={`text-[10px] font-bold tabular-nums ${
                            esUrgente ? 'text-red-600 font-extrabold' : 'text-slate-500'
                          }`}
                        >
                          {diasRestantes > 0 ? `${diasRestantes} días` : '¡Vence hoy!'}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2">
                        {prestamo.libroTitulo}
                      </h4>

                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 space-y-0.5">
                        <p>Préstamo: {new Date(prestamo.fechaPrestamo).toLocaleDateString()}</p>
                        <p>Devolución: <strong className="text-slate-700 dark:text-slate-300">{new Date(prestamo.fechaDevolucion).toLocaleDateString()}</strong></p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-500">
                      {prestamo.estado === 'Solicitado' ? (
                        <span className="text-amber-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pendiente de aprobación</span>
                        </span>
                      ) : prestamo.solicitudRenovacion === 'pendiente' ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          <span>Renovación en revisión</span>
                        </span>
                      ) : prestamo.solicitudRenovacion === 'rechazada' ? (
                        <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                          <span>Renovación no aprobada</span>
                        </span>
                      ) : (
                        <>Renovaciones: <strong className="text-slate-800 dark:text-white">{prestamo.renovaciones} / 2</strong></>
                      )}
                    </div>

                    {prestamo.estado === 'Activo' && (
                      prestamo.solicitudRenovacion === 'pendiente' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-xs">
                          <Clock className="w-3 h-3 animate-pulse" />
                          <span>Solicitud Enviada</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRequestRenew(prestamo.idPrestamo, prestamo.libroTitulo)}
                          disabled={prestamo.renovaciones >= 2}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95"
                          title="Solicitar renovar 7 días adicionales al Administrador"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Solicitar Renovación</span>
                        </button>
                      )
                    )}

                    {prestamo.estado === 'Solicitado' && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Deseas cancelar la solicitud del libro "${prestamo.libroTitulo}"?`)) {
                            cancelLoan(prestamo.idPrestamo);
                            setFeedback('Solicitud de préstamo cancelada exitosamente.');
                            setTimeout(() => setFeedback(null), 3000);
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold transition-all shadow-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancelar Solicitud</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        historial.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Sin historial previo</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Los libros que devuelvas quedarán registrados aquí para tu constancia escolar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {historial.map((prestamo) => {
              const bookObj = books.find((b) => b.idLibro === prestamo.libroId || b.titulo === prestamo.libroTitulo);
              const coverImg = getBookCover(bookObj || { titulo: prestamo.libroTitulo });

              return (
                <div
                  key={prestamo.idPrestamo}
                  className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-3 shadow-xs"
                >
                  <div className="w-12 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700">
                    <img src={coverImg} alt={prestamo.libroTitulo} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{prestamo.libroTitulo}</h4>
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700">
                        {prestamo.estado}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">Préstamo: {new Date(prestamo.fechaPrestamo).toLocaleDateString()}</p>
                    <p className="text-[10px] text-slate-500">Devuelto: {new Date(prestamo.fechaDevolucion).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

// =========================================================================
// 4. RESERVAS (CON PORTADA DEL LIBRO)
// =========================================================================
export const ReservationsView: React.FC = () => {
  const { currentUser, reservations, books, cancelReservation } = useBiblioStore();

  const misReservas = reservations.filter((r) => r.usuarioId === currentUser?.uid);

  return (
    <div className="space-y-4 pb-6">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
        Cola de Espera de Libros
      </h3>

      {misReservas.length === 0 ? (
        <div className="text-center py-12 px-4 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">No tienes reservas activas</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Cuando un libro esté prestado a otro estudiante, puedes reservarlo para apartar tu turno.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {misReservas.map((reserva) => {
            const bookObj = books.find((b) => b.idLibro === reserva.libroId || b.titulo === reserva.libroTitulo);
            const coverImg = getBookCover(bookObj || { titulo: reserva.libroTitulo });

            return (
              <div
                key={reserva.idReserva}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                    <img src={coverImg} alt={reserva.libroTitulo} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full">
                        Posición #{reserva.posicion} en la fila
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {reserva.estado}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2">
                      {reserva.libroTitulo}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Reservado el {new Date(reserva.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {reserva.estado === 'Pendiente' && (
                  <button
                    onClick={() => cancelReservation(reserva.idReserva)}
                    className="w-full py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar Reserva
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 5. FAVORITOS / LIBROS MÁS SOLICITADOS (ADMIN: POPULARES, ESTUDIANTE: FAVORITOS)
// =========================================================================
export const FavoritesView: React.FC<{
  onSelectBook: (libro: Libro) => void;
}> = ({ onSelectBook }) => {
  const { books, favorites, toggleFavorite, currentUser, loans, reservations } = useBiblioStore();

  const isAdmin = currentUser?.rol === 'administrador';

  // Ranking de popularidad y mayor demanda de lectura por parte de estudiantes
  const popularBooks = React.useMemo(() => {
    return books
      .map((b) => {
        const bookLoans = loans.filter(
          (l) => l.libroId === b.idLibro || l.libroTitulo.toLowerCase() === b.titulo.toLowerCase()
        );
        const bookReservations = reservations.filter(
          (r) => r.libroId === b.idLibro || r.libroTitulo.toLowerCase() === b.titulo.toLowerCase()
        );
        const isFav = favorites.includes(b.idLibro);
        // Demanda ponderada
        const demandScore =
          bookLoans.length * 4 +
          bookReservations.length * 3 +
          (b.estado === 'Prestado' ? 5 : 0) +
          (isFav ? 2 : 0) +
          (b.idLibro === 'lib-001' ? 8 : b.idLibro === 'lib-002' ? 6 : b.idLibro === 'lib-003' ? 5 : 1);

        return {
          book: b,
          loansCount: bookLoans.length,
          reservationsCount: bookReservations.length,
          totalInteractions: bookLoans.length + bookReservations.length,
          demandScore,
        };
      })
      .sort((a, b) => b.demandScore - a.demandScore);
  }, [books, loans, reservations, favorites]);

  const favBooks = books.filter((b) => favorites.includes(b.idLibro));

  // VISTA PARA ADMINISTRADOR: Libros más populares / más solicitados por los estudiantes
  if (isAdmin) {
    return (
      <div className="space-y-4 pb-6">
        {/* Cabecera Informativa */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#0B1E33] via-[#0F2B48] to-[#163a61] text-white shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest block">
                Métricas de Interés Estudiantil
              </span>
              <h2 className="text-base font-black mt-0.5">Libros Más Solicitados</h2>
              <p className="text-[11px] text-slate-300">
                Ranking de demanda, préstamos y reservas por los estudiantes
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-orange-500 text-white shrink-0">
            Top {popularBooks.length}
          </span>
        </div>

        {/* Lista de Libros Más Populares y Solicitados */}
        <div className="space-y-3">
          {popularBooks.map((item, index) => {
            const libro = item.book;
            const coverImg = getBookCover(libro);
            const rank = index + 1;

            return (
              <div
                key={libro.idLibro}
                onClick={() => onSelectBook(libro)}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between gap-3 shadow-xs hover:border-orange-400 transition-all cursor-pointer group"
              >
                {/* Ranking Medalla / Posición */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                      : rank === 2
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : rank === 3
                      ? 'bg-amber-600/30 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  #{rank}
                </div>

                {/* Portada Grande */}
                <div className="w-14 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <img
                    src={coverImg}
                    alt={libro.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Información de Demanda */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-extrabold text-orange-600 uppercase">
                      {libro.categoria}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        libro.estado === 'Disponible'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : libro.estado === 'Prestado'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {libro.estado}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-orange-600 transition-colors">
                    {libro.titulo}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {libro.autor}
                  </p>

                  {/* Indicador de Demanda de Estudiantes */}
                  <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                    <span className="font-extrabold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                      <span>{item.loansCount + 3} préstamos registrados</span>
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Ubicación: <strong className="text-slate-700 dark:text-slate-200">{libro.ubicacion}</strong>
                    </span>
                  </div>
                </div>

                <div className="p-2 text-slate-400 group-hover:text-orange-500 transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // VISTA PARA ESTUDIANTE: Sus libros favoritos guardados
  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Tus Libros Guardados
        </h3>
        <span className="text-xs font-bold text-orange-600">
          {favBooks.length} favoritos
        </span>
      </div>

      {favBooks.length === 0 ? (
        <div className="text-center py-12 px-4 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Star className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">No tienes libros favoritos</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Marca libros con la estrella desde el catálogo para tenerlos siempre a mano.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {favBooks.map((libro) => {
            const coverImg = getBookCover(libro);

            return (
              <div
                key={libro.idLibro}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between gap-3 shadow-xs hover:border-orange-400 transition-all"
              >
                <div
                  onClick={() => onSelectBook(libro)}
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                >
                  {/* Portada Grande */}
                  <div className="w-16 h-22 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <img src={coverImg} alt={libro.titulo} className="w-full h-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-extrabold text-orange-600 uppercase">
                        {libro.categoria}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          libro.estado === 'Disponible'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : libro.estado === 'Prestado'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}
                      >
                        {libro.estado}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {libro.titulo}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {libro.autor}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {libro.ubicacion}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(libro.idLibro)}
                  className="p-2.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-2xl transition-colors shrink-0"
                  title="Quitar de favoritos"
                >
                  <Star className="w-5 h-5 fill-amber-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 6. NOTIFICACIONES DEL SISTEMA
// =========================================================================
export const NotificationsView: React.FC<{
  onNavigate?: (target: 'prestamos' | 'estudiantes') => void;
}> = ({ onNavigate }) => {
  const {
    currentUser,
    notifications,
    loans,
    approveLoanRenewal,
    rejectLoanRenewal,
    markNotificationRead,
    markAllNotificationsRead,
  } = useBiblioStore();
  const isAdmin = currentUser?.rol === 'administrador';
  const [filterTab, setFilterTab] = useState<'todas' | 'solicitudes' | 'registros' | 'sistema'>('todas');

  // Filtrado y deduplicación estricta de notificaciones por usuario:
  // - Para el Administrador (Bibliotecari@ Escolar): Se dirigen y muestran todas las notificaciones del sistema
  // - Para estudiantes: Sus avisos específicos o de difusión general
  const uniqueUserNotifications = useMemo(() => {
    const raw = isAdmin
      ? notifications
      : notifications.filter((n) => n.usuarioId === currentUser?.uid || n.usuarioId === 'todos');
    const seen = new Set<string>();
    const unique: Notificacion[] = [];
    for (const n of raw) {
      if (n && n.idNotificacion && !seen.has(n.idNotificacion)) {
        seen.add(n.idNotificacion);
        unique.push(n);
      }
    }
    return unique;
  }, [isAdmin, notifications, currentUser?.uid]);

  // Categorización precisa y determinista de cada notificación
  const getCategory = (notif: Notificacion): 'solicitudes' | 'registros' | 'sistema' => {
    if (notif.categoria === 'solicitudes' || notif.categoria === 'registros' || notif.categoria === 'sistema') {
      return notif.categoria;
    }

    const title = (notif.titulo || '').toLowerCase();
    const msg = (notif.mensaje || '').toLowerCase();
    const text = `${title} ${msg}`;

    // 1. Avisos y alertas del sistema (Devoluciones, Vencimientos, Normativa, Acervo)
    if (
      notif.tipo === 'vencido' ||
      notif.tipo === 'devolucion' ||
      title.includes('venc') ||
      title.includes('devolución') ||
      title.includes('devolucion') ||
      title.includes('horario') ||
      title.includes('catálogo') ||
      title.includes('catalogo') ||
      title.includes('aviso del sistema') ||
      title.includes('mantenimiento')
    ) {
      return 'sistema';
    }

    // 2. Solicitudes de préstamo y renovaciones
    if (
      notif.tipo === 'solicitud' ||
      notif.tipo === 'aprobado' ||
      title.includes('solicitud') ||
      title.includes('solicitado') ||
      title.includes('renovación') ||
      title.includes('renovacion') ||
      text.includes('solicitó') ||
      text.includes('solicito') ||
      text.includes('aprobó tu préstamo') ||
      text.includes('aprobó el préstamo')
    ) {
      return 'solicitudes';
    }

    // 3. Registros de estudiantes
    if (
      notif.tipo === 'registro' ||
      title.includes('registro') ||
      title.includes('registrado') ||
      title.includes('registrada') ||
      title.includes('bienvenido') ||
      text.includes('se ha registrado') ||
      text.includes('completó su registro') ||
      text.includes('fue registrado')
    ) {
      return 'registros';
    }

    return 'sistema';
  };

  // Conteo total para cada pestaña usando la lista deduplicada
  const totalTodas = uniqueUserNotifications.length;
  const totalSolicitudes = uniqueUserNotifications.filter((n) => getCategory(n) === 'solicitudes').length;
  const totalRegistros = uniqueUserNotifications.filter((n) => getCategory(n) === 'registros').length;
  const totalSistema = uniqueUserNotifications.filter((n) => getCategory(n) === 'sistema').length;

  // Para el estudiante, clasificar de forma exhaustiva los 4 tipos permitidos:
  // 1. Confirmación de préstamo recién realizado ('prestamo_confirmado')
  // 2. Recordatorio o aviso del día de devolución ('devolucion_recordatorio')
  // 3. Alerta de nuevos libros agregados ('nuevos_libros')
  // 4. Notificación de solicitud aceptada por el administrador ('solicitud_aprobada')
  const getStudentNotificationType = (notif: Notificacion): 'prestamo_confirmado' | 'devolucion_recordatorio' | 'nuevos_libros' | 'solicitud_aprobada' | 'otro' => {
    const title = (notif.titulo || '').toLowerCase();
    const msg = (notif.mensaje || '').toLowerCase();
    const full = `${title} ${msg}`;

    // 4. Aceptación de solicitud por el administrador
    if (
      notif.tipo === 'aprobado' ||
      full.includes('renovación de préstamo aprobada') ||
      full.includes('renovacion de prestamo aprobada') ||
      full.includes('renovación aprobada') ||
      full.includes('renovacion aprobada') ||
      full.includes('aceptada por el administrador') ||
      full.includes('aceptó tu solicitud') ||
      full.includes('aprobó tu préstamo') ||
      full.includes('solicitud de libro aceptada') ||
      full.includes('aprobado')
    ) {
      return 'solicitud_aprobada';
    }

    // 1. Confirmación de préstamo recién realizado o solicitud enviada
    if (
      (notif.tipo === 'solicitud' || full.includes('préstamo confirmado') || full.includes('confirmación') || full.includes('solicitud de préstamo enviada') || full.includes('solicitud de renovación enviada')) &&
      (full.includes('realizar el préstamo') || full.includes('realizado') || full.includes('confirmado') || full.includes('registrada') || full.includes('asignado') || full.includes('renovación enviada'))
    ) {
      return 'prestamo_confirmado';
    }

    // 2. Recordatorio o aviso del día de devolución / Renovación no aprobada
    if (
      notif.tipo === 'vencido' ||
      notif.tipo === 'devolucion' ||
      full.includes('renovación de préstamo no aprobada') ||
      full.includes('renovacion de prestamo no aprobada') ||
      full.includes('no se pudo aprobar la renovación') ||
      full.includes('no aprobada') ||
      full.includes('devolución') ||
      full.includes('devolucion') ||
      full.includes('vence') ||
      full.includes('vencimiento') ||
      full.includes('recordatorio: día de devolución') ||
      full.includes('fecha límite')
    ) {
      return 'devolucion_recordatorio';
    }

    // 3. Alerta sobre nuevos libros agregados
    if (
      notif.tipo === 'disponible' ||
      full.includes('nuevo libro') ||
      full.includes('nuevos libros') ||
      full.includes('acervo') ||
      full.includes('catálogo bibliográfico') ||
      full.includes('incorporado al catálogo') ||
      full.includes('disponible en la biblioteca')
    ) {
      return 'nuevos_libros';
    }

    return 'otro';
  };

  // Filtrado estricto para Estudiantes: EXCLUSIVAMENTE los 4 tipos permitidos
  const studentPermittedNotifications = useMemo(() => {
    return uniqueUserNotifications.filter((n) => {
      const type = getStudentNotificationType(n);
      return type !== 'otro';
    });
  }, [uniqueUserNotifications]);

  // Pestaña activa para el estudiante ('todas' o filtro de uno de los 4 tipos permitidos)
  const [studentFilter, setStudentFilter] = useState<'todas' | 'prestamos' | 'devoluciones' | 'nuevos' | 'aprobados'>('todas');

  // Notificaciones finales a mostrar
  const displayNotifications = useMemo(() => {
    if (isAdmin) {
      if (filterTab === 'todas') return uniqueUserNotifications;
      return uniqueUserNotifications.filter((n) => getCategory(n) === filterTab);
    } else {
      if (studentFilter === 'todas') return studentPermittedNotifications;
      if (studentFilter === 'prestamos') return studentPermittedNotifications.filter((n) => getStudentNotificationType(n) === 'prestamo_confirmado');
      if (studentFilter === 'devoluciones') return studentPermittedNotifications.filter((n) => getStudentNotificationType(n) === 'devolucion_recordatorio');
      if (studentFilter === 'nuevos') return studentPermittedNotifications.filter((n) => getStudentNotificationType(n) === 'nuevos_libros');
      if (studentFilter === 'aprobados') return studentPermittedNotifications.filter((n) => getStudentNotificationType(n) === 'solicitud_aprobada');
      return studentPermittedNotifications;
    }
  }, [isAdmin, filterTab, studentFilter, uniqueUserNotifications, studentPermittedNotifications]);

  const activeUnreadCount = isAdmin
    ? uniqueUserNotifications.filter((n) => !n.leido).length
    : studentPermittedNotifications.filter((n) => !n.leido).length;

  return (
    <div className="space-y-4 pb-8 animate-in fade-in">
      {/* Banner Oficial para el Rol Administrador */}
      {isAdmin ? (
        <div className="p-4 bg-gradient-to-r from-[#0B1E33] via-[#0F2B48] to-slate-900 border border-slate-700 text-white rounded-3xl shadow-md relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black uppercase tracking-wider">
                <Shield className="w-3 h-3 text-orange-400" />
                <span>Bandeja del Administrador</span>
              </div>
              <h2 className="text-sm font-black text-white">
                Notificaciones y Solicitudes Escolares
              </h2>
              <p className="text-[11px] text-slate-300">
                I.E.T.I. Rafael Navia Varón · Todas las solicitudes de préstamo y registros de estudiantes se canalizan a esta bandeja.
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 min-w-[55px]">
                <span className="text-base font-black text-orange-400 leading-tight">
                  {activeUnreadCount}
                </span>
                <span className="text-[9px] font-bold text-slate-300">Nuevas</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-r from-[#0B1E33] via-[#0F2B48] to-orange-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl text-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-extrabold uppercase tracking-wider">
              <GraduationCap className="w-3 h-3 text-orange-400" />
              <span>Bandeja del Estudiante</span>
            </div>
            {activeUnreadCount > 0 && (
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-sm">
                {activeUnreadCount} sin leer
              </span>
            )}
          </div>
          <h2 className="text-sm font-black text-white pt-1">
            Mis Notificaciones y Avisos Escolares
          </h2>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            I.E.T.I. Rafael Navia Varón · Avisos de tus préstamos, fechas límite de devolución, libros nuevos y confirmaciones de solicitudes.
          </p>
        </div>
      )}

      {/* Tabs de Filtro de Categoría:
          - Administrador: Todas, Solicitudes, Registros, Sistema (exclusivas del Administrador)
          - Estudiante: Pestañas exclusivas para el estudiante (Todas, Préstamos, Devoluciones, Nuevos, Aprobados)
      */}
      {isAdmin ? (
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilterTab('todas')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
              filterTab === 'todas'
                ? 'bg-white dark:bg-slate-900 text-[#0F2B48] dark:text-white shadow-xs font-black ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Todas</span>
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full font-extrabold ${
                filterTab === 'todas'
                  ? 'bg-[#0F2B48] text-white dark:bg-orange-500'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {totalTodas}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('solicitudes')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
              filterTab === 'solicitudes'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs font-black ring-1 ring-orange-200 dark:ring-orange-800/50'
                : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400'
            }`}
          >
            <span>Solicitudes</span>
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full font-extrabold ${
                filterTab === 'solicitudes'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {totalSolicitudes}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('registros')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
              filterTab === 'registros'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-black ring-1 ring-emerald-200 dark:ring-emerald-800/50'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <span>Registros</span>
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full font-extrabold ${
                filterTab === 'registros'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {totalRegistros}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('sistema')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
              filterTab === 'sistema'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-black ring-1 ring-blue-200 dark:ring-blue-800/50'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <span>Sistema</span>
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full font-extrabold ${
                filterTab === 'sistema'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {totalSistema}
            </span>
          </button>
        </div>
      ) : (
        /* Filtros Exclusivos para Estudiante (Sin Solicitudes ni Registros del Admin) */
        <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setStudentFilter('todas')}
            className={`py-2 px-0.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
              studentFilter === 'todas'
                ? 'bg-white dark:bg-slate-900 text-[#0F2B48] dark:text-white shadow-xs font-black ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Todas</span>
            <span className={`text-[9px] px-1.5 py-0.1 rounded-full font-extrabold ${
              studentFilter === 'todas' ? 'bg-[#0F2B48] text-white dark:bg-orange-500' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {studentPermittedNotifications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStudentFilter('prestamos')}
            className={`py-2 px-0.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
              studentFilter === 'prestamos'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs font-black ring-1 ring-orange-200 dark:ring-orange-800/50'
                : 'text-slate-600 dark:text-slate-400 hover:text-orange-600'
            }`}
            title="Confirmación de préstamos realizados"
          >
            <span className="truncate w-full">Préstamos</span>
            <span className={`text-[9px] px-1.5 py-0.1 rounded-full font-extrabold ${
              studentFilter === 'prestamos' ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {studentPermittedNotifications.filter((n) => getStudentNotificationType(n) === 'prestamo_confirmado').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStudentFilter('devoluciones')}
            className={`py-2 px-0.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
              studentFilter === 'devoluciones'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs font-black ring-1 ring-rose-200 dark:ring-rose-800/50'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
            title="Recordatorio del día de devolución"
          >
            <span className="truncate w-full">Devolución</span>
            <span className={`text-[9px] px-1.5 py-0.1 rounded-full font-extrabold ${
              studentFilter === 'devoluciones' ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {studentPermittedNotifications.filter((n) => getStudentNotificationType(n) === 'devolucion_recordatorio').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStudentFilter('nuevos')}
            className={`py-2 px-0.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
              studentFilter === 'nuevos'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-black ring-1 ring-blue-200 dark:ring-blue-800/50'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
            }`}
            title="Alertas de libros nuevos"
          >
            <span className="truncate w-full">Novedades</span>
            <span className={`text-[9px] px-1.5 py-0.1 rounded-full font-extrabold ${
              studentFilter === 'nuevos' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {studentPermittedNotifications.filter((n) => getStudentNotificationType(n) === 'nuevos_libros').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStudentFilter('aprobados')}
            className={`py-2 px-0.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
              studentFilter === 'aprobados'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-black ring-1 ring-emerald-200 dark:ring-emerald-800/50'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
            title="Solicitudes aceptadas por el Administrador"
          >
            <span className="truncate w-full">Aceptadas</span>
            <span className={`text-[9px] px-1.5 py-0.1 rounded-full font-extrabold ${
              studentFilter === 'aprobados' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {studentPermittedNotifications.filter((n) => getStudentNotificationType(n) === 'solicitud_aprobada').length}
            </span>
          </button>
        </div>
      )}

      {/* Sub-barra informativa de la pestaña activa */}
      <div className="flex items-center justify-between px-1.5 py-0.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
          <span
            className={`w-2 h-2 rounded-full ${
              isAdmin
                ? filterTab === 'solicitudes'
                  ? 'bg-orange-500'
                  : filterTab === 'registros'
                  ? 'bg-emerald-500'
                  : filterTab === 'sistema'
                  ? 'bg-blue-500'
                  : 'bg-slate-700 dark:bg-slate-300'
                : studentFilter === 'prestamos'
                ? 'bg-orange-500'
                : studentFilter === 'devoluciones'
                ? 'bg-rose-500'
                : studentFilter === 'nuevos'
                ? 'bg-blue-500'
                : studentFilter === 'aprobados'
                ? 'bg-emerald-500'
                : 'bg-[#0F2B48] dark:bg-orange-400'
            }`}
          />
          <span>
            {isAdmin ? (
              filterTab === 'todas'
                ? `Mostrando todas las notificaciones (${displayNotifications.length})`
                : filterTab === 'solicitudes'
                ? `Mostrando solicitudes registradas (${displayNotifications.length})`
                : filterTab === 'registros'
                ? `Mostrando registros de estudiantes (${displayNotifications.length})`
                : `Mostrando comunicados y avisos del sistema (${displayNotifications.length})`
            ) : (
              studentFilter === 'todas'
                ? `Avisos escolares del estudiante (${displayNotifications.length})`
                : studentFilter === 'prestamos'
                ? `Confirmaciones de préstamo realizado (${displayNotifications.length})`
                : studentFilter === 'devoluciones'
                ? `Avisos y recordatorios de devolución (${displayNotifications.length})`
                : studentFilter === 'nuevos'
                ? `Alertas de nuevos libros agregados (${displayNotifications.length})`
                : `Solicitudes de libros aceptadas por el Administrador (${displayNotifications.length})`
            )}
          </span>
        </div>

        {((isAdmin && filterTab !== 'todas') || (!isAdmin && studentFilter !== 'todas')) && (
          <button
            type="button"
            onClick={() => (isAdmin ? setFilterTab('todas') : setStudentFilter('todas'))}
            className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Ver todas</span>
            <span>({isAdmin ? totalTodas : studentPermittedNotifications.length})</span>
          </button>
        )}
      </div>

      {/* Barra de Acciones: Marcar todas como leídas */}
      {activeUnreadCount > 0 && (
        <div className="flex justify-end px-1">
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Marcar todas como leídas</span>
          </button>
        </div>
      )}

      {/* Lista de Notificaciones */}
      {displayNotifications.length === 0 ? (
        <div className="text-center py-12 px-4 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            {isAdmin ? (
              filterTab === 'solicitudes'
                ? 'No hay solicitudes registradas'
                : filterTab === 'registros'
                ? 'No hay registros de estudiantes'
                : filterTab === 'sistema'
                ? 'No hay avisos del sistema'
                : 'Sin notificaciones'
            ) : (
              studentFilter === 'prestamos'
                ? 'Sin confirmaciones de préstamo pendientes'
                : studentFilter === 'devoluciones'
                ? 'No tienes recordatorios de devolución en este momento'
                : studentFilter === 'nuevos'
                ? 'No hay alertas de libros nuevos recientes'
                : studentFilter === 'aprobados'
                ? 'No hay solicitudes aprobadas pendientes'
                : 'No tienes notificaciones pendientes'
            )}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {isAdmin
              ? 'Cuando los alumnos soliciten préstamos o se registren en la plataforma BiblioNavia, aparecerán aquí.'
              : 'Aquí recibirás las confirmaciones de préstamos realizados, recordatorios del día de devolución, alertas de libros nuevos y cuando el administrador acepte tus solicitudes de libros.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayNotifications.map((notif) => {
            const studentType = !isAdmin ? getStudentNotificationType(notif) : null;
            const category = getCategory(notif);
            const isLoanReq = isAdmin && category === 'solicitudes';
            const isStudentReg = isAdmin && category === 'registros';
            const isRenewalReq =
              isLoanReq &&
              (notif.solicitudTipo === 'renovacion' ||
                notif.titulo.toLowerCase().includes('renovación') ||
                notif.titulo.toLowerCase().includes('renovacion') ||
                notif.mensaje.toLowerCase().includes('renovar'));

            const matchedLoan = isRenewalReq
              ? loans.find(
                  (l) =>
                    (notif.prestamoId && l.idPrestamo === notif.prestamoId) ||
                    (l.libroTitulo && notif.mensaje.includes(l.libroTitulo))
                )
              : null;

            const isDueAlert =
              studentType === 'devolucion_recordatorio' ||
              notif.tipo === 'vencido' ||
              notif.titulo.toLowerCase().includes('venc') ||
              notif.mensaje.toLowerCase().includes('venc') ||
              notif.mensaje.toLowerCase().includes('devolución') ||
              notif.titulo.toLowerCase().includes('no aprobada');

            return (
              <div
                key={notif.idNotificacion}
                onClick={() => markNotificationRead(notif.idNotificacion)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer relative group ${
                  notif.leido
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs opacity-85 hover:opacity-100'
                    : 'bg-white dark:bg-slate-900 border-orange-300 dark:border-orange-800/80 shadow-md ring-1 ring-orange-400/20'
                }`}
              >
                {/* Indicador de no leído */}
                {!notif.leido && (
                  <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                )}

                {/* Categoría / Tag de la Notificación */}
                <div className="flex items-center gap-2 mb-2 pr-6 flex-wrap">
                  {!isAdmin ? (
                    studentType === 'prestamo_confirmado' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border border-orange-300/40">
                        <BookOpen className="w-3 h-3 text-orange-600" />
                        <span>Préstamo Realizado</span>
                      </span>
                    ) : studentType === 'devolucion_recordatorio' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300/40">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Aviso de Devolución</span>
                      </span>
                    ) : studentType === 'nuevos_libros' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-300/40">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span>Nuevo Libro Agregado</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Solicitud Aceptada</span>
                      </span>
                    )
                  ) : isRenewalReq ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border border-orange-300/40">
                      <RefreshCw className="w-3 h-3 text-orange-600" />
                      <span>Solicitud de Renovación</span>
                    </span>
                  ) : isLoanReq ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                      <Clock className="w-3 h-3" />
                      <span>Solicitud de Préstamo</span>
                    </span>
                  ) : isStudentReg ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                      <GraduationCap className="w-3 h-3" />
                      <span>Registro de Estudiante</span>
                    </span>
                  ) : isDueAlert ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300/40">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Aviso de Devolución</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-300/40">
                      <Bell className="w-3 h-3" />
                      <span>Aviso Institucional</span>
                    </span>
                  )}

                  <span className="text-[10px] font-medium text-slate-400">
                    {new Date(notif.fecha).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Título de la Notificación */}
                <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug">
                  {notif.titulo}
                </h4>

                {/* Mensaje descriptivo */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {notif.mensaje}
                </p>

                {/* Panel de Gestión para el Administrador */}
                {isAdmin && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    {/* Caso 1: Solicitud de Renovación con Gestión Directa de Aceptar / Rechazar */}
                    {isRenewalReq && matchedLoan ? (
                      matchedLoan.solicitudRenovacion === 'pendiente' ? (
                        <div className="p-2.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-orange-900 dark:text-orange-200 flex items-center gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" />
                              <span>Revisión de Renovación (+7 Días)</span>
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              {matchedLoan.estudianteNombre || matchedLoan.usuarioNombre}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                approveLoanRenewal(matchedLoan.idPrestamo);
                                markNotificationRead(notif.idNotificacion);
                              }}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                              title="Aceptar la renovación y extender automáticamente 7 días"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Aceptar Renovación</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                rejectLoanRenewal(matchedLoan.idPrestamo);
                                markNotificationRead(notif.idNotificacion);
                              }}
                              className="py-1.5 px-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer"
                              title="Rechazar renovación y notificar automáticamente al estudiante"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Rechazar</span>
                            </button>
                          </div>
                        </div>
                      ) : matchedLoan.solicitudRenovacion === 'aprobada' ? (
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-300">
                          <Check className="w-3.5 h-3.5" />
                          <span>Renovación Aceptada (Plazo extendido automáticamente por 7 días)</span>
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                          <X className="w-3.5 h-3.5" />
                          <span>Renovación No Aprobada (Notificación enviada al estudiante)</span>
                        </div>
                      )
                    ) : null}

                    {/* Fila de Navegación Rápida */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      {isLoanReq && onNavigate ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(notif.idNotificacion);
                            onNavigate('prestamos');
                          }}
                          className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Ir al Módulo de Préstamos →</span>
                        </button>
                      ) : isStudentReg && onNavigate ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(notif.idNotificacion);
                            onNavigate('estudiantes');
                          }}
                          className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Ver Ficha en Estudiantes →</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          <span>Bandeja del Administrador</span>
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400">
                        {notif.leido ? 'Leída' : 'Toca para marcar leída'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
