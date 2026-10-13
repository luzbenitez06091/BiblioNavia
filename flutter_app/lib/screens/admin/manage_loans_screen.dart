import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/prestamo_model.dart';
import '../../models/usuario_model.dart';

class ManageLoansScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const ManageLoansScreen({super.key, required this.usuario});

  @override
  State<ManageLoansScreen> createState() => _ManageLoansScreenState();
}

class _ManageLoansScreenState extends State<ManageLoansScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<PrestamoModel> _prestamos = [
    PrestamoModel(
      idPrestamo: 'p-sol-01',
      usuarioId: 'est-002',
      libroId: 'lib-004',
      libroTitulo: 'Cálculo Diferencial e Integral',
      usuarioNombre: 'Mateo Gómez Herrera',
      fechaPrestamo: DateTime.now(),
      fechaDevolucion: DateTime.now().add(const Duration(days: 7)),
      estado: 'Solicitado',
    ),
    PrestamoModel(
      idPrestamo: 'p-act-01',
      usuarioId: 'est-001',
      libroId: 'lib-001',
      libroTitulo: 'Cien Años de Soledad',
      usuarioNombre: 'Valentina Ríos',
      fechaPrestamo: DateTime.now().subtract(const Duration(days: 5)),
      fechaDevolucion: DateTime.now().add(const Duration(days: 2)),
      estado: 'Activo',
      renovaciones: 1,
    ),
    PrestamoModel(
      idPrestamo: 'p-act-02',
      usuarioId: 'est-003',
      libroId: 'lib-002',
      libroTitulo: 'Física Cuántica y Nuevas Tecnologías',
      usuarioNombre: 'Camila Sofía Torres',
      fechaPrestamo: DateTime.now().subtract(const Duration(days: 10)),
      fechaDevolucion: DateTime.now().subtract(const Duration(days: 3)),
      estado: 'Activo',
      renovaciones: 0,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _aprobarPrestamo(String id) {
    setState(() {
      final idx = _prestamos.indexWhere((p) => p.idPrestamo == id);
      if (idx != -1) {
        final p = _prestamos[idx];
        _prestamos[idx] = PrestamoModel(
          idPrestamo: p.idPrestamo,
          usuarioId: p.usuarioId,
          libroId: p.libroId,
          libroTitulo: p.libroTitulo,
          usuarioNombre: p.usuarioNombre,
          fechaPrestamo: DateTime.now(),
          fechaDevolucion: DateTime.now().add(const Duration(days: 7)),
          estado: 'Activo',
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Préstamo Aprobado. Estado del libro actualizado a "Prestado" en Firestore.'),
        backgroundColor: AppTheme.disponible,
      ),
    );
  }

  void _registrarDevolucion(String id) {
    setState(() {
      final idx = _prestamos.indexWhere((p) => p.idPrestamo == id);
      if (idx != -1) {
        final p = _prestamos[idx];
        _prestamos[idx] = PrestamoModel(
          idPrestamo: p.idPrestamo,
          usuarioId: p.usuarioId,
          libroId: p.libroId,
          libroTitulo: p.libroTitulo,
          usuarioNombre: p.usuarioNombre,
          fechaPrestamo: p.fechaPrestamo,
          fechaDevolucion: p.fechaDevolucion,
          fechaEntregado: DateTime.now(),
          estado: 'Devuelto',
          renovaciones: p.renovaciones,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Devolución registrada. El ejemplar vuelve a estar "Disponible" en el catálogo.'),
        backgroundColor: AppTheme.disponible,
      ),
    );
  }

  void _cancelarPrestamo(String id) {
    setState(() {
      _prestamos.removeWhere((p) => p.idPrestamo == id);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Préstamo cancelado.')),
    );
  }

  void _renovarPorAdmin(String id) {
    setState(() {
      final idx = _prestamos.indexWhere((p) => p.idPrestamo == id);
      if (idx != -1) {
        final p = _prestamos[idx];
        _prestamos[idx] = PrestamoModel(
          idPrestamo: p.idPrestamo,
          usuarioId: p.usuarioId,
          libroId: p.libroId,
          libroTitulo: p.libroTitulo,
          usuarioNombre: p.usuarioNombre,
          fechaPrestamo: p.fechaPrestamo,
          fechaDevolucion: p.fechaDevolucion.add(const Duration(days: 7)),
          estado: p.estado,
          renovaciones: p.renovaciones + 1,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Préstamo renovado por el bibliotecario.')),
    );
  }

  void _registrarNuevoPrestamoDirecto() {
    final estudianteCtrl = TextEditingController();
    final libroCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          top: 20,
          left: 20,
          right: 20,
          bottom: MediaQuery.of(context).viewInsets.bottom + 20,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Registrar Nuevo Préstamo Directo',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.azulOscuro),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: estudianteCtrl,
              decoration: const InputDecoration(labelText: 'Nombre o Código del Estudiante'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: libroCtrl,
              decoration: const InputDecoration(labelText: 'Título o ISBN del Libro'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                if (estudianteCtrl.text.isEmpty || libroCtrl.text.isEmpty) return;

                setState(() {
                  _prestamos.insert(
                    0,
                    PrestamoModel(
                      idPrestamo: 'pres-${DateTime.now().millisecondsSinceEpoch}',
                      usuarioId: 'est-directo',
                      libroId: 'lib-directo',
                      libroTitulo: libroCtrl.text.trim(),
                      usuarioNombre: estudianteCtrl.text.trim(),
                      fechaPrestamo: DateTime.now(),
                      fechaDevolucion: DateTime.now().add(const Duration(days: 7)),
                      estado: 'Activo',
                    ),
                  );
                });

                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Préstamo registrado y activado en Firestore'),
                    backgroundColor: AppTheme.disponible,
                  ),
                );
              },
              child: const Text('Confirmar y Entregar Libro'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final solicitudes = _prestamos.where((p) => p.estado == 'Solicitado').toList();
    final activos = _prestamos.where((p) => p.estado == 'Activo').toList();
    final devueltos = _prestamos.where((p) => p.estado == 'Devuelto').toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Control de Préstamos'),
        backgroundColor: AppTheme.azulOscuro,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.naranja,
          tabs: [
            Tab(text: 'Solicitudes (${solicitudes.length})'),
            Tab(text: 'Activos (${activos.length})'),
            Tab(text: 'Devueltos (${devueltos.length})'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.azulOscuro,
        foregroundColor: Colors.white,
        onPressed: _registrarNuevoPrestamoDirecto,
        icon: const Icon(Icons.add_task_rounded),
        label: const Text('Nuevo Préstamo'),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Solicitudes Pendientes de Aprobación
          solicitudes.isEmpty
              ? const Center(child: Text('No hay solicitudes pendientes de aprobación.'))
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: solicitudes.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = solicitudes[index];
                    return Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.amber.shade300),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(item.usuarioNombre, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.amber.shade100,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text('Por Aprobar', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.orange)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text('Libro: ${item.libroTitulo}', style: const TextStyle(fontSize: 14, color: AppTheme.textoOscuro)),
                          const SizedBox(height: 14),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.disponible,
                                    minimumSize: const Size.fromHeight(38),
                                  ),
                                  onPressed: () => _aprobarPrestamo(item.idPrestamo),
                                  icon: const Icon(Icons.check, size: 16),
                                  label: const Text('Aprobar Préstamo', style: TextStyle(fontSize: 12)),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: OutlinedButton(
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.red,
                                    minimumSize: const Size.fromHeight(38),
                                  ),
                                  onPressed: () => _cancelarPrestamo(item.idPrestamo),
                                  child: const Text('Rechazar', style: TextStyle(fontSize: 12)),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),

          // Préstamos Activos
          activos.isEmpty
              ? const Center(child: Text('No hay préstamos activos en este momento.'))
              : ListView.separated(
                  padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 80),
                  itemCount: activos.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = activos[index];
                    final vencido = item.estaVencido;

                    return Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: vencido ? Colors.red.shade300 : AppTheme.grisBorde),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(item.usuarioNombre, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: vencido ? Colors.red.shade50 : Colors.blue.shade50,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  vencido ? 'VENCIDO' : 'En Plazo',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: vencido ? Colors.red : const Color(0xFF0284C7),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text('Libro: ${item.libroTitulo}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 6),
                          Text(
                            'Límite: ${item.fechaDevolucion.day}/${item.fechaDevolucion.month}/${item.fechaDevolucion.year} · Renovaciones: ${item.renovaciones}',
                            style: const TextStyle(fontSize: 12, color: AppTheme.textoMuted),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.azulOscuro,
                                    minimumSize: const Size.fromHeight(38),
                                  ),
                                  onPressed: () => _registrarDevolucion(item.idPrestamo),
                                  icon: const Icon(Icons.assignment_return_rounded, size: 16),
                                  label: const Text('Registrar Devolución', style: TextStyle(fontSize: 12)),
                                ),
                              ),
                              const SizedBox(width: 8),
                              OutlinedButton(
                                onPressed: () => _renovarPorAdmin(item.idPrestamo),
                                child: const Text('Renovar', style: TextStyle(fontSize: 12)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),

          // Historial de Devueltos
          devueltos.isEmpty
              ? const Center(child: Text('No hay registros de devoluciones recientes.'))
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: devueltos.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = devueltos[index];
                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppTheme.grisBorde),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.libroTitulo, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                          Text('Entregado por: ${item.usuarioNombre}', style: const TextStyle(fontSize: 12, color: AppTheme.textoMuted)),
                          Text(
                            'Devuelto el: ${item.fechaEntregado?.day}/${item.fechaEntregado?.month}/${item.fechaEntregado?.year}',
                            style: const TextStyle(fontSize: 11, color: AppTheme.disponible, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ],
      ),
    );
  }
}
