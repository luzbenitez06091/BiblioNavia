import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../services/auth_service.dart';
import 'student/student_main_navigation.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();
  final _documentoController = TextEditingController();
  final _codigoController = TextEditingController();
  final _gradoController = TextEditingController();
  final _correoController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _fotoUrlController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;
  String? _errorMessage;

  final AuthService _authService = AuthService();

  @override
  void dispose() {
    _nombreController.dispose();
    _documentoController.dispose();
    _codigoController.dispose();
    _gradoController.dispose();
    _correoController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _fotoUrlController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    if (_passwordController.text != _confirmPasswordController.text) {
      setState(() {
        _errorMessage = 'Las contraseñas no coinciden.';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final usuario = await _authService.registrarUsuario(
        nombre: _nombreController.text.trim(),
        documento: _documentoController.text.trim(),
        codigo: _codigoController.text.trim(),
        grado: _gradoController.text.trim(),
        correo: _correoController.text.trim(),
        password: _passwordController.text,
        foto: _fotoUrlController.text.trim(),
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('¡Cuenta registrada exitosamente en Firebase!'),
          backgroundColor: AppTheme.disponible,
        ),
      );

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => StudentMainNavigation(usuario: usuario)),
      );
    } catch (e) {
      setState(() {
        _errorMessage = 'Error al registrar usuario: ${e.toString()}';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Crear Cuenta Estudiantil'),
        backgroundColor: AppTheme.azulOscuro,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Registro Institucional BiblioNavia',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.azulOscuro,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Completa los datos para vincular tu ficha escolar a la biblioteca.',
                  style: TextStyle(fontSize: 13, color: AppTheme.textoMuted),
                ),
                const SizedBox(height: 24),

                if (_errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.red.shade200),
                    ),
                    child: Text(
                      _errorMessage!,
                      style: TextStyle(color: Colors.red.shade700, fontSize: 13),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // Nombre Completo
                const Text('Nombre Completo *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _nombreController,
                  decoration: const InputDecoration(hintText: 'Ej. Juan Camilo Pérez'),
                  validator: (val) => val == null || val.isEmpty ? 'Ingrese su nombre completo' : null,
                ),
                const SizedBox(height: 16),

                // Documento de Identidad
                const Text('Documento de Identidad *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _documentoController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(hintText: 'Ej. 1024567890'),
                  validator: (val) => val == null || val.isEmpty ? 'Ingrese su documento' : null,
                ),
                const SizedBox(height: 16),

                // Código Estudiantil y Grado (Row)
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Código Estudiantil *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _codigoController,
                            decoration: const InputDecoration(hintText: 'Ej. EST-2026-44'),
                            validator: (val) => val == null || val.isEmpty ? 'Código obligatorio' : null,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Grado Escolar *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _gradoController,
                            decoration: const InputDecoration(hintText: 'Ej. 11° B'),
                            validator: (val) => val == null || val.isEmpty ? 'Grado obligatorio' : null,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Correo Institucional
                const Text('Correo Institucional *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _correoController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(hintText: 'estudiante@colegio.edu.co'),
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Ingrese su correo';
                    if (!val.contains('@')) return 'Correo inválido';
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Contraseña
                const Text('Contraseña *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    hintText: 'Mínimo 6 caracteres',
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                  validator: (val) => val != null && val.length >= 6 ? null : 'Mínimo 6 caracteres',
                ),
                const SizedBox(height: 16),

                // Confirmar Contraseña
                const Text('Confirmar Contraseña *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _confirmPasswordController,
                  obscureText: _obscureConfirmPassword,
                  decoration: InputDecoration(
                    hintText: 'Repita la contraseña',
                    suffixIcon: IconButton(
                      icon: Icon(_obscureConfirmPassword ? Icons.visibility_off : Icons.visibility),
                      onPressed: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
                    ),
                  ),
                  validator: (val) => val != null && val.isNotEmpty ? null : 'Confirme la contraseña',
                ),
                const SizedBox(height: 16),

                // Foto de perfil opcional
                const Text('URL Foto de Perfil (Opcional)', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _fotoUrlController,
                  decoration: const InputDecoration(hintText: 'https://... (opcional)'),
                ),
                const SizedBox(height: 28),

                // Botón Registrar
                ElevatedButton(
                  onPressed: _isLoading ? null : _handleRegister,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Registrar Cuenta en Firebase'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
