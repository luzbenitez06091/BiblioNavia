import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/reserva_model.dart';
import '../../models/usuario_model.dart';

class ReservationsScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const ReservationsScreen({super.key, required this.usuario});

  @override
  State<ReservationsScreen> createState() => _ReservationsScreenState();
}

class _ReservationsScreenState extends State<ReservationsScreen> {
  final List<ReservaModel> _reservas = [
    ReservaModel(
      idReserva: 'res-001',
      usuarioId: 'est-001',
      libroId: 'lib-004',
      libroTitulo: 'Cálculo Diferencial e Integral con Aplicaciones',
      fecha: DateTime.now().subtract(const Duration(days: 1)),
      posicion: 1,
      estado: 'Pendiente',
    ),
    ReservaModel(
      idReserva: 'res-002',
      usuarioId: 'est-001',
      libroId: 'lib-002',
      libroTitulo: 'Física Cuántica y Nuevas Tecnologías',
      fecha: DateTime.now().subtract(const Duration(days: 3)),
      posicion: 2,
      estado: 'Pendiente',
    ),
  ];

  void _cancelarReserva(String idReserva) {
    setState(() {
      _reservas.removeWhere((r) => r.idReserva == idReserva);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Reserva cancelada exitosamente.'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Mis Reservas'),
        backgroundColor: AppTheme.azulOscuro,
      ),
      body: _reservas.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.bookmark_border_rounded, size: 56, color: AppTheme.textoMuted),
                  SizedBox(height: 12),
                  Text('No tienes reservas activas', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                  Text('Puedes reservar libros que actualmente estén prestados.', style: TextStyle(color: AppTheme.textoMuted, fontSize: 13)),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _reservas.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final reserva = _reservas[index];
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.grisBorde),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.naranja.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              'Posición en fila: #${reserva.posicion}',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.naranja,
                              ),
                            ),
                          ),
                          Text(
                            reserva.estado,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF0284C7),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        reserva.libroTitulo,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textoOscuro,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Reservado el ${reserva.fecha.day}/${reserva.fecha.month}/${reserva.fecha.year}',
                        style: const TextStyle(fontSize: 12, color: AppTheme.textoMuted),
                      ),
                      const SizedBox(height: 14),
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.red,
                          side: const BorderSide(color: Colors.red),
                          minimumSize: const Size.fromHeight(38),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () => _cancelarReserva(reserva.idReserva),
                        icon: const Icon(Icons.cancel_outlined, size: 16),
                        label: const Text('Cancelar Reserva', style: TextStyle(fontSize: 13)),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
