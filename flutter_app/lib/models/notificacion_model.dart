class NotificacionModel {
  final String idNotificacion;
  final String usuarioId;
  final String titulo;
  final String mensaje;
  final DateTime fecha;
  final bool leido;
  final String tipo; // 'devolucion', 'disponible', 'aprobado', 'vencido', 'sistema'

  NotificacionModel({
    required this.idNotificacion,
    required this.usuarioId,
    required this.titulo,
    required this.mensaje,
    required this.fecha,
    this.leido = false,
    this.tipo = 'sistema',
  });

  factory NotificacionModel.fromMap(Map<String, dynamic> data, String id) {
    return NotificacionModel(
      idNotificacion: id,
      usuarioId: data['usuarioId'] ?? '',
      titulo: data['titulo'] ?? '',
      mensaje: data['mensaje'] ?? '',
      fecha: data['fecha'] != null
          ? DateTime.tryParse(data['fecha'].toString()) ?? DateTime.now()
          : DateTime.now(),
      leido: data['leido'] ?? false,
      tipo: data['tipo'] ?? 'sistema',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'idNotificacion': idNotificacion,
      'usuarioId': usuarioId,
      'titulo': titulo,
      'mensaje': mensaje,
      'fecha': fecha.toIso8601String(),
      'leido': leido,
      'tipo': tipo,
    };
  }
}
