export type UserRole = 'estudiante' | 'administrador';

export interface Usuario {
  uid: string;
  nombreCompleto: string;
  nombre?: string; // Compatibilidad
  documento: string;
  codigo?: string;
  grado: string;
  correo: string;
  foto?: string;
  rol: UserRole;
  fechaRegistro: string;
}

export type BookStatus = 'Disponible' | 'Prestado' | 'Reservado' | 'En Reparación';

export interface Libro {
  idLibro: string;
  imagenPortada: string;
  imagen?: string; // Compatibilidad
  titulo: string;
  autor: string;
  editorial: string;
  isbn: string;
  anio: number;
  paginas: number;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  estado: BookStatus;
}

export type LoanStatus = 'Solicitado' | 'Activo' | 'Devuelto' | 'Vencido' | 'Cancelado';

export interface Prestamo {
  idPrestamo: string;
  usuarioId: string;
  usuarioNombre: string;
  estudianteNombre?: string;
  estudianteGrado?: string;
  libroId: string;
  libroTitulo: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  fechaEntregado?: string;
  estado: LoanStatus;
  renovaciones: number;
  solicitudRenovacion?: 'pendiente' | 'aprobada' | 'rechazada' | 'ninguna';
  fechaSolicitudRenovacion?: string;
}

export type ReservationStatus = 'Pendiente' | 'Disponible' | 'Completada' | 'Cancelada';

export interface Reserva {
  idReserva: string;
  usuarioId: string;
  libroId: string;
  libroTitulo: string;
  fecha: string;
  posicion: number;
  estado: ReservationStatus;
}

export interface Notificacion {
  idNotificacion: string;
  usuarioId: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
  tipo: 'devolucion' | 'disponible' | 'aprobado' | 'vencido' | 'sistema' | 'solicitud' | 'registro' | 'renovacion';
  categoria?: 'solicitudes' | 'registros' | 'sistema';
  prestamoId?: string;
  solicitudTipo?: 'prestamo' | 'renovacion';
}

export interface Favorito {
  idFavorito: string;
  usuarioId: string;
  libroId: string;
  fecha: string;
}

export interface AppConfig {
  modoOscuro: boolean;
  idioma: 'es' | 'en' | 'fr';
  tamanoLetra: 'pequena' | 'normal' | 'grande';
  notificacionesDevolucion: boolean;
  notificacionesDisponibilidad: boolean;
  notificacionesAlertas: boolean;
}
