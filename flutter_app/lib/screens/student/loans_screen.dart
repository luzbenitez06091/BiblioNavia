import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/prestamo_model.dart';
import '../../models/usuario_model.dart';

class LoansScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const LoansScreen({super.key, required this.usuario});

  @override
  State<LoansScreen> createState() => _LoansScreenState();
}

class _LoansScreenState extends State<LoansScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Préstamos Activos
  final List<PrestamoModel> _prestamosActivos = [
    PrestamoModel(
      idPrestamo: 'pres-01',
      usuarioId: 'est-001',
      libroId: 'lib-001',
      libroTitulo: 'Cien Años de Soledad',
      usuarioNombre: 'Valentina Ríos',
      fechaPrestamo: DateTime.now().subtract(const Duration(days: 4)),
      fechaDevolucion: DateTime.now().add(const Duration(days: 3)),
      estado: 'Activo',
      renovaciones: 0,
    ),
    PrestamoModel(
      idPrestamo: 'pres-02',
      usuarioId: 'est-001',
      libroId: 'lib-003',
      libroTitulo: 'Biología Celular y Genética Contemporánea',
      usuarioNombre: 'Valentina Ríos',
      fechaPrestamo: DateTime.now().subtract(const Duration(days: 2)),
      fechaDevolucion: DateTime.now().add(const Duration(days: 5)),
      estado: 'Activo',
      renovaciones: 1,
    ),
  ];

  // Historial de Préstamos Pasados
  final List<PrestamoModel> _historialPrestamos = [
    PrestamoModel(
      idPrestamo: 'pres-h01',
      usuarioId: 'est-001',
      libroId: 'lib-005',
      libroTitulo: 'Historia Universal Contemporánea',
      usuarioNombre: 'Valentina Ríos',
      fechaPrestamo: DateTime.now().subtract(const Duration(days: 30)),
      fechaDevolucion: DateTime.now().subtract(const Duration(days: 23)),
      fechaEntregado: DateTime.now().subtract(const Duration(days: 24)),
      estado: 'Devuelto',
      renovaciones: 0,
    ),
    PrestamoModel(
      idPrestamo: 'pres-h02',
      usuarioId: 'est-001',
      libroId: 'lib-006',
      libroTitulo: 'Don Quijote de la Mancha',
      usuarioNombre: 'Valentina Ríos',
      fechaPrestamo: DateTime.now().subtract(const Duration(days: 60)),
      fechaDevolucion: DateTime.now().subtract(const Duration(days: 46)),
      fechaEntregado: DateTime.now().subtract(const Duration(days: 48)),
      estado: 'Devuelto',
      renovaciones: 1,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _renovarPrestamo(PrestamoModel prestamo) {
    if (prestamo.renovaciones >= 2) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Límite de renovaciones alcanzado (máx. 2)'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      final index = _prestamosActivos.indexWhere((p) => p.idPrestamo == prestamo.idPrestamo);
      if (index != -1) {
        _prestamosActivos[index] = PrestamoModel(
          idPrestamo: prestamo.idPrestamo,
          usuarioId: prestamo.usuarioId,
          libroId: prestamo.libroId,
          libroTitulo: prestamo.libroTitulo,
          usuarioNombre: prestamo.usuarioNombre,
          fechaPrestamo: prestamo.fechaPrestamo,
          fechaDevolucion: prestamo.fechaDevolucion.add(const Duration(days: 7)),
          estado: prestamo.estado,
          renovaciones: prestamo.renovaciones + 1,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('¡Préstamo renovado por 7 días adicionales!'),
        backgroundColor: AppTheme.disponible,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Préstamos'),
        backgroundColor: AppTheme.azulOscuro,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.naranja,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(text: 'Mis Préstamos (2)'),
            Tab(text: 'Historial'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Pestaña 1: Préstamos Activos
          _prestamosActivos.isEmpty
              ? const Center(
                  child: Text('No tienes préstamos activos actualmente.'),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _prestamosActivos.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = _prestamosActivos[index];
                    return _buildPrestamoCard(item, esActivo: true);
                  },
                ),

          // Pestaña 2: Historial
          _historialPrestamos.isEmpty
              ? const Center(
                  child: Text('Aún no tienes historial de préstamos devueltos.'),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _historialPrestamos.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = _historialPrestamos[index];
                    return _buildPrestamoCard(item, esActivo: false);
                  },
                ),
        ],
      ),
    );
  }

  Widget _buildPrestamoCard(PrestamoModel prestamo, {required bool esActivo}) {
    final diasRestantes = prestamo.fechaDevolucion.difference(DateTime.now()).inDays;
    final esUrgente = diasRestantes <= 2;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: esActivo && esUrgente ? Colors.red.shade200 : AppTheme.grisBorde,
          width: esActivo && esUrgente ? 1.5 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: esActivo
                      ? (esUrgente ? Colors.red.shade50 : Colors.blue.shade50)
                      : Colors.green.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  prestamo.estado,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: esActivo
                        ? (esUrgente ? Colors.red.shade700 : const Color(0xFF0284C7))
                        : AppTheme.disponible,
                  ),
                ),
              ),
              if (esActivo)
                Text(
                  diasRestantes >= 0 ? '$diasRestantes días restantes' : '¡Vencido!',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: esUrgente ? Colors.red : AppTheme.textoMuted,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),

          // Título del Libro
          Text(
            prestamo.libroTitulo,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppTheme.textoOscuro,
            ),
          ),
          const SizedBox(height: 12),

          // Fechas
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildDateColumn('Fecha Préstamo', _formatDate(prestamo.fechaPrestamo)),
              _buildDateColumn(
                esActivo ? 'Fecha Límite' : 'Devuelto el',
                esActivo
                    ? _formatDate(prestamo.fechaDevolucion)
                    : _formatDate(prestamo.fechaEntregado ?? prestamo.fechaDevolucion),
              ),
              _buildDateColumn('Renovaciones', '${prestamo.renovaciones} / 2'),
            ],
          ),

          if (esActivo) ...[
            const SizedBox(height: 16),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.azulOscuro,
                minimumSize: const Size.fromHeight(40),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: prestamo.renovaciones < 2 ? () => _renovarPrestamo(prestamo) : null,
              icon: const Icon(Icons.refresh_rounded, size: 18),
              label: Text(
                prestamo.renovaciones < 2 ? 'Renovar Préstamo (+7 Días)' : 'Sin renovaciones disponibles',
                style: const TextStyle(fontSize: 13),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDateColumn(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textoMuted)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textoOscuro)),
      ],
    );
  }

  String _formatDate(DateTime dt) {
    return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}';
  }
}
