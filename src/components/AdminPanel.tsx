import React, { useState } from 'react';
import {
  BookMarked,
  BookPlus,
  Users,
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  RotateCcw,
  RefreshCw,
  FileSpreadsheet,
  Upload,
  Download,
  AlertCircle,
  Check,
  Eye,
  Camera,
  MapPin,
  Calendar,
  Sparkles,
  ShieldAlert,
  UserCheck,
  User,
  ArrowRight,
  X,
  FileText,
  Mail,
  GraduationCap,
  CreditCard,
  UserPlus,
  Lock,
  EyeOff,
  Settings,
  Award,
  Star,
  Bell,
  Database,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Libro, Usuario, Prestamo, BookStatus } from '../types';
import { useBiblioStore } from '../services/store';
import { getBookCover } from '../services/mockData';
import { BiblioNaviaLogo } from './BiblioNaviaLogo';
import { CARTOON_AVATARS } from '../services/avatars';

const PRESET_COVERS = [
  { label: 'Cien Años de Soledad', url: '/src/assets/images/cover_cien_anos_1790462849097.jpg' },
  { label: 'El Principito', url: '/src/assets/images/cover_principito_1790469069118.jpg' },
  { label: 'Don Quijote', url: '/src/assets/images/cover_quijote_1790464793213.jpg' },
  { label: 'La Odisea', url: '/src/assets/images/cover_odisea_1790469082371.jpg' },
  { label: 'Física Cuántica', url: '/src/assets/images/cover_fisica_1790462858863.jpg' },
  { label: 'Biología Celular', url: '/src/assets/images/cover_biologia_1790462869882.jpg' },
  { label: 'Cálculo Diferencial', url: '/src/assets/images/cover_calculo_1790464803256.jpg' },
  { label: 'Historia Universal', url: '/src/assets/images/cover_historia_1790464826116.jpg' },
  { label: 'Química Orgánica', url: '/src/assets/images/cover_quimica_1790464815826.jpg' },
  { label: 'Filosofía', url: '/src/assets/images/cover_filosofia_1790464851682.jpg' },
];

export const AdminPanel: React.FC<{
  onSwitchToStudentView: () => void;
  onLogout: () => void;
  initialModule?: 'libros' | 'agregar_libro' | 'estudiantes' | 'prestamos';
  onNavigateTab?: (tab: 'inicio' | 'perfil' | 'favoritos' | 'notificaciones' | 'configuracion' | 'creditos') => void;
}> = ({ onSwitchToStudentView, onLogout, initialModule = 'libros', onNavigateTab }) => {
  const {
    currentUser,
    books,
    users,
    loans,
    addBook,
    updateBook,
    deleteBook,
    approveLoan,
    returnLoan,
    renewLoan,
    approveLoanRenewal,
    rejectLoanRenewal,
    cancelLoan,
    addStudent,
    updateStudent,
    deleteStudent,
    bulkUploadBooksToFirestore,
    t,
  } = useBiblioStore();

  const [activeModule, setActiveModule] = useState<'libros' | 'agregar_libro' | 'estudiantes' | 'prestamos'>(initialModule);

  React.useEffect(() => {
    if (initialModule) {
      setActiveModule(initialModule);
    }
  }, [initialModule]);

  // Carga Masiva y Sincronización de 1.000 Libros en Cloud Firestore
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);
  const [bulkErrorMsg, setBulkErrorMsg] = useState<string | null>(null);
  const [bookPage, setBookPage] = useState(1);
  const BOOKS_PER_PAGE = 20;

  const handleBulkUpload = async () => {
    setBulkUploading(true);
    setBulkSuccessMsg(null);
    setBulkErrorMsg(null);
    setBulkProgress({ done: 0, total: 1000 });

    try {
      const res = await bulkUploadBooksToFirestore((done, total) => {
        setBulkProgress({ done, total });
      });

      if (res.success) {
        setBulkSuccessMsg(`¡${res.count} libros sincronizados exitosamente en Cloud Firestore!`);
        showToast('¡1.000 libros cargados exitosamente a Firestore!');
        setTimeout(() => setBulkSuccessMsg(null), 6000);
      } else {
        setBulkSuccessMsg(`¡Catálogo de 1.000 libros activo localmente! (${res.error || 'Listo'})`);
        showToast('1.000 libros cargados al catálogo');
        setTimeout(() => setBulkSuccessMsg(null), 6000);
      }
    } catch (err: any) {
      setBulkErrorMsg(err?.message || 'Error al ejecutar carga masiva.');
      setTimeout(() => setBulkErrorMsg(null), 5000);
    } finally {
      setBulkUploading(false);
    }
  };

  // Filtros
  const [bookSearch, setBookSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [loanTab, setLoanTab] = useState<'solicitudes' | 'activos' | 'devueltos'>('solicitudes');

  // Estado del Formulario "Agregar Libros"
  const [formTitulo, setFormTitulo] = useState('');
  const [formAutor, setFormAutor] = useState('');
  const [formEditorial, setFormEditorial] = useState('');
  const [formIsbn, setFormIsbn] = useState('');
  const [formAnio, setFormAnio] = useState<number>(2024);
  const [formPaginas, setFormPaginas] = useState<number>(250);
  const [formCategoria, setFormCategoria] = useState('Literatura');
  const [formUbicacion, setFormUbicacion] = useState('Estante A-01, Pasillo Central');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formEstado, setFormEstado] = useState<BookStatus>('Disponible');
  const [formImagen, setFormImagen] = useState('');
  const [storagePath, setStoragePath] = useState('gs://biblionavia-storage/portadas/cover_auto.jpg');

  // Modal Edición Rápida Libro
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Libro | null>(null);

  // Modal Crear / Agregar Nuevo Estudiante
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudentNombre, setNewStudentNombre] = useState('');
  const [newStudentDoc, setNewStudentDoc] = useState('');
  const [newStudentGrado, setNewStudentGrado] = useState('');
  const [newStudentCorreo, setNewStudentCorreo] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('Estudiante2026*');
  const [showNewStudentPassword, setShowNewStudentPassword] = useState(false);
  const [newStudentFoto, setNewStudentFoto] = useState(CARTOON_AVATARS[0]);

  // Modal Edición Estudiante Existente
  const [editingStudent, setEditingStudent] = useState<Usuario | null>(null);
  const [editStudentNombre, setEditStudentNombre] = useState('');
  const [editStudentDoc, setEditStudentDoc] = useState('');
  const [editStudentGrado, setEditStudentGrado] = useState('');
  const [editStudentCorreo, setEditStudentCorreo] = useState('');
  const [editStudentFoto, setEditStudentFoto] = useState('');

  // Feedback Toast
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Manejador de subida de archivo para la portada del libro (Firebase Storage)
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormImagen(base64);
        setStoragePath(`gs://biblionavia-storage/portadas/${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
        showToast('Portada cargada y lista para Firebase Storage');
      };
      reader.readAsDataURL(file);
    }
  };

  // AGREGAR NUEVO LIBRO AL CATÁLOGO
  const handleAddNewBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim() || !formAutor.trim() || !formDescripcion.trim()) {
      showToast('Por favor completa los campos requeridos: Título, Autor y Resumen/Sinopsis.');
      return;
    }

    const generatedIsbn = formIsbn.trim() || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    addBook({
      titulo: formTitulo.trim(),
      autor: formAutor.trim(),
      editorial: formEditorial.trim() || 'Editorial Escolar',
      isbn: generatedIsbn,
      anio: Number(formAnio) || new Date().getFullYear(),
      paginas: Number(formPaginas) || 200,
      categoria: formCategoria || 'Literatura',
      ubicacion: formUbicacion.trim() || 'Estante Principal, Pasillo Central',
      descripcion: formDescripcion.trim(),
      estado: formEstado || 'Disponible',
      imagenPortada: formImagen || getBookCover({ titulo: formTitulo, autor: formAutor, categoria: formCategoria }),
      imagen: formImagen || getBookCover({ titulo: formTitulo, autor: formAutor, categoria: formCategoria }),
    });

    // Resetear formulario
    setFormTitulo('');
    setFormAutor('');
    setFormEditorial('');
    setFormIsbn('');
    setFormDescripcion('');
    setFormImagen('');
    showToast('¡Libro agregado exitosamente al catálogo escolar!');
    setActiveModule('libros');
  };

  const openEditBookModal = (libro: Libro) => {
    setEditingBook(libro);
    setFormTitulo(libro.titulo);
    setFormAutor(libro.autor);
    setFormEditorial(libro.editorial);
    setFormIsbn(libro.isbn);
    setFormAnio(libro.anio);
    setFormPaginas(libro.paginas);
    setFormCategoria(libro.categoria);
    setFormUbicacion(libro.ubicacion);
    setFormDescripcion(libro.descripcion);
    setFormEstado(libro.estado);
    setFormImagen(getBookCover(libro));
    setIsBookModalOpen(true);
  };

  const handleSaveModalBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    updateBook({
      idLibro: editingBook.idLibro,
      titulo: formTitulo.trim(),
      autor: formAutor.trim(),
      editorial: formEditorial.trim(),
      isbn: formIsbn.trim(),
      anio: Number(formAnio),
      paginas: Number(formPaginas),
      categoria: formCategoria,
      ubicacion: formUbicacion.trim(),
      descripcion: formDescripcion.trim(),
      estado: formEstado,
      imagenPortada: formImagen,
      imagen: formImagen,
    });

    setIsBookModalOpen(false);
    setEditingBook(null);
    showToast('Libro actualizado exitosamente en Cloud Firestore');
  };

  // Abrir modal para editar información de estudiante existente
  const openEditStudent = (est: Usuario) => {
    setEditingStudent(est);
    setEditStudentNombre(est.nombreCompleto || est.nombre || '');
    setEditStudentDoc(est.documento || '');
    setEditStudentGrado(est.grado || '');
    setEditStudentCorreo(est.correo || '');
    setEditStudentFoto(est.foto || '');
  };

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editStudentNombre.trim() || !editStudentDoc.trim()) {
      showToast('Nombre y documento son obligatorios');
      return;
    }

    updateStudent({
      ...editingStudent,
      nombreCompleto: editStudentNombre.trim(),
      nombre: editStudentNombre.trim(),
      documento: editStudentDoc.trim(),
      grado: editStudentGrado.trim(),
      correo: editStudentCorreo.trim().toLowerCase(),
      foto: editStudentFoto.trim() || editingStudent.foto,
    });

    setEditingStudent(null);
    showToast('Ficha de estudiante actualizada en Firestore');
  };

  // REGISTRAR / AGREGAR NUEVO ESTUDIANTE AL SISTEMA
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentNombre.trim() || !newStudentDoc.trim() || !newStudentCorreo.trim()) {
      showToast('Por favor completa los campos requeridos: Nombre, Documento y Correo.');
      return;
    }

    if (newStudentPassword.length < 6) {
      showToast('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    if (users.some((u) => u.correo.toLowerCase() === newStudentCorreo.trim().toLowerCase())) {
      showToast('Ya existe un usuario con este correo institucional.');
      return;
    }

    if (users.some((u) => u.documento === newStudentDoc.trim())) {
      showToast('Ya existe un estudiante con este número de documento.');
      return;
    }

    addStudent({
      nombreCompleto: newStudentNombre.trim(),
      nombre: newStudentNombre.trim(),
      documento: newStudentDoc.trim(),
      grado: newStudentGrado.trim(),
      correo: newStudentCorreo.trim().toLowerCase(),
      foto: newStudentFoto || CARTOON_AVATARS[0],
    });

    setIsAddStudentModalOpen(false);
    setNewStudentNombre('');
    setNewStudentDoc('');
    setNewStudentGrado('');
    setNewStudentCorreo('');
    setNewStudentPassword('Estudiante2026*');
    showToast('¡Estudiante registrado exitosamente en el sistema y base de datos!');
  };

  const exportBooksList = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Titulo,Autor,Editorial,ISBN,Año,Paginas,Categoria,Ubicacion,Estado\n' +
      books
        .map(
          (b) =>
            `"${b.idLibro}","${b.titulo}","${b.autor}","${b.editorial}","${b.isbn}",${b.anio},${b.paginas},"${b.categoria}","${b.ubicacion}","${b.estado}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `biblionavia_catalogo_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inventario exportado a CSV exitosamente');
  };

  // Filtrado de listas
  const filteredBooks = books.filter(
    (b) =>
      b.titulo.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.autor.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.categoria.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const totalBookPages = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));
  const paginatedBooks = filteredBooks.slice(
    (bookPage - 1) * BOOKS_PER_PAGE,
    bookPage * BOOKS_PER_PAGE
  );

  React.useEffect(() => {
    setBookPage(1);
  }, [bookSearch]);

  const studentsList = users.filter((u) => u.rol === 'estudiante');
  const filteredStudents = studentsList.filter(
    (s) =>
      (s.nombreCompleto || s.nombre || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.documento.includes(studentSearch) ||
      s.correo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.grado.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const pendingLoans = loans.filter((l) => l.estado === 'Solicitado');
  const activeLoans = loans.filter((l) => l.estado === 'Activo');
  const returnedLoans = loans.filter((l) => l.estado === 'Devuelto');

  return (
    <div className="space-y-4 pb-8 text-slate-800 dark:text-slate-100">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-14 left-4 right-4 z-50 p-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

      {/* Cabecera del Administrador con Logo Oficial */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#0B1E33] via-[#0F2B48] to-[#163a61] text-white shadow-xl flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveModule('libros')}
          className="flex items-center gap-3 text-left cursor-pointer group focus:outline-none"
          title="Ir a Catálogo Principal"
        >
          <BiblioNaviaLogo size="md" className="group-hover:scale-105 transition-transform" />
          <div>
            <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest block">
              BiblioNavia · Admin
            </span>
            <h2 className="text-lg font-black mt-0.5 group-hover:text-orange-300 transition-colors">
              Gestión de Biblioteca
            </h2>
            <p className="text-xs text-slate-300">
              {currentUser?.nombreCompleto || currentUser?.nombre} · <span className="text-emerald-400 font-bold">Bibliotecari@ Escolar</span>
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {onNavigateTab && (
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => onNavigateTab('perfil')}
                className="p-1.5 rounded-xl hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Mi Perfil"
              >
                <User className="w-4 h-4 text-orange-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('favoritos')}
                className="p-1.5 rounded-xl hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Libros Más Solicitados"
              >
                <Star className="w-4 h-4 text-amber-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('notificaciones')}
                className="p-1.5 rounded-xl hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Notificaciones"
              >
                <Bell className="w-4 h-4 text-orange-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('configuracion')}
                className="p-1.5 rounded-xl hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Configuración"
              >
                <Settings className="w-4 h-4 text-slate-300" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('creditos')}
                className="p-1.5 rounded-xl hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Créditos"
              >
                <Award className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onSwitchToStudentView}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Ver cómo lo ve un estudiante"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vista Alumno</span>
            <span className="sm:hidden">Alumno</span>
          </button>
        </div>
      </div>

      {/* Métricas Resumidas Interactivas */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <button
          type="button"
          onClick={() => setActiveModule('libros')}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-orange-400 transition-all cursor-pointer text-center"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Libros</span>
          <span className="text-base font-black text-slate-900 dark:text-white tabular-nums">{books.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveModule('estudiantes')}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-all cursor-pointer text-center"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Alumnos</span>
          <span className="text-base font-black text-blue-600 dark:text-blue-400 tabular-nums">{studentsList.length}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveModule('prestamos');
            setLoanTab('solicitudes');
          }}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-orange-400 transition-all cursor-pointer text-center"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Pendientes</span>
          <span className="text-base font-black text-orange-600 tabular-nums">{pendingLoans.length}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveModule('prestamos');
            setLoanTab('activos');
          }}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 transition-all cursor-pointer text-center"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">En Préstamo</span>
          <span className="text-base font-black text-emerald-600 tabular-nums">{activeLoans.length}</span>
        </button>
      </div>

      {/* Pestañas de Navegación de Módulos */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveModule('libros')}
          className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeModule === 'libros'
              ? 'bg-white dark:bg-slate-900 text-[#0F2B48] dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span className="truncate">Libros</span>
        </button>

        <button
          onClick={() => setActiveModule('agregar_libro')}
          className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeModule === 'agregar_libro'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-orange-600 dark:text-orange-400 hover:text-orange-700 font-extrabold'
          }`}
          title="Agregar nuevos libros a la biblioteca física"
        >
          <BookPlus className="w-3.5 h-3.5" />
          <span className="truncate">+ Agregar</span>
        </button>

        <button
          onClick={() => setActiveModule('estudiantes')}
          className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeModule === 'estudiantes'
              ? 'bg-white dark:bg-slate-900 text-[#0F2B48] dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span className="truncate">Alumnos</span>
        </button>

        <button
          onClick={() => setActiveModule('prestamos')}
          className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeModule === 'prestamos'
              ? 'bg-white dark:bg-slate-900 text-[#0F2B48] dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="truncate">Préstamos</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MÓDULO 1: GESTIÓN DE LIBROS (CATÁLOGO VISUAL DEL INVENTARIO) */}
      {/* ========================================================================= */}
      {activeModule === 'libros' && (
        <div className="space-y-3">
          {/* Banner Oficial de Carga Masiva a Cloud Firestore */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0B1E33] via-[#0F2B48] to-slate-900 border border-slate-700 text-white shadow-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-wider mb-1">
                  <Database className="w-3 h-3 text-orange-400" />
                  <span>Base de Datos Cloud Firestore</span>
                </div>
                <h3 className="text-sm font-black text-white">
                  Catálogo Escolar ({books.length} Libros Registrados)
                </h3>
                <p className="text-[11px] text-slate-300">
                  10 áreas del conocimiento con portada, sinopsis, año, ISBN y ubicación física.
                </p>
              </div>

              <button
                type="button"
                disabled={bulkUploading}
                onClick={handleBulkUpload}
                className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              >
                {bulkUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sincronizando {bulkProgress ? `${bulkProgress.done}/${bulkProgress.total}` : '...'}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Carga Masiva 1.000 Libros</span>
                  </>
                )}
              </button>
            </div>

            {/* Barra de Progreso animada durante carga */}
            {bulkUploading && bulkProgress && (
              <div className="mt-3 space-y-1">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full transition-all duration-300"
                    style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                  <span>Escribiendo lotes de 500 en Cloud Firestore...</span>
                  <span>{bulkProgress.done} de {bulkProgress.total} libros</span>
                </div>
              </div>
            )}

            {bulkSuccessMsg && (
              <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{bulkSuccessMsg}</span>
              </div>
            )}

            {bulkErrorMsg && (
              <div className="mt-2.5 p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{bulkErrorMsg}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="Buscar por título, autor, categoría o ISBN..."
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 shadow-xs dark:text-white font-medium"
              />
            </div>

            <button
              onClick={() => setActiveModule('agregar_libro')}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Libro</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
              {filteredBooks.length} libros en catálogo (Página {bookPage} de {totalBookPages})
            </span>
            <button
              onClick={exportBooksList}
              className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" /> Exportar CSV
            </button>
          </div>

          {/* Tarjetas Visuales de Libros Paginadas */}
          <div className="space-y-2.5">
            {paginatedBooks.map((libro) => (
              <div
                key={libro.idLibro}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-xs hover:border-orange-300 transition-all"
              >
                {/* Portada Grande con Bordes Redondeados */}
                <div className="w-14 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <img
                    src={getBookCover(libro)}
                    alt={libro.titulo}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-extrabold text-orange-600 uppercase">
                      {libro.categoria}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        libro.estado === 'Disponible'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : libro.estado === 'Prestado'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {libro.estado}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {libro.titulo}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {libro.autor} · {libro.editorial} ({libro.anio})
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                    ISBN: {libro.isbn} · <strong className="text-slate-600 dark:text-slate-300">{libro.ubicacion}</strong>
                  </p>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => openEditBookModal(libro)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Editar Libro"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar libro "${libro.titulo}" del inventario físico?`)) {
                        deleteBook(libro.idLibro);
                        showToast('Libro eliminado del acervo');
                      }
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar Libro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Controles de Paginación de Libros */}
          {totalBookPages > 1 && (
            <div className="flex items-center justify-between pt-3 pb-2 px-1">
              <button
                type="button"
                onClick={() => setBookPage((p) => Math.max(1, p - 1))}
                disabled={bookPage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Página {bookPage} de {totalBookPages}
              </span>

              <button
                type="button"
                onClick={() => setBookPage((p) => Math.min(totalBookPages, p + 1))}
                disabled={bookPage === totalBookPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MÓDULO 2: AGREGAR NUEVO LIBRO (EXCLUSIVO ADMINISTRADOR) */}
      {/* ========================================================================= */}
      {activeModule === 'agregar_libro' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider block">
                Módulo Exclusivo del Administrador
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                Agregar Nuevo Libro al Catálogo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Al guardar, el ejemplar estará disponible inmediatamente para los estudiantes en el catálogo general.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
              Sincronización Dinámica
            </span>
          </div>

          <form onSubmit={handleAddNewBook} className="space-y-4 text-xs">
            {/* CAMPOS PRINCIPALES REQUERIDOS: TÍTULO, AUTOR Y RESUMEN/SINOPSIS */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-orange-50/40 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40">
              <span className="text-[11px] font-extrabold text-orange-800 dark:text-orange-300 uppercase tracking-wider block">
                1. Información Principal del Libro
              </span>

              {/* Nombre / Título del Libro */}
              <div>
                <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4 text-orange-500" />
                  <span>Nombre / Título del libro *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  placeholder="Ej. Cien Años de Soledad, Don Quijote, El Principito..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold dark:text-white text-xs sm:text-sm shadow-xs"
                />
              </div>

              {/* Autor del Libro */}
              <div>
                <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-orange-500" />
                  <span>Autor *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formAutor}
                  onChange={(e) => setFormAutor(e.target.value)}
                  placeholder="Ej. Gabriel García Márquez, Miguel de Cervantes..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold dark:text-white text-xs sm:text-sm shadow-xs"
                />
              </div>

              {/* Resumen / Sinopsis del Libro */}
              <div>
                <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>Resumen / Sinopsis del libro *</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  placeholder="Escribe aquí un resumen claro del argumento, temas principales y relevancia pedagógica o literaria del libro para los estudiantes..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-white text-xs leading-relaxed shadow-xs"
                />
              </div>
            </div>

            {/* SECCIÓN ADICIONAL: PORTADA Y METADATOS COMPLEMENTARIOS */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                2. Portada y Detalles de Biblioteca (Opcionales)
              </span>

              {/* Imagen de Portada y Previsualización Física Exclusiva */}
              <div className="flex gap-4 items-center">
                <div className="w-16 h-22 sm:w-20 sm:h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-orange-500 shadow-md shrink-0">
                  <img
                    src={formImagen || getBookCover({ titulo: formTitulo || 'Nuevo Libro Escolar', autor: formAutor || 'Autor Institucional', categoria: formCategoria })}
                    alt="Previsualización de portada"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Portada Física del Ejemplar
                    </span>
                    {formImagen && (
                      <button
                        type="button"
                        onClick={() => setFormImagen('')}
                        className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        Deshacer foto
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {formImagen
                      ? '✓ Fotografía física personalizada cargada.'
                      : 'Diseño vectorial físico editorial único generado en tiempo real (cero repeticiones garantizadas).'}
                  </p>
                </div>
              </div>

              {/* Categoría y Ubicación Física */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Categoría
                  </label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-orange-600 dark:text-orange-400"
                  >
                    <option value="Literatura">Literatura</option>
                    <option value="Ciencias Exactas">Ciencias Exactas</option>
                    <option value="Ciencias Naturales">Ciencias Naturales</option>
                    <option value="Matemáticas">Matemáticas</option>
                    <option value="Ciencias Sociales">Ciencias Sociales</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Filosofía">Filosofía</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>Ubicación en Biblioteca</span>
                  </label>
                  <input
                    type="text"
                    value={formUbicacion}
                    onChange={(e) => setFormUbicacion(e.target.value)}
                    placeholder="Ej. Estante A-01, Pasillo Central"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Editorial e ISBN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Editorial
                  </label>
                  <input
                    type="text"
                    value={formEditorial}
                    onChange={(e) => setFormEditorial(e.target.value)}
                    placeholder="Ej. Sudamericana, Alfaguara..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ISBN (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formIsbn}
                    onChange={(e) => setFormIsbn(e.target.value)}
                    placeholder="Autogenerado si está vacío"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookPlus className="w-4 h-4" />
                <span>Guardar y Agregar Libro al Catálogo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('libros')}
                className="px-5 h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MÓDULO 3: GESTIÓN Y CONSULTA DE ESTUDIANTES */}
      {/* ========================================================================= */}
      {activeModule === 'estudiantes' && (
        <div className="space-y-3">
          {/* Mensaje Informativo y Botón de Creación */}
          <div className="p-3 bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#0F2B48] dark:text-blue-400 font-extrabold">
              <UserCheck className="w-4 h-4 text-orange-500" />
              <span>Directorio y Registro Institucional de Estudiantes</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Como administrador puedes registrar nuevos estudiantes en la base de datos institucional para que accedan al catálogo escolar, así como consultar y actualizar sus fichas.
            </p>
          </div>

          {/* Barra de Búsqueda y Botón de Agregar Estudiante */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Buscar por nombre, documento o grado..."
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 shadow-xs dark:text-white font-medium"
              />
            </div>

            <button
              onClick={() => {
                setNewStudentNombre('');
                setNewStudentDoc('');
                setNewStudentGrado('');
                setNewStudentCorreo('');
                setNewStudentPassword('Estudiante2026*');
                setNewStudentFoto(CARTOON_AVATARS[0]);
                setIsAddStudentModalOpen(true);
              }}
              className="px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Crear y agregar nuevo estudiante"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Nuevo Alumno</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-1">
            {filteredStudents.length} estudiante(s) registrado(s)
          </div>

          {/* Directorio de Estudiantes */}
          <div className="space-y-2">
            {filteredStudents.map((estudiante) => {
              const activeUserLoans = loans.filter(
                (l) => l.usuarioId === estudiante.uid && l.estado === 'Activo'
              ).length;

              return (
                <div
                  key={estudiante.uid}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-colors"
                >
                  {/* Foto o Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    {estudiante.foto ? (
                      <img
                        src={estudiante.foto}
                        alt={estudiante.nombreCompleto || estudiante.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0F2B48] text-white text-xs font-bold flex items-center justify-center">
                        {(estudiante.nombreCompleto || estudiante.nombre || 'A').slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {estudiante.nombreCompleto || estudiante.nombre}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Documento: <strong className="text-slate-800 dark:text-slate-200">{estudiante.documento}</strong> · {estudiante.grado}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                      <span className="text-orange-600 dark:text-orange-400 truncate">{estudiante.correo}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold text-slate-600 dark:text-slate-300">
                        {activeUserLoans} préstamo(s)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Botón Editar Ficha */}
                    <button
                      onClick={() => openEditStudent(estudiante)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                      title="Editar Información del Estudiante"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Botón Desvincular */}
                    <button
                      onClick={() => {
                        if (confirm(`¿Desvincular ficha de "${estudiante.nombreCompleto || estudiante.nombre}"?`)) {
                          deleteStudent(estudiante.uid);
                          showToast('Estudiante retirado');
                        }
                      }}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                      title="Eliminar Estudiante"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MÓDULO 4: GESTIÓN DE PRÉSTAMOS */}
      {/* ========================================================================= */}
      {activeModule === 'prestamos' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setLoanTab('solicitudes')}
                className={`px-2.5 py-1 rounded-lg ${
                  loanTab === 'solicitudes' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Solicitudes ({pendingLoans.length})
              </button>
              <button
                onClick={() => setLoanTab('activos')}
                className={`px-2.5 py-1 rounded-lg ${
                  loanTab === 'activos' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Activos ({activeLoans.length})
              </button>
              <button
                onClick={() => setLoanTab('devueltos')}
                className={`px-2.5 py-1 rounded-lg ${
                  loanTab === 'devueltos' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Devueltos ({returnedLoans.length})
              </button>
            </div>

            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Gestión de Préstamos
            </span>
          </div>

          {/* Solicitudes Pendientes */}
          {loanTab === 'solicitudes' && (
            <div className="space-y-2">
              {pendingLoans.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-400">No hay solicitudes de préstamo pendientes.</p>
                </div>
              ) : (
                pendingLoans.map((l) => (
                  <div
                    key={l.idPrestamo}
                    className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">{l.libroTitulo}</h4>
                        <p className="text-[11px] text-slate-500">
                          Solicitado por: <strong className="text-slate-700 dark:text-slate-200">{l.usuarioNombre}</strong>
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Pendiente
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          approveLoan(l.idPrestamo);
                          showToast('Préstamo aprobado y activado');
                        }}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        Aprobar Préstamo
                      </button>
                      <button
                        onClick={() => {
                          cancelLoan(l.idPrestamo);
                          showToast('Solicitud rechazada');
                        }}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl text-xs font-bold"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Préstamos Activos */}
          {loanTab === 'activos' && (
            <div className="space-y-2">
              {activeLoans.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-400">No hay libros prestados actualmente.</p>
                </div>
              ) : (
                activeLoans.map((l) => (
                  <div
                    key={l.idPrestamo}
                    className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{l.libroTitulo}</h4>
                          {l.solicitudRenovacion === 'pendiente' && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-300">
                              Solicitud de Renovación
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          En poder de: <strong className="text-slate-700 dark:text-slate-200">{l.estudianteNombre || l.usuarioNombre}</strong> {l.estudianteGrado ? `(${l.estudianteGrado})` : ''}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Entrega: <strong className="text-slate-700 dark:text-slate-300">{new Date(l.fechaDevolucion).toLocaleDateString()}</strong> · Renovaciones: {l.renovaciones || 0}/2
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          returnLoan(l.idPrestamo);
                          showToast('Libro devuelto al inventario de la biblioteca');
                        }}
                        className="px-3 py-1.5 bg-[#0F2B48] hover:bg-[#163a61] text-white text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer shrink-0"
                      >
                        Registrar Devolución
                      </button>
                    </div>

                    {/* Si el estudiante solicitó renovación, panel de acción del Administrador */}
                    {l.solicitudRenovacion === 'pendiente' && (
                      <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 flex items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-orange-900 dark:text-orange-200 font-extrabold">
                          <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" />
                          <span>Solicita renovar +7 días adicionales</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              approveLoanRenewal(l.idPrestamo);
                              showToast('¡Renovación aprobada! Se extendió el plazo del préstamo.');
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Aceptar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              rejectLoanRenewal(l.idPrestamo);
                              showToast('Renovación rechazada. Se envió notificación al estudiante.');
                            }}
                            className="px-2.5 py-1 border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-50 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            <span>Rechazar</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Préstamos Devueltos */}
          {loanTab === 'devueltos' && (
            <div className="space-y-2">
              {returnedLoans.map((l) => (
                <div
                  key={l.idPrestamo}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{l.libroTitulo}</h4>
                    <p className="text-[11px] text-slate-400">{l.usuarioNombre}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Devuelto
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR INFORMACIÓN DE ESTUDIANTE (SOLO EDICIÓN) */}
      {/* ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase">Administración de Usuarios</span>
                <h3 className="text-sm font-black text-[#0F2B48] dark:text-white">
                  Editar Ficha de Estudiante
                </h3>
              </div>
              <button onClick={() => setEditingStudent(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={editStudentNombre}
                  onChange={(e) => setEditStudentNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={editStudentDoc}
                    onChange={(e) => setEditStudentDoc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Grado Escolar *
                  </label>
                  <input
                    type="text"
                    required
                    value={editStudentGrado}
                    onChange={(e) => setEditStudentGrado(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Correo Institucional *
                </label>
                <input
                  type="email"
                  required
                  value={editStudentCorreo}
                  onChange={(e) => setEditStudentCorreo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Avatar Ilustrado
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-2">
                  {CARTOON_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditStudentFoto(avatar)}
                      className={`w-10 h-10 rounded-xl overflow-hidden p-0.5 border-2 transition-all shrink-0 cursor-pointer ${
                        editStudentFoto === avatar
                          ? 'border-orange-500 ring-2 ring-orange-400/40 scale-105'
                          : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 py-2 border rounded-xl font-bold text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDICIÓN RÁPIDA DE LIBRO */}
      {/* ========================================================================= */}
      {isBookModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-[#0F2B48] dark:text-white">
                Editar Datos de Libro
              </h3>
              <button onClick={() => setIsBookModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveModalBook} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Título del Libro
                </label>
                <input
                  type="text"
                  required
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    required
                    value={formAutor}
                    onChange={(e) => setFormAutor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Editorial
                  </label>
                  <input
                    type="text"
                    required
                    value={formEditorial}
                    onChange={(e) => setFormEditorial(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    required
                    value={formIsbn}
                    onChange={(e) => setFormIsbn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none font-mono dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Estado
                  </label>
                  <select
                    value={formEstado}
                    onChange={(e) => setFormEstado(e.target.value as BookStatus)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none font-bold"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Prestado">Prestado</option>
                    <option value="Reservado">Reservado</option>
                    <option value="En Reparación">En Reparación</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ubicación en la Biblioteca
                </label>
                <input
                  type="text"
                  required
                  value={formUbicacion}
                  onChange={(e) => setFormUbicacion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs hover:bg-orange-600"
                >
                  Guardar Cambios en Firestore
                </button>
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR / AGREGAR NUEVO ESTUDIANTE (ADMINISTRADOR) */}
      {/* ========================================================================= */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider block">
                  Panel de Administración · Alumnos
                </span>
                <h3 className="text-base font-black text-[#0F2B48] dark:text-white mt-0.5 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-orange-500" />
                  <span>Registrar Nuevo Estudiante</span>
                </h3>
              </div>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              {/* Selector de Avatar Ilustrado */}
              <div>
                <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Avatar Ilustrado del Estudiante
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {CARTOON_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewStudentFoto(avatar)}
                      className={`w-12 h-12 rounded-2xl overflow-hidden p-0.5 border-2 transition-all shrink-0 cursor-pointer ${
                        newStudentFoto === avatar
                          ? 'border-orange-500 ring-2 ring-orange-400/40 scale-105'
                          : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre Completo */}
              <div>
                <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  <span>Nombre Completo del Estudiante *</span>
                </label>
                <input
                  type="text"
                  required
                  value={newStudentNombre}
                  onChange={(e) => setNewStudentNombre(e.target.value)}
                  placeholder="Ej. Santiago Moreno Gómez"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold dark:text-white text-xs"
                />
              </div>

              {/* Documento y Grado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                    <span>Documento (T.I./C.C.) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentDoc}
                    onChange={(e) => setNewStudentDoc(e.target.value)}
                    placeholder="Ej. 1098765432"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                    <span>Grado Escolar *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentGrado}
                    onChange={(e) => setNewStudentGrado(e.target.value)}
                    placeholder="Ej. 10° Grado A, 6-02, Transición..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-white font-bold text-xs"
                  />
                </div>
              </div>

              {/* Correo Electrónico Institucional */}
              <div>
                <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-orange-500" />
                  <span>Correo Institucional *</span>
                </label>
                <input
                  type="email"
                  required
                  value={newStudentCorreo}
                  onChange={(e) => setNewStudentCorreo(e.target.value)}
                  placeholder="alumno@colegio.edu.co"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-white text-xs"
                />
              </div>

              {/* Contraseña Temporal de Acceso */}
              <div>
                <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-orange-500" />
                    <span>Contraseña Temporal de Acceso *</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Mínimo 6 caracteres</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewStudentPassword ? 'text' : 'password'}
                    required
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    placeholder="Ej. Estudiante2026*"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewStudentPassword(!showNewStudentPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showNewStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  El estudiante podrá usar estas credenciales para iniciar sesión directamente en la aplicación.
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Crear y Registrar Estudiante</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
