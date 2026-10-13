import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/usuario_model.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Stream de estado de autenticación
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  User? get currentUser => _auth.currentUser;

  // Obtener perfil completo del usuario actual desde Firestore
  Future<UsuarioModel?> getUsuarioActual() async {
    final user = _auth.currentUser;
    if (user == null) return null;

    final doc = await _firestore.collection('usuarios').doc(user.uid).get();
    if (doc.exists && doc.data() != null) {
      return UsuarioModel.fromMap(doc.data()!, doc.id);
    }
    return null;
  }

  // Iniciar Sesión con Correo Institucional y Contraseña
  Future<UsuarioModel> iniciarSesion({
    required String correo,
    required String password,
  }) async {
    final credential = await _auth.signInWithEmailAndPassword(
      email: correo.trim(),
      password: password,
    );

    final uid = credential.user!.uid;
    final doc = await _firestore.collection('usuarios').doc(uid).get();

    if (!doc.exists) {
      throw Exception('El perfil del usuario no fue encontrado en Firestore.');
    }

    return UsuarioModel.fromMap(doc.data()!, uid);
  }

  // Crear Cuenta de Estudiante (El rol siempre es estudiante por defecto)
  Future<UsuarioModel> registrarUsuario({
    required String nombre,
    required String documento,
    required String codigo,
    required String grado,
    required String correo,
    required String password,
    String foto = '',
  }) async {
    final credential = await _auth.createUserWithEmailAndPassword(
      email: correo.trim(),
      password: password,
    );

    final uid = credential.user!.uid;
    final nuevoUsuario = UsuarioModel(
      uid: uid,
      nombre: nombre.trim(),
      documento: documento.trim(),
      codigo: codigo.trim(),
      grado: grado.trim(),
      correo: correo.trim(),
      foto: foto,
      rol: 'estudiante', // El estudiante no puede asignarse rol admin
      fechaRegistro: DateTime.now(),
    );

    // Guardar en Cloud Firestore en la colección 'usuarios'
    await _firestore.collection('usuarios').doc(uid).set(nuevoUsuario.toMap());

    // Crear notificación de bienvenida
    await _firestore.collection('notificaciones').add({
      'usuarioId': uid,
      'titulo': '¡Bienvenido a BiblioNavia!',
      'mensaje': 'Tu cuenta institucional ha sido creada exitosamente. Explora el catálogo escolar.',
      'fecha': DateTime.now().toIso8601String(),
      'leido': false,
      'tipo': 'sistema',
    });

    return nuevoUsuario;
  }

  // Recuperar Contraseña mediante Firebase Auth
  Future<void> recuperarPassword(String correo) async {
    await _auth.sendPasswordResetEmail(email: correo.trim());
  }

  // Cerrar Sesión
  Future<void> cerrarSesion() async {
    await _auth.signOut();
  }
}
