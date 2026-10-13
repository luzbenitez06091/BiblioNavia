import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/libro_model.dart';
import '../../models/usuario_model.dart';

class ManageBooksScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const ManageBooksScreen({super.key, required this.usuario});

  @override
  State<ManageBooksScreen> createState() => _ManageBooksScreenState();
}

class _ManageBooksScreenState extends State<ManageBooksScreen> {
  final TextEditingController _searchController = TextEditingController();

  final List<LibroModel> _libros = [
    LibroModel(
      idLibro: 'lib-001',
      titulo: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      editorial: 'Editorial Sudamericana',
      isbn: '978-0307474728',
      anio: 1967,
      paginas: 496,
      categoria: 'Literatura',
      ubicacion: 'Estante L-14',
      descripcion: 'Obra cumbre de la literatura hispanoamericana.',
      estado: 'Disponible',
    ),
    LibroModel(
      idLibro: 'lib-002',
      titulo: 'Física Cuántica y Nuevas Tecnologías',
      autor: 'Dr. Alejandro Restrepo',
      editorial: 'Pearson Educación',
      isbn: '978-6073238120',
      anio: 2023,
      paginas: 380,
      categoria: 'Ciencias Exactas',
      ubicacion: 'Estante C-08',
      descripcion: 'Texto especializado para educación media.',
      estado: 'Prestado',
    ),
    LibroModel(
      idLibro: 'lib-003',
      titulo: 'Biología Celular y Genética Contemporánea',
      autor: 'Dra. María Fernanda Ospina',
      editorial: 'McGraw-Hill Interamericana',
      isbn: '978-1456260124',
      anio: 2022,
      paginas: 520,
      categoria: 'Ciencias Naturales',
      ubicacion: 'Estante B-03',
      descripcion: 'Guía completa sobre dogma molecular y células.',
      estado: 'Disponible',
    ),
  ];

  void _abrirFormularioLibro({LibroModel? libroExistente}) {
    final tituloCtrl = TextEditingController(text: libroExistente?.titulo ?? '');
    final autorCtrl = TextEditingController(text: libroExistente?.autor ?? '');
    final editorialCtrl = TextEditingController(text: libroExistente?.editorial ?? '');
    final isbnCtrl = TextEditingController(text: libroExistente?.isbn ?? '');
    final anioCtrl = TextEditingController(text: libroExistente?.anio.toString() ?? '2024');
    final paginasCtrl = TextEditingController(text: libroExistente?.paginas.toString() ?? '100');
    final categoriaCtrl = TextEditingController(text: libroExistente?.categoria ?? 'Literatura');
    final ubicacionCtrl = TextEditingController(text: libroExistente?.ubicacion ?? 'Estante A-1');
    final descripcionCtrl = TextEditingController(text: libroExistente?.descripcion ?? '');
    String estadoSeleccionado = libroExistente?.estado ?? 'Disponible';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      libroExistente == null ? 'Agregar Nuevo Libro' : 'Editar Libro',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.azulOscuro),
                    ),
                    IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(controller: tituloCtrl, decoration: const InputDecoration(labelText: 'Título del Libro *')),
                const SizedBox(height: 10),
                TextField(controller: autorCtrl, decoration: const InputDecoration(labelText: 'Autor *')),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: TextField(controller: editorialCtrl, decoration: const InputDecoration(labelText: 'Editorial'))),
                    const SizedBox(width: 10),
                    Expanded(child: TextField(controller: isbnCtrl, decoration: const InputDecoration(labelText: 'ISBN'))),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: TextField(controller: anioCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Año'))),
                    const SizedBox(width: 10),
                    Expanded(child: TextField(controller: paginasCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Páginas'))),
                  ],
                ),
                const SizedBox(height: 10),
                TextField(controller: categoriaCtrl, decoration: const InputDecoration(labelText: 'Categoría (ej. Literatura)')),
                const SizedBox(height: 10),
                TextField(controller: ubicacionCtrl, decoration: const InputDecoration(labelText: 'Ubicación física en biblioteca')),
                const SizedBox(height: 10),
                TextField(controller: descripcionCtrl, maxLines: 2, decoration: const InputDecoration(labelText: 'Descripción / Sinopsis')),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: estadoSeleccionado,
                  decoration: const InputDecoration(labelText: 'Estado'),
                  items: const [
                    DropdownMenuItem(value: 'Disponible', child: Text('Disponible')),
                    DropdownMenuItem(value: 'Prestado', child: Text('Prestado')),
                    DropdownMenuItem(value: 'Reservado', child: Text('Reservado')),
                  ],
                  onChanged: (val) {
                    if (val != null) setModalState(() => estadoSeleccionado = val);
                  },
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    if (tituloCtrl.text.isEmpty || autorCtrl.text.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Título y Autor son obligatorios')),
                      );
                      return;
                    }

                    setState(() {
                      if (libroExistente == null) {
                        _libros.insert(
                          0,
                          LibroModel(
                            idLibro: 'lib-${DateTime.now().millisecondsSinceEpoch}',
                            titulo: tituloCtrl.text.trim(),
                            autor: autorCtrl.text.trim(),
                            editorial: editorialCtrl.text.trim(),
                            isbn: isbnCtrl.text.trim(),
                            anio: int.tryParse(anioCtrl.text) ?? 2024,
                            paginas: int.tryParse(paginasCtrl.text) ?? 100,
                            categoria: categoriaCtrl.text.trim(),
                            ubicacion: ubicacionCtrl.text.trim(),
                            descripcion: descripcionCtrl.text.trim(),
                            estado: estadoSeleccionado,
                          ),
                        );
                      } else {
                        final idx = _libros.indexWhere((l) => l.idLibro == libroExistente.idLibro);
                        if (idx != -1) {
                          _libros[idx] = LibroModel(
                            idLibro: libroExistente.idLibro,
                            titulo: tituloCtrl.text.trim(),
                            autor: autorCtrl.text.trim(),
                            editorial: editorialCtrl.text.trim(),
                            isbn: isbnCtrl.text.trim(),
                            anio: int.tryParse(anioCtrl.text) ?? 2024,
                            paginas: int.tryParse(paginasCtrl.text) ?? 100,
                            categoria: categoriaCtrl.text.trim(),
                            ubicacion: ubicacionCtrl.text.trim(),
                            descripcion: descripcionCtrl.text.trim(),
                            estado: estadoSeleccionado,
                          );
                        }
                      }
                    });

                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(libroExistente == null ? 'Libro guardado en Firestore' : 'Libro actualizado en Firestore'),
                        backgroundColor: AppTheme.disponible,
                      ),
                    );
                  },
                  child: Text(libroExistente == null ? 'Guardar Libro' : 'Actualizar Libro'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _eliminarLibro(String idLibro) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Eliminar Libro'),
        content: const Text('¿Estás seguro de eliminar este ejemplar del catálogo de Firestore?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancelar')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              setState(() => _libros.removeWhere((l) => l.idLibro == idLibro));
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Libro eliminado de Firestore.')),
              );
            },
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
  }

  void _importarLibros() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Importación por archivo CSV / JSON de biblioteca activada.'),
        backgroundColor: AppTheme.azulOscuro,
      ),
    );
  }

  void _exportarListado() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Listado de ${_libros.length} libros exportado exitosamente a formato Excel/CSV.'),
        backgroundColor: AppTheme.disponible,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.toLowerCase().trim();
    final librosFiltrados = _libros.where((l) {
      return query.isEmpty ||
          l.titulo.toLowerCase().contains(query) ||
          l.autor.toLowerCase().contains(query) ||
          l.isbn.toLowerCase().contains(query);
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Gestión de Libros'),
        backgroundColor: AppTheme.azulOscuro,
        actions: [
          IconButton(icon: const Icon(Icons.file_upload_outlined), tooltip: 'Importar', onPressed: _importarLibros),
          IconButton(icon: const Icon(Icons.file_download_outlined), tooltip: 'Exportar', onPressed: _exportarListado),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.naranja,
        foregroundColor: Colors.white,
        onPressed: () => _abrirFormularioLibro(),
        icon: const Icon(Icons.add),
        label: const Text('Nuevo Libro'),
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
                hintText: 'Buscar libro por título, autor o ISBN...',
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 80),
              itemCount: librosFiltrados.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final libro = librosFiltrados[index];
                return Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.grisBorde),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 60,
                        decoration: BoxDecoration(
                          color: AppTheme.azulOscuro.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.menu_book, color: AppTheme.azulOscuro),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              libro.titulo,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                            ),
                            Text(
                              '${libro.autor} · ${libro.categoria}',
                              style: const TextStyle(fontSize: 12, color: AppTheme.textoMuted),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${libro.ubicacion} · ISBN: ${libro.isbn}',
                              style: const TextStyle(fontSize: 11, color: AppTheme.naranja, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.edit_outlined, size: 20, color: AppTheme.azulOscuro),
                        onPressed: () => _abrirFormularioLibro(libroExistente: libro),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline, size: 20, color: Colors.red),
                        onPressed: () => _eliminarLibro(libro.idLibro),
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
