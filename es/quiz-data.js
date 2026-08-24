// Quiz de El Clásico — banco de preguntas
// Cifras alineadas con trophies.html / clasico.html / records.html / faq.html
var QUIZ_QUESTIONS = [
  {
    q: "¿Quién ha ganado más títulos oficiales en total?",
    opts: ["Real Madrid (106)", "Barcelona (104)", "Están exactamente igualados", "Ninguno — ambos superan los 120"],
    correct: 0,
    explain: "El Real Madrid lidera 106 a 104, apoyado sobre todo en un récord de Champions League."
  },
  {
    q: "¿Quién ha ganado más títulos de La Liga?",
    opts: ["Barcelona, 29 a 36", "Real Madrid, 36 a 29", "Empatados a 32", "Real Madrid, 40 a 25"],
    correct: 1,
    explain: "El Real Madrid tiene una ventaja de 7 títulos a nivel nacional: 36 Ligas frente a las 29 del Barcelona."
  },
  {
    q: "¿Quién posee el récord de títulos de Champions League / Copa de Europa?",
    opts: ["Barcelona, con 9", "Real Madrid, con 15", "Real Madrid, con 11", "Barcelona, con 12"],
    correct: 1,
    explain: "El Real Madrid es el máximo ganador histórico de la competición con 15 títulos, incluyendo cinco seguidos entre 1956 y 1960."
  },
  {
    q: "¿Qué club ha ganado más Copas del Rey?",
    opts: ["Barcelona, 32 a 20", "Real Madrid, 20 a 32", "Barcelona, 25 a 22", "Empatados a 20"],
    correct: 0,
    explain: "El Barcelona lidera en la competición de copa nacional, con un récord de 32 Copas del Rey frente a las 20 del Madrid."
  },
  {
    q: "Según el cómputo histórico total, ¿cómo está el balance de victorias en El Clásico?",
    opts: ["El Barcelona lidera por 10 victorias", "El Real Madrid lidera por 6 victorias", "Está igualado a 106 victorias cada uno", "El Real Madrid lidera por 20 victorias"],
    correct: 2,
    explain: "En 264 enfrentamientos oficiales desde 1902, ambos equipos han ganado 106 partidos cada uno, con 52 empates — un empate total."
  },
  {
    q: "¿Cuál es el mayor margen de victoria en la historia del Clásico?",
    opts: ["Barcelona 7–2 (1950)", "Real Madrid 11–1 (1943)", "Real Madrid 8–0 (1935)", "Barcelona 6–1 (1974)"],
    correct: 1,
    explain: "La victoria del Real Madrid por 11–1 en un partido de la Copa del Generalísimo de 1943 sigue siendo el mayor margen logrado por cualquiera de los dos equipos."
  },
  {
    q: "¿Qué club se fundó primero?",
    opts: ["Real Madrid, en 1902", "FC Barcelona, en 1899", "Se fundaron el mismo año", "Real Madrid, en 1897"],
    correct: 1,
    explain: "El FC Barcelona se fundó el 29 de noviembre de 1899; el Real Madrid le siguió en 1902 (y no recibió el título de \"Real\" hasta 1920)."
  },
  {
    q: "¿El traspaso de qué jugador entre ambos clubes se considera uno de los más polémicos de la historia del fútbol?",
    opts: ["Ronaldo Nazário, 2002", "Luis Figo, del Barcelona al Madrid, 2000", "Luis Enrique, del Madrid al Barcelona, 1996", "Michael Laudrup, 1994"],
    correct: 1,
    explain: "El traspaso de Luis Figo del Barcelona al Real Madrid en 2000 sigue siendo el cruce más infame de la frontera en este enfrentamiento."
  },
  {
    q: "¿Qué estadio tiene mayor capacidad oficial?",
    opts: ["Santiago Bernabéu", "Camp Nou", "Son del mismo tamaño", "Ninguno — ambos tienen menos de 60.000"],
    correct: 1,
    explain: "El récord de asistencia del Camp Nou es de 98.902, por delante de los 78.107 registrados en el Bernabéu en 2025/26."
  },
  {
    q: "¿Qué refleja el nombre del enfrentamiento, 'El Clásico'?",
    opts: ["Un acuerdo de patrocinio de los años 90", "El estatus del partido como la rivalidad original y más histórica del fútbol español", "Una referencia a un partido concreto de los años 50", "La fecha compartida de fundación de los clubes"],
    correct: 1,
    explain: "Los dos clubes ya se enfrentaron en 1902, y a mediados del siglo XX el partido ya era conocido como el enfrentamiento clásico del fútbol español."
  },
  {
    q: "¿Cuántas competiciones desaparecidas o descontinuadas se incluyen en el total histórico de títulos de cada club?",
    opts: ["Ninguna — solo cuentan las competiciones activas", "Varias, incluyendo la Copa Latina y la Copa Eva Duarte", "Solo la Copa Latina", "Solo amistosos, que no cuentan en absoluto"],
    correct: 1,
    explain: "Los totales históricos incluyen competiciones desaparecidas como la Copa Latina, la Copa Eva Duarte / Copa de la Liga y la Copa de Ferias."
  },
  {
    q: "En títulos de la Supercopa de la UEFA, ¿cómo se comparan ambos clubes?",
    opts: ["El Real Madrid lidera, 6 a 5", "El Barcelona lidera, 8 a 4", "Empatados a 6 cada uno", "El Real Madrid lidera, 10 a 2"],
    correct: 0,
    explain: "El Real Madrid tiene una ligera ventaja en la Supercopa de la UEFA, 6 títulos frente a los 5 del Barcelona."
  }
];
