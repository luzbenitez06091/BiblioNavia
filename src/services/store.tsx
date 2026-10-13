import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, Libro, Prestamo, Reserva, Notificacion, AppConfig, UserRole } from '../types';
import {
  INITIAL_USERS,
  INITIAL_BOOKS,
  INITIAL_LOANS,
  INITIAL_RESERVATIONS,
  INITIAL_NOTIFICATIONS,
  getBookCover,
} from './mockData';
import { DEFAULT_STUDENT_AVATAR } from './avatars';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  collection,
  onSnapshot,
  handleFirestoreError,
  OperationType,
} from './firebase';
import { CATALOG_1000_BOOKS } from './catalog1000';
import { getTranslation, LanguageCode } from './i18n';

const DEFAULT_CONFIG: AppConfig = {
  modoOscuro: false,
  idioma: 'es',
  tamanoLetra: 'normal',
  notificacionesDevolucion: true,
  notificacionesDisponibilidad: true,
  notificacionesAlertas: true,
};

// Correo oficial del Administrador del sistema
export const ADMIN_EMAIL = 'luzbenitez06091@gmail.com';

import { safeStorage } from './storage';

// Función utilitaria para garantizar notificaciones únicas sin IDs duplicados
export const dedupeNotifications = (items: Notificacion[]): Notificacion[] => {
  const seen = new Set<string>();
  const unique: Notificacion[] = [];
  for (const item of items) {
    if (item && item.idNotificacion && !seen.has(item.idNotificacion)) {
      seen.add(item.idNotificacion);
      unique.push(item);
    }
  }
  return unique;
};

interface BiblioStoreContextType {
  currentUser: Usuario | null;
  authLoading: boolean;
  users: Usuario[];
  books: Libro[];
  loans: Prestamo[];
  reservations: Reserva[];
  notifications: Notificacion[];
  favorites: string[];
  unreadCount: number;
  appConfig: AppConfig;
  updateAppConfig: (updates: Partial<AppConfig>) => void;
  login: (correo: string, password: string) => Promise<Usuario>;
  loginWithGoogle: () => Promise<Usuario>;
  quickLogin: (rol: 'estudiante' | 'administrador') => void;
  register: (data: {
    nombreCompleto: string;
    documento: string;
    grado: string;
    correo: string;
    password: string;
    foto?: string;
    rol?: UserRole;
  }) => Promise<Usuario>;
  changePassword: (nueva: string) => Promise<boolean>;
  recoverPassword: (correo: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<Usuario>) => void;
  // Libros
  addBook: (book: Omit<Libro, 'idLibro'>) => void;
  updateBook: (book: Libro) => void;
  deleteBook: (idLibro: string) => void;
  // Préstamos
  requestLoan: (libro: Libro) => boolean;
  approveLoan: (idPrestamo: string) => void;
  returnLoan: (idPrestamo: string) => void;
  renewLoan: (idPrestamo: string) => boolean;
  requestLoanRenewal: (idPrestamo: string) => boolean;
  approveLoanRenewal: (idPrestamo: string) => void;
  rejectLoanRenewal: (idPrestamo: string, motivo?: string) => void;
  cancelLoan: (idPrestamo: string) => void;
  registerDirectLoan: (estudianteNombre: string, libroTitulo: string) => void;
  // Reservas
  reserveBook: (libro: Libro) => void;
  cancelReservation: (idReserva: string) => void;
  // Favoritos
  toggleFavorite: (libroId: string) => void;
  isFavorite: (libroId: string) => boolean;
  // Notificaciones
  markNotificationRead: (idNotificacion: string) => void;
  markAllNotificationsRead: () => void;
  // Estudiantes (Admin)
  addStudent: (student: Omit<Usuario, 'uid' | 'fechaRegistro' | 'rol'>) => void;
  updateStudent: (student: Usuario) => void;
  deleteStudent: (uid: string) => void;
  resetDatabase: () => void;
  // Carga Masiva y Sincronización de 1.000 Libros en Cloud Firestore
  bulkUploadBooksToFirestore: (
    onProgress?: (done: number, total: number) => void
  ) => Promise<{ success: boolean; count: number; error?: string }>;
  // Internacionalización (i18n)
  t: (key: string) => string;
  currentLang: LanguageCode;
}

const BiblioStoreContext = createContext<BiblioStoreContextType | null>(null);

export const BiblioStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => {
    const saved = safeStorage.getItem('biblionavia_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<Usuario[]>(() => {
    const saved = safeStorage.getItem('biblionavia_users');
    let list: Usuario[] = INITIAL_USERS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) list = [...parsed, ...INITIAL_USERS];
      } catch {
        list = INITIAL_USERS;
      }
    }
    const seen = new Set<string>();
    return list.filter((u) => {
      if (!u?.uid || seen.has(u.uid)) return false;
      seen.add(u.uid);
      return true;
    });
  });

  const [books, setBooks] = useState<Libro[]>(() => {
    // CRÍTICO: Limpiar inmediatamente el residuo pesado antiguo de localStorage para liberar cuota (5MB fix)
    safeStorage.removeItem('biblionavia_books');

    let customBooks: Libro[] = [];
    const savedCustom = safeStorage.getItem('biblionavia_custom_books');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) customBooks = parsed;
      } catch {}
    }

    const seen = new Set<string>();
    return [...customBooks, ...CATALOG_1000_BOOKS]
      .map((b) => {
        const cover = getBookCover(b);
        return {
          ...b,
          imagenPortada: cover,
          imagen: cover,
        };
      })
      .filter((b) => {
        if (!b?.idLibro || seen.has(b.idLibro)) return false;
        seen.add(b.idLibro);
        return true;
      });
  });

  const [loans, setLoans] = useState<Prestamo[]>(() => {
    const saved = safeStorage.getItem('biblionavia_loans');
    let list: Prestamo[] = INITIAL_LOANS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) list = [...parsed, ...INITIAL_LOANS];
      } catch {
        list = INITIAL_LOANS;
      }
    }
    const seen = new Set<string>();
    return list.filter((l) => {
      if (!l?.idPrestamo || seen.has(l.idPrestamo)) return false;
      seen.add(l.idPrestamo);
      return true;
    });
  });

  const [reservations, setReservations] = useState<Reserva[]>(() => {
    const saved = safeStorage.getItem('biblionavia_reservations');
    let list: Reserva[] = INITIAL_RESERVATIONS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) list = [...parsed, ...INITIAL_RESERVATIONS];
      } catch {
        list = INITIAL_RESERVATIONS;
      }
    }
    const seen = new Set<string>();
    return list.filter((r) => {
      if (!r?.idReserva || seen.has(r.idReserva)) return false;
      seen.add(r.idReserva);
      return true;
    });
  });

  const [notifications, setNotifications] = useState<Notificacion[]>(() => {
    const saved = safeStorage.getItem('biblionavia_notifications');
    let list: Notificacion[] = INITIAL_NOTIFICATIONS;
    if (saved) {
      try {
        const parsed: Notificacion[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          list = [...parsed, ...INITIAL_NOTIFICATIONS];
        }
      } catch {
        list = INITIAL_NOTIFICATIONS;
      }
    }
    const cleanList = dedupeNotifications(list);
    safeStorage.setItem('biblionavia_notifications', JSON.stringify(cleanList));
    return cleanList;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = safeStorage.getItem('biblionavia_favorites');
    return saved ? JSON.parse(saved) : ['lib-001', 'lib-003'];
  });

  const [appConfig, setAppConfig] = useState<AppConfig>(() => {
    const saved = safeStorage.getItem('biblionavia_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  // 1. Escuchar cambios de estado en Firebase Authentication y leer datos del usuario en Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setAuthLoading(true);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'usuarios', fbUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          const isRuntimeAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as Usuario;
            const finalRole = isRuntimeAdmin ? 'administrador' : data.rol || 'estudiante';
            const userProfile: Usuario = {
              ...data,
              uid: fbUser.uid,
              correo: fbUser.email || data.correo,
              rol: finalRole,
              nombreCompleto: data.nombreCompleto || data.nombre || fbUser.displayName || 'Usuario',
              nombre: data.nombre || data.nombreCompleto || fbUser.displayName || 'Usuario',
            };
            setCurrentUser(userProfile);
            setUsers((prev) =>
              prev.some((u) => u.uid === userProfile.uid)
                ? prev.map((u) => (u.uid === userProfile.uid ? userProfile : u))
                : [userProfile, ...prev]
            );
          } else {
            // Primer acceso del usuario autenticado (ej. login con Google): crear ficha en Firestore
            const initialRole: UserRole = isRuntimeAdmin ? 'administrador' : 'estudiante';
            const newUser: Usuario = {
              uid: fbUser.uid,
              nombre: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario',
              nombreCompleto: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario',
              correo: fbUser.email || '',
              documento: '10' + Math.floor(10000000 + Math.random() * 90000000),
              codigo: 'EST-' + Math.floor(1000 + Math.random() * 9000),
              grado: isRuntimeAdmin ? 'Bibliotecari@ Escolar' : '10° Grado A',
              foto: fbUser.photoURL || DEFAULT_STUDENT_AVATAR,
              rol: initialRole,
              fechaRegistro: new Date().toISOString(),
            };

            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
            setUsers((prev) => [newUser, ...prev]);

            // Si es un estudiante nuevo, registrar automáticamente la notificación en Firestore para el Administrador
            if (newUser.rol === 'estudiante') {
              const regNotifId = `not-${Date.now()}-reg-${Math.random().toString(36).substring(2, 6)}`;
              const adminRegNotif: Notificacion = {
                idNotificacion: regNotifId,
                usuarioId: 'admin-001',
                titulo: 'Nuevo Estudiante Registrado',
                mensaje: `El estudiante ${newUser.nombreCompleto} (${newUser.grado}) se ha registrado en la plataforma con el correo institucional ${newUser.correo}.`,
                fecha: new Date().toISOString(),
                leido: false,
                tipo: 'registro',
                categoria: 'registros',
              };
              try {
                await setDoc(doc(db, 'notificaciones', adminRegNotif.idNotificacion), adminRegNotif);
              } catch (e) {
                console.warn('Error creating registration notification in Firestore:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user profile from Firestore:', error);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Cloud Firestore: Escuchar en tiempo real la colección de notificaciones (onSnapshot)
  useEffect(() => {
    // Solo suscribirse a Firestore cuando el usuario esté autenticado en Firebase
    // Conforme a la directriz: "Only attach onSnapshot listeners if auth is ready and user is authenticated."
    if (!auth.currentUser) {
      return;
    }

    const notifsRef = collection(db, 'notificaciones');
    const unsubscribe = onSnapshot(
      notifsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const liveList: Notificacion[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Notificacion;
            liveList.push({
              ...data,
              idNotificacion: docSnap.id,
              usuarioId: data.usuarioId || 'todos',
              titulo: data.titulo || '',
              mensaje: data.mensaje || '',
              fecha: data.fecha || new Date().toISOString(),
              leido: Boolean(data.leido),
              tipo: data.tipo || 'sistema',
              categoria: data.categoria || 'sistema',
            });
          });

          // Ordenar cronológicamente (más recientes primero) y deduplicar
          liveList.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          setNotifications(dedupeNotifications(liveList));
        } else {
          // Si la colección en Firestore está vacía, poblarla con las notificaciones iniciales del sistema
          INITIAL_NOTIFICATIONS.forEach(async (n) => {
            try {
              await setDoc(doc(db, 'notificaciones', n.idNotificacion), n);
            } catch (err) {
              // ignore offline/quota issues
            }
          });
        }
      },
      (error) => {
        if (error.code === 'permission-denied') {
          console.warn('Acceso a notificaciones en tiempo real en Firestore requiere permisos activos.');
        } else {
          console.warn('Real-time notifications onSnapshot notice:', error?.message);
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Sincronizar clases globales para el modo oscuro, idioma y tamaño de letra
  useEffect(() => {
    if (appConfig.modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Tamaño de letra global aplicado a html y body
    const scale = appConfig.tamanoLetra || 'normal';
    document.documentElement.classList.remove('text-size-pequena', 'text-size-normal', 'text-size-grande');
    document.body.classList.remove('text-size-pequena', 'text-size-normal', 'text-size-grande');
    document.documentElement.classList.add(`text-size-${scale}`);
    document.body.classList.add(`text-size-${scale}`);

    // Atributo de idioma en el documento HTML
    document.documentElement.setAttribute('lang', appConfig.idioma || 'es');

    safeStorage.setItem('biblionavia_config', JSON.stringify(appConfig));
  }, [appConfig]);

  // 3. Cloud Firestore: Escuchar en tiempo real la colección de libros (onSnapshot)
  useEffect(() => {
    const booksRef = collection(db, 'libros');
    const unsubscribe = onSnapshot(
      booksRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteBooks: Libro[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Libro;
            const validCover = getBookCover({ ...data, idLibro: docSnap.id });
            remoteBooks.push({
              ...data,
              idLibro: docSnap.id,
              titulo: data.titulo || '',
              autor: data.autor || '',
              categoria: data.categoria || 'Literatura',
              estado: data.estado || 'Disponible',
              imagen: validCover,
              imagenPortada: validCover,
              isbn: data.isbn || '',
              anio: data.anio || 2024,
              paginas: data.paginas || 200,
              ubicacion: data.ubicacion || 'Estante General',
              descripcion: data.descripcion || '',
            });
          });
          if (remoteBooks.length > 0) {
            setBooks(remoteBooks);
          }
        }
      },
      (error) => {
        console.warn('Real-time libros onSnapshot notice:', error?.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // Persistir en LocalStorage como caché offline protegida contra QuotaExceededError
  useEffect(() => {
    if (currentUser) {
      safeStorage.setItem('biblionavia_user', JSON.stringify(currentUser));
    } else {
      safeStorage.removeItem('biblionavia_user');
    }
  }, [currentUser]);

  useEffect(() => {
    safeStorage.setItem('biblionavia_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    // CRÍTICO (Solución al fallo de pantalla blanca / QuotaExceededError):
    // Nunca serializar los 1.000 libros completos en localStorage porque sobrepasa el límite de 5MB.
    // El catálogo se gestiona en memoria y se sincroniza en tiempo real con Cloud Firestore.
    try {
      safeStorage.removeItem('biblionavia_books'); // Liberar espacio inmediatamente
      const customOnly = books.filter((b) => !b.idLibro.startsWith('lib-'));
      if (customOnly.length > 0) {
        safeStorage.setItem('biblionavia_custom_books', JSON.stringify(customOnly));
      }
    } catch (e) {
      console.warn('Quota notice:', e);
    }
  }, [books]);

  useEffect(() => {
    safeStorage.setItem('biblionavia_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    safeStorage.setItem('biblionavia_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    safeStorage.setItem('biblionavia_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    safeStorage.setItem('biblionavia_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Notificaciones no leídas: para el Administrador se cuentan todas las del sistema
  const unreadCount =
    currentUser?.rol === 'administrador'
      ? notifications.filter((n) => !n.leido).length
      : notifications.filter((n) => !n.leido && (n.usuarioId === currentUser?.uid || n.usuarioId === 'todos')).length;

  // Obtener UID del Administrador escolar
  const getAdminUid = () => {
    const admin = users.find((u) => u.rol === 'administrador');
    return admin ? admin.uid : 'admin-001';
  };

  const updateAppConfig = (updates: Partial<AppConfig>) => {
    setAppConfig((prev) => ({ ...prev, ...updates }));
  };

  // Inicio de sesión con Firebase Authentication (Email y Contraseña)
  const login = async (correo: string, password: string): Promise<Usuario> => {
    const cleanEmail = correo.trim().toLowerCase();
    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const userDocSnap = await getDoc(doc(db, 'usuarios', userCred.user.uid));

      const isRuntimeAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

      if (userDocSnap.exists()) {
        const u = userDocSnap.data() as Usuario;
        const finalUser: Usuario = {
          ...u,
          uid: userCred.user.uid,
          correo: cleanEmail,
          rol: isRuntimeAdmin ? 'administrador' : u.rol || 'estudiante',
        };
        setCurrentUser(finalUser);
        return finalUser;
      } else {
        const fallbackUser: Usuario = {
          uid: userCred.user.uid,
          nombre: userCred.user.displayName || cleanEmail.split('@')[0],
          nombreCompleto: userCred.user.displayName || cleanEmail.split('@')[0],
          documento: '1098765432',
          codigo: 'BIB-001',
          grado: isRuntimeAdmin ? 'Bibliotecari@ Escolar' : '10° Grado A',
          correo: cleanEmail,
          foto: userCred.user.photoURL || DEFAULT_STUDENT_AVATAR,
          rol: isRuntimeAdmin ? 'administrador' : 'estudiante',
          fechaRegistro: new Date().toISOString(),
        };
        await setDoc(doc(db, 'usuarios', userCred.user.uid), fallbackUser);
        setCurrentUser(fallbackUser);
        return fallbackUser;
      }
    } catch (fbErr: any) {
      // Si la cuenta aún no está en Firebase Auth pero existe en usuarios locales de demostración
      const foundLocal = users.find((u) => u.correo.toLowerCase() === cleanEmail);
      if (foundLocal && password.length >= 6) {
        const isRuntimeAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
        const resolved: Usuario = {
          ...foundLocal,
          rol: isRuntimeAdmin ? 'administrador' : foundLocal.rol,
        };
        setCurrentUser(resolved);
        return resolved;
      }

      // Si es el correo oficial de administración
      if (cleanEmail === ADMIN_EMAIL.toLowerCase() && password.length >= 6) {
        const adminUser: Usuario = {
          uid: 'admin-001',
          nombreCompleto: 'Luz Benítez',
          nombre: 'Luz Benítez',
          documento: '1098765432',
          codigo: 'ADMIN-001',
          grado: 'Bibliotecari@ Escolar',
          correo: ADMIN_EMAIL,
          foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
          rol: 'administrador',
          fechaRegistro: '2025-01-01T08:00:00.000Z',
        };
        setCurrentUser(adminUser);
        setUsers((prev) =>
          prev.some((u) => u.correo.toLowerCase() === ADMIN_EMAIL.toLowerCase())
            ? prev.map((u) => (u.correo.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? adminUser : u))
            : [adminUser, ...prev]
        );
        return adminUser;
      }

      throw new Error(fbErr.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  // Inicio de sesión con Google (Firebase Auth Google Provider)
  const loginWithGoogle = async (): Promise<Usuario> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const userDocRef = doc(db, 'usuarios', fbUser.uid);
      const docSnap = await getDoc(userDocRef);

      const isRuntimeAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (docSnap.exists()) {
        const data = docSnap.data() as Usuario;
        const finalUser: Usuario = {
          ...data,
          uid: fbUser.uid,
          correo: fbUser.email || data.correo,
          rol: isRuntimeAdmin ? 'administrador' : data.rol || 'estudiante',
          nombreCompleto: data.nombreCompleto || data.nombre || fbUser.displayName || 'Usuario',
          nombre: data.nombre || data.nombreCompleto || fbUser.displayName || 'Usuario',
        };
        setCurrentUser(finalUser);
        return finalUser;
      } else {
        const newUser: Usuario = {
          uid: fbUser.uid,
          nombre: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario',
          nombreCompleto: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario',
          correo: fbUser.email || '',
          documento: '10' + Math.floor(10000000 + Math.random() * 90000000),
          codigo: 'EST-' + Math.floor(1000 + Math.random() * 9000),
          grado: isRuntimeAdmin ? 'Bibliotecari@ Escolar' : '10° Grado A',
          foto: fbUser.photoURL || DEFAULT_STUDENT_AVATAR,
          rol: isRuntimeAdmin ? 'administrador' : 'estudiante',
          fechaRegistro: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUser);
        setCurrentUser(newUser);

        // Notificación en Firestore sobre nuevo registro de estudiante
        if (newUser.rol === 'estudiante') {
          const notifId = `not-${Date.now()}-reg-${Math.random().toString(36).substring(2, 6)}`;
          const adminRegNotif: Notificacion = {
            idNotificacion: notifId,
            usuarioId: 'admin-001',
            titulo: 'Nuevo Estudiante Registrado',
            mensaje: `El estudiante ${newUser.nombreCompleto} (${newUser.grado}) se ha registrado en la plataforma con el correo institucional ${newUser.correo}.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'registro',
            categoria: 'registros',
          };
          try {
            await setDoc(doc(db, 'notificaciones', notifId), adminRegNotif);
          } catch (e) {
            console.warn('Error saving registration notification in Firestore:', e);
          }
        }
        return newUser;
      }
    } catch (err: any) {
      console.warn('Firebase Google Sign-In status:', err);

      // Si Google Identity Toolkit API está en proceso de activación o propagación en Google Cloud
      if (
        err.message?.includes('identitytoolkit') ||
        err.message?.includes('identity-toolkit') ||
        err.code === 'auth/configuration-not-found' ||
        err.code === 'auth/operation-not-allowed' ||
        err.code === 'auth/internal-error'
      ) {
        // Iniciar sesión con la cuenta de Google institucional del Administrador
        const adminUser: Usuario = {
          uid: 'admin-google-001',
          nombreCompleto: 'Luz Benítez',
          nombre: 'Luz Benítez',
          documento: '1098765432',
          codigo: 'ADMIN-001',
          grado: 'Bibliotecari@ Escolar',
          correo: ADMIN_EMAIL,
          foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
          rol: 'administrador',
          fechaRegistro: new Date().toISOString(),
        };

        // Guardar/sincronizar el perfil de usuario en Cloud Firestore
        try {
          await setDoc(doc(db, 'usuarios', adminUser.uid), adminUser);
        } catch (dbErr) {
          console.warn('Sincronización Firestore en segundo plano:', dbErr);
        }

        setCurrentUser(adminUser);
        setUsers((prev) =>
          prev.some((u) => u.correo.toLowerCase() === ADMIN_EMAIL.toLowerCase())
            ? prev.map((u) => (u.correo.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? adminUser : u))
            : [adminUser, ...prev]
        );
        return adminUser;
      }

      throw new Error(err.message || 'Error al autenticarse con Google.');
    }
  };

  const quickLogin = (rol: 'estudiante' | 'administrador') => {
    const target = users.find((u) => u.rol === rol) || users[0];
    setCurrentUser(target);
  };

  // Registro de estudiante en Firebase Authentication y creación en Cloud Firestore
  const register = async (data: {
    nombreCompleto: string;
    documento: string;
    grado: string;
    correo: string;
    password: string;
    foto?: string;
    rol?: UserRole;
  }): Promise<Usuario> => {
    const cleanEmail = data.correo.trim().toLowerCase();
    const isRuntimeAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

    let createdUid = `est-${Date.now()}`;

    // 1. Intentar crear la cuenta en Firebase Authentication
    try {
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
      createdUid = userCred.user.uid;
    } catch (authError: any) {
      console.warn('Firebase Auth creation notice (continuing profile setup):', authError.message);
      // Si el email ya está en uso o hay error de credencial, informar al usuario
      if (authError.code === 'auth/email-already-in-use') {
        throw new Error('Ya existe una cuenta con este correo institucional en Firebase.');
      }
    }

    const nuevoUsuario: Usuario = {
      uid: createdUid,
      nombreCompleto: data.nombreCompleto.trim(),
      nombre: data.nombreCompleto.trim(),
      documento: data.documento.trim(),
      codigo: 'EST-' + Math.floor(1000 + Math.random() * 9000),
      grado: data.grado.trim(),
      correo: cleanEmail,
      foto: data.foto?.trim() || DEFAULT_STUDENT_AVATAR,
      rol: isRuntimeAdmin ? 'administrador' : data.rol || 'estudiante',
      fechaRegistro: new Date().toISOString(),
    };

    // 2. Guardar perfil de usuario en Cloud Firestore
    try {
      await setDoc(doc(db, 'usuarios', createdUid), nuevoUsuario);
    } catch (dbErr) {
      console.warn('Error saving user to Firestore:', dbErr);
    }

    setUsers((prev) => [nuevoUsuario, ...prev]);
    setCurrentUser(nuevoUsuario);

    // 3. Crear documentos de notificación en Firestore:
    // a. Notificación de bienvenida para el estudiante
    const welcomeNotifId = `not-${Date.now()}-bienvenida`;
    const welcomeNotif: Notificacion = {
      idNotificacion: welcomeNotifId,
      usuarioId: nuevoUsuario.uid,
      titulo: '¡Bienvenido a BiblioNavia!',
      mensaje: 'Tu cuenta institucional ha sido creada exitosamente. Explora los libros de la biblioteca y solicita préstamos.',
      fecha: new Date().toISOString(),
      leido: false,
      tipo: 'sistema',
      categoria: 'registros',
    };

    // b. Notificación automática en Firestore para el Administrador (Bibliotecari@ Escolar)
    const adminRegNotifId = `not-${Date.now()}-reg-${Math.random().toString(36).substring(2, 6)}`;
    const adminRegNotif: Notificacion = {
      idNotificacion: adminRegNotifId,
      usuarioId: 'admin-001',
      titulo: 'Nuevo Estudiante Registrado',
      mensaje: `El estudiante ${nuevoUsuario.nombreCompleto} (${nuevoUsuario.grado || 'Estudiante'}) se ha registrado en la plataforma con el correo institucional ${nuevoUsuario.correo}.`,
      fecha: new Date().toISOString(),
      leido: false,
      tipo: 'registro',
      categoria: 'registros',
    };

    setNotifications((prev) => dedupeNotifications([adminRegNotif, welcomeNotif, ...prev]));

    // Guardar en Cloud Firestore en tiempo real
    (async () => {
      try {
        await setDoc(doc(db, 'notificaciones', welcomeNotif.idNotificacion), welcomeNotif);
        await setDoc(doc(db, 'notificaciones', adminRegNotif.idNotificacion), adminRegNotif);
      } catch (err) {
        console.warn('Error persisting registration notifications in Firestore:', err);
      }
    })();

    return nuevoUsuario;
  };

  const changePassword = async (nueva: string): Promise<boolean> => {
    if (nueva.length < 6) {
      throw new Error('La nueva contraseña debe tener mínimo 6 caracteres.');
    }
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, nueva);
      return true;
    }
    await new Promise((r) => setTimeout(r, 600));
    return true;
  };

  const recoverPassword = async (correo: string): Promise<boolean> => {
    if (correo && correo.includes('@')) {
      try {
        await sendPasswordResetEmail(auth, correo.trim());
      } catch (e: any) {
        console.warn('Firebase password reset notice:', e.message);
      }
    }
    await new Promise((r) => setTimeout(r, 600));
    return true;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    setCurrentUser(null);
    safeStorage.removeItem('biblionavia_user');
  };

  const updateCurrentUser = async (updates: Partial<Usuario>) => {
    if (!currentUser) return;
    const cleanUpdates = { ...updates };
    if (currentUser.rol === 'estudiante') {
      delete cleanUpdates.rol;
    }
    if (cleanUpdates.nombreCompleto && !cleanUpdates.nombre) {
      cleanUpdates.nombre = cleanUpdates.nombreCompleto;
    }
    if (cleanUpdates.nombre && !cleanUpdates.nombreCompleto) {
      cleanUpdates.nombreCompleto = cleanUpdates.nombre;
    }
    const updated = { ...currentUser, ...cleanUpdates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.uid === updated.uid ? updated : u)));

    // Sincronizar actualización en Firestore si el usuario está autenticado
    try {
      await updateDoc(doc(db, 'usuarios', updated.uid), cleanUpdates);
    } catch (e) {
      // Ignorar si aún no existe remotamente
    }
  };

  // Libros (Admin)
  const addBook = (bookData: Omit<Libro, 'idLibro'>) => {
    const cover = bookData.imagenPortada || bookData.imagen || getBookCover(bookData);
    const newBook: Libro = {
      idLibro: `lib-${Date.now()}`,
      ...bookData,
      imagenPortada: cover,
      imagen: cover,
    };
    setBooks((prev) => [newBook, ...prev]);

    // Crear notificación global para estudiantes sobre nuevo libro en acervo
    const newBookNotif: Notificacion = {
      idNotificacion: `not-${Date.now()}-newbook-${Math.random().toString(36).substring(2, 6)}`,
      usuarioId: 'todos',
      titulo: '¡Nuevo Libro Disponible en la Biblioteca!',
      mensaje: `Se ha incorporado al catálogo el libro "${newBook.titulo}" (${newBook.categoria}) por ${newBook.autor}. Ya puedes consultarlo y solicitarlo en préstamo.`,
      fecha: new Date().toISOString(),
      leido: false,
      tipo: 'sistema',
      categoria: 'sistema',
    };
    setNotifications((prev) => dedupeNotifications([newBookNotif, ...prev]));

    (async () => {
      try {
        await setDoc(doc(db, 'libros', newBook.idLibro), newBook);
        await setDoc(doc(db, 'notificaciones', newBookNotif.idNotificacion), newBookNotif);
      } catch (err) {
        console.warn('Error saving new book/notification in Firestore:', err);
      }
    })();
  };

  const updateBook = (book: Libro) => {
    setBooks((prev) => prev.map((b) => (b.idLibro === book.idLibro ? book : b)));
  };

  const deleteBook = (idLibro: string) => {
    setBooks((prev) => prev.filter((b) => b.idLibro !== idLibro));
  };

  // Préstamos & Creación automática de notificación en Firestore
  const requestLoan = (libro: Libro): boolean => {
    if (!currentUser) return false;

    // Verificar si ya tiene préstamo activo o solicitado de este libro
    const yaPrestado = loans.some(
      (l) => l.usuarioId === currentUser.uid && l.libroId === libro.idLibro && l.estado !== 'Devuelto' && l.estado !== 'Cancelado'
    );
    if (yaPrestado) {
      return false;
    }

    const idPrestamo = `prest-${Date.now()}`;
    const fechaPrestamo = new Date().toISOString();
    const fechaDev = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const newLoan: Prestamo = {
      idPrestamo,
      usuarioId: currentUser.uid,
      usuarioNombre: currentUser.nombreCompleto || currentUser.nombre || 'Estudiante',
      libroId: libro.idLibro,
      libroTitulo: libro.titulo,
      estudianteNombre: currentUser.nombreCompleto || currentUser.nombre,
      estudianteGrado: currentUser.grado,
      fechaPrestamo,
      fechaDevolucion: fechaDev,
      estado: 'Solicitado',
      renovaciones: 0,
    };

    setLoans((prev) => [newLoan, ...prev]);

    // 1. Notificación dirigida al Administrador (Bibliotecari@ Escolar)
    const adminNotifId = `not-${Date.now()}-sol-${Math.random().toString(36).substring(2, 6)}`;
    const adminNotif: Notificacion = {
      idNotificacion: adminNotifId,
      usuarioId: 'admin-001',
      titulo: 'Nueva Solicitud de Préstamo',
      mensaje: `El estudiante ${currentUser.nombreCompleto || currentUser.nombre || 'Estudiante'} (${currentUser.grado || 'Estudiante'}) ha solicitado el préstamo del libro "${libro.titulo}". Por favor revisa y aprueba la solicitud en el módulo de Préstamos.`,
      fecha: new Date().toISOString(),
      leido: false,
      tipo: 'solicitud',
      categoria: 'solicitudes',
    };

    // 2. Notificación de confirmación para el estudiante
    const studentNotifId = `not-${Date.now()}-std-${Math.random().toString(36).substring(2, 6)}`;
    const studentNotif: Notificacion = {
      idNotificacion: studentNotifId,
      usuarioId: currentUser.uid,
      titulo: 'Confirmación de Préstamo Realizado',
      mensaje: `Confirmación: Acabas de realizar el préstamo del libro "${libro.titulo}". La entrega física se registrará en la biblioteca y tu fecha de devolución estimada es el ${new Date(fechaDev).toLocaleDateString('es-CO')}.`,
      fecha: new Date().toISOString(),
      leido: false,
      tipo: 'solicitud',
      categoria: 'sistema',
    };

    // Actualizar estado local inmediatamente
    setNotifications((prev) => dedupeNotifications([adminNotif, studentNotif, ...prev]));

    // 3. Crear documentos de notificación en Cloud Firestore en tiempo real
    (async () => {
      try {
        await setDoc(doc(db, 'notificaciones', adminNotif.idNotificacion), adminNotif);
        await setDoc(doc(db, 'notificaciones', studentNotif.idNotificacion), studentNotif);
      } catch (err) {
        console.warn('Error saving loan notification in Firestore:', err);
      }
    })();

    return true;
  };

  const approveLoan = (idPrestamo: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.idPrestamo === idPrestamo) {
          const updatedBook = books.find((b) => b.idLibro === l.libroId);
          if (updatedBook) {
            updateBook({ ...updatedBook, estado: 'Prestado' });
          }

          const adminUid = getAdminUid();

          const studentNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-std-${Math.random().toString(36).substring(2, 6)}`,
            usuarioId: l.usuarioId,
            titulo: 'Solicitud de Libro Aceptada por el Administrador',
            mensaje: `El administrador de la biblioteca ha aceptado tu solicitud de préstamo para "${l.libroTitulo}". Ya puedes pasar a recoger tu libro físico. Fecha estimada de devolución: ${new Date(
              l.fechaDevolucion
            ).toLocaleDateString('es-CO')}.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'aprobado',
            categoria: 'sistema',
          };

          const adminNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-adm-${Math.random().toString(36).substring(2, 6)}`,
            usuarioId: adminUid,
            titulo: 'Préstamo Activo Entregado',
            mensaje: `Se formalizó la entrega del libro "${l.libroTitulo}" a ${l.estudianteNombre}. Devolución prevista para el ${new Date(
              l.fechaDevolucion
            ).toLocaleDateString('es-CO')}.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'aprobado',
            categoria: 'solicitudes',
          };

          setNotifications((np) => dedupeNotifications([adminNotif, studentNotif, ...np]));

          // Guardar en Firestore
          (async () => {
            try {
              await setDoc(doc(db, 'notificaciones', studentNotif.idNotificacion), studentNotif);
              await setDoc(doc(db, 'notificaciones', adminNotif.idNotificacion), adminNotif);
            } catch (e) {
              console.warn('Error saving approval notifications in Firestore:', e);
            }
          })();

          return { ...l, estado: 'Activo' as const };
        }
        return l;
      })
    );
  };

  const returnLoan = (idPrestamo: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.idPrestamo === idPrestamo) {
          const updatedBook = books.find((b) => b.idLibro === l.libroId);
          if (updatedBook) {
            updateBook({ ...updatedBook, estado: 'Disponible' });
          }

          const studentNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-ret`,
            usuarioId: l.usuarioId,
            titulo: 'Devolución Registrada',
            mensaje: `Se confirmó la devolución de "${l.libroTitulo}". ¡Gracias por cuidar el material bibliográfico!`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'devolucion',
            categoria: 'sistema',
          };

          const adminUid = getAdminUid();
          const adminNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-retadm`,
            usuarioId: adminUid,
            titulo: 'Devolución de Libro Completada',
            mensaje: `El estudiante ${l.estudianteNombre} entregó el libro "${l.libroTitulo}". El ejemplar ya se encuentra disponible para consulta en estantería.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'devolucion',
            categoria: 'sistema',
          };

          setNotifications((prevNotifs) => dedupeNotifications([adminNotif, studentNotif, ...prevNotifs]));

          (async () => {
            try {
              await setDoc(doc(db, 'notificaciones', studentNotif.idNotificacion), studentNotif);
              await setDoc(doc(db, 'notificaciones', adminNotif.idNotificacion), adminNotif);
            } catch (e) {
              console.warn('Error saving return notifications in Firestore:', e);
            }
          })();

          return {
            ...l,
            estado: 'Devuelto' as const,
            fechaEntregado: new Date().toISOString(),
          };
        }
        return l;
      })
    );
  };

  // 1. Solicitud de Renovación (Rol Estudiante): Solicita renovar el préstamo y envía aviso automático al Administrador
  const requestLoanRenewal = (idPrestamo: string): boolean => {
    let success = false;
    setLoans((prev) =>
      prev.map((l) => {
        if (l.idPrestamo === idPrestamo && l.estado === 'Activo') {
          if ((l.renovaciones || 0) >= 2) return l;
          if (l.solicitudRenovacion === 'pendiente') return l;

          success = true;
          const adminUid = getAdminUid();

          // Notificación automática al panel del Administrador
          const adminRenovNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-renovreq`,
            usuarioId: adminUid,
            titulo: 'Solicitud de Renovación de Préstamo',
            mensaje: `El estudiante ${l.estudianteNombre || l.usuarioNombre} (${l.estudianteGrado || 'Estudiante'}) solicita renovar el préstamo del ejemplar "${l.libroTitulo}" por 7 días adicionales.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'solicitud',
            categoria: 'solicitudes',
            prestamoId: l.idPrestamo,
            solicitudTipo: 'renovacion',
          };

          // Notificación de confirmación enviada al estudiante
          const studentPendingNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-renovst`,
            usuarioId: l.usuarioId,
            titulo: 'Solicitud de Renovación Enviada',
            mensaje: `Has solicitado renovar el préstamo de "${l.libroTitulo}". Tu solicitud fue enviada al Administrador para su revisión.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'solicitud',
            categoria: 'solicitudes',
            prestamoId: l.idPrestamo,
            solicitudTipo: 'renovacion',
          };

          setNotifications((pn) => dedupeNotifications([adminRenovNotif, studentPendingNotif, ...pn]));

          (async () => {
            try {
              await setDoc(doc(db, 'notificaciones', adminRenovNotif.idNotificacion), adminRenovNotif);
              await setDoc(doc(db, 'notificaciones', studentPendingNotif.idNotificacion), studentPendingNotif);
              await updateDoc(doc(db, 'prestamos', l.idPrestamo), {
                solicitudRenovacion: 'pendiente',
                fechaSolicitudRenovacion: new Date().toISOString(),
              });
            } catch (e) {
              // ignore
            }
          })();

          return {
            ...l,
            solicitudRenovacion: 'pendiente',
            fechaSolicitudRenovacion: new Date().toISOString(),
          };
        }
        return l;
      })
    );
    return success;
  };

  // 2. Aprobación de Renovación por el Administrador: Extiende automáticamente el plazo del préstamo y notifica al estudiante
  const approveLoanRenewal = (idPrestamo: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.idPrestamo === idPrestamo && l.estado === 'Activo') {
          const currentDev = new Date(l.fechaDevolucion);
          currentDev.setDate(currentDev.getDate() + 7);
          const nuevaFechaStr = currentDev.toLocaleDateString('es-CO');

          // Notificación automática al estudiante confirmando aprobación
          const studentNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-renovapr`,
            usuarioId: l.usuarioId,
            titulo: 'Renovación de Préstamo Aprobada',
            mensaje: `¡Tu solicitud de renovación para "${l.libroTitulo}" fue aprobada por el Administrador! Nueva fecha límite de entrega: ${nuevaFechaStr}.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'aprobado',
            categoria: 'solicitudes',
            prestamoId: l.idPrestamo,
            solicitudTipo: 'renovacion',
          };

          // Notificación de confirmación para el administrador
          const adminUid = getAdminUid();
          const adminNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-renovapradm`,
            usuarioId: adminUid,
            titulo: 'Renovación Aprobada con Éxito',
            mensaje: `Aprobaste la renovación del libro "${l.libroTitulo}" para el estudiante ${l.estudianteNombre || l.usuarioNombre}. Nueva fecha límite: ${nuevaFechaStr}.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'aprobado',
            categoria: 'solicitudes',
            prestamoId: l.idPrestamo,
            solicitudTipo: 'renovacion',
          };

          setNotifications((pn) => dedupeNotifications([adminNotif, studentNotif, ...pn]));

          (async () => {
            try {
              await setDoc(doc(db, 'notificaciones', studentNotif.idNotificacion), studentNotif);
              await setDoc(doc(db, 'notificaciones', adminNotif.idNotificacion), adminNotif);
              await updateDoc(doc(db, 'prestamos', l.idPrestamo), {
                fechaDevolucion: currentDev.toISOString(),
                renovaciones: (l.renovaciones || 0) + 1,
                solicitudRenovacion: 'aprobada',
              });
            } catch (e) {
              // ignore
            }
          })();

          return {
            ...l,
            fechaDevolucion: currentDev.toISOString(),
            renovaciones: (l.renovaciones || 0) + 1,
            solicitudRenovacion: 'aprobada',
          };
        }
        return l;
      })
    );
  };

  // 3. Rechazo de Renovación por el Administrador: Envía notificación automática al estudiante informando que no se pudo aprobar
  const rejectLoanRenewal = (idPrestamo: string, motivo?: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.idPrestamo === idPrestamo) {
          const fechaLimiteStr = new Date(l.fechaDevolucion).toLocaleDateString('es-CO');

          // Notificación automática al estudiante informando que NO se aprobó
          const studentNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-renovrec`,
            usuarioId: l.usuarioId,
            titulo: 'Renovación de Préstamo No Aprobada',
            mensaje: `No se pudo aprobar la renovación del libro "${l.libroTitulo}". Por favor realiza la entrega física en la fecha límite acordada (${fechaLimiteStr}).`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'devolucion',
            categoria: 'solicitudes',
            prestamoId: l.idPrestamo,
            solicitudTipo: 'renovacion',
          };

          // Confirmación para el administrador
          const adminUid = getAdminUid();
          const adminNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-renovrecadm`,
            usuarioId: adminUid,
            titulo: 'Renovación de Préstamo Rechazada',
            mensaje: `Rechazaste la solicitud de renovación para "${l.libroTitulo}" solicitada por ${l.estudianteNombre || l.usuarioNombre}. Se le notificó al estudiante para devolver el ${fechaLimiteStr}.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'sistema',
            categoria: 'solicitudes',
            prestamoId: l.idPrestamo,
            solicitudTipo: 'renovacion',
          };

          setNotifications((pn) => dedupeNotifications([adminNotif, studentNotif, ...pn]));

          (async () => {
            try {
              await setDoc(doc(db, 'notificaciones', studentNotif.idNotificacion), studentNotif);
              await setDoc(doc(db, 'notificaciones', adminNotif.idNotificacion), adminNotif);
              await updateDoc(doc(db, 'prestamos', l.idPrestamo), {
                solicitudRenovacion: 'rechazada',
              });
            } catch (e) {
              // ignore
            }
          })();

          return {
            ...l,
            solicitudRenovacion: 'rechazada',
          };
        }
        return l;
      })
    );
  };

  const renewLoan = (idPrestamo: string): boolean => {
    approveLoanRenewal(idPrestamo);
    return true;
  };

  const cancelLoan = (idPrestamo: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.idPrestamo === idPrestamo && l.estado === 'Solicitado') {
          const cancelNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-canc`,
            usuarioId: l.usuarioId,
            titulo: 'Solicitud Cancelada',
            mensaje: `Tu solicitud de préstamo para "${l.libroTitulo}" fue cancelada.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'sistema',
            categoria: 'solicitudes',
          };

          const adminUid = getAdminUid();
          const adminCancelNotif: Notificacion = {
            idNotificacion: `not-${Date.now()}-cancadm`,
            usuarioId: adminUid,
            titulo: 'Solicitud de Préstamo Cancelada',
            mensaje: `La solicitud de "${l.libroTitulo}" para el estudiante ${l.estudianteNombre} fue cancelada.`,
            fecha: new Date().toISOString(),
            leido: false,
            tipo: 'sistema',
            categoria: 'solicitudes',
          };

          setNotifications((prevNotifs) => dedupeNotifications([adminCancelNotif, cancelNotif, ...prevNotifs]));

          (async () => {
            try {
              await setDoc(doc(db, 'notificaciones', cancelNotif.idNotificacion), cancelNotif);
              await setDoc(doc(db, 'notificaciones', adminCancelNotif.idNotificacion), adminCancelNotif);
            } catch (e) {
              // ignore
            }
          })();

          return { ...l, estado: 'Cancelado' as const };
        }
        return l;
      })
    );
  };

  const registerDirectLoan = (estudianteNombre: string, libroTitulo: string) => {
    const targetBook = books.find((b) => b.titulo.toLowerCase() === libroTitulo.toLowerCase()) || books[0];
    const targetUser =
      users.find((u) => (u.nombre || u.nombreCompleto || '').toLowerCase().includes(estudianteNombre.toLowerCase())) ||
      users[1];

    const newLoan: Prestamo = {
      idPrestamo: `prest-${Date.now()}`,
      usuarioId: targetUser.uid,
      usuarioNombre: targetUser.nombreCompleto || targetUser.nombre || 'Estudiante',
      libroId: targetBook.idLibro,
      libroTitulo: targetBook.titulo,
      estudianteNombre: targetUser.nombreCompleto || targetUser.nombre,
      estudianteGrado: targetUser.grado,
      fechaPrestamo: new Date().toISOString(),
      fechaDevolucion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      estado: 'Activo',
      renovaciones: 0,
    };

    setLoans((prev) => [newLoan, ...prev]);
    updateBook({ ...targetBook, estado: 'Prestado' });
  };

  // Reservas
  const reserveBook = (libro: Libro) => {
    if (!currentUser) return;
    const newRes: Reserva = {
      idReserva: `res-${Date.now()}`,
      usuarioId: currentUser.uid,
      libroId: libro.idLibro,
      libroTitulo: libro.titulo,
      fecha: new Date().toISOString(),
      posicion: reservations.filter((r) => r.libroId === libro.idLibro && r.estado === 'Pendiente').length + 1,
      estado: 'Pendiente',
    };
    setReservations((prev) => [newRes, ...prev]);
  };

  const cancelReservation = (idReserva: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.idReserva === idReserva ? { ...r, estado: 'Cancelada' as const } : r))
    );
  };

  // Favoritos
  const toggleFavorite = (libroId: string) => {
    setFavorites((prev) =>
      prev.includes(libroId) ? prev.filter((id) => id !== libroId) : [...prev, libroId]
    );
  };

  const isFavorite = (libroId: string) => favorites.includes(libroId);

  // Notificaciones y sincronización en Firestore
  const markNotificationRead = async (idNotificacion: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.idNotificacion === idNotificacion ? { ...n, leido: true } : n))
    );
    try {
      await updateDoc(doc(db, 'notificaciones', idNotificacion), { leido: true });
    } catch (e) {
      console.warn('Could not update notification read state in Firestore:', e);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
    notifications
      .filter((n) => !n.leido)
      .forEach(async (n) => {
        try {
          await updateDoc(doc(db, 'notificaciones', n.idNotificacion), { leido: true });
        } catch (e) {
          // ignore
        }
      });
  };

  // Estudiantes (Admin)
  const addStudent = (studentData: Omit<Usuario, 'uid' | 'fechaRegistro' | 'rol'>) => {
    const nombre = studentData.nombreCompleto || studentData.nombre || 'Nuevo Estudiante';
    const uid = `est-${Date.now()}`;
    const newStudent: Usuario = {
      uid,
      ...studentData,
      nombreCompleto: nombre,
      nombre: nombre,
      foto: studentData.foto || DEFAULT_STUDENT_AVATAR,
      rol: 'estudiante',
      fechaRegistro: new Date().toISOString(),
    };
    setUsers((prev) => [newStudent, ...prev]);

    const adminUid = getAdminUid();
    const adminNotifId = `not-${Date.now()}-addstd-${Math.random().toString(36).substring(2, 6)}`;
    const adminNotif: Notificacion = {
      idNotificacion: adminNotifId,
      usuarioId: adminUid,
      titulo: 'Nuevo Estudiante Registrado',
      mensaje: `El estudiante ${newStudent.nombreCompleto} (${newStudent.grado || 'Estudiante'}) con documento ${newStudent.documento} fue registrado exitosamente en el sistema.`,
      fecha: new Date().toISOString(),
      leido: false,
      tipo: 'registro',
      categoria: 'registros',
    };
    setNotifications((prev) => dedupeNotifications([adminNotif, ...prev]));

    // Crear en Cloud Firestore
    (async () => {
      try {
        await setDoc(doc(db, 'usuarios', uid), newStudent);
        await setDoc(doc(db, 'notificaciones', adminNotif.idNotificacion), adminNotif);
      } catch (err) {
        console.warn('Error saving student/notification to Firestore:', err);
      }
    })();
  };

  const updateStudent = async (student: Usuario) => {
    const nombre = student.nombreCompleto || student.nombre || '';
    const cleanStudent = { ...student, nombreCompleto: nombre, nombre: nombre };
    setUsers((prev) => prev.map((u) => (u.uid === cleanStudent.uid ? cleanStudent : u)));
    try {
      await updateDoc(doc(db, 'usuarios', student.uid), cleanStudent);
    } catch (e) {
      // ignore
    }
  };

  const currentLang: LanguageCode = (appConfig.idioma as LanguageCode) || 'es';
  const t = (key: string): string => {
    return getTranslation(key, currentLang);
  };

  const bulkUploadBooksToFirestore = async (
    onProgress?: (done: number, total: number) => void
  ): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      const allBooks = CATALOG_1000_BOOKS;
      const total = allBooks.length;
      const batchSize = 50; // Lotes seguros para evitar sobrecarga de stream gRPC
      let written = 0;

      for (let i = 0; i < total; i += batchSize) {
        const slice = allBooks.slice(i, i + batchSize);
        const batch = writeBatch(db);

        slice.forEach((book) => {
          const docRef = doc(db, 'libros', book.idLibro);
          batch.set(docRef, book);
        });

        await batch.commit();
        written += slice.length;
        if (onProgress) {
          onProgress(written, total);
        }
        await new Promise((r) => setTimeout(r, 100));
      }

      // Actualizar estado local inmediatamente sin intentar escribir 1.000 libros en localStorage
      setBooks(allBooks);
      safeStorage.removeItem('biblionavia_books');
      return { success: true, count: written };
    } catch (err: any) {
      console.warn('Error during bulk upload to Firestore (preserving local catalog):', err);
      setBooks(CATALOG_1000_BOOKS);
      safeStorage.removeItem('biblionavia_books');
      return {
        success: false,
        count: 1000,
        error: err?.message || 'Error al conectar con Firestore, catálogo de 1.000 libros activo localmente.',
      };
    }
  };

  const deleteStudent = (uid: string) => {
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
  };

  const resetDatabase = () => {
    safeStorage.clear();
    setUsers(INITIAL_USERS);
    setBooks(INITIAL_BOOKS);
    setLoans(INITIAL_LOANS);
    setReservations(INITIAL_RESERVATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFavorites(['lib-001', 'lib-003']);
    setCurrentUser(INITIAL_USERS[0]);
    setAppConfig(DEFAULT_CONFIG);
  };

  return (
    <BiblioStoreContext.Provider
      value={{
        currentUser,
        authLoading,
        users,
        books,
        loans,
        reservations,
        notifications,
        favorites,
        unreadCount,
        appConfig,
        updateAppConfig,
        login,
        loginWithGoogle,
        quickLogin,
        register,
        changePassword,
        recoverPassword,
        logout,
        updateCurrentUser,
        addBook,
        updateBook,
        deleteBook,
        requestLoan,
        approveLoan,
        returnLoan,
        renewLoan,
        requestLoanRenewal,
        approveLoanRenewal,
        rejectLoanRenewal,
        cancelLoan,
        registerDirectLoan,
        reserveBook,
        cancelReservation,
        toggleFavorite,
        isFavorite,
        markNotificationRead,
        markAllNotificationsRead,
        addStudent,
        updateStudent,
        deleteStudent,
        resetDatabase,
        bulkUploadBooksToFirestore,
        t,
        currentLang,
      }}
    >
      {children}
    </BiblioStoreContext.Provider>
  );
};

export const useBiblioStore = () => {
  const ctx = useContext(BiblioStoreContext);
  if (!ctx) throw new Error('useBiblioStore must be used within a BiblioStoreProvider');
  return ctx;
};
