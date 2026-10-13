import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/libro_model.dart';
import '../../models/usuario_model.dart';
import 'book_detail_screen.dart';

class FavoritesScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const FavoritesScreen({super.key, required this.usuario});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final List<LibroModel> _favoritos = [
    LibroModel(
      idLibro: 'lib-001',
      titulo: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      categoria: 'Literatura',
      editorial: 'Editorial Sudamericana',
      isbn: '978-0307474728',
      ubicacion: 'Estante L-14',
      descripcion: 'Obra cumbre de la literatura universal y del realismo mágico.',
      estado: 'Disponible',
    ),
    LibroModel(
      idLibro: 'lib-003',
      titulo: 'Biología Celular y Genética Contemporánea',
      autor: 'Dra. María Fernanda Ospina',
      categoria: 'Ciencias Naturales',
      editorial: 'McGraw-Hill Interamericana',
      isbn: '978-1456260124',
      ubicacion: 'Estante B-03',
      descripcion: 'Guía completa sobre dogma central de la biología molecular.',
      estado: 'Disponible',
    ),
  ];

  void _eliminarFavorito(String idLibro) {
    setState(() {
      _favoritos.removeWhere((l) => l.idLibro == idLibro);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Libro retirado de tus favoritos.'),
        duration: Duration(seconds: 1),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Libros Favoritos'),
        backgroundColor: AppTheme.azulOscuro,
      ),
      body: _favoritos.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.star_outline_rounded, size: 60, color: AppTheme.textoMuted),
                  SizedBox(height: 12),
                  Text('No tienes favoritos guardados', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                  Text('Marca libros con la estrella para encontrarlos rápido.', style: TextStyle(color: AppTheme.textoMuted, fontSize: 13)),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _favoritos.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final libro = _favoritos[index];
                return InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => BookDetailScreen(libro: libro, usuario: widget.usuario),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.grisBorde),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 50,
                          height: 65,
                          decoration: BoxDecoration(
                            color: AppTheme.azulOscuro.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.book_rounded, color: AppTheme.azulOscuro, size: 28),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                libro.categoria,
                                style: const TextStyle(fontSize: 11, color: AppTheme.naranja, fontWeight: FontWeight.w600),
                              ),
                              Text(
                                libro.titulo,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textoOscuro),
                              ),
                              Text(
                                libro.autor,
                                style: const TextStyle(fontSize: 12, color: AppTheme.textoMuted),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent),
                          onPressed: () => _eliminarFavorito(libro.idLibro),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
