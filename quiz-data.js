// El Clásico Quiz — question bank
// Figures kept in sync with trophies.html / clasico.html / records.html / faq.html
var QUIZ_QUESTIONS = [
  {
    q: "Who has won more official trophies overall?",
    opts: ["Real Madrid (106)", "Barcelona (104)", "It's exactly tied", "Neither — both have over 120"],
    correct: 0,
    explain: "Real Madrid lead 106 to 104, largely on the strength of a record Champions League haul."
  },
  {
    q: "Who has won more La Liga titles?",
    opts: ["Barcelona, 29 to 36", "Real Madrid, 36 to 29", "Tied at 32 each", "Real Madrid, 40 to 25"],
    correct: 1,
    explain: "Real Madrid hold a 7-title edge domestically, 36 La Liga titles to Barcelona's 29."
  },
  {
    q: "Who holds the record for most Champions League / European Cup titles?",
    opts: ["Barcelona, with 9", "Real Madrid, with 15", "Real Madrid, with 11", "Barcelona, with 12"],
    correct: 1,
    explain: "Real Madrid are the competition's all-time record holder with 15 titles, including five straight from 1956–1960."
  },
  {
    q: "Which club has won more Copa del Rey titles?",
    opts: ["Barcelona, 32 to 20", "Real Madrid, 20 to 32", "Barcelona, 25 to 22", "Tied at 20 each"],
    correct: 0,
    explain: "Barcelona lead domestic cup competition, with a record 32 Copa del Rey wins to Madrid's 20."
  },
  {
    q: "As of the most recent all-time tally, what is the head-to-head Clásico win count?",
    opts: ["Barcelona lead by 10 wins", "Real Madrid lead by 6 wins", "It's level at 106 wins apiece", "Real Madrid lead by 20 wins"],
    correct: 2,
    explain: "Across 264 competitive meetings since 1902, both sides have won 106 each, with 52 draws — a dead heat."
  },
  {
    q: "What is the largest margin of victory in Clásico history?",
    opts: ["Barcelona 7–2 (1950)", "Real Madrid 11–1 (1943)", "Real Madrid 8–0 (1935)", "Barcelona 6–1 (1974)"],
    correct: 1,
    explain: "Real Madrid's 11–1 win in a 1943 Copa del Generalísimo tie remains the biggest margin either side has managed."
  },
  {
    q: "Which club was founded first?",
    opts: ["Real Madrid, in 1902", "FC Barcelona, in 1899", "They were founded the same year", "Real Madrid, in 1897"],
    correct: 1,
    explain: "FC Barcelona was founded on 29 November 1899; Real Madrid followed in 1902 (and wasn't granted the \"Real\" title until 1920)."
  },
  {
    q: "Which player's transfer between the two clubs is considered one of the most controversial in football history?",
    opts: ["Ronaldo Nazário, 2002", "Luis Figo, Barcelona to Madrid, 2000", "Luis Enrique, Madrid to Barcelona, 1996", "Michael Laudrup, 1994"],
    correct: 1,
    explain: "Luis Figo's move from Barcelona to Real Madrid in 2000 remains the fixture's most infamous crossing of the divide."
  },
  {
    q: "Which stadium has the larger official capacity?",
    opts: ["Santiago Bernabéu", "Camp Nou", "They're the same size", "Neither — both hold under 60,000"],
    correct: 1,
    explain: "Camp Nou's record attendance sits at 98,902, ahead of the Bernabéu's 78,107 recorded in 2025/26."
  },
  {
    q: "What does the fixture's name, 'El Clásico', reflect?",
    opts: ["A sponsorship deal from the 1990s", "The fixture's status as Spanish football's original, most historic rivalry", "A reference to a specific 1950s match", "The clubs' shared founding date"],
    correct: 1,
    explain: "The two clubs met as early as 1902, and by the mid-20th century the match was already known as Spanish football's classic confrontation."
  },
  {
    q: "How many defunct or discontinued competitions are counted in each club's all-time trophy total?",
    opts: ["None — only active competitions count", "Several, including the Latin Cup and Copa Eva Duarte", "Only the Latin Cup", "Only friendlies, which don't count at all"],
    correct: 1,
    explain: "The all-time totals include defunct competitions like the Latin Cup, Copa Eva Duarte / Copa de la Liga, and the Fairs Cup."
  },
  {
    q: "In UEFA Super Cup wins, how do the two clubs compare?",
    opts: ["Real Madrid lead, 6 to 5", "Barcelona lead, 8 to 4", "Tied at 6 each", "Real Madrid lead, 10 to 2"],
    correct: 0,
    explain: "Real Madrid have the narrow edge in the UEFA Super Cup, 6 wins to Barcelona's 5."
  }
];
