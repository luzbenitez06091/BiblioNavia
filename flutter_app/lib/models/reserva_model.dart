class ReservaModel {
  final String idReserva;
  final String usuarioId;
  final String libroId;
  final String libroTitulo;
  final DateTime fecha;
  final int posicion;
  final String estado; // 'Pendiente', 'Disponible', 'Completada', 'Cancelada'

  ReservaModel({
    required this.idReserva,
    required this.usuarioId,
    required this.libroId,
    this.libroTitulo = '',
    required this.fecha,
    required this.posicion,
    required this.estado,
  });

  factory ReservaModel.fromMap(Map<String, dynamic> data, String id) {
    return ReservaModel(
      idReserva: id,
      usuarioId: data['usuarioId'] ?? '',
      libroId: data['libroId'] ?? '',
      libroTitulo: data['libroTitulo'] ?? '',
      fecha: data['fecha'] != null
          ? DateTime.tryParse(data['fecha'].toString()) ?? DateTime.now()
          : DateTime.now(),
      posicion: data['posicion'] is int
          ? data['posicion']
          : int.tryParse(data['posicion']?.toString() ?? '1') ?? 1,
      estado: data['estado'] ?? 'Pendiente',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'idReserva': idReserva,
      'usuarioId': usuarioId,
      'libroId': libroId,
      'libroTitulo': libroTitulo,
      'fecha': fecha.toIso8601String(),
      'posicion': posicion,
      'estado': estado,
    };
  }
}
