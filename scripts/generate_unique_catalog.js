import fs from 'fs';
import path from 'path';

// Cargar catálogo actual para conservar todos los títulos, autores, categorías, sinopsis, ISBNs, años, etc.
const catalogFile = path.resolve('src/services/catalog1000.ts');
const rawTs = fs.readFileSync(catalogFile, 'utf8');
const eqIndex = rawTs.indexOf('= [');
const jsonStart = rawTs.indexOf('[', eqIndex);
const jsonEnd = rawTs.lastIndexOf(']');
const existingBooks = JSON.parse(rawTs.substring(jsonStart, jsonEnd + 1));

console.log(`Loaded ${existingBooks.length} existing books to update with 1,000 strictly unique covers.`);

// Portadas locales de archivo para títulos emblemáticos
const ICONIC_COVERS = {
  'lib-0001': '/src/assets/images/cover_cien_anos_1790462849097.jpg',
  'lib-0008': '/src/assets/images/cover_quijote_1790464793213.jpg',
  'lib-0101': '/src/assets/images/cover_biologia_1790462869882.jpg',
  'lib-0201': '/src/assets/images/cover_fisica_1790462858863.jpg',
  'lib-0301': '/src/assets/images/cover_calculo_1790464803256.jpg',
  'lib-0401': '/src/assets/images/cover_historia_1790464826116.jpg',
  'lib-0501': '/src/assets/images/cover_filosofia_1790464851682.jpg',
  'lib-0801': '/src/assets/images/cover_principito_1790469069118.jpg',
  'lib-0821': '/src/assets/images/cover_odisea_1790469082371.jpg',
};

const uniqueCoversSet = new Set();
const updatedBooks = [];

existingBooks.forEach((book, idx) => {
  const num = idx + 1;
  const pad = String(num).padStart(4, '0');
  const bookId = book.idLibro || `lib-${pad}`;

  let uniqueUrl;
  if (ICONIC_COVERS[bookId] && !uniqueCoversSet.has(ICONIC_COVERS[bookId])) {
    uniqueUrl = ICONIC_COVERS[bookId];
  } else {
    // URL garantizada única por libro con seed determinístico para portada de libro
    uniqueUrl = `https://picsum.photos/seed/biblionavia-libro-${pad}/400/600`;
  }

  // Comprobar colisión estricta
  if (uniqueCoversSet.has(uniqueUrl)) {
    uniqueUrl = `https://picsum.photos/seed/biblionavia-libro-${pad}-${Date.now()}/400/600`;
  }

  uniqueCoversSet.add(uniqueUrl);

  updatedBooks.push({
    ...book,
    idLibro: bookId,
    imagen: uniqueUrl,
    imagenPortada: uniqueUrl,
  });
});

// Verificación matemática de unicidad
if (uniqueCoversSet.size !== 1000) {
  throw new Error(`Error: expected 1000 unique covers, got ${uniqueCoversSet.size}`);
}

console.log(`Verified 100% unique covers: ${uniqueCoversSet.size} distinct URLs for ${updatedBooks.length} books.`);

const newFileContent = `import { Libro } from '../types';

/**
 * Catálogo completo de 1.000 libros clasificados para BiblioNavia
 * Abarca 10 áreas temáticas (100 libros por área) con todos los campos requeridos.
 * Cada uno de los 1.000 libros cuenta con una portada de imagen estrictamente única sin repeticiones.
 */
export const CATALOG_1000_BOOKS: Libro[] = ${JSON.stringify(updatedBooks, null, 2)};

export function get1000Books(): Libro[] {
  return CATALOG_1000_BOOKS;
}
`;

fs.writeFileSync(catalogFile, newFileContent, 'utf8');
console.log(`Updated ${catalogFile} successfully!`);
