import fs from 'fs';
import path from 'path';

// Script para generar un catálogo de 1.000 libros 100% únicos y auténticos
// Garantiza: 0 títulos duplicados y 0 portadas duplicadas

const CATEGORIES_CONFIG = [
  {
    categoria: 'Literatura',
    pasillo: 'Pasillo L - Literatura Universal, Clásica & Juvenil',
    editoriales: ['Alfaguara', 'Planeta', 'Penguin Clásicos', 'Alianza Editorial', 'Seix Barral', 'Cátedra', 'Norma', 'Fondo de Cultura Económica'],
    count: 220,
  },
  {
    categoria: 'Ciencias Exactas',
    pasillo: 'Pasillo M - Matemáticas, Física & Astronomía',
    editoriales: ['Pearson Educación', 'McGraw-Hill', 'Reverté', 'Trillas', 'Cengage Learning', 'Editorial Mir', 'Prentice Hall'],
    count: 130,
  },
  {
    categoria: 'Ciencias Naturales',
    pasillo: 'Pasillo B - Biología, Ecología & Ciencias de la Tierra',
    editoriales: ['Panamericana', 'Omega', 'Médica Panamericana', 'Akal', 'Vicens Vives', 'Santillana', 'Planeta Ciencia'],
    count: 130,
  },
  {
    categoria: 'Química',
    pasillo: 'Pasillo Q - Química General, Orgánica & Bioquímica',
    editoriales: ['Pearson', 'McGraw-Hill', 'Reverté', 'Thomson', 'Trillas', 'Alianza Universidad'],
    count: 100,
  },
  {
    categoria: 'Ciencias Sociales',
    pasillo: 'Pasillo S - Historia, Geografía, Economía & Sociedad',
    editoriales: ['Crítica', 'Ariel', 'Fondo de Cultura Económica', 'Taurus', 'Siglo XXI Editores', 'Debate', 'Tirant lo Blanch'],
    count: 130,
  },
  {
    categoria: 'Filosofía',
    pasillo: 'Pasillo F - Filosofía, Ética & Lógica',
    editoriales: ['Gredos', 'Alianza Editorial', 'Herder', 'Trotta', 'Tecnos', 'Paidós', 'Fondo de Cultura Económica'],
    count: 100,
  },
  {
    categoria: 'Tecnología e Informática',
    pasillo: 'Pasillo T - Computación, Programación & Robótica',
    editoriales: ['Marcombo', 'Anaya Multimedia', 'O Reilly Media', 'Alfaomega', 'Ra-Ma', 'Dextra Editorial'],
    count: 110,
  },
  {
    categoria: 'Arte y Música',
    pasillo: 'Pasillo A - Bellas Artes, Música & Diseño',
    editoriales: ['Taschen', 'Gustavo Gili', 'Akal', 'Phaidon', 'Blume', 'Turner'],
    count: 80,
  },
];

console.log('Total books expected:', CATEGORIES_CONFIG.reduce((a, b) => a + b.count, 0));
