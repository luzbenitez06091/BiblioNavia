class UsuarioModel {
  final String uid;
  final String nombre;
  final String documento;
  final String codigo;
  final String grado;
  final String correo;
  final String foto;
  final String rol; // 'estudiante' o 'administrador'
  final DateTime fechaRegistro;

  UsuarioModel({
    required this.uid,
    required this.nombre,
    required this.documento,
    required this.codigo,
    required this.grado,
    required this.correo,
    this.foto = '',
    required this.rol,
    required this.fechaRegistro,
  });

  bool get esAdmin => rol == 'administrador';
  bool get esEstudiante => rol == 'estudiante';

  factory UsuarioModel.fromMap(Map<String, dynamic> data, String id) {
    return UsuarioModel(
      uid: id,
      nombre: data['nombre'] ?? '',
      documento: data['documento'] ?? '',
      codigo: data['codigo'] ?? '',
      grado: data['grado'] ?? '',
      correo: data['correo'] ?? '',
      foto: data['foto'] ?? '',
      rol: data['rol'] ?? 'estudiante',
      fechaRegistro: data['fechaRegistro'] != null
          ? DateTime.tryParse(data['fechaRegistro'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'nombre': nombre,
      'documento': documento,
      'codigo': codigo,
      'grado': grado,
      'correo': correo,
      'foto': foto,
      'rol': rol,
      'fechaRegistro': fechaRegistro.toIso8601String(),
    };
  }
}
