import React, { useState } from 'react';
import { BiblioStoreProvider, useBiblioStore } from './services/store';
import { PhoneFrame } from './components/PhoneFrame';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreens } from './components/AuthScreens';
import { DrawerMenu, DrawerNavigationTarget } from './components/DrawerMenu';
import { ProfileView } from './components/ProfileView';
import { ConfigView } from './components/ConfigView';
import { CreditsView } from './components/CreditsView';
import {
  StudentDashboardView,
  CatalogView,
  LoansView,
  ReservationsView,
  FavoritesView,
  NotificationsView,
} from './components/StudentViews';
import { AdminPanel } from './components/AdminPanel';
import { BookDetailModal } from './components/BookDetailModal';
import { ApkExportModal } from './components/ApkExportModal';
import { Libro } from './types';
import { ArrowLeft } from 'lucide-react';

type AppTab =
  | 'inicio'
  | 'buscar'
  | 'prestamos'
  | 'notificaciones'
  | 'perfil'
  | 'reservas'
  | 'favoritos'
  | 'configuracion'
  | 'creditos';

const MainAppContent: React.FC = () => {
  const { currentUser, books, quickLogin, logout } = useBiblioStore();
  const [showSplash, setShowSplash] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [activeTab, setActiveTab] = useState<AppTab>('inicio');
  const [loansTab, setLoansTab] = useState<'activos' | 'historial'>('activos');
  const [adminModule, setAdminModule] = useState<'libros' | 'agregar_libro' | 'estudiantes' | 'prestamos'>('libros');
  const [adminKey, setAdminKey] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [adminViewingAsStudent, setAdminViewingAsStudent] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerNavigate = (target: DrawerNavigationTarget) => {
    setIsDrawerOpen(false);
    if (target === 'inicio') {
      setActiveTab('inicio');
      setAdminModule('libros');
      setAdminKey((k) => k + 1);
    } else if (target === 'perfil') {
      setActiveTab('perfil');
    } else if (target === 'configuracion') {
      setActiveTab('configuracion');
    } else if (target === 'prestamos') {
      setActiveTab('prestamos');
      setLoansTab('activos');
    } else if (target === 'favoritos') {
      setActiveTab('favoritos');
    } else if (target === 'notificaciones') {
      setActiveTab('notificaciones');
    } else if (target === 'creditos') {
      setActiveTab('creditos');
    }
  };

  const drawerNode = (
    <DrawerMenu
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      activeItem={activeTab}
      onNavigate={handleDrawerNavigate}
      onLogout={() => {
        setIsDrawerOpen(false);
        logout();
      }}
    />
  );

  // Splash Screen Inicial (100% Pantalla Completa)
  if (showSplash) {
    return (
      <PhoneFrame
        onOpenApkModal={() => setIsApkModalOpen(true)}
        currentRole={currentUser?.rol || null}
        onSwitchRole={(role) => quickLogin(role)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBottomNav={false}
      >
        <SplashScreen onFinish={() => setShowSplash(false)} />
        <ApkExportModal isOpen={isApkModalOpen} onClose={() => setIsApkModalOpen(false)} />
      </PhoneFrame>
    );
  }

  // Pantallas de Login / Registro / Recuperar (100% Pantalla Completa)
  if (!currentUser) {
    return (
      <PhoneFrame
        onOpenApkModal={() => setIsApkModalOpen(true)}
        currentRole={null}
        onSwitchRole={(role) => quickLogin(role)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBottomNav={false}
      >
        <AuthScreens
          initialView={authView}
          onSuccess={() => setActiveTab('inicio')}
        />
        <ApkExportModal isOpen={isApkModalOpen} onClose={() => setIsApkModalOpen(false)} />
      </PhoneFrame>
    );
  }

  // Pantalla del Administrador / Bibliotecario o Estudiante
  const isActualAdmin = currentUser.rol === 'administrador';
  const showAdminView = isActualAdmin && !adminViewingAsStudent;

  return (
    <PhoneFrame
      onOpenApkModal={() => setIsApkModalOpen(true)}
      currentRole={currentUser.rol}
      onSwitchRole={(role) => {
        quickLogin(role);
        setAdminViewingAsStudent(false);
      }}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab === 'inicio') {
          setAdminModule('libros');
          setAdminKey((k) => k + 1);
        }
        setIsDrawerOpen(false);
      }}
      showBottomNav={!isActualAdmin || adminViewingAsStudent}
      onOpenDrawer={() => setIsDrawerOpen(true)}
      drawerNode={drawerNode}
      showTopBar={true}
    >
      <div className="flex-1 flex flex-col p-3 sm:p-5">
        {/* Banner de previsualización para el Administrador si está en modo estudiante */}
        {isActualAdmin && adminViewingAsStudent && (
          <div className="mb-3 p-2.5 bg-orange-500 text-white rounded-2xl text-xs flex items-center justify-between shadow-sm">
            <span className="font-bold">Vista de prueba: Modo Estudiante</span>
            <button
              onClick={() => {
                setAdminViewingAsStudent(false);
                setActiveTab('inicio');
                setAdminModule('libros');
              }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Volver al Panel Admin
            </button>
          </div>
        )}

        {/* Encabezado de retorno contextual cuando está en sub-vistas */}
        {activeTab !== 'inicio' && (
          <button
            onClick={() => {
              setActiveTab('inicio');
              setAdminModule('libros');
              setAdminKey((k) => k + 1);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mb-3 cursor-pointer p-1.5 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors w-fit"
            title="Volver a la pantalla principal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isActualAdmin ? 'Volver al Panel Administrador' : 'Volver al Inicio'}</span>
          </button>
        )}

        {/* Contenido Principal */}
        {activeTab === 'inicio' ? (
          showAdminView ? (
            <AdminPanel
              key={adminKey}
              initialModule={adminModule}
              onSwitchToStudentView={() => setAdminViewingAsStudent(true)}
              onLogout={logout}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          ) : (
            <StudentDashboardView
              onNavigateToCatalog={() => setActiveTab('buscar')}
              onNavigateToLoans={() => {
                setActiveTab('prestamos');
                setLoansTab('activos');
              }}
              onNavigateToReservations={() => setActiveTab('reservas')}
              onNavigateToFavorites={() => setActiveTab('favoritos')}
              onSelectBook={(libro) => setSelectedBook(libro)}
            />
          )
        ) : (
          <>
            {activeTab === 'buscar' && (
              <CatalogView onSelectBook={(libro) => setSelectedBook(libro)} />
            )}

            {activeTab === 'prestamos' && <LoansView initialTab={loansTab} />}

            {activeTab === 'reservas' && <ReservationsView />}

            {activeTab === 'favoritos' && (
              <FavoritesView onSelectBook={(libro) => setSelectedBook(libro)} />
            )}

            {activeTab === 'notificaciones' && (
              <NotificationsView
                onNavigate={(target) => {
                  if (target === 'prestamos') {
                    if (isActualAdmin) {
                      setActiveTab('inicio');
                      setAdminModule('prestamos');
                      setAdminKey((k) => k + 1);
                    } else {
                      setActiveTab('prestamos');
                    }
                  } else if (target === 'estudiantes') {
                    if (isActualAdmin) {
                      setActiveTab('inicio');
                      setAdminModule('estudiantes');
                      setAdminKey((k) => k + 1);
                    }
                  }
                }}
              />
            )}

            {activeTab === 'perfil' && <ProfileView onLogout={logout} />}

            {activeTab === 'configuracion' && <ConfigView onLogout={logout} />}

            {activeTab === 'creditos' && <CreditsView />}
          </>
        )}
      </div>

      {/* Modal de Detalle de Libro */}
      <BookDetailModal
        libro={selectedBook}
        onClose={() => setSelectedBook(null)}
        onOpenLoans={() => {
          setSelectedBook(null);
          setActiveTab('prestamos');
          setLoansTab('activos');
        }}
      />

      {/* Modal de Exportación y Compilación de APK Android */}
      <ApkExportModal isOpen={isApkModalOpen} onClose={() => setIsApkModalOpen(false)} />
    </PhoneFrame>
  );
};

export default function App() {
  return (
    <BiblioStoreProvider>
      <MainAppContent />
    </BiblioStoreProvider>
  );
}
