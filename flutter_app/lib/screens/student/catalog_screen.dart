import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/libro_model.dart';
import '../../models/usuario_model.dart';
import 'book_detail_screen.dart';

class CatalogScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const CatalogScreen({super.key, required this.usuario});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'Todas';
  String _selectedDisponibilidad = 'Todos';

  // Libros precargados de la biblioteca institucional
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
      imagen: 'assets/images/cover_cien_anos.jpg',
      ubicacion: 'Estante L-14, Pasillo Novela Hispanoamericana',
      descripcion:
          'Una de las obras cumbre de la literatura universal y del realismo mágico, narra la historia épica y trágica de la familia Buendía a lo largo de siete generaciones en el mítico pueblo de Macondo.',
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
      imagen: 'assets/images/cover_fisica.jpg',
      ubicacion: 'Estante C-08, Pasillo Física Fundamental',
      descripcion:
          'Texto pedagógico especializado para educación media y pregrado que abarca los fundamentos de la mecánica cuántica y sus aplicaciones en computación cuántica y semiconductores.',
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
      imagen: 'assets/images/cover_biologia.jpg',
      ubicacion: 'Estante B-03, Pasillo Ciencias de la Vida',
      descripcion:
          'Guía completa sobre dogma central de la biología molecular, ingeniería genética, biotecnología celular y conservación de biodiversidad para jóvenes investigadores.',
      estado: 'Disponible',
    ),
    LibroModel(
      idLibro: 'lib-004',
      titulo: 'Cálculo Diferencial e Integral con Aplicaciones',
      autor: 'James Stewart & Lothar Redlin',
      editorial: 'Cengage Learning',
      isbn: '978-6075265483',
      anio: 2021,
      paginas: 640,
      categoria: 'Matemáticas',
      imagen: '',
      ubicacion: 'Estante M-02, Pasillo Matemáticas Avanzadas',
      descripcion:
          'Enfoque claro y riguroso de límites, derivadas, integrales y modelado matemático para estudiantes de educación secundaria y primer año universitario.',
      estado: 'Reservado',
    ),
    LibroModel(
      idLibro: 'lib-005',
      titulo: 'Historia Universal Contemporánea',
      autor: 'Eric Hobsbawm',
      editorial: 'Crítica Editorial',
      isbn: '978-8498921239',
      anio: 2018,
      paginas: 412,
      categoria: 'Ciencias Sociales',
      imagen: '',
      ubicacion: 'Estante S-11, Pasillo Historia y Geopolítica',
      descripcion:
          'Análisis crítico de los principales acontecimientos del siglo XX y XXI, revoluciones sociales, guerras globales y formación del mundo multipolar moderno.',
      estado: 'Disponible',
    ),
    LibroModel(
      idLibro: 'lib-006',
      titulo: 'Don Quijote de la Mancha',
      autor: 'Miguel de Cervantes Saavedra',
      editorial: 'Real Academia Española',
      isbn: '978-8420412146',
      anio: 1605,
      paginas: 860,
      categoria: 'Literatura',
      imagen: '',
      ubicacion: 'Estante L-01, Pasillo Literatura Clásica',
      descripcion:
          'La obra magna de las letras castellanas que explora la locura, el idealismo y la condición humana a través de las aventuras del ingenioso hidalgo Don Quijote y Sancho Panza.',
      estado: 'Disponible',
    ),
  ];

  final List<String> _categorias = [
    'Todas',
    'Literatura',
    'Ciencias Exactas',
    'Ciencias Naturales',
    'Matemáticas',
    'Ciencias Sociales',
  ];

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.toLowerCase().trim();

    // Filtros por Título, Autor, Categoría, Editorial, ISBN y Disponibilidad
    final librosFiltrados = _libros.where((libro) {
      final coincideTexto = query.isEmpty ||
          libro.titulo.toLowerCase().contains(query) ||
          libro.autor.toLowerCase().contains(query) ||
          libro.editorial.toLowerCase().contains(query) ||
          libro.isbn.toLowerCase().contains(query);

      final coincideCategoria =
          _selectedCategory == 'Todas' || libro.categoria == _selectedCategory;

      final coincideDisponibilidad = _selectedDisponibilidad == 'Todos' ||
          libro.estado.toLowerCase() == _selectedDisponibilidad.toLowerCase();

      return coincideTexto && coincideCategoria && coincideDisponibilidad;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Catálogo de Libros'),
        backgroundColor: AppTheme.azulOscuro,
      ),
      body: Column(
        children: [
          // Barra de búsqueda con filtros
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: (val) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Buscar por título, autor, editorial, ISBN...',
                    prefixIcon: const Icon(Icons.search, color: AppTheme.textoMuted),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {});
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: const Color(0xFFF1F5F9),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Filtro rápido de categorías horizontal
                SizedBox(
                  height: 36,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categorias.length,
                    itemBuilder: (context, index) {
                      final cat = _categorias[index];
                      final isSelected = _selectedCategory == cat;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(cat),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedCategory = cat;
                            });
                          },
                          selectedColor: AppTheme.naranja,
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : AppTheme.textoOscuro,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            fontSize: 12,
                          ),
                          backgroundColor: const Color(0xFFF1F5F9),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                            side: BorderSide.none,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Header de resultados
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Mostrando ${librosFiltrados.length} ejemplares',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textoMuted,
                  ),
                ),
                // Selector de disponibilidad
                DropdownButton<String>(
                  value: _selectedDisponibilidad,
                  underline: const SizedBox(),
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.azulOscuro),
                  items: const [
                    DropdownMenuItem(value: 'Todos', child: Text('Todos los estados')),
                    DropdownMenuItem(value: 'Disponible', child: Text('Solo Disponibles')),
                    DropdownMenuItem(value: 'Prestado', child: Text('En Préstamo')),
                    DropdownMenuItem(value: 'Reservado', child: Text('Reservados')),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedDisponibilidad = val);
                  },
                ),
              ],
            ),
          ),

          // Lista de Libros
          Expanded(
            child: librosFiltrados.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off_rounded, size: 54, color: AppTheme.textoMuted),
                        SizedBox(height: 12),
                        Text(
                          'No se encontraron libros',
                          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: AppTheme.textoOscuro),
                        ),
                        Text(
                          'Intenta con otros términos o filtros.',
                          style: TextStyle(color: AppTheme.textoMuted, fontSize: 13),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: librosFiltrados.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final libro = librosFiltrados[index];
                      return _buildBookItem(libro);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildBookItem(LibroModel libro) {
    Color estadoColor;
    switch (libro.estado) {
      case 'Disponible':
        estadoColor = AppTheme.disponible;
        break;
      case 'Prestado':
        estadoColor = AppTheme.prestado;
        break;
      default:
        estadoColor = AppTheme.reservado;
    }

    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => BookDetailScreen(libro: libro, usuario: widget.usuario),
          ),
        );
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.grisBorde),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Portada
            Container(
              width: 72,
              height: 100,
              decoration: BoxDecoration(
                color: AppTheme.azulOscuro.withOpacity(0.08),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppTheme.grisBorde),
              ),
              child: const Center(
                child: Icon(Icons.auto_stories, color: AppTheme.azulOscuro, size: 36),
              ),
            ),
            const SizedBox(width: 14),

            // Metadatos
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        libro.categoria,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.naranja,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: estadoColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          libro.estado,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: estadoColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    libro.titulo,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textoOscuro,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    libro.autor,
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppTheme.textoMuted,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.place_outlined, size: 13, color: AppTheme.textoMuted),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          libro.ubicacion,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 11, color: AppTheme.textoMuted),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
