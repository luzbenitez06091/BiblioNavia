import React from 'react';
import {
  Home,
  User,
  Settings,
  BookMarked,
  Star,
  Bell,
  Award,
  LogOut,
  X,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useBiblioStore } from '../services/store';
import { BiblioNaviaLogo } from './BiblioNaviaLogo';

export type DrawerNavigationTarget =
  | 'inicio'
  | 'perfil'
  | 'configuracion'
  | 'prestamos'
  | 'favoritos'
  | 'notificaciones'
  | 'creditos';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  onNavigate: (target: DrawerNavigationTarget) => void;
  onLogout: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  activeItem,
  onNavigate,
  onLogout,
}) => {
  const { currentUser, unreadCount, favorites, loans, t } = useBiblioStore();

  const isAdmin = currentUser?.rol === 'administrador';

  const activeLoansCount = loans.filter(
    (l) => l.usuarioId === currentUser?.uid && (l.estado === 'Activo' || l.estado === 'Solicitado')
  ).length;

  const menuItems: Array<{
    id: DrawerNavigationTarget;
    label: string;
    icon: any;
    badge: string | null;
    badgeColor?: string;
  }> = [
    {
      id: 'inicio',
      label: t('nav.home'),
      icon: Home,
      badge: null,
    },
    {
      id: 'perfil',
      label: t('nav.profile'),
      icon: User,
      badge: isAdmin ? t('profile.roleAdmin') : (currentUser?.grado ? currentUser.grado.split(' ')[0] : null),
      badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    },
    {
      id: 'notificaciones',
      label: t('nav.notifications'),
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount}` : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'configuracion',
      label: t('nav.settings'),
      icon: Settings,
      badge: null,
    },
    // SOLO PARA ESTUDIANTES: Remover "Mis préstamos" para el rol de Administrador
    ...(!isAdmin
      ? [
          {
            id: 'prestamos' as DrawerNavigationTarget,
            label: t('nav.loans'),
            icon: BookMarked,
            badge: activeLoansCount > 0 ? `${activeLoansCount}` : null,
            badgeColor: 'bg-orange-500 text-white',
          },
        ]
      : []),
    {
      id: 'favoritos',
      label: isAdmin ? 'Libros Más Solicitados' : t('nav.favorites'),
      icon: Star,
      badge: isAdmin ? 'Populares' : (favorites.length > 0 ? `${favorites.length}` : null),
      badgeColor: 'bg-amber-400 text-slate-900',
    },
    {
      id: 'creditos',
      label: t('nav.credits'),
      icon: Award,
      badge: 'Luz Elena M.',
      badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 overflow-hidden flex">
      {/* Backdrop con desenfoque suave y animación */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Panel del Drawer Lateral (Colores Institucionales: Azul Oscuro, Naranja y Blanco) */}
      <aside className="relative w-[82%] max-w-[310px] h-full bg-[#0B1E33] text-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 border-r border-slate-700/60">
        {/* Cabecera del Drawer con Logo y Datos de Usuario */}
        <div className="p-5 bg-gradient-to-br from-[#0A1A2C] via-[#0F2B48] to-[#163a61] border-b border-slate-700/60 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Cerrar Menú"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo Oficial BiblioNavia: Clic navega a Inicio */}
          <button
            type="button"
            onClick={() => {
              onNavigate('inicio');
              onClose();
            }}
            className="flex items-center gap-3 mb-4 text-left cursor-pointer hover:opacity-90 transition-opacity w-full group focus:outline-none"
            title="Ir a Inicio"
          >
            <BiblioNaviaLogo size="md" className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight text-white group-hover:text-orange-300 transition-colors">
                  BiblioNavia
                </h1>
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-300 font-medium leading-none">
                Biblioteca Escolar Inteligente
              </p>
            </div>
          </button>

          {/* Tarjeta Resumen del Usuario */}
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                onNavigate('perfil');
                onClose();
              }}
              className="w-full text-left group flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 hover:border-orange-500/50 hover:bg-slate-900/90 transition-all cursor-pointer focus:outline-none"
              title="Abrir Mi Perfil"
            >
              <div className="relative shrink-0">
                {currentUser.foto ? (
                  <img
                    src={currentUser.foto}
                    alt={currentUser.nombreCompleto || currentUser.nombre}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-orange-500/50"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 font-extrabold flex items-center justify-center text-sm">
                    {(currentUser.nombreCompleto || currentUser.nombre || 'U')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0A1A2C]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                  {currentUser.nombreCompleto || currentUser.nombre}
                </h3>
                <p className="text-[10px] text-slate-300 truncate">
                  {currentUser.correo}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {isAdmin ? 'Bibliotecari@ Escolar' : (currentUser.grado || 'Estudiante')}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          )}
        </div>

        {/* Lista de Navegación del Menú */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
            Navegación Principal
          </span>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-white text-orange-600' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pie del Menú con Cerrar Sesión y Crédito Destacado */}
        <div className="p-4 border-t border-slate-700/60 bg-[#091727] space-y-3">
          {/* Mini tarjeta de Créditos */}
          <div
            onClick={() => {
              onNavigate('creditos');
              onClose();
            }}
            className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center cursor-pointer hover:bg-orange-500/15 transition-colors"
          >
            <div className="flex items-center justify-center gap-1.5 text-orange-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BiblioNavia v1.0</span>
            </div>
            <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
              Aplicación realizada por <strong className="text-white font-extrabold">Luz Elena Merchancano Benítez</strong>
            </p>
          </div>

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
