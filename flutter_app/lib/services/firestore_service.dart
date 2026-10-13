import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/libro_model.dart';
import '../models/prestamo_model.dart';
import '../models/reserva_model.dart';
import '../models/notificacion_model.dart';
import '../models/usuario_model.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // ==================== LIBROS ====================
  Stream<List<LibroModel>> getLibrosStream() {
    return _firestore.collection('libros').snapshots().map((snapshot) {
      return snapshot.docs
          .map((doc) => LibroModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> agregarLibro(LibroModel libro) async {
    final docRef = _firestore.collection('libros').doc();
    final libroConId = LibroModel(
      idLibro: docRef.id,
      titulo: libro.titulo,
      autor: libro.autor,
      editorial: libro.editorial,
      isbn: libro.isbn,
      anio: libro.anio,
      paginas: libro.paginas,
      categoria: libro.categoria,
      imagen: libro.imagen,
      ubicacion: libro.ubicacion,
      descripcion: libro.descripcion,
      estado: libro.estado,
    );
    await docRef.set(libroConId.toMap());
  }

  Future<void> actualizarLibro(LibroModel libro) async {
    await _firestore
        .collection('libros')
        .doc(libro.idLibro)
        .update(libro.toMap());
  }

  Future<void> eliminarLibro(String idLibro) async {
    await _firestore.collection('libros').doc(idLibro).delete();
  }

  // ==================== PRÉSTAMOS ====================
  Stream<List<PrestamoModel>> getPrestamosPorUsuario(String usuarioId) {
    return _firestore
        .collection('prestamos')
        .where('usuarioId', isEqualTo: usuarioId)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => PrestamoModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  Stream<List<PrestamoModel>> getAllPrestamosStream() {
    return _firestore.collection('prestamos').snapshots().map((snapshot) {
      return snapshot.docs
          .map((doc) => PrestamoModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> solicitarPrestamo({
    required String usuarioId,
    required String usuarioNombre,
    required String libroId,
    required String libroTitulo,
  }) async {
    final docRef = _firestore.collection('prestamos').doc();
    final prestamo = PrestamoModel(
      idPrestamo: docRef.id,
      usuarioId: usuarioId,
      usuarioNombre: usuarioNombre,
      libroId: libroId,
      libroTitulo: libroTitulo,
      fechaPrestamo: DateTime.now(),
      fechaDevolucion: DateTime.now().add(const Duration(days: 7)),
      estado: 'Solicitado',
    );
    await docRef.set(prestamo.toMap());
  }

  Future<void> aprobarPrestamo(String idPrestamo, String libroId) async {
    await _firestore.collection('prestamos').doc(idPrestamo).update({
      'estado': 'Activo',
      'fechaPrestamo': DateTime.now().toIso8601String(),
      'fechaDevolucion': DateTime.now().add(const Duration(days: 7)).toIso8601String(),
    });
    // Actualizar libro a Prestado
    await _firestore.collection('libros').doc(libroId).update({
      'estado': 'Prestado',
    });
  }

  Future<void> registrarDevolucion(String idPrestamo, String libroId) async {
    await _firestore.collection('prestamos').doc(idPrestamo).update({
      'estado': 'Devuelto',
      'fechaEntregado': DateTime.now().toIso8601String(),
    });
    // Volver a poner libro en Disponible
    await _firestore.collection('libros').doc(libroId).update({
      'estado': 'Disponible',
    });
  }

  Future<void> renovarPrestamo(String idPrestamo, int renovacionesActuales) async {
    if (renovacionesActuales >= 2) {
      throw Exception('Has alcanzado el límite máximo de renovaciones permitidas.');
    }
    await _firestore.collection('prestamos').doc(idPrestamo).update({
      'fechaDevolucion': DateTime.now().add(const Duration(days: 7)).toIso8601String(),
      'renovaciones': renovacionesActuales + 1,
    });
  }

  // ==================== RESERVAS ====================
  Stream<List<ReservaModel>> getReservasPorUsuario(String usuarioId) {
    return _firestore
        .collection('reservas')
        .where('usuarioId', isEqualTo: usuarioId)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => ReservaModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> reservarLibro({
    required String usuarioId,
    required String libroId,
    required String libroTitulo,
  }) async {
    final query = await _firestore
        .collection('reservas')
        .where('libroId', isEqualTo: libroId)
        .where('estado', isEqualTo: 'Pendiente')
        .get();

    final posicion = query.docs.length + 1;
    final docRef = _firestore.collection('reservas').doc();

    final reserva = ReservaModel(
      idReserva: docRef.id,
      usuarioId: usuarioId,
      libroId: libroId,
      libroTitulo: libroTitulo,
      fecha: DateTime.now(),
      posicion: posicion,
      estado: 'Pendiente',
    );
    await docRef.set(reserva.toMap());
  }

  Future<void> cancelarReserva(String idReserva) async {
    await _firestore.collection('reservas').doc(idReserva).update({
      'estado': 'Cancelada',
    });
  }

  // ==================== FAVORITOS ====================
  Stream<List<String>> getFavoritosIds(String usuarioId) {
    return _firestore
        .collection('favoritos')
        .where('usuarioId', isEqualTo: usuarioId)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => doc.data()['libroId'] as String)
          .toList();
    });
  }

  Future<void> toggleFavorito(String usuarioId, String libroId) async {
    final query = await _firestore
        .collection('favoritos')
        .where('usuarioId', isEqualTo: usuarioId)
        .where('libroId', isEqualTo: libroId)
        .get();

    if (query.docs.isNotEmpty) {
      for (var doc in query.docs) {
        await doc.reference.delete();
      }
    } else {
      await _firestore.collection('favoritos').add({
        'usuarioId': usuarioId,
        'libroId': libroId,
        'fecha': DateTime.now().toIso8601String(),
      });
    }
  }

  // ==================== NOTIFICACIONES ====================
  Stream<List<NotificacionModel>> getNotificacionesPorUsuario(String usuarioId) {
    return _firestore
        .collection('notificaciones')
        .where('usuarioId', isEqualTo: usuarioId)
        .snapshots()
        .map((snapshot) {
      final list = snapshot.docs
          .map((doc) => NotificacionModel.fromMap(doc.data(), doc.id))
          .toList();
      list.sort((a, b) => b.fecha.compareTo(a.fecha));
      return list;
    });
  }

  Future<void> marcarNotificacionLeida(String idNotificacion) async {
    await _firestore
        .collection('notificaciones')
        .doc(idNotificacion)
        .update({'leido': true});
  }

  // ==================== GESTIÓN ESTUDIANTES (ADMIN) ====================
  Stream<List<UsuarioModel>> getEstudiantesStream() {
    return _firestore
        .collection('usuarios')
        .where('rol', isEqualTo: 'estudiante')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => UsuarioModel.fromMap(doc.data(), doc.id))
          .toList();
    });
  }
}
