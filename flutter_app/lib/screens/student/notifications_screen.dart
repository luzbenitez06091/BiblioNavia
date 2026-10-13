import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/notificacion_model.dart';
import '../../models/usuario_model.dart';

class NotificationsScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const NotificationsScreen({super.key, required this.usuario});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<NotificacionModel> _notificaciones = [
    NotificacionModel(
      idNotificacion: 'not-001',
      usuarioId: 'est-001',
      titulo: 'Recordatorio de Devolución',
      mensaje: 'Faltan 2 días para la devolución pactada de "Cien Años de Soledad". Puedes renovarlo desde la sección de préstamos.',
      fecha: DateTime.now().subtract(const Duration(hours: 2)),
      tipo: 'devolucion',
      leido: false,
    ),
    NotificacionModel(
      idNotificacion: 'not-002',
      usuarioId: 'est-001',
      titulo: '¡Libro Reservado Disponible!',
      mensaje: 'Tu reserva para "Física Cuántica y Nuevas Tecnologías" ya se encuentra en el mostrador. Tienes 48 horas para recogerlo.',
      fecha: DateTime.now().subtract(const Duration(days: 1)),
      tipo: 'disponible',
      leido: false,
    ),
    NotificacionModel(
      idNotificacion: 'not-003',
      usuarioId: 'est-001',
      titulo: 'Préstamo Aprobado',
      mensaje: 'El bibliotecario ha aprobado tu solicitud de "Biología Celular y Genética Contemporánea". Disfruta tu lectura.',
      fecha: DateTime.now().subtract(const Duration(days: 3)),
      tipo: 'aprobado',
      leido: true,
    ),
    NotificacionModel(
      idNotificacion: 'not-004',
      usuarioId: 'est-001',
      titulo: 'Alerta: Préstamo Vencido',
      mensaje: 'El ejemplar "Historia Universal Contemporánea" tenía fecha límite de devolución ayer. Por favor acércate a la biblioteca escolar.',
      fecha: DateTime.now().subtract(const Duration(days: 5)),
      tipo: 'vencido',
      leido: true,
    ),
  ];

  void _marcarLeida(String id) {
    setState(() {
      final index = _notificaciones.indexWhere((n) => n.idNotificacion == id);
      if (index != -1) {
        final notif = _notificaciones[index];
        _notificaciones[index] = NotificacionModel(
          idNotificacion: notif.idNotificacion,
          usuarioId: notif.usuarioId,
          titulo: notif.titulo,
          mensaje: notif.mensaje,
          fecha: notif.fecha,
          tipo: notif.tipo,
          leido: true,
        );
      }
    });
  }

  void _marcarTodasLeidas() {
    setState(() {
      for (int i = 0; i < _notificaciones.length; i++) {
        final notif = _notificaciones[i];
        _notificaciones[i] = NotificacionModel(
          idNotificacion: notif.idNotificacion,
          usuarioId: notif.usuarioId,
          titulo: notif.titulo,
          mensaje: notif.mensaje,
          fecha: notif.fecha,
          tipo: notif.tipo,
          leido: true,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Notificaciones'),
        backgroundColor: AppTheme.azulOscuro,
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all_rounded),
            tooltip: 'Marcar todas como leídas',
            onPressed: _marcarTodasLeidas,
          ),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _notificaciones.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final notif = _notificaciones[index];
          IconData icon;
          Color color;

          switch (notif.tipo) {
            case 'devolucion':
              icon = Icons.alarm_rounded;
              color = Colors.amber.shade700;
              break;
            case 'disponible':
              icon = Icons.check_circle_rounded;
              color = AppTheme.disponible;
              break;
            case 'aprobado':
              icon = Icons.thumb_up_alt_rounded;
              color = const Color(0xFF0284C7);
              break;
            case 'vencido':
              icon = Icons.warning_amber_rounded;
              color = Colors.red;
              break;
            default:
              icon = Icons.notifications_rounded;
              color = AppTheme.naranja;
          }

          return InkWell(
            onTap: () => _marcarLeida(notif.idNotificacion),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: notif.leido ? Colors.white : const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: notif.leido ? AppTheme.grisBorde : AppTheme.disponible.withOpacity(0.3),
                  width: notif.leido ? 1 : 1.5,
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: color, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              notif.titulo,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: notif.leido ? FontWeight.w600 : FontWeight.w800,
                                color: AppTheme.textoOscuro,
                              ),
                            ),
                            if (!notif.leido)
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: AppTheme.naranja,
                                  shape: BoxShape.circle,
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          notif.mensaje,
                          style: const TextStyle(fontSize: 12, height: 1.4, color: Color(0xFF475569)),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '${notif.fecha.day}/${notif.fecha.month} · ${notif.fecha.hour.toString().padLeft(2, '0')}:${notif.fecha.minute.toString().padLeft(2, '0')}',
                          style: const TextStyle(fontSize: 10, color: AppTheme.textoMuted),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
