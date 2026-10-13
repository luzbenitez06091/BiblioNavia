import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Download,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';
import { useBiblioStore } from '../services/store';
import { BiblioNaviaLogo } from './BiblioNaviaLogo';

interface PhoneFrameProps {
  children: React.ReactNode;
  onOpenApkModal: () => void;
  currentRole: 'estudiante' | 'administrador' | null;
  onSwitchRole: (role: 'estudiante' | 'administrador') => void;
  activeTab: string;
  onTabChange: (tab: any) => void;
  showBottomNav: boolean;
  mockupShowcaseNode?: React.ReactNode;
  onOpenDrawer?: () => void;
  drawerNode?: React.ReactNode;
  showTopBar?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  onOpenApkModal,
  currentRole,
  onSwitchRole,
  activeTab,
  onTabChange,
  showBottomNav,
  onOpenDrawer,
  drawerNode,
  showTopBar = false,
}) => {
  const { unreadCount, currentUser, appConfig, t } = useBiblioStore();

  return (
    <div
      style={{ width: '100vw', height: '100vh' }}
      className={`w-screen h-screen overflow-hidden flex flex-col ${
        appConfig?.modoOscuro ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } app-scale-${appConfig?.tamanoLetra || 'normal'} font-sans selection:bg-orange-500 selection:text-white relative`}
    >
      {/* BARRA SUPERIOR INSTITUCIONAL NATIVA (APPBAR) */}
      {showTopBar && (
        <header className="shrink-0 h-14 sm:h-16 px-4 sm:px-6 bg-[#0F2B48] text-white flex items-center justify-between z-20 border-b border-[#163a61] shadow-md select-none">
          <div className="flex items-center gap-3">
            {/* BOTÓN DEL MENÚ PLEGABLE LATERAL (DRAWER) */}
            <button
              type="button"
              onClick={onOpenDrawer}
              className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors flex items-center justify-center cursor-pointer relative z-10"
              title="Abrir Menú"
            >
              <Menu className="w-5 h-5 text-orange-400" />
            </button>

            {/* Logo y Nombre de la App: Clic redirige a Inicio */}
            <button
              type="button"
              onClick={() => onTabChange('inicio')}
              className="flex items-center gap-2.5 text-left hover:opacity-90 active:scale-95 transition-all cursor-pointer group focus:outline-none relative z-10"
              title="Ir a Pantalla de Inicio"
            >
              <BiblioNaviaLogo size="sm" className="group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="font-black text-base sm:text-lg tracking-tight text-white leading-tight group-hover:text-orange-300 transition-colors">
                  BiblioNavia
                </span>
                <span className="text-[10px] text-slate-300 font-medium hidden sm:block leading-none">
                  Biblioteca Escolar Inteligente
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* ÍCONO DE NOTIFICACIONES FUNCIONAL SIEMPRE ACCESIBLE EN LA CABECERA */}
            <button
              type="button"
              onClick={() => onTabChange('notificaciones')}
              className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20 text-slate-200 hover:text-white transition-colors relative z-10 cursor-pointer"
              title="Abrir Notificaciones y Avisos"
            >
              <Bell className="w-5 h-5 text-orange-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#0F2B48] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Avatar / Perfil */}
            {currentUser && (
              <button
                type="button"
                onClick={() => onTabChange('perfil')}
                className="w-8 h-8 rounded-xl overflow-hidden border border-orange-500/50 bg-slate-800 shrink-0 cursor-pointer transition-transform hover:scale-105 relative z-10"
                title="Ver Mi Perfil"
              >
                {currentUser.foto ? (
                  <img src={currentUser.foto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full text-xs font-bold text-orange-400 flex items-center justify-center">
                    {(currentUser.nombreCompleto || currentUser.nombre || 'U').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </button>
            )}
          </div>
        </header>
      )}

      {/* Menú Plegable Lateral (Drawer) */}
      {drawerNode}

      {/* Área Principal de la Aplicación a Pantalla Completa */}
      <main className="flex-1 w-full h-full overflow-y-auto flex flex-col relative">
        <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
          {children}
        </div>
      </main>

      {/* Menú de Navegación Inferior (Modo Estudiante) */}
      {showBottomNav && (
        <nav className="shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2 z-30 relative shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-around">
            <button
              onClick={() => onTabChange('inicio')}
              className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'inicio'
                  ? 'text-orange-600 dark:text-orange-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  activeTab === 'inicio' ? 'bg-orange-50 dark:bg-orange-500/10' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <span className="text-[11px] leading-none">{t('nav.home')}</span>
            </button>

            <button
              onClick={() => onTabChange('buscar')}
              className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'buscar'
                  ? 'text-orange-600 dark:text-orange-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  activeTab === 'buscar' ? 'bg-orange-50 dark:bg-orange-500/10' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <span className="text-[11px] leading-none">{t('nav.catalog')}</span>
            </button>

            <button
              onClick={() => onTabChange('prestamos')}
              className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'prestamos'
                  ? 'text-orange-600 dark:text-orange-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  activeTab === 'prestamos' ? 'bg-orange-50 dark:bg-orange-500/10' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <span className="text-[11px] leading-none">{t('nav.loans')}</span>
            </button>

            <button
              onClick={() => onTabChange('notificaciones')}
              className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors relative cursor-pointer ${
                activeTab === 'notificaciones'
                  ? 'text-orange-600 dark:text-orange-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl relative transition-all ${
                  activeTab === 'notificaciones' ? 'bg-orange-50 dark:bg-orange-500/10' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-orange-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-none">{t('nav.notifications')}</span>
            </button>

            <button
              onClick={() => onTabChange('perfil')}
              className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'perfil'
                  ? 'text-orange-600 dark:text-orange-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  activeTab === 'perfil' ? 'bg-orange-50 dark:bg-orange-500/10' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="text-[11px] leading-none">{t('nav.profile')}</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};
