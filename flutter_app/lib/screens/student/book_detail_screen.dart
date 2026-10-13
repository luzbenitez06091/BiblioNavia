import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/libro_model.dart';
import '../../models/usuario_model.dart';

class BookDetailScreen extends StatefulWidget {
  final LibroModel libro;
  final UsuarioModel usuario;

  const BookDetailScreen({
    super.key,
    required this.libro,
    required this.usuario,
  });

  @override
  State<BookDetailScreen> createState() => _BookDetailScreenState();
}

class _BookDetailScreenState extends State<BookDetailScreen> {
  bool _isFavorite = false;
  bool _isProcessing = false;

  void _solicitarPrestamo() async {
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() => _isProcessing = false);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Row(
          children: [
            Icon(Icons.check_circle_rounded, color: AppTheme.disponible),
            SizedBox(width: 8),
            Text('Préstamo Solicitado'),
          ],
        ),
        content: Text(
          'Tu solicitud para "${widget.libro.titulo}" fue registrada en Cloud Firestore. Pasa por el mostrador de biblioteca con tu código ${widget.usuario.codigo} para retirarlo.',
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Entendido'),
          ),
        ],
      ),
    );
  }

  void _reservarLibro() async {
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;
    setState(() => _isProcessing = false);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Row(
          children: [
            Icon(Icons.bookmark_added_rounded, color: AppTheme.naranja),
            SizedBox(width: 8),
            Text('Reserva Confirmada'),
          ],
        ),
        content: Text(
          'Has quedado en la posición #1 de la fila de espera para "${widget.libro.titulo}". Te enviaremos una notificación cuando el libro sea devuelto.',
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Aceptar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final libro = widget.libro;

    Color estadoColor = libro.estado == 'Disponible'
        ? AppTheme.disponible
        : libro.estado == 'Prestado'
            ? AppTheme.prestado
            : AppTheme.reservado;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Detalle del Libro'),
        backgroundColor: AppTheme.azulOscuro,
        actions: [
          IconButton(
            icon: Icon(
              _isFavorite ? Icons.star_rounded : Icons.star_border_rounded,
              color: _isFavorite ? Colors.amber : Colors.white,
              size: 26,
            ),
            onPressed: () {
              setState(() {
                _isFavorite = !_isFavorite;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(_isFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos'),
                  duration: const Duration(seconds: 1),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Banner Portada grande
            Container(
              padding: const EdgeInsets.symmetric(vertical: 28),
              color: const Color(0xFFF1F5F9),
              child: Center(
                child: Container(
                  width: 140,
                  height: 200,
                  decoration: BoxDecoration(
                    color: AppTheme.azulOscuro,
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.18),
                        blurRadius: 16,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.menu_book_rounded, size: 54, color: AppTheme.naranja),
                      const SizedBox(height: 12),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8.0),
                        child: Text(
                          libro.titulo,
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Categoría y Estado
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        libro.categoria.toUpperCase(),
                        style: const TextStyle(
                          color: AppTheme.naranja,
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: estadoColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: estadoColor.withOpacity(0.3)),
                        ),
                        child: Text(
                          libro.estado,
                          style: TextStyle(
                            color: estadoColor,
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Título
                  Text(
                    libro.titulo,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.textoOscuro,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // Autor
                  Text(
                    'Por ${libro.autor}',
                    style: const TextStyle(
                      fontSize: 15,
                      color: AppTheme.textoMuted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Ficha Técnica en Grid
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.grisBorde),
                    ),
                    child: Column(
                      children: [
                        _buildInfoRow('Editorial', libro.editorial.isNotEmpty ? libro.editorial : 'No especificada'),
                        const Divider(height: 16, color: AppTheme.grisBorde),
                        _buildInfoRow('ISBN', libro.isbn.isNotEmpty ? libro.isbn : 'N/A'),
                        const Divider(height: 16, color: AppTheme.grisBorde),
                        _buildInfoRow('Año de Publicación', libro.anio.toString()),
                        const Divider(height: 16, color: AppTheme.grisBorde),
                        _buildInfoRow('Páginas', '${libro.paginas} págs.'),
                        const Divider(height: 16, color: AppTheme.grisBorde),
                        _buildInfoRow('Ubicación en Biblioteca', libro.ubicacion, highlight: true),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Sinopsis
                  const Text(
                    'Descripción',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textoOscuro),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    libro.descripcion.isNotEmpty
                        ? libro.descripcion
                        : 'Sinopsis no provista para este ejemplar.',
                    style: const TextStyle(fontSize: 14, height: 1.5, color: Color(0xFF334155)),
                  ),
                  const SizedBox(height: 32),

                  // BOTONES DE ACCIÓN
                  if (libro.estado == 'Disponible') ...[
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.azulOscuro,
                        minimumSize: const Size.fromHeight(52),
                      ),
                      onPressed: _isProcessing ? null : _solicitarPrestamo,
                      icon: const Icon(Icons.bookmark_add_rounded),
                      label: const Text('Solicitar Préstamo Escolar'),
                    ),
                  ] else ...[
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.naranja,
                        minimumSize: const Size.fromHeight(52),
                      ),
                      onPressed: _isProcessing ? null : _reservarLibro,
                      icon: const Icon(Icons.alarm_add_rounded),
                      label: const Text('Reservar Ejemplar (Fila de espera)'),
                    ),
                  ],
                  const SizedBox(height: 12),

                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                      side: const BorderSide(color: AppTheme.grisBorde),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () {
                      setState(() => _isFavorite = !_isFavorite);
                    },
                    icon: Icon(
                      _isFavorite ? Icons.star_rounded : Icons.star_border_rounded,
                      color: _isFavorite ? Colors.amber : AppTheme.textoMuted,
                    ),
                    label: Text(
                      _isFavorite ? 'En tus Favoritos' : 'Agregar a Favoritos',
                      style: const TextStyle(color: AppTheme.textoOscuro),
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

  Widget _buildInfoRow(String label, String value, {bool highlight = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, color: AppTheme.textoMuted)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: TextStyle(
              fontSize: 13,
              fontWeight: highlight ? FontWeight.w700 : FontWeight.w600,
              color: highlight ? AppTheme.naranja : AppTheme.textoOscuro,
            ),
          ),
        ),
      ],
    );
  }
}
