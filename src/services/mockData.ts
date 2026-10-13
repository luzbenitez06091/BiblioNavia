import { Usuario, Libro, Prestamo, Reserva, Notificacion } from '../types';
import { CARTOON_AVATARS, DEFAULT_ADMIN_AVATAR } from './avatars';
import { CATALOG_1000_BOOKS } from './catalog1000';

export const INITIAL_USERS: Usuario[] = [
  {
    uid: 'admin-001',
    nombreCompleto: 'Luz Benítez',
    nombre: 'Luz Benítez',
    documento: '1098765432',
    grado: 'Bibliotecari@ Escolar',
    correo: 'luzbenitez06091@gmail.com',
    foto: DEFAULT_ADMIN_AVATAR,
    rol: 'administrador',
    fechaRegistro: '2025-01-01T08:00:00.000Z',
  },
  {
    uid: 'est-001',
    nombreCompleto: 'Valentina Ríos Restrepo',
    nombre: 'Valentina Ríos Restrepo',
    documento: '1098765432',
    grado: '10° Grado A',
    correo: 'valentina.rios@colegio.edu.co',
    foto: CARTOON_AVATARS[1],
    rol: 'estudiante',
    fechaRegistro: '2026-01-15T08:00:00.000Z',
  },
  {
    uid: 'est-002',
    nombreCompleto: 'Mateo Gómez Herrera',
    nombre: 'Mateo Gómez Herrera',
    documento: '1023456789',
    grado: '11° Grado B',
    correo: 'mateo.gomez@colegio.edu.co',
    foto: CARTOON_AVATARS[0],
    rol: 'estudiante',
    fechaRegistro: '2026-02-01T09:00:00.000Z',
  },
  {
    uid: 'est-003',
    nombreCompleto: 'Camila Sofía Torres',
    nombre: 'Camila Sofía Torres',
    documento: '1045678901',
    grado: '9° Grado C',
    correo: 'camila.torres@colegio.edu.co',
    foto: CARTOON_AVATARS[3],
    rol: 'estudiante',
    fechaRegistro: '2026-02-18T10:30:00.000Z',
  }
];

export const INITIAL_BOOKS: Libro[] = CATALOG_1000_BOOKS;

import { generateUniqueBookCoverSvg } from './coverGenerator';

export const CANONICAL_BOOK_ID_COVERS: Record<string, string> = {
  'lib-0001': '/src/assets/images/cover_cien_anos_1790462849097.jpg',
  'lib-0002': '/src/assets/images/cover_quijote_1790464793213.jpg',
  'lib-0003': '/src/assets/images/cover_principito_1790469069118.jpg',
  'lib-0004': '/src/assets/images/cover_odisea_1790469082371.jpg',
  'lib-0005': '/src/assets/images/cover_fisica_1790462858863.jpg',
  'lib-0006': '/src/assets/images/cover_biologia_1790462869882.jpg',
  'lib-0007': '/src/assets/images/cover_calculo_1790464803256.jpg',
  'lib-0008': '/src/assets/images/cover_historia_1790464826116.jpg',
  'lib-0009': '/src/assets/images/cover_quimica_1790464815826.jpg',
  'lib-0010': '/src/assets/images/cover_filosofia_1790464851682.jpg',
};

export const BOOK_COVER_MAP: Record<string, string> = {
  'cien anos de soledad': '/src/assets/images/cover_cien_anos_1790462849097.jpg',
  'cien años de soledad': '/src/assets/images/cover_cien_anos_1790462849097.jpg',
  'el principito': '/src/assets/images/cover_principito_1790469069118.jpg',
  'don quijote de la mancha': '/src/assets/images/cover_quijote_1790464793213.jpg',
  'don quijote': '/src/assets/images/cover_quijote_1790464793213.jpg',
  'la odisea': '/src/assets/images/cover_odisea_1790469082371.jpg',
  'física universitaria con física moderna': '/src/assets/images/cover_fisica_1790462858863.jpg',
  'fisica universitaria con fisica moderna': '/src/assets/images/cover_fisica_1790462858863.jpg',
  'biología celular y molecular': '/src/assets/images/cover_biologia_1790462869882.jpg',
  'biologia celular y molecular': '/src/assets/images/cover_biologia_1790462869882.jpg',
  'cálculo trascendentes tempranas': '/src/assets/images/cover_calculo_1790464803256.jpg',
  'calculo trascendentes tempranas': '/src/assets/images/cover_calculo_1790464803256.jpg',
  'historia universal contemporánea: de 1914 al presente': '/src/assets/images/cover_historia_1790464826116.jpg',
  'historia universal contemporanea: de 1914 al presente': '/src/assets/images/cover_historia_1790464826116.jpg',
  'química orgánica y bioquímica fundamental': '/src/assets/images/cover_quimica_1790464815826.jpg',
  'quimica organica y bioquimica fundamental': '/src/assets/images/cover_quimica_1790464815826.jpg',
  'lógica proposicional y argumentación crítica': '/src/assets/images/cover_filosofia_1790464851682.jpg',
  'logica proposicional y argumentacion critica': '/src/assets/images/cover_filosofia_1790464851682.jpg',
};

export const getBookCover = (libro?: Partial<Libro> | null): string => {
  if (!libro) {
    return generateUniqueBookCoverSvg({ titulo: 'Libro Escolar', categoria: 'Literatura' });
  }

  const rawTitle = (libro.titulo || '').trim();
  const cleanTitle = rawTitle.toLowerCase().trim();

  // 1. Obras canónicas maestras: correspondencia física real estricta (1:1 exacta sin repeticiones)
  if (libro.idLibro && CANONICAL_BOOK_ID_COVERS[libro.idLibro]) {
    return CANONICAL_BOOK_ID_COVERS[libro.idLibro];
  }

  if (cleanTitle && BOOK_COVER_MAP[cleanTitle]) {
    return BOOK_COVER_MAP[cleanTitle];
  }

  // 2. Comprobar si la imagen asignada es inválida o es una foto canónica asignada por error a otro título
  const isInvalidOrRepeated = (url?: string) => {
    if (!url || typeof url !== 'string' || url.length < 5) return true;
    if (url.includes('placeholder')) return true;
    if (url.includes('photo-1544716278-ca5e3f4abd8c')) return true;
    if (url.includes('picsum.photos')) return true;

    // Si es una foto física de las 10 obras maestras, solo puede pertenecer a esa obra maestra específica evaluada en el paso 1
    const canonicalFiles = [
      'cover_cien_anos', 'cover_principito', 'cover_quijote', 'cover_odisea',
      'cover_fisica', 'cover_biologia', 'cover_calculo', 'cover_historia',
      'cover_quimica', 'cover_filosofia'
    ];
    for (const f of canonicalFiles) {
      if (url.includes(f)) {
        return true; // No es la obra maestra canónica; evitar repetir foto física ajena
      }
    }
    return false;
  };

  // 3. Si el libro tiene su propia portada legítima exclusiva (SVG vectorizado personalizado o foto propia subida por admin)
  if (libro.imagenPortada && !isInvalidOrRepeated(libro.imagenPortada)) {
    return libro.imagenPortada;
  }
  if (libro.imagen && !isInvalidOrRepeated(libro.imagen)) {
    return libro.imagen;
  }

  // 4. Si coincide con el catálogo oficial de 1.000 libros por ID exacto
  if (libro.idLibro) {
    const catalogBook = CATALOG_1000_BOOKS.find((b) => b.idLibro === libro.idLibro);
    if (catalogBook && catalogBook.imagenPortada && !isInvalidOrRepeated(catalogBook.imagenPortada)) {
      return catalogBook.imagenPortada;
    }
  }

  // 5. Si coincide con el catálogo oficial por título exacto
  if (cleanTitle) {
    const catalogBook = CATALOG_1000_BOOKS.find((b) => b.titulo.toLowerCase().trim() === cleanTitle);
    if (catalogBook && catalogBook.imagenPortada && !isInvalidOrRepeated(catalogBook.imagenPortada)) {
      return catalogBook.imagenPortada;
    }
  }

  // 6. Generar portada física vectorial editorial exclusiva con su propio título, autor, editorial, ISBN, año y lomo 3D
  return generateUniqueBookCoverSvg({
    idLibro: libro.idLibro,
    titulo: rawTitle || 'Libro Escolar',
    autor: libro.autor,
    categoria: libro.categoria,
    editorial: libro.editorial,
    isbn: libro.isbn,
    anio: libro.anio,
  });
};

export const INITIAL_LOANS: Prestamo[] = [
  {
    idPrestamo: 'pres-01',
    usuarioId: 'est-001',
    usuarioNombre: 'Valentina Ríos Restrepo',
    libroId: 'lib-0001',
    libroTitulo: 'Cien Años de Soledad',
    fechaPrestamo: new Date(Date.now() - 4 * 86400000).toISOString(),
    fechaDevolucion: new Date(Date.now() + 3 * 86400000).toISOString(),
    estado: 'Activo',
    renovaciones: 0,
  },
  {
    idPrestamo: 'pres-02',
    usuarioId: 'est-001',
    usuarioNombre: 'Valentina Ríos Restrepo',
    estudianteNombre: 'Valentina Ríos Restrepo',
    estudianteGrado: '10° Grado A',
    libroId: 'lib-0006',
    libroTitulo: 'Biología Celular y Molecular',
    fechaPrestamo: new Date(Date.now() - 2 * 86400000).toISOString(),
    fechaDevolucion: new Date(Date.now() + 5 * 86400000).toISOString(),
    estado: 'Activo',
    renovaciones: 0,
    solicitudRenovacion: 'pendiente',
    fechaSolicitudRenovacion: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    idPrestamo: 'pres-03',
    usuarioId: 'est-002',
    libroId: 'lib-0007',
    libroTitulo: 'Cálculo Trascendentes Tempranas',
    usuarioNombre: 'Mateo Gómez Herrera',
    fechaPrestamo: new Date().toISOString(),
    fechaDevolucion: new Date(Date.now() + 7 * 86400000).toISOString(),
    estado: 'Solicitado',
    renovaciones: 0,
  },
  {
    idPrestamo: 'pres-h01',
    usuarioId: 'est-001',
    usuarioNombre: 'Valentina Ríos Restrepo',
    libroId: 'lib-0008',
    libroTitulo: 'Historia Universal Contemporánea: de 1914 al Presente',
    fechaPrestamo: new Date(Date.now() - 32 * 86400000).toISOString(),
    fechaDevolucion: new Date(Date.now() - 25 * 86400000).toISOString(),
    fechaEntregado: new Date(Date.now() - 26 * 86400000).toISOString(),
    estado: 'Devuelto',
    renovaciones: 0,
  },
  {
    idPrestamo: 'pres-h02',
    usuarioId: 'est-001',
    usuarioNombre: 'Valentina Ríos Restrepo',
    libroId: 'lib-0002',
    libroTitulo: 'Don Quijote de la Mancha',
    fechaPrestamo: new Date(Date.now() - 65 * 86400000).toISOString(),
    fechaDevolucion: new Date(Date.now() - 51 * 86400000).toISOString(),
    fechaEntregado: new Date(Date.now() - 53 * 86400000).toISOString(),
    estado: 'Devuelto',
    renovaciones: 1,
  }
];

export const INITIAL_RESERVATIONS: Reserva[] = [
  {
    idReserva: 'res-001',
    usuarioId: 'est-001',
    libroId: 'lib-0003',
    libroTitulo: 'El Principito',
    fecha: new Date(Date.now() - 1 * 86400000).toISOString(),
    posicion: 1,
    estado: 'Pendiente',
  },
  {
    idReserva: 'res-002',
    usuarioId: 'est-001',
    libroId: 'lib-0004',
    libroTitulo: 'La Odisea',
    fecha: new Date(Date.now() - 3 * 86400000).toISOString(),
    posicion: 2,
    estado: 'Pendiente',
  }
];

export const INITIAL_NOTIFICATIONS: Notificacion[] = [
  // --- CATEGORÍA: SOLICITUDES ---
  {
    idNotificacion: 'not-001',
    usuarioId: 'admin-001',
    titulo: 'Nueva Solicitud de Préstamo',
    mensaje: 'El estudiante Mateo Gómez Herrera (11° Grado B) solicitó el préstamo del libro "Cálculo Diferencial e Integral con Aplicaciones". Requiere tu aprobación en el módulo de Préstamos.',
    fecha: new Date(Date.now() - 30 * 60000).toISOString(),
    leido: false,
    tipo: 'solicitud',
    categoria: 'solicitudes',
  },
  {
    idNotificacion: 'not-005',
    usuarioId: 'admin-001',
    titulo: 'Nueva Solicitud de Préstamo',
    mensaje: 'La estudiante Valentina Ríos Restrepo (10° Grado A) solicitó el préstamo de "Biología Celular y Genética Contemporánea". Solicitud en espera de entrega física.',
    fecha: new Date(Date.now() - 3 * 3600000).toISOString(),
    leido: false,
    tipo: 'solicitud',
    categoria: 'solicitudes',
  },
  {
    idNotificacion: 'not-006',
    usuarioId: 'admin-001',
    titulo: 'Solicitud de Renovación de Préstamo',
    mensaje: 'La estudiante Valentina Ríos Restrepo (10° Grado A) solicita renovar el préstamo del ejemplar "Biología Celular y Molecular" por 7 días adicionales.',
    fecha: new Date(Date.now() - 2 * 3600000).toISOString(),
    leido: false,
    tipo: 'solicitud',
    categoria: 'solicitudes',
    prestamoId: 'pres-02',
    solicitudTipo: 'renovacion',
  },

  // --- CATEGORÍA: REGISTROS ---
  {
    idNotificacion: 'not-002',
    usuarioId: 'admin-001',
    titulo: 'Nuevo Estudiante Registrado',
    mensaje: 'La estudiante Camila Sofía Torres (9° Grado C) se ha registrado exitosamente en la plataforma BiblioNavia con correo camila.torres@colegio.edu.co.',
    fecha: new Date(Date.now() - 2 * 3600000).toISOString(),
    leido: false,
    tipo: 'registro',
    categoria: 'registros',
  },
  {
    idNotificacion: 'not-004',
    usuarioId: 'admin-001',
    titulo: 'Nuevo Estudiante Registrado',
    mensaje: 'El estudiante Mateo Gómez Herrera (11° Grado B) completó su registro institucional con documento 1023456789 y acceso habilitado al catálogo.',
    fecha: new Date(Date.now() - 48 * 3600000).toISOString(),
    leido: true,
    tipo: 'registro',
    categoria: 'registros',
  },
  {
    idNotificacion: 'not-007',
    usuarioId: 'admin-001',
    titulo: 'Nuevo Estudiante Registrado',
    mensaje: 'La estudiante Valentina Ríos Restrepo (10° Grado A) fue dada de alta en el sistema escolar con documento 1098765432.',
    fecha: new Date(Date.now() - 72 * 3600000).toISOString(),
    leido: true,
    tipo: 'registro',
    categoria: 'registros',
  },

  // --- CATEGORÍA: SISTEMA ---
  {
    idNotificacion: 'not-003',
    usuarioId: 'admin-001',
    titulo: 'Préstamo Próximo a Vencer',
    mensaje: 'El préstamo de "Cien Años de Soledad" asignado a Valentina Ríos Restrepo (10° Grado A) vence en 3 días. Realizar seguimiento escolar.',
    fecha: new Date(Date.now() - 14 * 3600000).toISOString(),
    leido: false,
    tipo: 'vencido',
    categoria: 'sistema',
  },
  {
    idNotificacion: 'not-008',
    usuarioId: 'todos',
    titulo: 'Aviso del Sistema BiblioNavia',
    mensaje: 'Actualización del catálogo bibliográfico institucional 2026 completada. Se añadieron nuevas colecciones académicas y técnicas para la I.E.T.I. Rafael Navia Varón.',
    fecha: new Date(Date.now() - 24 * 3600000).toISOString(),
    leido: false,
    tipo: 'sistema',
    categoria: 'sistema',
  },
  {
    idNotificacion: 'not-009',
    usuarioId: 'todos',
    titulo: 'Horario y Normativa de Biblioteca Escolar',
    mensaje: 'Recordatorio institucional: La biblioteca escolar presta atención continua de Lunes a Viernes de 7:00 a.m. a 3:30 p.m. Sede Principal I.E.T.I. Rafael Navia Varón.',
    fecha: new Date(Date.now() - 50 * 3600000).toISOString(),
    leido: true,
    tipo: 'sistema',
    categoria: 'sistema',
  },
  {
    idNotificacion: 'not-010',
    usuarioId: 'admin-001',
    titulo: 'Devolución Exitosa de Libro',
    mensaje: 'Se registró la devolución física de "Historia Universal Contemporánea" en óptimas condiciones de conservación y el libro ya está disponible en catálogo.',
    fecha: new Date(Date.now() - 90 * 3600000).toISOString(),
    leido: true,
    tipo: 'devolucion',
    categoria: 'sistema',
  },

  // --- NOTIFICACIONES ESPECÍFICAS PARA EL ESTUDIANTE (est-001) ---
  // 1. Confirmación de préstamo recién realizado
  {
    idNotificacion: 'not-std-loan-01',
    usuarioId: 'est-001',
    titulo: 'Préstamo Confirmado Exitosamente',
    mensaje: 'Has solicitado en préstamo el libro "Cien Años de Soledad". El ejemplar ha quedado asignado a tu registro escolar.',
    fecha: new Date(Date.now() - 4 * 86400000).toISOString(),
    leido: false,
    tipo: 'solicitud',
    categoria: 'sistema',
  },
  // 2. Recordatorio o aviso del día de devolución
  {
    idNotificacion: 'not-std-due-01',
    usuarioId: 'est-001',
    titulo: 'Recordatorio: Día de Devolución Próximo',
    mensaje: 'Recordatorio: La fecha límite de devolución para el libro "Cien Años de Soledad" es en 3 días. Por favor acércate a la biblioteca escolar.',
    fecha: new Date(Date.now() - 2 * 3600000).toISOString(),
    leido: false,
    tipo: 'vencido',
    categoria: 'sistema',
  },
  // 3. Alerta de nuevos libros agregados
  {
    idNotificacion: 'not-std-new-01',
    usuarioId: 'todos',
    titulo: '¡Nuevos Libros Disponibles en Biblioteca!',
    mensaje: 'Se han incorporado nuevos títulos al acervo de la I.E.T.I. Rafael Navia Varón en Literatura, Ciencia y Tecnología. ¡Explora el catálogo y solicita el tuyo!',
    fecha: new Date(Date.now() - 12 * 3600000).toISOString(),
    leido: false,
    tipo: 'disponible',
    categoria: 'sistema',
  },
  // 4. Aceptación de solicitud de libro por el administrador
  {
    idNotificacion: 'not-std-appr-01',
    usuarioId: 'est-001',
    titulo: 'Solicitud de Libro Aceptada por el Administrador',
    mensaje: '¡Excelente noticia! La administración de la biblioteca ha aceptado tu solicitud de préstamo para "Biología Celular y Genética Contemporánea". Ya puedes pasar a recoger tu libro físico.',
    fecha: new Date(Date.now() - 1 * 86400000).toISOString(),
    leido: false,
    tipo: 'aprobado',
    categoria: 'sistema',
  },
];
