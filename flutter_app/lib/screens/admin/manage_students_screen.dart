import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/usuario_model.dart';

class ManageStudentsScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const ManageStudentsScreen({super.key, required this.usuario});

  @override
  State<ManageStudentsScreen> createState() => _ManageStudentsScreenState();
}

class _ManageStudentsScreenState extends State<ManageStudentsScreen> {
  final TextEditingController _searchController = TextEditingController();

  final List<UsuarioModel> _estudiantes = [
    UsuarioModel(
      uid: 'est-001',
      nombre: 'Valentina Ríos',
      documento: '1098765432',
      codigo: 'EST-2026-08',
      grado: '10° Grado A',
      correo: 'valentina.rios@colegio.edu.co',
      rol: 'estudiante',
      fechaRegistro: DateTime.now().subtract(const Duration(days: 40)),
    ),
    UsuarioModel(
      uid: 'est-002',
      nombre: 'Mateo Gómez Herrera',
      documento: '1023456789',
      codigo: 'EST-2026-15',
      grado: '11° Grado B',
      correo: 'mateo.gomez@colegio.edu.co',
      rol: 'estudiante',
      fechaRegistro: DateTime.now().subtract(const Duration(days: 35)),
    ),
    UsuarioModel(
      uid: 'est-003',
      nombre: 'Camila Sofía Torres',
      documento: '1045678901',
      codigo: 'EST-2026-22',
      grado: '9° Grado C',
      correo: 'camila.torres@colegio.edu.co',
      rol: 'estudiante',
      fechaRegistro: DateTime.now().subtract(const Duration(days: 20)),
    ),
  ];

  void _abrirFormularioEstudiante({UsuarioModel? estudianteExistente}) {
    final nombreCtrl = TextEditingController(text: estudianteExistente?.nombre ?? '');
    final docCtrl = TextEditingController(text: estudianteExistente?.documento ?? '');
    final codigoCtrl = TextEditingController(text: estudianteExistente?.codigo ?? '');
    final gradoCtrl = TextEditingController(text: estudianteExistente?.grado ?? '');
    final correoCtrl = TextEditingController(text: estudianteExistente?.correo ?? '');

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
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                estudianteExistente == null ? 'Registrar Nuevo Estudiante' : 'Editar Estudiante',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.azulOscuro),
              ),
              const SizedBox(height: 16),
              TextField(controller: nombreCtrl, decoration: const InputDecoration(labelText: 'Nombre Completo *')),
              const SizedBox(height: 10),
              TextField(controller: docCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Documento de Identidad *')),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(child: TextField(controller: codigoCtrl, decoration: const InputDecoration(labelText: 'Código Estudiantil *'))),
                  const SizedBox(width: 10),
                  Expanded(child: TextField(controller: gradoCtrl, decoration: const InputDecoration(labelText: 'Grado / Curso *'))),
                ],
              ),
              const SizedBox(height: 10),
              TextField(controller: correoCtrl, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: 'Correo Institucional *')),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  if (nombreCtrl.text.isEmpty || docCtrl.text.isEmpty || codigoCtrl.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Por favor llena los campos obligatorios')),
                    );
                    return;
                  }

                  setState(() {
                    if (estudianteExistente == null) {
                      _estudiantes.insert(
                        0,
                        UsuarioModel(
                          uid: 'est-${DateTime.now().millisecondsSinceEpoch}',
                          nombre: nombreCtrl.text.trim(),
                          documento: docCtrl.text.trim(),
                          codigo: codigoCtrl.text.trim(),
                          grado: gradoCtrl.text.trim(),
                          correo: correoCtrl.text.trim(),
                          rol: 'estudiante',
                          fechaRegistro: DateTime.now(),
                        ),
                      );
                    } else {
                      final idx = _estudiantes.indexWhere((e) => e.uid == estudianteExistente.uid);
                      if (idx != -1) {
                        _estudiantes[idx] = UsuarioModel(
                          uid: estudianteExistente.uid,
                          nombre: nombreCtrl.text.trim(),
                          documento: docCtrl.text.trim(),
                          codigo: codigoCtrl.text.trim(),
                          grado: gradoCtrl.text.trim(),
                          correo: correoCtrl.text.trim(),
                          rol: 'estudiante',
                          fechaRegistro: estudianteExistente.fechaRegistro,
                        );
                      }
                    }
                  });

                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Estudiante registrado en Firestore con rol "estudiante"'),
                      backgroundColor: AppTheme.disponible,
                    ),
                  );
                },
                child: Text(estudianteExistente == null ? 'Registrar en Firebase' : 'Guardar Cambios'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _eliminarEstudiante(String uid) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Eliminar Estudiante'),
        content: const Text('¿Deseas desvincular la ficha del estudiante de la biblioteca?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancelar')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              setState(() => _estudiantes.removeWhere((e) => e.uid == uid));
              Navigator.pop(ctx);
            },
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.toLowerCase().trim();
    final filtrados = _estudiantes.where((e) {
      return query.isEmpty ||
          e.nombre.toLowerCase().contains(query) ||
          e.codigo.toLowerCase().contains(query) ||
          e.documento.contains(query) ||
          e.grado.toLowerCase().contains(query);
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Gestión de Estudiantes'),
        backgroundColor: AppTheme.azulOscuro,
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.naranja,
        foregroundColor: Colors.white,
        onPressed: () => _abrirFormularioEstudiante(),
        icon: const Icon(Icons.person_add_rounded),
        label: const Text('Nuevo Estudiante'),
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: TextField(
              controller: _searchController,
              onChanged: (val) => setState(() {}),
              decoration: const InputDecoration(
                hintText: 'Buscar por nombre, código, documento o grado...',
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 80),
              itemCount: filtrados.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final est = filtrados[index];
                return Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.grisBorde),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: AppTheme.azulOscuro,
                        foregroundColor: Colors.white,
                        child: Text(est.nombre[0]),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(est.nombre, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                            Text('Código: ${est.codigo} · ${est.grado}', style: const TextStyle(fontSize: 12, color: AppTheme.textoMuted)),
                            Text('Doc: ${est.documento} · ${est.correo}', style: const TextStyle(fontSize: 11, color: AppTheme.naranja)),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.edit_outlined, size: 20, color: AppTheme.azulOscuro),
                        onPressed: () => _abrirFormularioEstudiante(estudianteExistente: est),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline, size: 20, color: Colors.red),
                        onPressed: () => _eliminarEstudiante(est.uid),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
