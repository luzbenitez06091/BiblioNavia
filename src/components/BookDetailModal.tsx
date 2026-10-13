import React, { useState } from 'react';
import {
  X,
  Star,
  Calendar,
  Layers,
  MapPin,
  Building,
  Hash,
  CheckCircle2,
  Clock,
  BookmarkPlus,
  AlertCircle,
} from 'lucide-react';
import { Libro } from '../types';
import { useBiblioStore } from '../services/store';
import { getBookCover } from '../services/mockData';

interface BookDetailModalProps {
  libro: Libro | null;
  onClose: () => void;
  onOpenLoans?: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  libro,
  onClose,
  onOpenLoans,
}) => {
  const {
    currentUser,
    requestLoan,
    reserveBook,
    toggleFavorite,
    isFavorite,
    reservations,
  } = useBiblioStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!libro) return null;

  const favorite = isFavorite(libro.idLibro);
  const pendingReservationsCount = reservations.filter(
    (r) => r.libroId === libro.idLibro && r.estado === 'Pendiente'
  ).length;

  const handleLoan = () => {
    const ok = requestLoan(libro);
    if (ok) {
      setToastMessage('¡Préstamo solicitado! Redirigiendo a tus Préstamos activos...');
      setTimeout(() => {
        onClose();
        if (onOpenLoans) {
          onOpenLoans();
        }
      }, 600);
    } else {
      setToastMessage('Ya tienes un préstamo activo o en trámite para este libro.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleReserve = () => {
    reserveBook(libro);
    setToastMessage(`¡Libro reservado! Quedaste en la posición #${pendingReservationsCount + 1} de la cola.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFav = () => {
    toggleFavorite(libro.idLibro);
    setToastMessage(favorite ? 'Eliminado de tus favoritos.' : '¡Agregado a tus favoritos!');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Prestado':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-300">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-4 right-4 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Barra Superior */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Detalle del Ejemplar
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleFav}
              className={`p-2 rounded-full transition-colors ${
                favorite ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Star className={`w-5 h-5 ${favorite ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido Desplazable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Portada grande y cabecera */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-36 h-52 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0 relative flex items-center justify-center">
              <img
                src={getBookCover(libro)}
                alt={libro.titulo}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                  {libro.categoria}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(libro.estado)}`}>
                  {libro.estado}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-[#0F2B48] leading-tight">
                {libro.titulo}
              </h2>

              <p className="text-sm font-medium text-slate-600">
                Por {libro.autor}
              </p>

              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="font-semibold text-slate-800">{libro.ubicacion}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ficha Técnica Requerida */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Editorial</span>
              <span className="font-bold text-slate-800 truncate block">{libro.editorial || 'No indicada'}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">ISBN</span>
              <span className="font-mono font-bold text-slate-800 truncate block">{libro.isbn || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Año</span>
              <span className="font-bold text-slate-800 block">{libro.anio}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Páginas</span>
              <span className="font-bold text-slate-800 block">{libro.paginas} págs.</span>
            </div>
          </div>

          {/* Sinopsis / Descripción */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Sinopsis del libro
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {libro.descripcion || 'Sinopsis general disponible en la biblioteca.'}
            </p>
          </div>

          {/* Estado de Cola si está prestado */}
          {libro.estado !== 'Disponible' && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">Ejemplar actualmente en préstamo.</span>
                <p className="text-amber-800 mt-0.5">
                  Hay {pendingReservationsCount} estudiante(s) esperando en fila. Si lo reservas ahora, quedarás en la posición #{pendingReservationsCount + 1}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Barra de Acciones Fija Inferior */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          {libro.estado === 'Disponible' ? (
            <button
              onClick={handleLoan}
              className="w-full h-12 bg-[#0F2B48] hover:bg-[#0a1e33] active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <BookmarkPlus className="w-4 h-4 text-orange-400" />
              <span>Solicitar Préstamo Escolar</span>
            </button>
          ) : (
            <button
              onClick={handleReserve}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Reservar Libro (Fila de espera)</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleToggleFav}
              className={`flex-1 h-10 border rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                favorite
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favorite ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{favorite ? 'En tus Favoritos' : 'Agregar a Favoritos'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
