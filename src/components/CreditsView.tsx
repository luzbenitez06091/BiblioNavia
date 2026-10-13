import React from 'react';
import {
  Award,
  Sparkles,
  Heart,
  ShieldCheck,
  Smartphone,
  Database,
  Layers,
  CheckCircle2,
  Calendar,
  Code,
  School,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { BiblioNaviaLogo } from './BiblioNaviaLogo';

export const CreditsView: React.FC = () => {
  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-300">
      {/* Título de la Sección */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-500" />
          <span>Créditos</span>
        </h2>
        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
          BiblioNavia v1.0
        </span>
      </div>

      {/* Banner Principal de Créditos con Logo y Nombre */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1E33] via-[#0F2B48] to-[#163a61] text-white shadow-xl text-center relative overflow-hidden">
        {/* Glow de fondo decorativo */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Logo Oficial de BiblioNavia */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <BiblioNaviaLogo size="lg" />
          <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900 rounded-full border border-orange-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          </div>
        </div>

        {/* Nombre de la Aplicación */}
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
          <span>BiblioNavia</span>
        </h1>

        {/* Información de Versión */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-bold text-orange-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Versión BiblioNavia v1.0</span>
        </div>

        {/* Texto Requerido */}
        <p className="text-xs text-slate-200 mt-3 leading-relaxed max-w-xs mx-auto font-medium">
          “Sistema inteligente de gestión de biblioteca escolar.”
        </p>
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed max-w-xs mx-auto italic opacity-90">
          “Aplicación desarrollada para la gestión inteligente de préstamos de biblioteca escolar.”
        </p>

        {/* Tarjeta de Presentación Elegante y Profesional */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-orange-500/25 via-amber-500/20 to-orange-500/25 border-2 border-orange-500/60 shadow-lg text-center backdrop-blur-xs">
          <div className="flex items-center justify-center gap-1.5 text-orange-300 mb-1">
            <Award className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-300">
              Autora y Desarrolladora Principal
            </span>
            <Award className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>

          <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-1">
            Luz Elena Merchancano Benítez
          </h3>

          <p className="text-xs font-bold text-orange-300 mt-1">
            “Aplicación realizada por: Luz Elena Merchancano Benítez”
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300 mt-2 pt-2 border-t border-white/10">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0" />
            <span>Creada con dedicación para fortalecer la lectura escolar</span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Presentación Tecnológica */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span>Ficha Técnica y Arquitectura</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
              <Database className="w-4 h-4" />
              <span className="font-bold text-[11px]">Base de Datos</span>
            </div>
            <p className="font-extrabold text-slate-900 dark:text-white text-[11px]">
              Cloud Firestore
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Colecciones usuarios y libros
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
              <Layers className="w-4 h-4" />
              <span className="font-bold text-[11px]">Almacenamiento</span>
            </div>
            <p className="font-extrabold text-slate-900 dark:text-white text-[11px]">
              Firebase Storage
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Portadas de alta resolución
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
              <Code className="w-4 h-4" />
              <span className="font-bold text-[11px]">Frontend & PWA</span>
            </div>
            <p className="font-extrabold text-slate-900 dark:text-white text-[11px]">
              React + TypeScript
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Tailwind CSS + Lucide
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
              <Smartphone className="w-4 h-4" />
              <span className="font-bold text-[11px]">Plataforma Móvil</span>
            </div>
            <p className="font-extrabold text-slate-900 dark:text-white text-[11px]">
              Android / Web PWA
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Diseño adaptable a celular
            </p>
          </div>
        </div>
      </div>

      {/* Características del Sistema */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
          Módulos Integrados en BiblioNavia
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Inicio de sesión y creación de cuentas profesionales</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Recuperación de contraseña mediante correo institucional</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Menú plegable lateral con acceso rápido a todas las funciones</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Catálogo visual con portadas reales y estado de disponibilidad</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Módulo de Administrador con opción "Agregar libros" y control físico</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Gestión de préstamos activos, reservas y sistema de notificaciones</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Eliminación total del código estudiantil por documento único</span>
          </div>
        </div>
      </div>
    </div>
  );
};
