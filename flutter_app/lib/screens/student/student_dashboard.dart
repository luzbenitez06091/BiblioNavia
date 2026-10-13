import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/usuario_model.dart';
import 'catalog_screen.dart';
import 'favorites_screen.dart';
import 'reservations_screen.dart';

class StudentDashboard extends StatelessWidget {
  final UsuarioModel usuario;
  final VoidCallback onNavigateToCatalog;
  final VoidCallback onNavigateToLoans;

  const StudentDashboard({
    super.key,
    required this.usuario,
    required this.onNavigateToCatalog,
    required this.onNavigateToLoans,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.menu_book_rounded, color: AppTheme.naranja, size: 20),
            ),
            const SizedBox(width: 10),
            const Text(
              'BiblioNavia',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 19),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite_rounded, color: Colors.white),
            tooltip: 'Favoritos',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => FavoritesScreen(usuario: usuario)),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Saludo personalizado al estudiante
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.azulOscuro, Color(0xFF1E3A8A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.azulOscuro.withOpacity(0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Hola, ${usuario.nombre}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${usuario.grado} · Código: ${usuario.codigo}',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.8),
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.naranja,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Activo',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Barra de búsqueda rápida
                  GestureDetector(
                    onTap: onNavigateToCatalog,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.search, color: AppTheme.textoMuted, size: 20),
                          SizedBox(width: 10),
                          Text(
                            'Buscar título, autor, ISBN o materia...',
                            style: TextStyle(color: AppTheme.textoMuted, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // TARJETAS DE ESTADÍSTICAS (Las 4 solicitadas)
            const Text(
              'Resumen de la Biblioteca',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textoOscuro),
            ),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.45,
              children: [
                _buildStatCard(
                  titulo: 'Libros Disponibles',
                  valor: '1,280',
                  icono: Icons.check_circle_outline,
                  color: AppTheme.disponible,
                  onTap: onNavigateToCatalog,
                ),
                _buildStatCard(
                  titulo: 'Libros Prestados',
                  valor: '342',
                  icono: Icons.swap_horiz_rounded,
                  color: AppTheme.naranja,
                  onTap: onNavigateToLoans,
                ),
                _buildStatCard(
                  titulo: 'Préstamos Activos',
                  valor: '2',
                  icono: Icons.menu_book_rounded,
                  color: const Color(0xFF0284C7),
                  onTap: onNavigateToLoans,
                ),
                _buildStatCard(
                  titulo: 'Libros Nuevos',
                  valor: '48',
                  icono: Icons.auto_awesome,
                  color: const Color(0xFF8B5CF6),
                  onTap: onNavigateToCatalog,
                ),
              ],
            ),
            const SizedBox(height: 24),

            // ACCESOS RÁPIDOS
            const Text(
              'Accesos Rápidos',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textoOscuro),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildQuickAction(
                    context,
                    icono: Icons.bookmark_added_rounded,
                    label: 'Mis Reservas',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => ReservationsScreen(usuario: usuario)),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildQuickAction(
                    context,
                    icono: Icons.star_rounded,
                    label: 'Favoritos',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => FavoritesScreen(usuario: usuario)),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildQuickAction(
                    context,
                    icono: Icons.history_rounded,
                    label: 'Historial',
                    onTap: onNavigateToLoans,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // AVISO IMPORTANTE
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.amber.shade200),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.info_outline_rounded, color: Colors.amber.shade800),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Recordatorio de Devolución',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Colors.amber.shade900,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Recuerda devolver "Cien Años de Soledad" antes del viernes para evitar suspensiones temporales del servicio de préstamo.',
                          style: TextStyle(color: Colors.amber.shade900, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required String titulo,
    required String valor,
    required IconData icono,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.grisBorde),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icono, color: color, size: 20),
                ),
                Icon(Icons.chevron_right, color: Colors.grey.shade400, size: 18),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  valor,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textoOscuro,
                  ),
                ),
                Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: AppTheme.textoMuted,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction(
    BuildContext context, {
    required IconData icono,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.grisBorde),
        ),
        child: Column(
          children: [
            Icon(icono, color: AppTheme.azulOscuro, size: 24),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textoOscuro),
            ),
          ],
        ),
      ),
    );
  }
}
