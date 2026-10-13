class PrestamoModel {
  final String idPrestamo;
  final String usuarioId;
  final String libroId;
  final String libroTitulo;
  final String usuarioNombre;
  final DateTime fechaPrestamo;
  final DateTime fechaDevolucion;
  final DateTime? fechaEntregado;
  final String estado; // 'Solicitado', 'Activo', 'Devuelto', 'Vencido', 'Cancelado'
  final int renovaciones;

  PrestamoModel({
    required this.idPrestamo,
    required this.usuarioId,
    required this.libroId,
    this.libroTitulo = '',
    this.usuarioNombre = '',
    required this.fechaPrestamo,
    required this.fechaDevolucion,
    this.fechaEntregado,
    required this.estado,
    this.renovaciones = 0,
  });

  bool get estaVencido =>
      estado == 'Activo' && DateTime.now().isAfter(fechaDevolucion);

  factory PrestamoModel.fromMap(Map<String, dynamic> data, String id) {
    return PrestamoModel(
      idPrestamo: id,
      usuarioId: data['usuarioId'] ?? '',
      libroId: data['libroId'] ?? '',
      libroTitulo: data['libroTitulo'] ?? '',
      usuarioNombre: data['usuarioNombre'] ?? '',
      fechaPrestamo: data['fechaPrestamo'] != null
          ? DateTime.tryParse(data['fechaPrestamo'].toString()) ?? DateTime.now()
          : DateTime.now(),
      fechaDevolucion: data['fechaDevolucion'] != null
          ? DateTime.tryParse(data['fechaDevolucion'].toString()) ?? DateTime.now().add(const Duration(days: 7))
          : DateTime.now().add(const Duration(days: 7)),
      fechaEntregado: data['fechaEntregado'] != null
          ? DateTime.tryParse(data['fechaEntregado'].toString())
          : null,
      estado: data['estado'] ?? 'Activo',
      renovaciones: data['renovaciones'] is int
          ? data['renovaciones']
          : int.tryParse(data['renovaciones']?.toString() ?? '0') ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'idPrestamo': idPrestamo,
      'usuarioId': usuarioId,
      'libroId': libroId,
      'libroTitulo': libroTitulo,
      'usuarioNombre': usuarioNombre,
      'fechaPrestamo': fechaPrestamo.toIso8601String(),
      'fechaDevolucion': fechaDevolucion.toIso8601String(),
      'fechaEntregado': fechaEntregado?.toIso8601String(),
      'estado': estado,
      'renovaciones': renovaciones,
    };
  }
}
