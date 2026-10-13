export type LanguageCode = 'es' | 'en' | 'fr';

export interface Translations {
  [key: string]: {
    es: string;
    en: string;
    fr: string;
  };
}

export const DICTIONARY: Translations = {
  // Navigation & Drawer
  'nav.home': { es: 'Inicio', en: 'Home', fr: 'Accueil' },
  'nav.catalog': { es: 'Catálogo', en: 'Catalog', fr: 'Catalogue' },
  'nav.loans': { es: 'Préstamos', en: 'Loans', fr: 'Prêts' },
  'nav.notifications': { es: 'Notificaciones', en: 'Notifications', fr: 'Notifications' },
  'nav.profile': { es: 'Mi Perfil', en: 'My Profile', fr: 'Mon Profil' },
  'nav.reservations': { es: 'Mis Reservas', en: 'My Reservations', fr: 'Mes Réservations' },
  'nav.favorites': { es: 'Favoritos', en: 'Favorites', fr: 'Favoris' },
  'nav.settings': { es: 'Configuración', en: 'Settings', fr: 'Paramètres' },
  'nav.credits': { es: 'Créditos', en: 'Credits', fr: 'Crédits' },
  'nav.logout': { es: 'Cerrar Sesión', en: 'Sign Out', fr: 'Déconnexion' },
  'nav.adminBadge': { es: 'Administrador', en: 'Administrator', fr: 'Administrateur' },
  'nav.studentBadge': { es: 'Estudiante', en: 'Student', fr: 'Étudiant' },

  // Auth
  'auth.login': { es: 'Iniciar Sesión', en: 'Sign In', fr: 'Connexion' },
  'auth.register': { es: 'Registrarse', en: 'Register', fr: "S'inscrire" },
  'auth.email': { es: 'Correo Electrónico', en: 'Email Address', fr: 'Adresse Courriel' },
  'auth.password': { es: 'Contraseña', en: 'Password', fr: 'Mot de passe' },
  'auth.forgotPassword': { es: '¿Olvidaste tu contraseña?', en: 'Forgot your password?', fr: 'Mot de passe oublié ?' },
  'auth.loginWithEmail': { es: 'Iniciar sesión con correo', en: 'Sign in with email', fr: 'Se connecter par courriel' },
  'auth.noAccount': { es: '¿No tienes cuenta? Regístrate', en: "Don't have an account? Sign up", fr: "Vous n'avez pas de compte ? S'inscrire" },

  // Config View
  'config.title': { es: 'Configuración', en: 'Settings', fr: 'Paramètres' },
  'config.badge': { es: 'Ajustes de la Aplicación', en: 'Application Settings', fr: "Paramètres de l'application" },
  'config.subtitle': { es: 'Personaliza tu experiencia de lectura en BiblioNavia', en: 'Customize your reading experience in BiblioNavia', fr: 'Personnalisez votre expérience de lecture dans BiblioNavia' },
  'config.appearance': { es: 'Apariencia y Tema', en: 'Appearance & Theme', fr: 'Apparence et Thème' },
  'config.darkMode': { es: 'Modo Oscuro Activo', en: 'Dark Mode Active', fr: 'Mode Sombre Actif' },
  'config.lightMode': { es: 'Modo Claro Activo', en: 'Light Mode Active', fr: 'Mode Clair Actif' },
  'config.darkDesc': { es: 'Colores oscuros para descansar la vista', en: 'Dark colors to rest your eyes', fr: 'Couleurs sombres pour reposer les yeux' },
  'config.lightDesc': { es: 'Colores claros y legibles', en: 'Bright and readable colors', fr: 'Couleurs claires et lisibles' },
  'config.language': { es: 'Idioma y Lectura', en: 'Language & Reading', fr: 'Langue et Lecture' },
  'config.interfaceLanguage': { es: 'Idioma de la Interfaz', en: 'Interface Language', fr: "Langue de l'interface" },
  'config.fontSize': { es: 'Tamaño de Letra', en: 'Font Size', fr: 'Taille de Police' },
  'config.fontSizeSmall': { es: 'Pequeña', en: 'Small', fr: 'Petite' },
  'config.fontSizeNormal': { es: 'Normal', en: 'Normal', fr: 'Normale' },
  'config.fontSizeLarge': { es: 'Grande', en: 'Large', fr: 'Grande' },
  'config.notifications': { es: 'Notificaciones y Alertas', en: 'Notifications & Alerts', fr: 'Notifications et Alertes' },
  'config.dueAlerts': { es: 'Avisos de Devolución', en: 'Due Date Alerts', fr: 'Alertes de Retour' },
  'config.dueAlertsDesc': { es: 'Recordatorio 3 días antes de la fecha límite', en: 'Reminder 3 days before deadline', fr: 'Rappel 3 jours avant la date limite' },
  'config.newBooks': { es: 'Nuevos Libros Disponibles', en: 'New Books Available', fr: 'Nouveaux Livres Disponibles' },
  'config.newBooksDesc': { es: 'Aviso cuando ingresen novedades al acervo', en: 'Alert when new titles arrive', fr: 'Alerte lors des nouvelles arrivées' },
  'config.appInfo': { es: 'Información de la Plataforma', en: 'Platform Information', fr: 'Informations sur la Plateforme' },
  'config.version': { es: 'Versión Oficial', en: 'Official Version', fr: 'Version Officielle' },
  'config.institution': { es: 'Institución Educativa', en: 'Educational Institution', fr: 'Établissement Éducatif' },
  'config.sync': { es: 'Sincronización Cloud', en: 'Cloud Sync', fr: 'Synchronisation Cloud' },

  // Books & Catalog
  'books.catalogTitle': { es: 'Catálogo de Libros', en: 'Book Catalog', fr: 'Catalogue de Livres' },
  'books.searchPlaceholder': { es: 'Buscar por título, autor, categoría o ISBN...', en: 'Search by title, author, category or ISBN...', fr: 'Rechercher par titre, auteur, catégorie ou ISBN...' },
  'books.all': { es: 'Todos los libros', en: 'All books', fr: 'Tous les livres' },
  'books.available': { es: 'Disponible', en: 'Available', fr: 'Disponible' },
  'books.borrowed': { es: 'Prestado', en: 'Borrowed', fr: 'Prêté' },
  'books.reserved': { es: 'Reservado', en: 'Reserved', fr: 'Réservé' },
  'books.requestLoan': { es: 'Solicitar Préstamo', en: 'Request Loan', fr: 'Demander un prêt' },
  'books.reserve': { es: 'Reservar Ejemplar', en: 'Reserve Book', fr: 'Réserver ce livre' },
  'books.pages': { es: 'páginas', en: 'pages', fr: 'pages' },
  'books.year': { es: 'Año', en: 'Year', fr: 'Année' },
  'books.isbn': { es: 'ISBN', en: 'ISBN', fr: 'ISBN' },
  'books.location': { es: 'Ubicación', en: 'Location', fr: 'Emplacement' },
  'books.publisher': { es: 'Editorial', en: 'Publisher', fr: 'Éditeur' },
  'books.synopsis': { es: 'Sinopsis', en: 'Synopsis', fr: 'Synopsis' },
  'books.page': { es: 'Página', en: 'Page', fr: 'Page' },
  'books.of': { es: 'de', en: 'of', fr: 'sur' },
  'books.prev': { es: 'Anterior', en: 'Previous', fr: 'Précédent' },
  'books.next': { es: 'Siguiente', en: 'Next', fr: 'Suivant' },
  'books.totalCatalog': { es: 'libros en el catálogo', en: 'books in catalog', fr: 'livres dans le catalogue' },

  // Profile View
  'profile.title': { es: 'Mi Perfil', en: 'My Profile', fr: 'Mon Profil' },
  'profile.roleAdmin': { es: 'Bibliotecari@ Escolar', en: 'School Librarian', fr: 'Bibliothécaire Scolaire' },
  'profile.roleStudent': { es: 'Estudiante', en: 'Student', fr: 'Étudiant' },
  'profile.takePhoto': { es: 'Tomar Foto', en: 'Take Photo', fr: 'Prendre une photo' },
  'profile.fromGallery': { es: 'Desde Galería', en: 'From Gallery', fr: 'Depuis la galerie' },
  'profile.updatePhoto': { es: 'Actualizar Foto de Perfil', en: 'Update Profile Photo', fr: 'Modifier la photo de profil' },
  'profile.cameraActive': { es: 'Cámara Activa', en: 'Camera Active', fr: 'Caméra Active' },
  'profile.capturePhoto': { es: 'Capturar Fotografía', en: 'Capture Photo', fr: 'Capturer la photo' },
  'profile.retakePhoto': { es: 'Tomar Otra Vez', en: 'Retake Photo', fr: 'Reprendre la photo' },
  'profile.savePhoto': { es: 'Guardar y Actualizar Foto', en: 'Save & Update Photo', fr: 'Enregistrer la photo' },
  'profile.personalInfo': { es: 'Información Personal', en: 'Personal Information', fr: 'Informations personnelles' },
  'profile.fullName': { es: 'Nombre Completo', en: 'Full Name', fr: 'Nom Complet' },
  'profile.idDoc': { es: 'Documento de Identidad', en: 'Identification ID', fr: "Document d'identité" },
  'profile.grade': { es: 'Grado / Curso', en: 'Grade / Class', fr: 'Classe / Niveau' },
  'profile.saveChanges': { es: 'Guardar Cambios', en: 'Save Changes', fr: 'Enregistrer les modifications' },
  'profile.changePassword': { es: 'Cambiar Contraseña', en: 'Change Password', fr: 'Changer le mot de passe' },
  'profile.cancel': { es: 'Cancelar', en: 'Cancel', fr: 'Annuler' },

  // Loans View
  'loans.title': { es: 'Mis Préstamos', en: 'My Loans', fr: 'Mes Prêts' },
  'loans.active': { es: 'Préstamos Activos', en: 'Active Loans', fr: 'Prêts Actifs' },
  'loans.history': { es: 'Historial', en: 'History', fr: 'Historique' },
  'loans.dueDate': { es: 'Fecha de Devolución', en: 'Due Date', fr: 'Date de Retour' },
  'loans.renew': { es: 'Renovar Préstamo', en: 'Renew Loan', fr: 'Renouveler le prêt' },

  // Admin Panel
  'admin.title': { es: 'Panel de Administración', en: 'Admin Dashboard', fr: 'Panneau Administrateur' },
  'admin.books': { es: 'Libros', en: 'Books', fr: 'Livres' },
  'admin.students': { es: 'Estudiantes', en: 'Students', fr: 'Étudiants' },
  'admin.loans': { es: 'Préstamos', en: 'Loans', fr: 'Prêts' },
  'admin.bulkUploadTitle': { es: 'Carga Masiva de 1.000 Libros', en: 'Bulk Upload 1,000 Books', fr: 'Chargement Massif de 1 000 Livres' },
  'admin.bulkUploadBtn': { es: 'Sincronizar 1.000 Libros en Firestore', en: 'Sync 1,000 Books in Firestore', fr: 'Synchroniser 1 000 Livres sur Firestore' },
  'admin.bulkUploading': { es: 'Cargando lote a Firestore...', en: 'Uploading batch to Firestore...', fr: 'Chargement du lot sur Firestore...' },
  'admin.bulkSuccess': { es: '¡1.000 libros sincronizados exitosamente en Firestore!', en: '1,000 books successfully synchronized in Firestore!', fr: '1 000 livres synchronisés avec succès sur Firestore !' },
};

export function getTranslation(key: string, lang: LanguageCode = 'es'): string {
  const entry = DICTIONARY[key];
  if (!entry) return key;
  return entry[lang] || entry['es'] || key;
}
