import fs from 'fs';
import path from 'path';
import { generateUniqueBookCoverSvg, CANONICAL_COVERS } from '../src/services/coverGenerator';

// Generador de 1.000 libros con 1.000 títulos únicos y 1.000 portadas físicas exclusivas

const CATEGORIES_DEF = [
  {
    name: 'Literatura',
    pasillo: 'Pasillo L - Literatura Universal, Clásica & Juvenil',
    editoriales: ['Alfaguara', 'Planeta', 'Penguin Clásicos', 'Alianza Editorial', 'Seix Barral', 'Cátedra', 'Norma', 'Fondo de Cultura Económica'],
    count: 220,
    prefix: 'Lit',
    subgenres: [
      { tag: 'Novela Clásica Universal', desc: 'Edición crítica anotada con estudio biográfico y contexto histórico.' },
      { tag: 'Narrativa Hispanoamericana', desc: 'Obra cumbre de la literatura en lengua castellana con análisis temático.' },
      { tag: 'Literatura Colombiana', desc: 'Lectura escolar recomendada para formación humanística y cultural.' },
      { tag: 'Poesía y Lirismo', desc: 'Antología poética seleccionada para el desarrollo de la sensibilidad estética.' },
      { tag: 'Teatro y Dramaturgia', desc: 'Texto dramático completo con acotaciones escénicas y guía de representación.' },
      { tag: 'Cuentos y Relatos Breves', desc: 'Selección de relatos breves para fomento lector en educación media.' },
      { tag: 'Ciencia Ficción y Distopía', desc: 'Visión literaria sobre el porvenir técnico, el poder y la condición humana.' },
      { tag: 'Novela Histórica y Testimonial', desc: 'Recreación documental de sucesos y personajes determinantes del pasado.' },
    ],
  },
  {
    name: 'Ciencias Exactas',
    pasillo: 'Pasillo M - Matemáticas, Física & Astronomía',
    editoriales: ['Pearson Educación', 'McGraw-Hill Interamericana', 'Editorial Reverté', 'Trillas', 'Cengage Learning', 'Editorial Mir'],
    count: 130,
    prefix: 'Mat',
    subgenres: [
      { tag: 'Aritmética y Álgebra', desc: 'Fundamentos de operaciones, ecuaciones, polinomios y modelado matemático.' },
      { tag: 'Geometría y Trigonometría', desc: 'Demostraciones euclidianas, identidades trigonométricas y geometría analítica.' },
      { tag: 'Cálculo Diferencial e Integral', desc: 'Límites, derivadas, integrales y aplicaciones a la física y la ingeniería.' },
      { tag: 'Probabilidad y Estadística', desc: 'Inferencia estadística, variables aleatorias, muestreo y análisis de datos.' },
      { tag: 'Física Mecánica y Dinámica', desc: 'Cinemática, leyes de Newton, energía, momento lineal y rotación.' },
      { tag: 'Termodinámica y Fluidos', desc: 'Hidrostática, calorimetría, leyes térmicas y entropía de sistemas.' },
      { tag: 'Electromagnetismo y Óptica', desc: 'Campos eléctricos, circuitos, inducción electromagnética y ondas luminosas.' },
      { tag: 'Astrofísica y Cosmología', desc: 'Mecánica celeste, evolución estelar, galaxias y estructura del universo.' },
    ],
  },
  {
    name: 'Ciencias Naturales',
    pasillo: 'Pasillo B - Biología, Ecología & Ciencias de la Tierra',
    editoriales: ['Médica Panamericana', 'Ediciones Omega', 'Akal', 'Vicens Vives', 'Santillana', 'Planeta Ciencia'],
    count: 130,
    prefix: 'Bio',
    subgenres: [
      { tag: 'Biología Celular y Molecular', desc: 'Estructura organular, membrana plasmática, metabolismo y ciclo celular.' },
      { tag: 'Genética y Herencia', desc: 'Leyes mendelianas, ADN, código genético y biotecnología moderna.' },
      { tag: 'Ecología y Biodiversidad', desc: 'Ecosistemas, cadenas tróficas, dinámica poblacional y conservación.' },
      { tag: 'Botánica y Fisiología Vegetal', desc: 'Fotosíntesis, morfología de plantas vasculares y flora neotropical.' },
      { tag: 'Zoología y Comportamiento Animal', desc: 'Taxonomía animal, adaptaciones evolutivas y etología comparada.' },
      { tag: 'Anatomía y Fisiología Humana', desc: 'Sistemas cardiovascular, nervioso, endocrino, óseo e inmunológico.' },
      { tag: 'Microbiología e Inmunología', desc: 'Bacteriología, virología básica, respuesta inmune y salud pública.' },
      { tag: 'Geología y Ciencias de la Tierra', desc: 'Tectónica de placas, minerales, ciclo de las rocas y clima global.' },
    ],
  },
  {
    name: 'Química',
    pasillo: 'Pasillo Q - Química General, Orgánica & Bioquímica',
    editoriales: ['Pearson', 'McGraw-Hill', 'Reverté', 'Thomson', 'Trillas', 'Alianza'],
    count: 100,
    prefix: 'Qui',
    subgenres: [
      { tag: 'Química General y Estructura', desc: 'Teoría atómica, tabla periódica, enlaces químicos y fuerzas intermoleculares.' },
      { tag: 'Estequiometría y Disoluciones', desc: 'Leyes ponderales, balanceo de reacciones, molaridad y pH.' },
      { tag: 'Química Orgánica Fundamental', desc: 'Hidrocarburos, grupos funcionales, isomería y síntesis orgánica.' },
      { tag: 'Bioquímica y Macromoléculas', desc: 'Proteínas, carbohidratos, lípidos, ácidos nucleicos y enzimología.' },
      { tag: 'Termoquímica y Cinética', desc: 'Velocidad de reacción, catálisis, entalpía y equilibrio químico.' },
      { tag: 'Química Analítica e Instrumental', desc: 'Gravimetría, volumetría, espectroscopía y métodos de laboratorio.' },
      { tag: 'Química Ambiental y Sostenible', desc: 'Ciclos biogeoquímicos, química de la atmósfera y remediación verde.' },
    ],
  },
  {
    name: 'Ciencias Sociales',
    pasillo: 'Pasillo S - Historia, Geografía, Economía & Sociedad',
    editoriales: ['Editorial Crítica', 'Ariel', 'Fondo de Cultura Económica', 'Taurus', 'Siglo XXI Editores', 'Debate'],
    count: 130,
    prefix: 'Soc',
    subgenres: [
      { tag: 'Historia Universal', desc: 'Civilizaciones antiguas, era medieval, revoluciones modernas y siglo XX.' },
      { tag: 'Historia de Colombia y América Latina', desc: 'Período prehispánico, colonia, independencia y república contemporánea.' },
      { tag: 'Geografía Humana y Territorial', desc: 'Demografía, urbanismo, regiones naturales y geopolítica global.' },
      { tag: 'Constitución y Democracia', desc: 'Mecanismos de participación ciudadana, derechos humanos y Estado social.' },
      { tag: 'Economía y Finanzas Escolares', desc: 'Microeconomía básica, mercados, inflación, moneda y finanzas personales.' },
      { tag: 'Sociología y Cultura', desc: 'Estructura social, movimientos colectivos, género y cambio social.' },
      { tag: 'Antropología y Etnografía', desc: 'Diversidad cultural, mitos de origen, rituales y memoria comunitaria.' },
    ],
  },
  {
    name: 'Filosofía',
    pasillo: 'Pasillo F - Filosofía, Ética & Lógica',
    editoriales: ['Editorial Gredos', 'Alianza Editorial', 'Herder', 'Trotta', 'Tecnos', 'Paidós'],
    count: 100,
    prefix: 'Fil',
    subgenres: [
      { tag: 'Filosofía Clásica y Helenística', desc: 'Pensamiento socrático, diálogos platónicos y metafísica aristotélica.' },
      { tag: 'Filosofía Moderna y Racionalismo', desc: 'Duda cartesiana, empirismo inglés, ilustración e idealismo kantiano.' },
      { tag: 'Ética y Filosofía Moral', desc: 'Dilemas éticos, justicia distributiva, bioética y responsabilidad cívica.' },
      { tag: 'Lógica y Teoría de la Argumentación', desc: 'Lógica formal, silogismos, falacias no formales y pensamiento crítico.' },
      { tag: 'Epistemología y Conocimiento', desc: 'Método científico, falsacionismo, verdad y límites de la razón humana.' },
      { tag: 'Filosofía Contemporánea y Existencia', desc: 'Fenomenología, existencialismo, teoría crítica y posmodernidad.' },
      { tag: 'Filosofía Política y del Derecho', desc: 'Contractualismo, soberanía popular, justicia y teorías del poder.' },
    ],
  },
  {
    name: 'Tecnología e Informática',
    pasillo: 'Pasillo T - Computación, Programación & Robótica',
    editoriales: ['Marcombo', 'Anaya Multimedia', "O'Reilly Media", 'Alfaomega', 'Ra-Ma', 'Dextra'],
    count: 110,
    prefix: 'Tec',
    subgenres: [
      { tag: 'Fundamentos de Computación', desc: 'Arquitectura de hardware, sistemas operativos, binario y lógica de circuitos.' },
      { tag: 'Pensamiento Computacional y Lógica', desc: 'Diagramas de flujo, pseudocódigo y resolución estructurada de problemas.' },
      { tag: 'Algoritmos y Estructuras de Datos', desc: 'Búsqueda, ordenamiento, listas, árboles, grafos y complejidad algorítmica.' },
      { tag: 'Redes y Comunicaciones', desc: 'Modelo OSI/TCP-IP, protocolos de internet, routing, switches y wifi.' },
      { tag: 'Ciberseguridad y Privacidad', desc: 'Criptografía, autenticación, prevención de malware e higiene digital.' },
      { tag: 'Inteligencia Artificial y Datos', desc: 'Redes neuronales, aprendizaje supervisado, visión artificial y ética de la IA.' },
      { tag: 'Bases de Datos y SQL', desc: 'Modelado entidad-relación, normalización relacional y consultas SQL.' },
      { tag: 'Robótica y Sistemas Embebidos', desc: 'Microcontroladores, sensores, actuadores, Arduino y mecatrónica escolar.' },
    ],
  },
  {
    name: 'Arte y Música',
    pasillo: 'Pasillo A - Bellas Artes, Música & Diseño',
    editoriales: ['Taschen', 'Gustavo Gili', 'Akal', 'Phaidon', 'Blume', 'Turner'],
    count: 80,
    prefix: 'Art',
    subgenres: [
      { tag: 'Historia del Arte Universal', desc: 'Evolución de las artes visuales desde las cavernas hasta las vanguardias.' },
      { tag: 'Dibujo y Composición Visual', desc: 'Perspectiva, claroscuro, proporción áurea y técnicas secas y húmedas.' },
      { tag: 'Teoría del Color y Pintura', desc: 'Círculo cromático, armonías de color, óleo, acrílico y acuarela.' },
      { tag: 'Música y Armonía', desc: 'Lectura de partituras, intervalos, escalas, acordes y análisis auditivo.' },
      { tag: 'Fotografía y Lenguaje Audiovisual', desc: 'Óptica de cámara, velocidad de obturación, diafragma y fotoperiodismo.' },
      { tag: 'Arquitectura y Urbanismo', desc: 'Estructuras arquitectónicas, órdenes clásicos y urbanismo sostenible.' },
      { tag: 'Diseño Gráfico e Ilustración', desc: 'Tipografía, semiótica visual, identidad corporativa y diagramación.' },
    ],
  },
];

export function buildComplete1000Catalog(): any[] {
  const books: any[] = [];
  const usedTitles = new Set<string>();
  const usedCovers = new Set<string>();
  let globalCounter = 1;

  // 1. LAS 10 OBRAS EMBLEMÁTICAS CANÓNICAS CON SU FOTO FÍSICA EXACTA Y REAL
  const CANONICAL_BOOKS = [
    {
      idLibro: 'lib-0001',
      titulo: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      categoria: 'Literatura',
      editorial: 'Editorial Sudamericana',
      anio: 1967,
      paginas: 471,
      isbn: '978-843-76049-47',
      ubicacion: 'Pasillo L, Vitrina de Obras Maestras #01',
      descripcion: 'Edición conmemorativa oficial de la obra cumbre del realismo mágico sobre la saga centenaria de Macondo.',
      imagenPortada: '/src/assets/images/cover_cien_anos_1790462849097.jpg',
      imagen: '/src/assets/images/cover_cien_anos_1790462849097.jpg',
      estado: 'Disponible',
    },
    {
      idLibro: 'lib-0002',
      titulo: 'Don Quijote de la Mancha',
      autor: 'Miguel de Cervantes Saavedra',
      categoria: 'Literatura',
      editorial: 'Real Academia Española',
      anio: 1605,
      paginas: 864,
      isbn: '978-842-04121-46',
      ubicacion: 'Pasillo L, Vitrina de Obras Maestras #02',
      descripcion: 'Edición conmemorativa de la novela de caballería que inmortalizó los ideales de justicia de Don Quijote y Sancho.',
      imagenPortada: '/src/assets/images/cover_quijote_1790464793213.jpg',
      imagen: '/src/assets/images/cover_quijote_1790464793213.jpg',
      estado: 'Disponible',
    },
    {
      idLibro: 'lib-0003',
      titulo: 'El Principito',
      autor: 'Antoine de Saint-Exupéry',
      categoria: 'Literatura',
      editorial: 'Reynal & Hitchcock',
      anio: 1943,
      paginas: 96,
      isbn: '978-849-83814-98',
      ubicacion: 'Pasillo L, Vitrina de Obras Maestras #03',
      descripcion: 'Edición original ilustrada sobre la amistad, la flor y la lección del zorro: lo esencial es invisible a los ojos.',
      imagenPortada: '/src/assets/images/cover_principito_1790469069118.jpg',
      imagen: '/src/assets/images/cover_principito_1790469069118.jpg',
      estado: 'Disponible',
    },
    {
      idLibro: 'lib-0004',
      titulo: 'La Odisea',
      autor: 'Homero',
      categoria: 'Literatura',
      editorial: 'Editorial Gredos',
      anio: 1982,
      paginas: 448,
      isbn: '978-842-49245-08',
      ubicacion: 'Pasillo L, Vitrina de Obras Maestras #04',
      descripcion: 'Edición clásica de la epopeya homérica sobre el retorno de Odiseo a Ítaca superando sirenas y monstruos.',
      imagenPortada: '/src/assets/images/cover_odisea_1790469082371.jpg',
      imagen: '/src/assets/images/cover_odisea_1790469082371.jpg',
      estado: 'Disponible',
    },
    {
      idLibro: 'lib-0005',
      titulo: 'Física Universitaria con Física Moderna',
      autor: 'Francis W. Sears & Mark W. Zemansky',
      categoria: 'Ciencias Exactas',
      editorial: 'Pearson Educación',
      anio: 2018,
      paginas: 896,
      isbn: '978-607-32443-98',
      ubicacion: 'Pasillo M, Estante 01 - Física General',
      descripcion: 'Texto fundamental de mecánica clásica, campos cuánticos, relatividad especial y termodinámica.',
      imagenPortada: '/src/assets/images/cover_fisica_1790462858863.jpg',
      imagen: '/src/assets/images/cover_fisica_1790462858863.jpg',
      estado: 'Disponible',
    },
    {
      idLibro: 'lib-0006',
      titulo: 'Biología Celular y Molecular',
      autor: 'Harvey Lodish & Arnold Berk',
      categoria: 'Ciencias Naturales',
      editorial: 'Editorial Médica Panamericana',
      anio: 2016,
      paginas: 1040,
      isbn: '978-950-06062-64',
      ubicacion: 'Pasillo B, Estante 01 - Biología Avanzada',
      descripcion: 'Tratado de referencia médica sobre vías de señalización celular, ciclo genómico y transcripción del ARN.',
      imagenPortada: '/src/assets/images/cover_biologia_1790462869882.jpg',
      imagen: '/src/assets/images/cover_biologia_1790462869882.jpg',
      estado: 'Disponible',
    },
    {
      idLibro: 'lib-0007',
      titulo: 'Cálculo Trascendentes Tempranas',
      autor: 'James Stewart',
      categoria: 'Ciencias Exactas',
      editorial: 'Cengage Learning',
      anio: 2017,
      paginas: 1152,
      isbn: '978-607-52655-06',
      ubicacion: 'Pasillo M, Estante 02 - Cálculo Superior',
      descripcion: 'El texto más consultado de cálculo con aplicaciones rigurosas a la física, economía y ciencias aplicadas.',
      imagenPortada: '/src/assets/images/cover_calculo_1790464803256.jpg',
      imagen: '/src/assets/images/cover_calculo_1790464803256.jpg',
      estado: 'Disponible',
    },
    {
      idLibro: 'lib-0008',
      titulo: 'Historia Universal Contemporánea: de 1914 al Presente',
      autor: 'Alberto Fernández García',
      categoria: 'Ciencias Sociales',
      editorial: 'Editorial Vicens Vives',
      anio: 2015,
      paginas: 460,
      isbn: '978-843-16788-21',
      ubicacion: 'Pasillo S, Estante 01 - Siglo XX',
      descripcion: 'Análisis geopolítico desde la Primera Guerra Mundial hasta la Guerra Fría y la era de la globalización.',
      imagenPortada: '/src/assets/images/cover_historia_1790464826116.jpg',
      imagen: '/src/assets/images/cover_historia_1790464826116.jpg',
      estado: 'Disponible',
    },
    {
      idLibro: 'lib-0009',
      titulo: 'Química Orgánica y Bioquímica Fundamental',
      autor: 'L. G. Wade Jr.',
      categoria: 'Química',
      editorial: 'Pearson Educación',
      anio: 2017,
      paginas: 780,
      isbn: '978-607-32384-72',
      ubicacion: 'Pasillo Q, Estante 01 - Química Orgánica',
      descripcion: 'Mecanismos de reacción de síntesis, grupos funcionales orgánicos, esteroides y biomoléculas complejas.',
      imagenPortada: '/src/assets/images/cover_quimica_1790464815826.jpg',
      imagen: '/src/assets/images/cover_quimica_1790464815826.jpg',
      estado: 'Disponible',
    },
    {
      idLibro: 'lib-0010',
      titulo: 'Lógica Proposicional y Argumentación Crítica',
      autor: 'Irving M. Copi & Carl Cohen',
      categoria: 'Filosofía',
      editorial: 'Editorial Limusa / Noriega',
      anio: 2019,
      paginas: 384,
      isbn: '978-968-18485-76',
      ubicacion: 'Pasillo F, Estante 01 - Lógica Formal',
      descripcion: 'Métodos formales de deducción, tablas de verdad, lógica de predicados y detección de falacias lógicas.',
      imagenPortada: '/src/assets/images/cover_filosofia_1790464851682.jpg',
      imagen: '/src/assets/images/cover_filosofia_1790464851682.jpg',
      estado: 'Disponible',
    },
  ];

  CANONICAL_BOOKS.forEach((b) => {
    books.push(b);
    usedTitles.add(b.titulo.toLowerCase().trim());
    usedCovers.add(b.imagenPortada);
    globalCounter++;
  });

  // 2. GENERAR LAS RESTANTES 990 OBRAS CON TÍTULOS 100% ÚNICOS Y PORTADAS SVG FÍSICAS EXCLUSIVAS
  let remainingCounts: Record<string, number> = {
    Literatura: 220 - 4, // 216 restantes
    'Ciencias Exactas': 130 - 2, // 128 restantes
    'Ciencias Naturales': 130 - 1, // 129 restantes
    Química: 100 - 1, // 99 restantes
    'Ciencias Sociales': 130 - 1, // 129 restantes
    Filosofía: 100 - 1, // 99 restantes
    'Tecnología e Informática': 110, // 110 restantes
    'Arte y Música': 80, // 80 restantes
  };

  // Diccionario rico de autores reales por categoría
  const AUTHORS_BY_CAT: Record<string, string[]> = {
    Literatura: [
      'Julio Cortázar', 'Jorge Luis Borges', 'Juan Rulfo', 'Franz Kafka', 'Fiódor Dostoyevski',
      'Jane Austen', 'José Saramago', 'Ray Bradbury', 'George Orwell', 'Aldous Huxley',
      'León Tolstói', 'Victor Hugo', 'Gustave Flaubert', 'Ernest Hemingway', 'Oscar Wilde',
      'Mary Shelley', 'Emily Brontë', 'Charlotte Brontë', 'Herman Melville', 'Mark Twain',
      'Robert Louis Stevenson', 'Julio Verne', 'Mario Vargas Llosa', 'Isabel Allende',
      'Ernesto Sabato', 'Alejo Carpentier', 'Carlos Fuentes', 'José María Arguedas',
      'Rómulo Gallegos', 'Pablo Neruda', 'Federico García Lorca', 'Antonio Machado',
      'César Vallejo', 'Octavio Paz', 'Horacio Quiroga', 'Mario Benedetti',
      'Adolfo Bioy Casares', 'Manuel Puig', 'Hermann Hesse', 'Albert Camus',
      'Jean-Paul Sartre', 'J.D. Salinger', 'Edgar Allan Poe', 'H.P. Lovecraft',
      'J.R.R. Tolkien', 'Isaac Asimov', 'Arthur C. Clarke', 'Philip K. Dick',
      'Patrick Süskind', 'Umberto Eco', 'Milan Kundera', 'Tomás Carrasquilla',
      'Álvaro Mutis', 'Andrés Caicedo', 'Manuel Zapata Olivella', 'José Eustasio Rivera',
    ],
    'Ciencias Exactas': [
      'Isaac Newton', 'Albert Einstein', 'Stephen Hawking', 'Carl Sagan', 'Richard Feynman',
      'Euclides de Alejandría', 'Carl Friedrich Gauss', 'Leonhard Euler', 'René Descartes',
      'James Stewart', 'Tom M. Apostol', 'David Halliday & Robert Resnick', 'Paul A. Tipler',
      'Charles Kittel', 'Kip S. Thorne', 'Roger Penrose', 'Brian Greene',
      'Michio Kaku', 'Ian Stewart', 'Benoît Mandelbrot', 'George Polya',
      'Gilbert Strang', 'Michael Spivak', 'Dennis G. Zill', 'Douglas C. Giancoli',
    ],
    'Ciencias Naturales': [
      'Charles Darwin', 'Gregor Mendel', 'James D. Watson & Francis Crick', 'Richard Dawkins',
      'Stephen Jay Gould', 'Lynn Margulis', 'Helena Curtis & N. Sue Barnes', 'Neil A. Campbell',
      'Peter H. Raven', 'Edward O. Wilson', 'Ernst Mayr', 'Alexander von Humboldt',
      'Rachel Carson', 'Jane Goodall', 'David Attenborough', 'Eric Kandel',
      'Antonio Damasio', 'Oliver Sacks', 'Arthur C. Guyton & John E. Hall', 'Bruce Alberts',
    ],
    Química: [
      'Linus Pauling', 'Raymond Chang', 'Theodore L. Brown', 'John McMurry',
      'David L. Nelson & Michael M. Cox', 'Robert T. Morrison & Robert N. Boyd',
      'Peter Atkins & Julio de Paula', 'F. Albert Cotton & Geoffrey Wilkinson',
      'Daniel C. Harris', 'Douglas A. Skoog', 'Gilbert N. Lewis', 'Marie Curie',
      'Dmitri Mendeléyev', 'Antoine Lavoisier', 'Svante Arrhenius', 'G. N. Schrauzer',
    ],
    'Ciencias Sociales': [
      'Eric Hobsbawm', 'Yuval Noah Harari', 'Eduardo Galeano', 'Jared Diamond',
      'Fernand Braudel', 'Max Weber', 'Émile Durkheim', 'Michel Foucault',
      'Pierre Bourdieu', 'Hannah Arendt', 'Orlando Fals Borda', 'Germán Arciniegas',
      'Jorge Orlando Melo', 'Alfonso Múnera', 'David Bushnell', 'Marc Bloch',
      'Paul Veyne', 'Edward Said', 'Zygmunt Bauman', 'Thomas Piketty',
    ],
    Filosofía: [
      'Platón', 'Aristóteles', 'René Descartes', 'Immanuel Kant', 'Friedrich Nietzsche',
      'Baruch Spinoza', 'John Locke', 'David Hume', 'Jean-Jacques Rousseau',
      'Georg Wilhelm Friedrich Hegel', 'Arthur Schopenhauer', 'Søren Kierkegaard',
      'Bertrand Russell', 'Ludwig Wittgenstein', 'Karl Popper', 'Martin Heidegger',
      'Hans-Georg Gadamer', 'Jürgen Habermas', 'John Rawls', 'Gilles Deleuze',
    ],
    'Tecnología e Informática': [
      'Alan Turing', 'Donald Knuth', 'Andrew S. Tanenbaum', 'Stuart Russell & Peter Norvig',
      'Brian W. Kernighan & Dennis Ritchie', 'Robert C. Martin', 'Martin Fowler',
      'Erich Gamma & Richard Helm', 'Thomas H. Cormen', 'Jon Bentley',
      'Linus Torvalds', 'Richard Stallman', 'Tim Berners-Lee', 'Claude Shannon',
      'John von Neumann', 'Edsger W. Dijkstra', 'Donald Norman', 'Steve McConnell',
    ],
    'Arte y Música': [
      'Ernst Gombrich', 'Wucius Wong', 'Walter Piston', 'Michael Freeman',
      'J. Peter Burkholder', 'Johannes Itten', 'Vasili Kandinski', 'Paul Klee',
      'John Berger', 'Rudolf Arnheim', 'Leonardo da Vinci', 'Erwin Panofsky',
      'Heinrich Wölfflin', 'Gillo Dorfles', 'Aaron Copland', 'Arnold Schoenberg',
    ],
  };

  for (const catConf of CATEGORIES_DEF) {
    const needed = remainingCounts[catConf.name];
    const authors = AUTHORS_BY_CAT[catConf.name];
    let createdForCat = 0;

    for (let s = 0; s < catConf.subgenres.length; s++) {
      const sub = catConf.subgenres[s];
      const countForSub = Math.ceil(needed / catConf.subgenres.length);

      for (let i = 1; i <= countForSub; i++) {
        if (createdForCat >= needed) break;

        const author = authors[(createdForCat + s) % authors.length];
        const editorial = catConf.editoriales[(createdForCat + s) % catConf.editoriales.length];
        const anio = 1970 + ((createdForCat * 7 + s * 13) % 54);
        const paginas = 150 + ((createdForCat * 19 + s * 23) % 700);

        // Generar título único y real para la disciplina
        let candidateTitle = `${sub.tag}: Principios y Aplicaciones (Vol. ${i})`;
        if (catConf.name === 'Literatura') {
          const litSpecifics = [
            `Antología de ${sub.tag}: Obras Esenciales (Tomo ${i})`,
            `Cuentos Escogidos de ${author}: Edición Escolar (Vol. ${i})`,
            `Ensayos y Relatos de ${sub.tag}: Lectura Crítica (Tomo ${i})`,
            `Compendio de ${sub.tag}: De los Orígenes a la Modernidad (Parte ${i})`,
          ];
          candidateTitle = litSpecifics[i % litSpecifics.length];
        } else if (catConf.name === 'Ciencias Exactas') {
          const exactSpecifics = [
            `Tratado de ${sub.tag}: Teoría y Problemas Resueltos (Vol. ${i})`,
            `Fundamentos Rigurosos de ${sub.tag}: Nivel Bachillerato (Tomo ${i})`,
            `Lecciones Avanzadas de ${sub.tag} (Parte ${i})`,
            `Manual Práctico de ${sub.tag}: Métodos y Demostraciones (Edición ${i})`,
          ];
          candidateTitle = exactSpecifics[i % exactSpecifics.length];
        } else if (catConf.name === 'Ciencias Naturales') {
          const natSpecifics = [
            `Investigaciones en ${sub.tag}: Enfoque Neotropical (Tomo ${i})`,
            `Manual de Campo y Laboratorio de ${sub.tag} (Vol. ${i})`,
            `Principios Fundamentales de ${sub.tag} (Fascículo ${i})`,
            `Biodiversidad y Dinámica de ${sub.tag} (Parte ${i})`,
          ];
          candidateTitle = natSpecifics[i % natSpecifics.length];
        } else if (catConf.name === 'Química') {
          const quiSpecifics = [
            `Curso Teórico-Práctico de ${sub.tag} (Tomo ${i})`,
            `Estructura y Transformaciones en ${sub.tag} (Vol. ${i})`,
            `Laboratorio y Reacciones de ${sub.tag} (Edición ${i})`,
            `Avances y Aplicaciones de ${sub.tag} (Parte ${i})`,
          ];
          candidateTitle = quiSpecifics[i % quiSpecifics.length];
        } else if (catConf.name === 'Ciencias Sociales') {
          const socSpecifics = [
            `Estudios Históricos y Críticos de ${sub.tag} (Vol. ${i})`,
            `Perspectivas Contemporáneas de ${sub.tag} (Tomo ${i})`,
            `Memoria, Territorio y Sociedad en ${sub.tag} (Parte ${i})`,
            `Guía Documental y Didáctica de ${sub.tag} (Edición ${i})`,
          ];
          candidateTitle = socSpecifics[i % socSpecifics.length];
        } else if (catConf.name === 'Filosofía') {
          const filSpecifics = [
            `Lecturas Filosóficas sobre ${sub.tag} (Tomo ${i})`,
            `Diálogos y Controversias en ${sub.tag} (Vol. ${i})`,
            `Historia del Pensamiento: ${sub.tag} (Parte ${i})`,
            `Introducción al Debate de ${sub.tag} (Edición ${i})`,
          ];
          candidateTitle = filSpecifics[i % filSpecifics.length];
        } else if (catConf.name === 'Tecnología e Informática') {
          const tecSpecifics = [
            `Ingeniería y Desarrollo de ${sub.tag} (Vol. ${i})`,
            `Arquitectura Moderna de ${sub.tag} (Tomo ${i})`,
            `Prácticas de Programación y Diseño en ${sub.tag} (Parte ${i})`,
            `Guía del Desarrollador: ${sub.tag} (Edición ${i})`,
          ];
          candidateTitle = tecSpecifics[i % tecSpecifics.length];
        } else if (catConf.name === 'Arte y Música') {
          const artSpecifics = [
            `Gramática y Apreciación de ${sub.tag} (Vol. ${i})`,
            `Historia y Maestros de ${sub.tag} (Tomo ${i})`,
            `Taller Creativo de ${sub.tag} (Parte ${i})`,
            `Estética Visual y Sonoridades en ${sub.tag} (Edición ${i})`,
          ];
          candidateTitle = artSpecifics[i % artSpecifics.length];
        }

        // Garantizar unicidad absoluta de título
        let finalTitle = candidateTitle;
        let suffix = 1;
        while (usedTitles.has(finalTitle.toLowerCase().trim())) {
          finalTitle = `${candidateTitle} - Ejemplar ${suffix}`;
          suffix++;
        }
        usedTitles.add(finalTitle.toLowerCase().trim());

        const paddedId = String(globalCounter).padStart(4, '0');
        const idLibro = `lib-${paddedId}`;
        const isbnNumber = `${9789580000000 + globalCounter}`;
        const isbn = `978-${isbnNumber.slice(3, 6)}-${isbnNumber.slice(6, 11)}-${isbnNumber.slice(11, 13)}`;
        const estanteNum = String((globalCounter % 48) + 1).padStart(2, '0');
        const ubicacion = `${catConf.pasillo}, Estante ${estanteNum}`;

        // Generar portada física SVG determinista y 100% exclusiva
        const coverSvg = generateUniqueBookCoverSvg({
          idLibro,
          titulo: finalTitle,
          autor: author,
          categoria: catConf.name,
          editorial,
          isbn,
          anio,
        });

        usedCovers.add(coverSvg);

        books.push({
          idLibro,
          titulo: finalTitle,
          autor: author,
          editorial,
          isbn,
          anio,
          paginas,
          categoria: catConf.name,
          imagenPortada: coverSvg,
          imagen: coverSvg,
          ubicacion,
          descripcion: `${sub.desc} Autoría de ${author}, sello editorial ${editorial}. Registro de acervo #${paddedId}.`,
          estado: globalCounter % 11 === 0 ? 'Prestado' : globalCounter % 23 === 0 ? 'Reservado' : 'Disponible',
        });

        createdForCat++;
        globalCounter++;
      }
    }
  }

  return books;
}

// Ejecutar prueba y verificar
const allBooks = buildComplete1000Catalog();
console.log('Total libros generados:', allBooks.length);
const uniqueTitles = new Set(allBooks.map((b) => b.titulo.toLowerCase().trim()));
console.log('Total títulos únicos:', uniqueTitles.size);
const uniqueCovers = new Set(allBooks.map((b) => b.imagenPortada));
console.log('Total portadas únicas:', uniqueCovers.size);

const cienAnos = allBooks.filter((b) => b.titulo.toLowerCase().includes('cien años de soledad'));
console.log('Apariciones de Cien Años de Soledad:', cienAnos.length);
if (cienAnos.length === 1) {
  console.log('Portada Cien Años:', cienAnos[0].imagenPortada);
}
