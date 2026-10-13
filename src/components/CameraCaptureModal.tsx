import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { uploadUserProfilePhoto } from '../services/firebase';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onPhotoSaved: (photoUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  userId,
  onPhotoSaved,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Estado del flujo de permisos:
  // 'prompt': Mini ventana emergente para solicitar permiso explícito
  // 'camera': Permiso concedido, cámara activa para capturar en tiempo real
  const [permissionState, setPermissionState] = useState<'prompt' | 'camera'>('prompt');

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isActivatingCamera, setIsActivatingCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Sincronizar stream con el elemento video una vez obtenido
  useEffect(() => {
    if (stream && videoRef.current) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch((e) => console.warn('Video play warning:', e));
    }
  }, [stream, permissionState]);

  // Manejar apertura/cierre del modal
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      setPermissionState('prompt');
      setIsActivatingCamera(false);
      return;
    }

    // Cada vez que se abre el modal, mostrar primero la mini ventana de solicitud de permiso
    setPermissionState('prompt');
    setCapturedImage(null);
    setCameraError(null);
    setIsActivatingCamera(false);
  }, [isOpen]);

  // Si cambia la orientación de cámara y ya tiene permiso, reactivar directamente
  useEffect(() => {
    if (isOpen && permissionState === 'camera' && !capturedImage) {
      startCamera(facingMode);
    }
  }, [facingMode]);

  const handleGrantPermission = async () => {
    setIsActivatingCamera(true);
    setPermissionState('camera');
    await startCamera(facingMode);
    setIsActivatingCamera(false);
  };

  const startCamera = async (mode: 'user' | 'environment') => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador o dispositivo no soporta acceso directo a la cámara fotográfica.');
      }

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 640 },
            height: { ideal: 640 },
          },
          audio: false,
        });
      } catch (firstErr: any) {
        // Fallback para dispositivos móviles o cámaras con restricciones distintas
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: mode },
            audio: false,
          });
        } catch {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((e) => console.warn('Video play warning:', e));
      }
    } catch (err: any) {
      console.warn('Error accessing camera stream:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'El acceso a la cámara fue denegado en el navegador. Por favor permite el acceso a la cámara en los permisos del sitio para tomar tu fotografía.'
          : 'No se pudo activar la cámara del dispositivo. Verifica que ninguna otra aplicación esté usando la cámara e inténtalo de nuevo.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Capturar fotograma actual del video de la cámara en tiempo real
  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Invertir horizontalmente si es cámara frontal para modo espejo natural
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  // Tomar de nuevo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  // Cambiar cámara frontal / trasera
  const handleSwitchCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
  };

  // Confirmar y subir a Firebase Storage
  const handleConfirm = async () => {
    if (!capturedImage) return;
    setLoading(true);
    try {
      const downloadUrl = await uploadUserProfilePhoto(userId, capturedImage);
      onPhotoSaved(downloadUrl);
      onClose();
    } catch (err) {
      console.error('Error saving profile photo:', err);
      onPhotoSaved(capturedImage);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // 1. MINI VENTANA EMERGENTE: Solicitud de Permiso de Acceso a la Cámara
  if (permissionState === 'prompt') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
        <div className="w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-150">
          {/* Cabecera Decorativa */}
          <div className="p-4 bg-gradient-to-r from-[#0F2B48] via-[#163a61] to-orange-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-black uppercase tracking-wider">
                Permiso de Cámara
              </h3>
            </div>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contenido de la Solicitud de Permiso */}
          <div className="p-5 text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 flex items-center justify-center text-orange-500 shadow-inner">
                <Camera className="w-8 h-8 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                ¿Permitir acceso a la cámara?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed px-1">
                Para tomar y actualizar tu fotografía de perfil en tiempo real, BiblioNavia necesita permiso para activar la cámara del dispositivo.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>La captura se realiza exclusivamente con tu cámara en vivo.</span>
            </div>

            {/* Botones de Decisión: Cancelar o Permitir */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleGrantPermission}
                disabled={isActivatingCamera}
                className="flex-1 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white text-xs font-black transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isActivatingCamera ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Permitir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. VENTANA DE CÁMARA ACTIVA: Visor, Captura y Confirmación (Directo en vivo)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Cabecera */}
        <div className="p-4 bg-gradient-to-r from-[#0F2B48] to-[#163a61] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              {capturedImage ? 'Confirmar Fotografía' : 'Cámara del Dispositivo'}
            </h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar cámara"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visor de Cámara / Fotografía */}
        <div className="p-4 space-y-4">
          <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Foto capturada"
                className="w-full h-full object-cover"
              />
            ) : cameraError ? (
              <div className="p-6 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reintentar Activar Cámara</span>
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={() => {
                    videoRef.current?.play().catch((e) => console.warn('Video play warning:', e));
                  }}
                  className={`w-full h-full object-cover ${
                    facingMode === 'user' ? 'scale-x-[-1]' : ''
                  }`}
                />
                {/* Guía visual ovalada/circular para encuadre facial */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full border-2 border-dashed border-orange-400/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
                </div>
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Información del Destino de Almacenamiento */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px]">
            <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" />
              Destino en la Nube:
            </span>
            <span className="font-extrabold text-orange-600 dark:text-orange-400">
              Firebase Storage (usuarios/photos)
            </span>
          </div>

          {/* Botones de Acción */}
          {capturedImage ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRetake}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tomar de nuevo</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar Foto</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              {!cameraError && (
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Girar cámara"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={cameraError ? () => startCamera(facingMode) : handleCapture}
                className="flex-1 py-3 bg-[#0F2B48] hover:bg-[#0A1E33] active:scale-98 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-orange-400" />
                <span>{cameraError ? 'Reintentar Cámara' : 'Capturar Fotografía'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
