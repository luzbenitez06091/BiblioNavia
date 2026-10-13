import React, { useState } from 'react';
import {
  User,
  Mail,
  FileText,
  GraduationCap,
  KeyRound,
  Edit3,
  Camera,
  Check,
  X,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  Calendar,
  ShieldCheck,
  BookOpen,
  Info,
  MapPin,
  School,
  CheckCircle2,
  Award,
  LogOut,
  Smile,
} from 'lucide-react';
import { useBiblioStore } from '../services/store';
import { CARTOON_AVATARS } from '../services/avatars';
import { CameraCaptureModal } from './CameraCaptureModal';
import { uploadUserProfilePhoto } from '../services/firebase';

const AVATAR_PRESETS = CARTOON_AVATARS;

export const ProfileView: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const { currentUser, updateCurrentUser, changePassword, books, users, loans, logout } = useBiblioStore();
  const isAdmin = currentUser?.rol === 'administrador';

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  // Modal de información institucional (Nombre completo de la institución)
  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);

  // Escuchar tecla Escape para cerrar el modal institucional
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsInstitutionModalOpen(false);
      }
    };
    if (isInstitutionModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInstitutionModalOpen]);

  // Estados de edición de datos personales
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editNombre, setEditNombre] = useState(currentUser?.nombreCompleto || currentUser?.nombre || '');
  const [editDocumento, setEditDocumento] = useState(currentUser?.documento || '');
  const [editGrado, setEditGrado] = useState(currentUser?.grado || '');

  // Estados de cambio de contraseña
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Estados de foto de perfil (Cámara en tiempo real)
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  // Mensaje de éxito / feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Guardar datos personales
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNombre.trim()) {
      setErrorMsg('El nombre completo no puede estar vacío.');
      return;
    }
    updateCurrentUser({
      nombreCompleto: editNombre.trim(),
      nombre: editNombre.trim(),
      documento: editDocumento.trim(),
      grado: editGrado.trim(),
    });
    setIsEditingInfo(false);
    setErrorMsg(null);
    showToast('Información personal actualizada con éxito');
  };

  // Guardar cambio de contraseña
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    try {
      await changePassword(newPass);
      setIsChangingPass(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setErrorMsg(null);
      showToast('¡Contraseña cambiada exitosamente!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al cambiar la contraseña');
    }
  };



  return (
    <div className="space-y-4 pb-8">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl text-center shadow-lg animate-in fade-in flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-600 text-white text-xs font-bold rounded-2xl text-center shadow-lg animate-in fade-in flex items-center justify-center gap-2">
          <X className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Cabecera / Tarjeta del Perfil */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs text-center relative overflow-hidden">
        {/* Fondo decorativo institucional */}
        <div className="h-20 -mx-5 -mt-5 bg-gradient-to-r from-[#0B1E33] via-[#0F2B48] to-orange-600 relative">
          <div className="absolute top-2 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-black/40 text-orange-400 border border-orange-400/30">
            {currentUser?.rol === 'administrador' ? 'Rol Administrador' : 'Rol Estudiante'}
          </div>
        </div>

        {/* Foto de Perfil Circular Grande con Botón para Actualizar */}
        <div className="relative inline-block -mt-12 mb-3">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-xl bg-slate-100 dark:bg-slate-800">
            {currentUser?.foto ? (
              <img
                src={currentUser.foto}
                alt={currentUser.nombreCompleto || currentUser.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#0F2B48] to-orange-500 text-white text-2xl font-black flex items-center justify-center">
                {(currentUser?.nombreCompleto || currentUser?.nombre || 'U')
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCameraModalOpen(true)}
            className="absolute bottom-0 right-0 p-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-transform active:scale-95 ring-2 ring-white dark:ring-slate-900 cursor-pointer"
            title="Tomar foto con la cámara del dispositivo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botón directo "Tomar foto" para ambos roles (Admin y Estudiante) */}
        <div className="mt-1 mb-2 flex justify-center">
          <button
            type="button"
            onClick={() => setIsCameraModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#0F2B48] to-orange-500 hover:from-[#163a61] hover:to-orange-600 active:scale-95 text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
            title="Tomar foto en tiempo real con la cámara fotográfica"
          >
            <Camera className="w-3.5 h-3.5 text-orange-300" />
            <span>Tomar foto</span>
          </button>
        </div>

        {/* Nombre Completo y Correo Institucional */}
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          {currentUser?.nombreCompleto || currentUser?.nombre}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {currentUser?.correo}
        </p>

        {/* Cargo o Grado */}
        {isAdmin ? (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mt-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/40 text-xs font-black shadow-xs">
            <Shield className="w-3.5 h-3.5 text-orange-500" />
            <span>Bibliotecari@ Escolar</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{currentUser?.grado}</span>
          </div>
        )}

        {/* Tarjetas de Información Personal / Institucional */}
        {isAdmin ? (
          <div className="grid grid-cols-2 gap-2 mt-4 text-left">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold uppercase">Cargo Oficial</span>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                Bibliotecari@ Escolar
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <FileText className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold uppercase">Identificación</span>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100 font-mono">
                {currentUser?.documento}
              </p>
            </div>

            {/* Institución Educativa - Click abre el modal con el nombre completo */}
            <button
              type="button"
              onClick={() => setIsInstitutionModalOpen(true)}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50/40 dark:hover:bg-slate-800 transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
              title="Click para ver el nombre completo de la institución"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Institución Educativa</span>
                </div>
                <Info className="w-3.5 h-3.5 text-orange-400 opacity-60 group-hover:opacity-100 group-hover:text-orange-500 transition-all" />
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                I.E.T.I. Rafael Navia Varón
              </p>
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-orange-500 dark:text-orange-400 group-hover:underline">
                <span>Ver nombre completo</span>
                <span>↗</span>
              </div>
            </button>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold uppercase">Fecha de Registro</span>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                {currentUser?.fechaRegistro ? new Date(currentUser.fechaRegistro).toLocaleDateString() : '15/01/2024'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 mt-4 text-left">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <FileText className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold uppercase">Documento</span>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100 font-mono">
                {currentUser?.documento}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold uppercase">Grado Escolar</span>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                {currentUser?.grado}
              </p>
            </div>

            {/* Institución Educativa para Estudiante - Mismo campo exacto que en Administrador */}
            <button
              type="button"
              onClick={() => setIsInstitutionModalOpen(true)}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50/40 dark:hover:bg-slate-800 transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
              title="Click para ver el nombre completo de la institución"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Institución Educativa</span>
                </div>
                <Info className="w-3.5 h-3.5 text-orange-400 opacity-60 group-hover:opacity-100 group-hover:text-orange-500 transition-all" />
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                I.E.T.I. Rafael Navia Varón
              </p>
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-orange-500 dark:text-orange-400 group-hover:underline">
                <span>Ver nombre completo</span>
                <span>↗</span>
              </div>
            </button>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold uppercase">Fecha de Registro</span>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                {currentUser?.fechaRegistro ? new Date(currentUser.fechaRegistro).toLocaleDateString() : '15/01/2026'}
              </p>
            </div>
          </div>
        )}

        {/* Panel de Estadísticas Profesionales de Gestión para el Administrador */}
        {isAdmin && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-left">
            <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estadísticas Rápidas de Gestión</span>
            </span>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block">Acervo Total</span>
                <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">{books.length}</span>
                <span className="text-[9px] text-slate-400">libros físicos</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block">Estudiantes</span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5 block">
                  {users.filter((u) => u.rol === 'estudiante').length}
                </span>
                <span className="text-[9px] text-slate-400">registrados</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block">En Préstamo</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {loans.filter((l) => l.estado === 'Activo').length}
                </span>
                <span className="text-[9px] text-slate-400">ejemplares</span>
              </div>
            </div>
          </div>
        )}

        {/* Botones de Acción de Perfil */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              setIsEditingInfo(!isEditingInfo);
              setIsChangingPass(false);
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isEditingInfo
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-orange-400'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingInfo ? 'Cerrar Edición' : 'Editar Datos'}</span>
          </button>

          <button
            onClick={() => {
              setIsChangingPass(!isChangingPass);
              setIsEditingInfo(false);
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isChangingPass
                ? 'bg-[#0F2B48] text-white border-[#0F2B48] shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isChangingPass ? 'Cancelar' : 'Contraseña'}</span>
          </button>
        </div>

        {/* Sección: Avatar del Perfil (Ubicado justo por debajo de Editar Datos y Contraseña) */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                Avatar del Perfil
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">
              Selecciona tu ilustración
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            {CARTOON_AVATARS.map((avatarUri, idx) => {
              const isSelected = currentUser?.foto === avatarUri;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    updateCurrentUser({ foto: avatarUri });
                    showToast('¡Avatar de perfil actualizado!');
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden p-0.5 transition-all cursor-pointer group ${
                    isSelected
                      ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 shadow-md shadow-orange-500/20'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  title={`Seleccionar Avatar #${idx + 1}`}
                >
                  <img
                    src={avatarUri}
                    alt={`Avatar ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg bg-white dark:bg-slate-900"
                  />
                  {isSelected && (
                    <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón de Cerrar Sesión (Ambos Roles: Administrador y Estudiante) */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200/80 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
            title="Cerrar sesión de forma segura y regresar a la pantalla de inicio"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Formulario Desplegable: Editar Información Personal */}
      {isEditingInfo && (
        <form
          onSubmit={handleSaveInfo}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              {isAdmin ? 'Editar Ficha Profesional' : 'Editar Información Personal'}
            </h3>
            <span className="text-[10px] text-orange-500 font-bold">Datos en Firestore</span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={editNombre}
              onChange={(e) => setEditNombre(e.target.value)}
              placeholder="Ej. Valentina Ríos Restrepo"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 font-bold dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Documento *
              </label>
              <input
                type="text"
                value={editDocumento}
                onChange={(e) => setEditDocumento(e.target.value)}
                placeholder="Ej. 1098765432"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 font-bold dark:text-white font-mono"
                required
              />
            </div>

            {isAdmin ? (
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Cargo Institucional
                </label>
                <input
                  type="text"
                  disabled
                  value="Bibliotecari@ Escolar"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Grado Escolar *
                </label>
                <input
                  type="text"
                  value={editGrado}
                  onChange={(e) => setEditGrado(e.target.value)}
                  placeholder="Ej. 10° Grado A"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 font-bold dark:text-white"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Institución Educativa
              </label>
              <button
                type="button"
                onClick={() => setIsInstitutionModalOpen(true)}
                className="text-[10px] font-bold text-orange-500 hover:text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3 h-3" />
                <span>Ver nombre completo</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsInstitutionModalOpen(true)}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 text-left flex items-center justify-between cursor-pointer transition-colors"
              title="Click para ver el nombre completo de la institución"
            >
              <span>I.E.T.I. Rafael Navia Varón</span>
              <span className="text-[10px] text-orange-500 font-semibold flex items-center gap-0.5">
                <Info className="w-3 h-3" /> Detalle ↗
              </span>
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingInfo(false)}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      )}

      {/* Formulario Desplegable: Cambiar Contraseña */}
      {isChangingPass && (
        <form
          onSubmit={handleSavePassword}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              Cambiar Contraseña
            </h3>
            <span className="text-[10px] text-blue-500 font-bold">Firebase Auth</span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 dark:text-white pr-9"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Nueva Contraseña (mínimo 6 caracteres)
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Confirmar Nueva Contraseña
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              required
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsChangingPass(false)}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-[#0F2B48] hover:bg-[#163a61] shadow-sm"
            >
              Actualizar Contraseña
            </button>
          </div>
        </form>
      )}

      {/* Modal de Cámara en Vivo con Captura Obligatoria y Almacenamiento en Firebase */}
      {isCameraModalOpen && currentUser && (
        <CameraCaptureModal
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
          userId={currentUser.uid}
          onPhotoSaved={(photoUrl) => {
            updateCurrentUser({ foto: photoUrl });
            showToast('¡Foto de perfil capturada y actualizada con éxito en Firebase Storage!');
          }}
        />
      )}

      {/* Ventana Emergente (Modal / Popup): Nombre Completo de la Institución Educativa */}
      {isInstitutionModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="institution-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsInstitutionModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Header del Modal */}
            <div className="relative p-5 bg-gradient-to-br from-orange-500 via-orange-600 to-[#0F2B48] text-white">
              <button
                type="button"
                onClick={() => setIsInstitutionModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                title="Cerrar ventana"
                aria-label="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider text-orange-100 border border-white/20">
                    <School className="w-3 h-3" />
                    Establecimiento Educativo Oficial
                  </span>
                  <h3 id="institution-modal-title" className="text-base font-black text-white mt-1 leading-tight">
                    Información Institucional
                  </h3>
                </div>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-5 space-y-4">
              {/* Tarjeta Destacada: Nombre Completo de la Institución */}
              <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-500/30 text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 block mb-1">
                  Nombre Completo Oficial
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white leading-snug">
                  Institución Educativa Técnica Industrial Rafael Navia Varón
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-orange-500 text-white text-xs font-black shadow-xs">
                  <Award className="w-3.5 h-3.5" />
                  <span>I.E.T.I. Rafael Navia Varón</span>
                </div>
              </div>

              {/* Ficha de Detalles Institucionales */}
              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <Building2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Carácter & Modalidad</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      Educación Media Técnica Industrial Oficial
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <BookOpen className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Biblioteca Escolar</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      Biblionavia · Sistema Bibliotecario Institucional
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Ubicación y Sede</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      Santiago de Cali, Valle del Cauca · Colombia
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <ShieldCheck className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Rol en el Perfil</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {currentUser?.rol === 'administrador'
                        ? 'Bibliotecari@ Escolar (Administrador)'
                        : `Estudiante Institucional (${currentUser?.grado || 'Bachillerato'})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de cierre */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsInstitutionModalOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Entendido · Cerrar Ventana</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
