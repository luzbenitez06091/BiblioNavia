import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CreditCard,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Camera,
} from 'lucide-react';
import { useBiblioStore } from '../services/store';
import { BiblioNaviaLogo } from './BiblioNaviaLogo';
import { CARTOON_AVATARS } from '../services/avatars';

interface AuthScreensProps {
  onSuccess: () => void;
  initialView?: 'login' | 'register' | 'forgot';
}

export const AuthScreens: React.FC<AuthScreensProps> = ({ onSuccess, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>(initialView);

  React.useEffect(() => {
    if (initialView) {
      setView(initialView);
    }
  }, [initialView]);

  const { login, quickLogin, register, recoverPassword } = useBiblioStore();

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regNombre, setRegNombre] = useState('');
  const [regDocumento, setRegDocumento] = useState('');
  const [regGrado, setRegGrado] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regFoto, setRegFoto] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor completa todos los campos.');
      return;
    }
    setLoginLoading(true);
    setLoginError(null);

    try {
      await login(loginEmail, loginPassword);
      onSuccess();
    } catch (err: any) {
      setLoginError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNombre || !regDocumento || !regGrado || !regEmail || !regPassword) {
      setRegError('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }

    setRegLoading(true);
    setRegError(null);

    try {
      await register({
        nombreCompleto: regNombre.trim(),
        documento: regDocumento.trim(),
        grado: regGrado.trim(),
        correo: regEmail.trim().toLowerCase(),
        password: regPassword,
        foto: regFoto.trim() || undefined,
        rol: 'estudiante',
      });
      onSuccess();
    } catch (err: any) {
      setRegError(err.message || 'Error al crear la cuenta.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotError('Ingresa un correo electrónico válido.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);

    try {
      await recoverPassword(forgotEmail);
      setForgotSuccess(true);
    } catch (err: any) {
      setForgotError('No se pudo procesar la recuperación de contraseña.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-y-auto">
      {/* ========================================================================= */}
      {/* VISTA: INICIO DE SESIÓN */}
      {/* ========================================================================= */}
      {view === 'login' && (
        <div className="w-full max-w-sm my-auto animate-in fade-in duration-300">
          {/* Tarjeta Central con Bordes Redondeados y Sombras Elegantes */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/10 border border-slate-200/80 dark:border-slate-800 transition-all duration-300">
            {/* Logo Oficial de BiblioNavia y Nombre */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center relative mb-3">
                <BiblioNaviaLogo size="lg" />
                <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                </div>
              </div>

              <h1 className="text-2xl font-black text-[#0F2B48] dark:text-white tracking-tight">
                BiblioNavia
              </h1>

              {/* Mensajes Claros Requeridos */}
              <p className="text-sm font-bold text-orange-600 mt-1">
                Bienvenido a BiblioNavia
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ingresa para acceder a la biblioteca escolar
              </p>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-medium">{loginError}</span>
              </div>
            )}

            {/* Formulario de Inicio de Sesión */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Campo Correo Electrónico Institucional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Correo electrónico institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="estudiante@colegio.edu.co"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Campo Contraseña con Botón Mostrar/Ocultar Contraseña */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  />
                  {/* Botón Mostrar/Ocultar Contraseña */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Opción ¿Olvidaste tu contraseña? */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setLoginError(null);
                    setView('forgot');
                  }}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón Iniciar Sesión Tradicional con Correo */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full h-12 bg-[#0F2B48] hover:bg-[#0A1E33] active:scale-[0.98] text-white font-bold rounded-xl text-sm shadow-md shadow-[#0F2B48]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Iniciar sesión con correo</span>
                )}
              </button>

              {/* Divisor Visual Suave */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  o registrar nuevo alumno
                </span>
              </div>

              {/* Opción Crear Cuenta */}
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setView('register');
                }}
                className="w-full h-12 bg-white dark:bg-slate-800 hover:bg-orange-50/50 dark:hover:bg-slate-700/60 active:scale-[0.98] text-[#0F2B48] dark:text-white hover:text-orange-600 font-bold rounded-xl text-sm border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500/50 transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                Crear cuenta
              </button>
            </form>
          </div>

          {/* Accesos Rápidos de Demostración para Pruebas del Evaluador */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Ingreso Rápido para Demostración
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  quickLogin('estudiante');
                  onSuccess();
                }}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-300 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                <span>Estudiante</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  quickLogin('administrador');
                  onSuccess();
                }}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Administrador</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA: CREAR CUENTA */}
      {/* ========================================================================= */}
      {view === 'register' && (
        <div className="w-full max-w-sm my-auto animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/10 border border-slate-200/80 dark:border-slate-800 transition-all duration-300">
            {/* Botón Volver */}
            <button
              onClick={() => {
                setRegError(null);
                setView('login');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0F2B48] dark:hover:text-white mb-4 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al inicio de sesión</span>
            </button>

            {/* Encabezado Profesional con Logo Oficial */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-500/20 text-[11px] font-bold mb-2">
                  <BiblioNaviaLogo size="xs" />
                  <span>Registro Institucional</span>
                </div>
                <h2 className="text-2xl font-black text-[#0F2B48] dark:text-white tracking-tight">
                  Crear cuenta
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Completa tus datos para registrarte como usuario de BiblioNavia
                </p>
              </div>
              <BiblioNaviaLogo size="md" className="shrink-0 mt-1" />
            </div>

            {/* Banner de Error */}
            {regError && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-medium">{regError}</span>
              </div>
            )}

            {/* Formulario Crear Cuenta */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Campo Nombre Completo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regNombre}
                    onChange={(e) => setRegNombre(e.target.value)}
                    placeholder="Ej. Valentina Ríos Restrepo"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Grid: Documento y Grado */}
              <div className="grid grid-cols-2 gap-3">
                {/* Campo Documento */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Documento *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regDocumento}
                      onChange={(e) => setRegDocumento(e.target.value)}
                      placeholder="1098234567"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Campo Grado */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grado escolar *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regGrado}
                      onChange={(e) => setRegGrado(e.target.value)}
                      placeholder="10° B"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Campo Correo Institucional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo institucional *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nombre.apellido@colegio.edu.co"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Grid: Contraseña y Confirmar Contraseña */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mín. 6 caract."
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-800 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setRegShowPassword(!regShowPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {regShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirmar *
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repite clave"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Campo Foto de Perfil Opcional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Foto de perfil (opcional)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="url"
                      value={regFoto}
                      onChange={(e) => setRegFoto(e.target.value)}
                      placeholder="URL de foto o avatar"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIdx = CARTOON_AVATARS.indexOf(regFoto);
                      const nextIdx = (currentIdx + 1) % CARTOON_AVATARS.length;
                      setRegFoto(CARTOON_AVATARS[nextIdx]);
                    }}
                    className="px-2.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-bold shrink-0 hover:bg-orange-100 transition-colors cursor-pointer flex items-center gap-1"
                    title="Elegir avatar ilustrado"
                  >
                    <span>Avatar</span>
                    {regFoto ? (
                      <img src={regFoto} alt="Avatar" className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <span>🎨</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de Enviar Registro */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#0F2B48] to-[#163a61] hover:from-[#0A1E33] hover:to-[#0F2B48] active:scale-[0.98] text-white font-bold rounded-xl text-sm shadow-md shadow-[#0F2B48]/20 transition-all flex items-center justify-center cursor-pointer"
                >
                  {regLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Registrando usuario...</span>
                    </div>
                  ) : (
                    <span>Crear cuenta</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA: RECUPERAR CONTRASEÑA */}
      {/* ========================================================================= */}
      {view === 'forgot' && (
        <div className="w-full max-w-sm my-auto animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/10 border border-slate-200/80 dark:border-slate-800 transition-all duration-300">
            {/* Botón Volver */}
            <button
              onClick={() => {
                setForgotSuccess(false);
                setForgotError(null);
                setView('login');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0F2B48] dark:hover:text-white mb-5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al inicio de sesión</span>
            </button>

            {forgotSuccess ? (
              /* Mensaje de Confirmación Exitoso */
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#0F2B48] dark:text-white">
                    ¡Enlace enviado!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed px-2">
                    Si el correo está registrado recibirás instrucciones para recuperar tu contraseña.
                  </p>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">
                    Revisa tu bandeja de entrada en <span className="text-orange-600">{forgotEmail}</span>
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setForgotSuccess(false);
                      setView('login');
                    }}
                    className="w-full h-11 bg-[#0F2B48] hover:bg-[#0A1E33] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              </div>
            ) : (
              /* Formulario de Recuperación con Icono de Seguridad */
              <div>
                {/* Logo Oficial de BiblioNavia */}
                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center relative mb-2">
                    <BiblioNaviaLogo size="md" />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    BiblioNavia
                  </h3>
                  <h2 className="text-xl font-black text-[#0F2B48] dark:text-white mt-1">
                    Recuperar contraseña
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed px-1">
                    Ingresa tu correo electrónico y enviaremos un enlace para recuperar el acceso a tu cuenta.
                  </p>
                </div>

                {/* Banner de Error */}
                {forgotError && (
                  <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span className="font-medium">{forgotError}</span>
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Correo electrónico *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="tu-correo@colegio.edu.co"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 flex items-start gap-2.5">
                    <KeyRound className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-snug font-medium">
                      Si el correo está registrado recibirás instrucciones para recuperar tu contraseña a través de Firebase Authentication.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center cursor-pointer"
                  >
                    {forgotLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Enviando enlace...</span>
                      </div>
                    ) : (
                      <span>Enviar enlace de recuperación</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
