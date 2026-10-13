import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/usuario_model.dart';
import 'student_dashboard.dart';
import 'catalog_screen.dart';
import 'loans_screen.dart';
import 'notifications_screen.dart';
import 'profile_screen.dart';

class StudentMainNavigation extends StatefulWidget {
  final UsuarioModel usuario;

  const StudentMainNavigation({super.key, required this.usuario});

  @override
  State<StudentMainNavigation> createState() => _StudentMainNavigationState();
}

class _StudentMainNavigationState extends State<StudentMainNavigation> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      StudentDashboard(
        usuario: widget.usuario,
        onNavigateToCatalog: () => setState(() => _currentIndex = 1),
        onNavigateToLoans: () => setState(() => _currentIndex = 2),
      ),
      CatalogScreen(usuario: widget.usuario),
      LoansScreen(usuario: widget.usuario),
      NotificationsScreen(usuario: widget.usuario),
      ProfileScreen(usuario: widget.usuario),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        backgroundColor: Colors.white,
        elevation: 3,
        indicatorColor: AppTheme.naranja.withOpacity(0.15),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded, color: AppTheme.naranja),
            label: 'Inicio',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search_rounded, color: AppTheme.naranja),
            label: 'Buscar',
          ),
          NavigationDestination(
            icon: Icon(Icons.book_outlined),
            selectedIcon: Icon(Icons.book_rounded, color: AppTheme.naranja),
            label: 'Préstamos',
          ),
          NavigationDestination(
            icon: Badge(
              label: Text('3'),
              child: Icon(Icons.notifications_none_rounded),
            ),
            selectedIcon: Badge(
              label: Text('3'),
              child: Icon(Icons.notifications_rounded, color: AppTheme.naranja),
            ),
            label: 'Notificaciones',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline_rounded),
            selectedIcon: Icon(Icons.person_rounded, color: AppTheme.naranja),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}
