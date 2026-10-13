import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../services/auth_service.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _correoController = TextEditingController();
  bool _isLoading = false;
  bool _sent = false;
  String? _errorMessage;

  final AuthService _authService = AuthService();

  @override
  void dispose() {
    _correoController.dispose();
    super.dispose();
  }

  Future<void> _handleReset() async {
    final email = _correoController.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _errorMessage = 'Por favor ingresa un correo válido.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await _authService.recuperarPassword(email);
      setState(() {
        _sent = true;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'No se pudo enviar el correo de recuperación.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Recuperar Contraseña'),
        backgroundColor: AppTheme.azulOscuro,
      ),
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: _sent
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: Colors.green.shade50,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(Icons.check_circle_rounded, color: Colors.green.shade600, size: 54),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'Enlace de recuperación enviado',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.azulOscuro),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Revisa tu bandeja de entrada en ${_correoController.text} y sigue las instrucciones para restablecer tu clave en Firebase.',
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 14, color: AppTheme.textoMuted),
                      ),
                      const SizedBox(height: 32),
                      ElevatedButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Volver al Inicio de Sesión'),
                      ),
                    ],
                  ),
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 20),
                    const Icon(Icons.lock_reset_rounded, size: 64, color: AppTheme.naranja),
                    const SizedBox(height: 16),
                    const Text(
                      '¿Olvidaste tu contraseña institucional?',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.azulOscuro),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Ingresa tu correo institucional registrado y te enviaremos un enlace oficial de Firebase para restablecerla.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 14, color: AppTheme.textoMuted),
                    ),
                    const SizedBox(height: 32),

                    if (_errorMessage != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.red.shade200),
                        ),
                        child: Text(_errorMessage!, style: TextStyle(color: Colors.red.shade700, fontSize: 13)),
                      ),
                      const SizedBox(height: 16),
                    ],

                    TextFormField(
                      controller: _correoController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        hintText: 'estudiante@colegio.edu.co',
                        prefixIcon: Icon(Icons.email_outlined),
                      ),
                    ),
                    const SizedBox(height: 24),

                    ElevatedButton(
                      onPressed: _isLoading ? null : _handleReset,
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Text('Solicitar Enlace de Recuperación'),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
