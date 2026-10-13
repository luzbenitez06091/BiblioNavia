import 'package:flutter/material.dart';

class AppTheme {
  // Institutional Colors
  static const Color azulOscuro = Color(0xFF0F2B48); // Azul institucional principal
  static const Color azulClaro = Color(0xFF1E3A8A);
  static const Color naranja = Color(0xFFF97316);    // Naranja complementario
  static const Color naranjaOscuro = Color(0xFFEA580C);
  static const Color blanco = Colors.white;
  static const Color grisFondo = Color(0xFFF8FAFC);
  static const Color grisBorde = Color(0xFFE2E8F0);
  static const Color textoOscuro = Color(0xFF0F172A);
  static const Color textoMuted = Color(0xFF64748B);

  // Estados
  static const Color disponible = Color(0xFF10B981);
  static const Color prestado = Color(0xFFEF4444);
  static const Color reservado = Color(0xFFF59E0B);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: blanco,
    primaryColor: azulOscuro,
    colorScheme: const ColorScheme.light(
      primary: azulOscuro,
      secondary: naranja,
      surface: blanco,
      onPrimary: blanco,
      onSecondary: blanco,
      onSurface: textoOscuro,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: azulOscuro,
      foregroundColor: blanco,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: blanco,
        letterSpacing: -0.3,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: azulOscuro,
        foregroundColor: blanco,
        minimumSize: const Size.fromHeight(52),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: -0.2,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFFF1F5F9),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: grisBorde),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: grisBorde),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: naranja, width: 2),
      ),
    ),
    cardTheme: CardTheme(
      color: blanco,
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: grisBorde, width: 1),
      ),
    ),
  );
}
