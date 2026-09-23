const gameResults = {
  game1: [
    { place: 1, team: 'Sukafrukty', t1: 16, t2: 13, t3: 14, sum3: 43, t4: 14, t5: 12, t6: 17, sum6: 86, t7: 20, total: 106 },
    { place: 2, team: 'Не знали, но не забыли', t1: 16, t2: 13, t3: 12, sum3: 41, t4: 12, t5: 11, t6: 14, sum6: 76, t7: 14, total: 90 },
    { place: 3, team: 'Молодежь', t1: 14, t2: 11, t3: 8, sum3: 33, t4: 11, t5: 11, t6: 12, sum6: 67, t7: 13, total: 80 },
    { place: 4, team: 'В яблочко', t1: 16, t2: 9, t3: 8, sum3: 33, t4: 12, t5: 10, t6: 15, sum6: 70, t7: 10, total: 80 },
    { place: 5, team: 'Давай Попозже', t1: 16, t2: 11, t3: 10, sum3: 37, t4: 9, t5: 11, t6: 9, sum6: 67, t7: 7, total: 74 },
    { place: 6, team: 'Бублики', t1: 13, t2: 10, t3: 9, sum3: 32, t4: 11, t5: 9, t6: 12, sum6: 62, t7: 10, total: 72 },
    { place: 7, team: 'Джон Мамкович', t1: 8, t2: 6, t3: 10, sum3: 24, t4: 11, t5: 10, t6: 9, sum6: 48, t7: 7, total: 55 },
    { place: 9, team: 'Дельфины Дона Симона', t1: 7, t2: 8, t3: 7, sum3: 22, t4: 8, t5: 8, t6: 9, sum6: 45, t7: 7, total: 52 },
    { place: 10, team: 'Вопросы но не повторяются', t1: 10, t2: 7, t3: 8, sum3: 25, t4: 8, t5: 8, t6: 9, sum6: 47, t7: 5, total: 52 },
    { place: 10, team: 'Бюро тефтелек', t1: 11, t2: 5, t3: 4, sum3: 20, t4: 8, t5: 7, t6: 8, sum6: 43, t7: 5, total: 48 },
    { place: 11, team: 'Медведь на ухо наступил', t1: 7, t2: 6, t3: 4, sum3: 17, t4: 5, t5: 8, t6: 8, sum6: 31, t7: 8, total: 39 },
  ],
  game2: [
    { place: 1, team: 'Джон Мамкович', t1: 6, t2: 11, t3: 4, sum3: 21, t4: 5, t5: 6, t6: 9, sum6: 41, t7: 18, total: 59 },
    { place: 2, team: 'Молодежь', t1: 10, t2: 6, t3: 7, sum3: 23, t4: 6, t5: 5, t6: 8, sum6: 42, t7: 9, total: 51 },
    { place: 3, team: 'Давай Попозже', t1: 8, t2: 10, t3: 6, sum3: 24, t4: 5, t5: 7, t6: 9, sum6: 45, t7: 4, total: 49 },
    { place: 4, team: 'Майкл Джордан', t1: 11, t2: 9, t3: 5, sum3: 25, t4: 3, t5: 5, t6: 5, sum6: 38, t7: 6, total: 44 },
    { place: 5, team: 'Бублики', t1: 12, t2: 4, t3: 4, sum3: 20, t4: 5, t5: 4, t6: 8, sum6: 37, t7: 2, total: 39 },
    { place: 6, team: 'Руки мам!', t1: 6, t2: 4, t3: 4, sum3: 14, t4: 3, t5: 4, t6: 7, sum6: 28, t7: 9, total: 37 },
    { place: 7, team: 'Бюро тефтелек', t1: 5, t2: 2, t3: 4, sum3: 11, t4: 2, t5: 2, t6: 6, sum6: 21, t7: 6, total: 27 },
    { place: 8, team: 'В яблочко', t1: 9, t2: 5, t3: 7, sum3: 21, t4: 5, t5: 5, t6: 4, sum6: 35, t7: -32, total: 3 },
  ],
  game3: null,
  game4: null,
  game5: null,
  game6: null,
  game7: null,
  game8: null,
  game9: null,
  game10: null,
};

const gameMeta = {
  game1: { n: 1, date: '08.09.2026', name: '2010-2025 lite' },
  game2: { n: 2, date: '17.09.2026', name: '90е и 00е' },
  game3: { n: 3, date: '01.10.2026', name: 'music mix' },
  game4: { n: 4, date: '15.10.2026', name: 'Всё на А' },
  game5: { n: 5, date: '29.10.2026', name: 'Halloween Music Party' },
  game6: { n: 6, date: '12.11.2026', name: 'Romantik Collection' },
  game7: { n: 7, date: '26.11.2026', name: 'Музыка в кино' },
  game8: { n: 8, date: '10.12.2026', name: 'Музыкальный алфавит' },
  game9: { n: 9, date: '22.12.2026', name: 'Вокруг света' },
  game10: { n: 10, date: '29.12.2026', name: 'Новогодний музыкальный микс' },
};

const seasons = [
  { id: 'autumn', name: 'Осень', period: 'сентябрь — ноябрь 2026', icon: 'fa-leaf', games: ['game1','game2','game3','game4','game5','game6','game7'], finalGame: 'game7' },
  { id: 'winter', name: 'Зима', period: 'декабрь 2026 — февраль 2027', icon: 'fa-snowflake', games: ['game8','game9','game10'], finalGame: null },
  { id: 'spring', name: 'Весна', period: 'март — май 2027', icon: 'fa-seedling', games: [], finalGame: null },
  { id: 'summer', name: 'Лето', period: 'июнь — август 2027', icon: 'fa-sun', games: [], finalGame: null },
];

// Fill in a Spotify playlist URL (e.g. https://open.spotify.com/playlist/XXXX) once it exists for a game.
const gamePlaylists = {
  game1: null,
  game2: null,
  game3: null,
  game4: null,
  game5: null,
  game6: null,
  game7: null,
  game8: null,
  game9: null,
  game10: null,
};
