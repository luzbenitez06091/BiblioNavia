import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Globe,
  Type,
  Bell,
  Sliders,
  LogOut,
  Check,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { useBiblioStore } from '../services/store';

export const ConfigView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { appConfig, updateAppConfig, currentUser, t } = useBiblioStore();
  const [toast, setToast] = useState<string | null>(null);

  const showToastMessage = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleToggleTheme = () => {
    const next = !appConfig.modoOscuro;
    updateAppConfig({ modoOscuro: next });
    showToastMessage(next ? 'Modo oscuro activado' : 'Modo claro activado');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full shadow-lg border border-slate-700 animate-in fade-in flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Cabecera */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F2B48] via-[#163a61] to-[#0B1E33] text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
              {t('config.badge')}
            </span>
            <h2 className="text-lg font-black mt-0.5">{t('config.title')}</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {t('config.subtitle')}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Sliders className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sección Apariencia (Modo Oscuro / Modo Claro) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Moon className="w-4 h-4 text-orange-500" />
          <span>{t('config.appearance')}</span>
        </h3>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 flex items-center justify-center">
              {appConfig.modoOscuro ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {appConfig.modoOscuro ? t('config.darkMode') : t('config.lightMode')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {appConfig.modoOscuro ? t('config.darkDesc') : t('config.lightDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleTheme}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              appConfig.modoOscuro ? 'bg-orange-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
          </button>
        </div>
      </div>

      {/* Sección Idioma y Tipografía */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-orange-500" />
          <span>{t('config.language')}</span>
        </h3>

        {/* Idioma */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
            {t('config.interfaceLanguage')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'es', label: 'Español' },
              { code: 'en', label: 'English' },
              { code: 'fr', label: 'Français' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  updateAppConfig({ idioma: lang.code as any });
                  showToastMessage(
                    lang.code === 'es'
                      ? 'Idioma establecido a Español'
                      : lang.code === 'en'
                      ? 'Language set to English'
                      : 'Langue définie sur Français'
                  );
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  appConfig.idioma === lang.code
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tamaño de Letra */}
        <div className="pt-2">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-orange-500" />
            <span>{t('config.fontSize')}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'pequena', labelKey: 'config.fontSizeSmall', defaultLabel: 'Pequeña', sample: 'A' },
              { id: 'normal', labelKey: 'config.fontSizeNormal', defaultLabel: 'Normal', sample: 'A' },
              { id: 'grande', labelKey: 'config.fontSizeLarge', defaultLabel: 'Grande', sample: 'A' },
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  updateAppConfig({ tamanoLetra: size.id as any });
                  showToastMessage(
                    `${t('config.fontSize')}: ${t(size.labelKey)}`
                  );
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  appConfig.tamanoLetra === size.id
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300'
                }`}
              >
                <span className={`${size.id === 'pequena' ? 'text-xs' : size.id === 'grande' ? 'text-base font-black' : 'text-sm font-bold'}`}>
                  {size.sample}
                </span>
                <span className="text-[10px] mt-0.5">{t(size.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sección Activar / Desactivar Notificaciones */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" />
          <span>{t('config.notifications')}</span>
        </h3>

        <div className="space-y-2">
          {/* Recordatorios de Devolución */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {t('config.dueAlerts')}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {t('config.dueAlertsDesc')}
              </p>
            </div>
            <input
              type="checkbox"
              checked={appConfig.notificacionesDevolucion}
              onChange={(e) => {
                updateAppConfig({ notificacionesDevolucion: e.target.checked });
                showToastMessage(e.target.checked ? 'Avisos de devolución activados' : 'Avisos de devolución desactivados');
              }}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 cursor-pointer accent-orange-500"
            />
          </div>

          {/* Disponibilidad de Nuevos Libros */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {t('config.newBooks')}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {t('config.newBooksDesc')}
              </p>
            </div>
            <input
              type="checkbox"
              checked={appConfig.notificacionesDisponibilidad}
              onChange={(e) => {
                updateAppConfig({ notificacionesDisponibilidad: e.target.checked });
                showToastMessage(e.target.checked ? 'Avisos de novedades activados' : 'Avisos de novedades desactivados');
              }}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 cursor-pointer accent-orange-500"
            />
          </div>
          {/* Alertas Generales de Biblioteca */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Alertas Institucionales
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Horarios especiales, nuevos libros y eventos
              </p>
            </div>
            <input
              type="checkbox"
              checked={appConfig.notificacionesAlertas}
              onChange={(e) => {
                updateAppConfig({ notificacionesAlertas: e.target.checked });
                showToastMessage(e.target.checked ? 'Alertas institucionales activadas' : 'Alertas desactivadas');
              }}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 cursor-pointer accent-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Sección Preferencias de Usuario */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span>{t('config.appInfo')}</span>
        </h3>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Cuenta activa:</span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
              {currentUser?.correo}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Rol asignado:</span>
            <span className="font-bold text-orange-600 dark:text-orange-400 capitalize">
              {currentUser?.rol === 'administrador' ? t('nav.adminBadge') : t('nav.studentBadge')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">{t('config.sync')}:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Firebase Firestore (1.000 Libros)
            </span>
          </div>
        </div>
      </div>

      {/* Botón Cerrar Sesión */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 font-bold text-xs transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
};
