class LibroModel {
  final String idLibro;
  final String titulo;
  final String autor;
  final String editorial;
  final String isbn;
  final int anio;
  final int paginas;
  final String categoria;
  final String imagen;
  final String ubicacion;
  final String descripcion;
  final String estado; // 'Disponible', 'Prestado', 'Reservado'

  LibroModel({
    required this.idLibro,
    required this.titulo,
    required this.autor,
    this.editorial = '',
    this.isbn = '',
    this.anio = 2024,
    this.paginas = 0,
    required this.categoria,
    this.imagen = '',
    this.ubicacion = 'Estante General',
    this.descripcion = '',
    this.estado = 'Disponible',
  });

  bool get estaDisponible => estado == 'Disponible';
  bool get estaPrestado => estado == 'Prestado';
  bool get estaReservado => estado == 'Reservado';

  factory LibroModel.fromMap(Map<String, dynamic> data, String id) {
    return LibroModel(
      idLibro: id,
      titulo: data['titulo'] ?? '',
      autor: data['autor'] ?? '',
      editorial: data['editorial'] ?? '',
      isbn: data['isbn'] ?? '',
      anio: data['anio'] is int ? data['anio'] : int.tryParse(data['anio']?.toString() ?? '2024') ?? 2024,
      paginas: data['paginas'] is int ? data['paginas'] : int.tryParse(data['paginas']?.toString() ?? '0') ?? 0,
      categoria: data['categoria'] ?? 'General',
      imagen: data['imagen'] ?? '',
      ubicacion: data['ubicacion'] ?? 'Estante A-1',
      descripcion: data['descripcion'] ?? '',
      estado: data['estado'] ?? 'Disponible',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'idLibro': idLibro,
      'titulo': titulo,
      'autor': autor,
      'editorial': editorial,
      'isbn': isbn,
      'anio': anio,
      'paginas': paginas,
      'categoria': categoria,
      'imagen': imagen,
      'ubicacion': ubicacion,
      'descripcion': descripcion,
      'estado': estado,
    };
  }
}
