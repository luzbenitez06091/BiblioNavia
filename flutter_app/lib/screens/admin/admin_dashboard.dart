import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/usuario_model.dart';
import '../login_screen.dart';
import '../student/student_main_navigation.dart';
import 'manage_books_screen.dart';
import 'manage_students_screen.dart';
import 'manage_loans_screen.dart';

class AdminDashboard extends StatelessWidget {
  final UsuarioModel usuario;

  const AdminDashboard({super.key, required this.usuario});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Panel Bibliotecario / Admin'),
        backgroundColor: AppTheme.azulOscuro,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Cerrar Sesión',
            onPressed: () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const LoginScreen()),
                (route) => false,
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
            // Banner de Administrador
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.azulOscuro, Color(0xFF0F172A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.naranja.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.admin_panel_settings_rounded, color: AppTheme.naranja, size: 36),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          usuario.nombre,
                          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'Rol: Administrador / Bibliotecario General',
                          style: TextStyle(color: AppTheme.naranja, fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                        Text(
                          'Código: ${usuario.codigo} · Firebase Cloud Firestore',
                          style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Métricas Rápidas
            const Text(
              'Indicadores de la Biblioteca',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textoOscuro),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard('Total Libros', '1,622', Icons.library_books, AppTheme.azulOscuro),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildMetricCard('Préstamos Activos', '342', Icons.swap_horiz, AppTheme.naranja),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildMetricCard('Pendientes', '8', Icons.pending_actions, Colors.amber.shade700),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // MÓDULOS DE GESTIÓN PRINCIPALES
            const Text(
              'Módulos de Gestión',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textoOscuro),
            ),
            const SizedBox(height: 12),

            _buildModuleCard(
              context,
              titulo: 'Gestión de Libros',
              descripcion: 'Agregar libros, editar catálogo, eliminar, importar y exportar listado.',
              icono: Icons.auto_stories_rounded,
              color: AppTheme.azulOscuro,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => ManageBooksScreen(usuario: usuario)),
                );
              },
            ),
            const SizedBox(height: 12),

            _buildModuleCard(
              context,
              titulo: 'Gestión de Estudiantes',
              descripcion: 'Registrar estudiantes, editar fichas, buscar por código y grado escolar.',
              icono: Icons.people_alt_rounded,
              color: const Color(0xFF0284C7),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => ManageStudentsScreen(usuario: usuario)),
                );
              },
            ),
            const SizedBox(height: 12),

            _buildModuleCard(
              context,
              titulo: 'Gestión de Préstamos y Devoluciones',
              descripcion: 'Aprobar solicitudes, registrar entregas, devoluciones y renovaciones.',
              icono: Icons.assignment_turned_in_rounded,
              color: AppTheme.disponible,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => ManageLoansScreen(usuario: usuario)),
                );
              },
            ),
            const SizedBox(height: 24),

            // Acceso de previsualización a modo estudiante
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.grisBorde),
              ),
              child: Row(
                children: [
                  const Icon(Icons.visibility_rounded, color: AppTheme.azulOscuro),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Vista Previa de Estudiante', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                        Text('Navegar como usuario regular para probar catálogo', style: TextStyle(color: AppTheme.textoMuted, fontSize: 12)),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.azulOscuro,
                      minimumSize: const Size(80, 36),
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => StudentMainNavigation(usuario: usuario)),
                      );
                    },
                    child: const Text('Abrir', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.grisBorde),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.textoOscuro)),
          Text(label, style: const TextStyle(fontSize: 10, color: AppTheme.textoMuted)),
        ],
      ),
    );
  }

  Widget _buildModuleCard(
    BuildContext context, {
    required String titulo,
    required String descripcion,
    required IconData icono,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.grisBorde),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icono, color: color, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(titulo, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.textoOscuro)),
                  const SizedBox(height: 3),
                  Text(descripcion, style: const TextStyle(fontSize: 12, color: AppTheme.textoMuted)),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: AppTheme.textoMuted),
          ],
        ),
      ),
    );
  }
}
