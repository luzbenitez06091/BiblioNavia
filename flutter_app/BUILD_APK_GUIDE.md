# 📱 BiblioNavia - Guía para Generar el Archivo APK Android

Esta aplicación ha sido desarrollada con una arquitectura limpia y modular en **Flutter & Dart**, integrada con **Firebase Authentication**, **Cloud Firestore** y **Firebase Storage**.

---

## 🚀 Requisitos Previos

1. **Flutter SDK** instalado (versión 3.0.0 o superior):
   ```bash
   flutter doctor
   ```
2. **Android Studio** o **Android SDK Command-line Tools** con API level 21 a 34.
3. Proyecto de **Firebase** configurado.

---

## ⚙️ Paso 1: Configurar Firebase en Android

1. Ve a la consola de [Firebase Console](https://console.firebase.google.com/).
2. Crea un proyecto llamado `BiblioNavia`.
3. Registra una aplicación Android con el Package Name:
   ```
   com.biblionavia.app
   ```
4. Descarga el archivo `google-services.json` y colócalo en:
   ```
   flutter_app/android/app/google-services.json
   ```
5. En la consola de Firebase:
   - Activa **Authentication** con el proveedor de **Correo electrónico y contraseña**.
   - Crea la base de datos **Cloud Firestore**.
   - Aplica las reglas de seguridad provistas en `firestore.rules`.
   - Activa **Firebase Storage** para fotos de perfil y portadas de libros.

---

## 📦 Paso 2: Instalar Dependencias

Desde la carpeta `flutter_app`:
```bash
cd flutter_app
flutter pub get
```

---

## 🔨 Paso 3: Generar el Archivo APK Android

### 1. Generar APK de Lanzamiento (Release - Recomendado)
```bash
flutter build apk --release
```
El archivo APK listo para instalar en cualquier teléfono o tableta Android se generará en:
```
flutter_app/build/app/outputs/flutter-apk/app-release.apk
```

### 2. Generar APK dividido por Arquitectura (Reduce tamaño de descarga):
```bash
flutter build apk --split-per-abi
```
Generará versiones optimizadas para `arm64-v8a`, `armeabi-v7a` y `x86_64`.

### 3. Generar Android App Bundle (AAB para Google Play Store):
```bash
flutter build appbundle --release
```
Ubicado en:
```
flutter_app/build/app/outputs/bundle/release/app-release.aab
```

---

## 📲 Paso 4: Instalar en Celular Android

Conecta tu celular por USB con **Depuración USB** activada y ejecuta:
```bash
flutter install
```
O simplemente copia el archivo `app-release.apk` a tu teléfono vía WhatsApp, Telegram, Google Drive o USB, ábrelo y pulsa **Instalar**.

---

## 📂 Estructura Limpia del Proyecto Flutter

```
flutter_app/
├── android/
│   ├── app/
│   │   ├── build.gradle            # Configuración Android Gradle y Firebase BOM
│   │   └── src/main/AndroidManifest.xml # Permisos Internet, Almacenamiento y Cámara
├── lib/
│   ├── main.dart                   # Punto de entrada de la aplicación
│   ├── config/
│   │   └── theme.dart              # Paleta institucional (Azul Marino + Naranja)
│   ├── models/
│   │   ├── usuario_model.dart      # Modelo Usuario (roles: estudiante, administrador)
│   │   ├── libro_model.dart        # Modelo Libro con estados
│   │   ├── prestamo_model.dart     # Modelo Préstamos y renovaciones
│   │   ├── reserva_model.dart      # Modelo Reservas con cola
│   │   └── notificacion_model.dart # Modelo Notificaciones push/in-app
│   ├── services/
│   │   ├── auth_service.dart       # Firebase Authentication
│   │   ├── firestore_service.dart  # Consultas y transacciones Cloud Firestore
│   │   └── storage_service.dart    # Subida de imágenes a Firebase Storage
│   └── screens/
│       ├── splash_screen.dart       # Pantalla de carga con logo y barra animada
│       ├── login_screen.dart        # Inicio de sesión con roles
│       ├── register_screen.dart     # Registro institucional completo
│       ├── forgot_password_screen.dart # Recuperación oficial Firebase Auth
│       ├── student/
│       │   ├── student_main_navigation.dart # Menú inferior de 5 pestañas
│       │   ├── student_dashboard.dart       # Dashboard con las 4 tarjetas y accesos
│       │   ├── catalog_screen.dart          # Catálogo y buscador avanzado
│       │   ├── book_detail_screen.dart      # Ficha técnica, préstamo y reserva
│       │   ├── loans_screen.dart            # Mis préstamos activos e historial
│       │   ├── reservations_screen.dart     # Gestión de reservas en espera
│       │   ├── favorites_screen.dart        # Libros favoritos
│       │   ├── notifications_screen.dart    # Centro de notificaciones
│       │   └── profile_screen.dart          # Perfil, preferencias y sesión
│       └── admin/
│           ├── admin_dashboard.dart         # Panel de control bibliotecario
│           ├── manage_books_screen.dart     # CRUD, importación y exportación de libros
│           ├── manage_students_screen.dart  # Gestión de estudiantes
│           └── manage_loans_screen.dart     # Devoluciones, aprobaciones y renovaciones
└── pubspec.yaml                     # Dependencias Firebase y UI
```
