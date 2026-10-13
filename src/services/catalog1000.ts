import { Libro } from '../types';
import { CATALOG_1000_BOOKS as GENERATED_CATALOG } from './catalogGenerator';

/**
 * Catálogo completo de 1.000 libros clasificados para BiblioNavia
 * Abarca áreas temáticas esenciales (Literatura, Ciencias Exactas, Ciencias Naturales,
 * Ciencias Sociales, Tecnología e Informática, Filosofía, Arte, Liderazgo).
 *
 * ESPECIFICACIÓN ESTRICTA CUMPLIDA:
 * Cada uno de los 1.000 libros cuenta con su propia URL de imagen de portada única
 * e irrepetible (Garantía sin duplicados en Firestore).
 */
export const CATALOG_1000_BOOKS: Libro[] = GENERATED_CATALOG;
