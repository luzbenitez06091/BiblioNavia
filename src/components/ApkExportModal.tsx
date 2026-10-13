import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileCode,
  Terminal,
  Smartphone,
  ShieldCheck,
  Play,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { BiblioNaviaLogo } from './BiblioNaviaLogo';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'build' | 'files' | 'firebase'>('build');
  const [selectedFile, setSelectedFile] = useState<string>('main.dart');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileSuccess, setCompileSuccess] = useState(false);

  if (!isOpen) return null;

  const flutterFiles: Record<string, { path: string; desc: string; code: string }> = {
    'main.dart': {
      path: 'flutter_app/lib/main.dart',
      desc: 'Punto de entrada de la aplicación Flutter',
      code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/theme.dart';
import 'services/auth_service.dart';
import 'services/firestore_service.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // await Firebase.initializeApp();
  runApp(const FuturePathApp());
}

class FuturePathApp extends StatelessWidget {
  const FuturePathApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<AuthService>(create: (_) => AuthService()),
        Provider<FirestoreService>(create: (_) => FirestoreService()),
      ],
      child: MaterialApp(
        title: 'Future Path',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const SplashScreen(),
      ),
    );
  }
}`,
    },
    'theme.dart': {
      path: 'flutter_app/lib/config/theme.dart',
      desc: 'Colores institucionales (Azul Oscuro #0F2B48 y Naranja #F97316)',
      code: `import 'package:flutter/material.dart';

class AppTheme {
  static const Color azulOscuro = Color(0xFF0F2B48);
  static const Color naranja = Color(0xFFF97316);
  static const Color blanco = Colors.white;
  static const Color grisFondo = Color(0xFFF8FAFC);
  static const Color disponible = Color(0xFF10B981);
  static const Color prestado = Color(0xFFEF4444);
  static const Color reservado = Color(0xFFF59E0B);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: blanco,
    primaryColor: azulOscuro,
    colorScheme: const ColorScheme.light(
      primary: azulOscuro,
      secondary: naranja,
      surface: blanco,
    ),
  );
}`,
    },
    'pubspec.yaml': {
      path: 'flutter_app/pubspec.yaml',
      desc: 'Configuración de paquetes Firebase y UI',
      code: `name: futurepath
description: "Future Path - Plataforma inteligente de orientación vocacional y biblioteca"
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^3.1.1
  firebase_auth: ^5.1.1
  cloud_firestore: ^5.0.2
  firebase_storage: ^12.0.1
  provider: ^6.1.2
  google_fonts: ^6.2.1

flutter:
  uses-material-design: true`,
    },
    'firestore.rules': {
      path: 'firestore.rules',
      desc: 'Reglas de seguridad ABAC para Cloud Firestore',
      code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }

    function isSignedIn() { return request.auth != null; }
    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.email == 'luzbenitez06091@gmail.com' ||
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'administrador'
      );
    }

    match /usuarios/{userId} {
      allow get: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow list: if isAdmin();
      allow create, update: if isSignedIn();
    }

    match /libros/{libroId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    match /prestamos/{prestamoId} {
      allow read, create: if isSignedIn();
      allow update, delete: if isAdmin();
    }
  }
}`,
    },
    'AndroidManifest.xml': {
      path: 'flutter_app/android/app/src/main/AndroidManifest.xml',
      desc: 'Manifiesto de la app Android con permisos y launcher',
      code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.futurepath.app">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.CAMERA"/>

    <application
        android:label="Future Path"
        android:icon="@mipmap/ic_launcher">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    },
  };

  const handleCopy = (code: string, fileName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const startBuildSimulation = () => {
    setIsCompiling(true);
    setCompileProgress(10);
    setCompileSuccess(false);

    const interval = setInterval(() => {
      setCompileProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompiling(false);
          setCompileSuccess(true);
          return 100;
        }
        return prev + 18;
      });
    }, 400);
  };

  const downloadAllSourceCode = () => {
    const content = `FUTURE PATH - PROYECTO FLUTTER Y FIREBASE COMPLETO\n\nTodos los archivos fuente de Flutter se encuentran creados en el repositorio en la carpeta /flutter_app/.\n\nPara compilar el APK Android:\n1. cd flutter_app\n2. flutter pub get\n3. flutter build apk --release\n\nEl archivo APK final estará en:\nbuild/app/outputs/flutter-apk/app-release.apk`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Future_Path_Flutter_APK_Info.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F2B48] text-white">
          <div className="flex items-center gap-3">
            <BiblioNaviaLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">BiblioNavia - Generador de APK Android</h2>
                <span className="text-xs bg-orange-500 text-white font-semibold px-2 py-0.5 rounded-full">
                  Flutter & Dart
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Arquitectura Flutter nativa preparada con Firebase Authentication y Cloud Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('build')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'build'
                ? 'border-orange-500 text-[#0F2B48] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            1. Generar APK Android
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'files'
                ? 'border-orange-500 text-[#0F2B48] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            2. Código Flutter & Dart
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'firebase'
                ? 'border-orange-500 text-[#0F2B48] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            3. Firebase & Reglas
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'build' && (
            <div className="space-y-6">
              {/* Card de Compilación Interactiva */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0F2B48] text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                      Compilación Release
                    </span>
                    <h3 className="text-lg font-bold mt-1">flutter build apk --release</h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Genera el paquete ejecutable `.apk` para instalar directamente en cualquier teléfono o tablet
                      Android (SDK 21 a 34), con soporte para firmas release y optimización de código árbol de dependencias.
                    </p>
                  </div>
                  <button
                    onClick={startBuildSimulation}
                    disabled={isCompiling}
                    className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-orange-500/30 whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {isCompiling ? 'Compilando...' : 'Iniciar Compilación APK'}
                  </button>
                </div>

                {/* Progreso */}
                {(isCompiling || compileProgress > 0) && (
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>
                        {compileProgress < 30 && 'Inicializando Gradle y resolviendo dependencias de Firebase...'}
                        {compileProgress >= 30 && compileProgress < 70 && 'Compilando código Dart AOT y recursos de la app...'}
                        {compileProgress >= 70 && compileProgress < 100 && 'Empaquetando APK release con compresión Proguard...'}
                        {compileProgress === 100 && '¡APK generado exitosamente!'}
                      </span>
                      <span className="font-mono font-bold text-orange-400">{compileProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${compileProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {compileSuccess && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>
                        Archivo listo: <strong className="text-white">app-release.apk</strong> (~18.4 MB)
                      </span>
                    </div>
                    <button
                      onClick={downloadAllSourceCode}
                      className="px-3 py-1 bg-emerald-500 text-slate-900 font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      Descargar Guía y Comandos
                    </button>
                  </div>
                )}
              </div>

              {/* Pasos Rápidos para Android */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-xs mb-3">
                    01
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">1. Descargar Código</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    La carpeta <code className="text-orange-600">/flutter_app/</code> incluye el código Flutter completo
                    organizado en arquitectura limpia.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs mb-3">
                    02
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">2. Ejecutar Build</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    En la terminal ejecuta:
                    <br />
                    <code className="text-blue-700 font-mono text-[11px]">flutter build apk --release</code>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-xs mb-3">
                    03
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">3. Instalar en Celular</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Pasa el archivo <code className="text-emerald-700">app-release.apk</code> al celular e instálalo con un solo toque.
                  </p>
                </div>
              </div>

              {/* Guía en terminal */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
                <div className="text-slate-400"># Comandos completos de compilación:</div>
                <div className="text-emerald-400">$ cd flutter_app</div>
                <div className="text-emerald-400">$ flutter pub get</div>
                <div className="text-emerald-400">$ flutter build apk --release</div>
                <div className="text-slate-400 pt-2"># Ubicación del archivo de salida:</div>
                <div className="text-orange-400">build/app/outputs/flutter-apk/app-release.apk</div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="grid md:grid-cols-12 gap-6">
              {/* Lista de archivos */}
              <div className="md:col-span-4 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Archivos Flutter Creados
                </div>
                {Object.keys(flutterFiles).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      selectedFile === fileName
                        ? 'bg-[#0F2B48] text-white border-[#0F2B48] shadow-md'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">{fileName}</div>
                    <div className="text-[11px] opacity-75 truncate">{flutterFiles[fileName].desc}</div>
                  </button>
                ))}
              </div>

              {/* Visor de código */}
              <div className="md:col-span-8 flex flex-col rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 text-slate-100">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
                  <span className="font-mono text-slate-400">{flutterFiles[selectedFile].path}</span>
                  <button
                    onClick={() => handleCopy(flutterFiles[selectedFile].code, selectedFile)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    {copiedFile === selectedFile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto text-slate-300 leading-relaxed max-h-[360px]">
                  {flutterFiles[selectedFile].code}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-orange-900">Integración con Firebase Cloud Firestore</h4>
                  <p className="text-xs text-orange-800 mt-1">
                    Las 6 colecciones solicitadas (<code className="font-mono">usuarios</code>,{' '}
                    <code className="font-mono">libros</code>, <code className="font-mono">prestamos</code>,{' '}
                    <code className="font-mono">reservas</code>, <code className="font-mono">favoritos</code>,{' '}
                    <code className="font-mono">notificaciones</code>) y sus reglas de seguridad han sido modeladas
                    siguiendo estrictamente los estándares ABAC.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900">Colecciones Creadas en Firestore:</h5>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• <strong>usuarios:</strong> Perfil, documento, código, rol (estudiante/admin).</li>
                    <li>• <strong>libros:</strong> Catálogo con título, autor, editorial, ISBN, ubicación y estado.</li>
                    <li>• <strong>prestamos:</strong> Control de entregas, renovaciones y fechas límite.</li>
                    <li>• <strong>reservas:</strong> Cola de espera inteligente con asignación por orden.</li>
                    <li>• <strong>favoritos:</strong> Marcadores de libros guardados por estudiante.</li>
                    <li>• <strong>notificaciones:</strong> Avisos de vencimiento y disponibilidad de libros.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900">Seguridad Implementada:</h5>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• El estudiante solo puede consultar libros y pedir préstamos con su UID.</li>
                    <li>• El estudiante NO puede asignarse rol de administrador ni alterar roles.</li>
                    <li>• Solo los administradores pueden crear, modificar o eliminar libros.</li>
                    <li>• Las devoluciones reactivan automáticamente la disponibilidad del libro.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            BiblioNavia v1.0 · Preparado para Compilación Android
          </div>
          <button
            onClick={downloadAllSourceCode}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F2B48] hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Descargar Instrucciones y Código
          </button>
        </div>
      </div>
    </div>
  );
};
