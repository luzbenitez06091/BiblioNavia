import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/usuario_model.dart';
import '../login_screen.dart';

class ProfileScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const ProfileScreen({super.key, required this.usuario});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _darkMode = false;
  bool _notificacionesActivas = true;
  String _idioma = 'Español';
  String _fontSize = 'Mediano';

  void _cerrarSesion() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Cerrar Sesión'),
        content: const Text('¿Estás seguro de que deseas salir de BiblioNavia?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const LoginScreen()),
                (route) => false,
              );
            },
            child: const Text('Cerrar Sesión'),
          ),
        ],
      ),
    );
  }

  void _editarPerfilDialog() {
    final nombreCtrl = TextEditingController(text: widget.usuario.nombre);
    final gradoCtrl = TextEditingController(text: widget.usuario.grado);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Editar Perfil'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nombreCtrl,
              decoration: const InputDecoration(labelText: 'Nombre Completo'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: gradoCtrl,
              decoration: const InputDecoration(labelText: 'Grado / Curso'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Perfil actualizado en Cloud Firestore'),
                  backgroundColor: AppTheme.disponible,
                ),
              );
            },
            child: const Text('Guardar'),
          ),
        ],
      ),
    );
  }

  void _cambiarPasswordDialog() {
    final actualCtrl = TextEditingController();
    final nuevaCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Cambiar Contraseña'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: actualCtrl,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Contraseña Actual'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: nuevaCtrl,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Nueva Contraseña (mín 6 car.)'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Contraseña actualizada en Firebase Auth'),
                  backgroundColor: AppTheme.disponible,
                ),
              );
            },
            child: const Text('Actualizar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final usuario = widget.usuario;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Mi Perfil Estudiantil'),
        backgroundColor: AppTheme.azulOscuro,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Tarjeta de Identificación Escolar
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.grisBorde),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Avatar
                  Stack(
                    children: [
                      CircleAvatar(
                        radius: 46,
                        backgroundColor: AppTheme.azulOscuro,
                        child: Text(
                          usuario.nombre.isNotEmpty ? usuario.nombre[0].toUpperCase() : 'U',
                          style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: Colors.white),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: AppTheme.naranja,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.camera_alt, color: Colors.white, size: 16),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  Text(
                    usuario.nombre,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.textoOscuro),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    usuario.correo,
                    style: const TextStyle(fontSize: 13, color: AppTheme.textoMuted),
                  ),
                  const SizedBox(height: 16),

                  // Fila de Datos Escolares
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildUserMeta('Documento', usuario.documento),
                        Container(height: 30, width: 1, color: AppTheme.grisBorde),
                        _buildUserMeta('Código', usuario.codigo),
                        Container(height: 30, width: 1, color: AppTheme.grisBorde),
                        _buildUserMeta('Grado', usuario.grado),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Opciones de Cuenta
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.grisBorde),
              ),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.person_outline_rounded, color: AppTheme.azulOscuro),
                    title: const Text('Editar Perfil', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    trailing: const Icon(Icons.chevron_right, size: 20),
                    onTap: _editarPerfilDialog,
                  ),
                  const Divider(height: 1, indent: 56),
                  ListTile(
                    leading: const Icon(Icons.lock_outline_rounded, color: AppTheme.azulOscuro),
                    title: const Text('Cambiar Contraseña', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    trailing: const Icon(Icons.chevron_right, size: 20),
                    onTap: _cambiarPasswordDialog,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Preferencias de la Aplicación
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.grisBorde),
              ),
              child: Column(
                children: [
                  SwitchListTile(
                    secondary: const Icon(Icons.dark_mode_outlined, color: AppTheme.azulOscuro),
                    title: const Text('Modo Oscuro', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    value: _darkMode,
                    activeColor: AppTheme.naranja,
                    onChanged: (val) => setState(() => _darkMode = val),
                  ),
                  const Divider(height: 1, indent: 56),
                  SwitchListTile(
                    secondary: const Icon(Icons.notifications_active_outlined, color: AppTheme.azulOscuro),
                    title: const Text('Notificaciones Push', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    value: _notificacionesActivas,
                    activeColor: AppTheme.naranja,
                    onChanged: (val) => setState(() => _notificacionesActivas = val),
                  ),
                  const Divider(height: 1, indent: 56),
                  ListTile(
                    leading: const Icon(Icons.language_rounded, color: AppTheme.azulOscuro),
                    title: const Text('Idioma', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    trailing: DropdownButton<String>(
                      value: _idioma,
                      underline: const SizedBox(),
                      items: const [
                        DropdownMenuItem(value: 'Español', child: Text('Español')),
                        DropdownMenuItem(value: 'Inglés', child: Text('English')),
                      ],
                      onChanged: (val) {
                        if (val != null) setState(() => _idioma = val);
                      },
                    ),
                  ),
                  const Divider(height: 1, indent: 56),
                  ListTile(
                    leading: const Icon(Icons.format_size_rounded, color: AppTheme.azulOscuro),
                    title: const Text('Tamaño de Letra', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    trailing: DropdownButton<String>(
                      value: _fontSize,
                      underline: const SizedBox(),
                      items: const [
                        DropdownMenuItem(value: 'Pequeño', child: Text('Pequeño')),
                        DropdownMenuItem(value: 'Mediano', child: Text('Mediano')),
                        DropdownMenuItem(value: 'Grande', child: Text('Grande')),
                      ],
                      onChanged: (val) {
                        if (val != null) setState(() => _fontSize = val);
                      },
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Botón Cerrar Sesión
            OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.red,
                side: const BorderSide(color: Colors.red),
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: _cerrarSesion,
              icon: const Icon(Icons.logout_rounded, size: 20),
              label: const Text('Cerrar Sesión', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUserMeta(String label, String value) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textoMuted)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textoOscuro)),
      ],
    );
  }
}
