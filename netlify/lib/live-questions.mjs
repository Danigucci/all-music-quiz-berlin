// Question bank for the live quiz (live-host.html + live.html).
// The right answer is always "a", wrong ones in "w"; options are shuffled per game.
// Media lives in /live/audio (and /live/photos for a photo round) and only plays on the host screen.
// `start` is the second of the clip to start from, `gain` evens out loudness between clips (1 = as is).
// Prizes for the top 3, shown to players before the game and on the final podium.
// `logo` is a path on the site (square picture, shown in a circle).
export const PRIZES = [
  { text: 'Gutschein на 30 € от @khinkali_station', logo: 'live/prizes/khinkali-station.png' },
  { text: 'Кальян на выбор в @shadow.berlin', logo: 'live/prizes/shadow-berlin.png' },
  { text: 'Gutschein на 20 € в баре @kvartira62', logo: 'live/prizes/kvartira62.png' },
];

export const ROUNDS = [
  {
    id: 'hits', kind: 'audio', title: 'Угадай хит',
    rule: 'Звучит фрагмент песни — выбери исполнителя и название.',
    prompt: 'Что это за песня?',
    questions: [
      { media: 'live/audio/r1-01.mp4', gain: 1.68, a: 'Queen — Bohemian Rhapsody', w: ['Queen — Somebody to Love', 'Led Zeppelin — Stairway to Heaven', 'The Beatles — Hey Jude'], info: 'Альбом «A Night at the Opera», 1975' },
      { media: 'live/audio/r1-02.mp4', gain: 0.97, a: 'Madonna — Like a Prayer', w: ['Madonna — La Isla Bonita', 'Cyndi Lauper — Time After Time', 'Whitney Houston — I Wanna Dance with Somebody'], info: 'Альбом «Like a Prayer», 1989' },
      { media: 'live/audio/r1-03.mp4', gain: 0.97, a: 'Eminem — Lose Yourself', w: ['Eminem — Without Me', '50 Cent — In da Club', 'Jay-Z — 99 Problems'], info: 'Саундтрек к фильму «8 миля», 2002' },
      { media: 'live/audio/r1-04.mp4', gain: 0.72, a: 'Britney Spears — Toxic', w: ['Britney Spears — Oops!… I Did It Again', 'Christina Aguilera — Dirrty', 'Kylie Minogue — Can\'t Get You Out of My Head'], info: 'Альбом «In the Zone», 2003' },
      { media: 'live/audio/r1-05.mp4', gain: 0.97, a: 'Coldplay — Viva la Vida', w: ['Coldplay — Clocks', 'The Killers — Mr. Brightside', 'OneRepublic — Counting Stars'], info: 'Альбом «Viva la Vida or Death and All His Friends», 2008' },
      { media: 'live/audio/r1-06.mp4', start: 16, gain: 0.43, a: 'Billie Eilish — bad guy', w: ['Billie Eilish — bury a friend', 'Lorde — Royals', 'Dua Lipa — New Rules'], info: 'Альбом «When We All Fall Asleep, Where Do We Go?», 2019' },
      { media: 'live/audio/r1-07.mp4', gain: 0.79, a: 'Руки Вверх! — Он тебя целует', w: ['Руки Вверх! — Крошка моя', 'Иванушки International — Кукла', 'Отпетые мошенники — Девушки бывают разные'], info: 'Альбом «Конец попсе, танцуют все», 2002' },
      { media: 'live/audio/r1-08.mp4', gain: 0.84, a: 'Ленинград — Мне бы в небо', w: ['Ленинград — WWW', 'Сектор Газа — 30 лет', 'Король и Шут — Кукла колдуна'], info: 'Альбом «Пираты XXI века», 2002' },
      { media: 'live/audio/r1-09.mp4', gain: 0.69, a: 'Сплин — Выхода нет', w: ['Сплин — Орбит без сахара', 'Би-2 — Серебро', 'Мумий Тролль — Утекай'], info: 'Альбом «Гранатовый альбом», 1998' },
      { media: 'live/audio/r1-10.mp4', start: 18, gain: 0.95, a: 'Иванушки International — Тополиный пух', w: ['Иванушки International — Тучи', 'Руки Вверх! — Студент', 'Hi-Fi — Не дано'], info: 'Альбом «Об этом я буду кричать всю ночь», 1998' },
    ],
  },
  {
    id: 'euro', kind: 'audio', title: 'Евровидение',
    rule: 'Звучит песня с Евровидения — угадай, какую страну она представляла.',
    prompt: 'Какую страну представляла эта песня?',
    questions: [
      { media: 'live/audio/r2-01.mp4', gain: 0.73, a: 'Швеция', w: ['Норвегия', 'Дания', 'Великобритания'], info: 'ABBA — Waterloo. Победа в 1974 году' },
      { media: 'live/audio/r2-02.mp4', gain: 0.79, a: 'Финляндия', w: ['Швеция', 'Норвегия', 'Германия'], info: 'Lordi — Hard Rock Hallelujah. Победа в 2006 году' },
      { media: 'live/audio/r2-03.mp4', gain: 0.63, a: 'Россия', w: ['Украина', 'Беларусь', 'Азербайджан'], info: 'Дима Билан — Believe. Победа в 2008 году' },
      { media: 'live/audio/r2-04.mp4', gain: 0.78, a: 'Норвегия', w: ['Беларусь', 'Швеция', 'Россия'], info: 'Alexander Rybak — Fairytale. Победа в 2009 году' },
      { media: 'live/audio/r2-05.mp4', gain: 0.56, a: 'Германия', w: ['Австрия', 'Швейцария', 'Дания'], info: 'Lena — Satellite. Победа в 2010 году' },
      { media: 'live/audio/r2-06.mp4', gain: 0.86, a: 'Австрия', w: ['Германия', 'Нидерланды', 'Швеция'], info: 'Conchita Wurst — Rise Like a Phoenix. Победа в 2014 году' },
      { media: 'live/audio/r2-07.mp4', gain: 0.68, a: 'Израиль', w: ['Кипр', 'Греция', 'Мальта'], info: 'Netta — Toy. Победа в 2018 году' },
      { media: 'live/audio/r2-08.mp4', gain: 1.06, a: 'Нидерланды', w: ['Бельгия', 'Великобритания', 'Ирландия'], info: 'Duncan Laurence — Arcade. Победа в 2019 году' },
      { media: 'live/audio/r2-09.mp4', gain: 0.45, a: 'Италия', w: ['Испания', 'Франция', 'Сан-Марино'], info: 'Måneskin — Zitti e buoni. Победа в 2021 году' },
      { media: 'live/audio/r2-10.mp4', gain: 0.49, a: 'Украина', w: ['Россия', 'Молдова', 'Польша'], info: 'Верка Сердючка — Dancing Lasha Tumbai. Второе место в 2007 году' },
    ],
  },
  {
    id: 'film', kind: 'audio', title: 'Музыка в кино',
    rule: 'Звучит саундтрек — угадай фильм или сериал.',
    prompt: 'Из какого фильма или сериала?',
    questions: [
      { media: 'live/audio/r3-01.mp4', gain: 1.13, a: 'Миссия невыполнима', w: ['Идентификация Борна', 'Одиннадцать друзей Оушена', 'Шпионские игры'], info: 'Lalo Schifrin — Mission: Impossible' },
      { media: 'live/audio/r3-02.mp4', gain: 0.83, a: 'Джеймс Бонд', w: ['Остин Пауэрс', 'Шерлок Холмс', 'Kingsman'], info: 'John Barry — James Bond Theme («Доктор Ноу», 1962)' },
      { media: 'live/audio/r3-03.mp4', gain: 1.82, a: 'Индиана Джонс', w: ['Звёздные войны', 'Супермен', 'Назад в будущее'], info: 'John Williams — Raiders March' },
      { media: 'live/audio/r3-04.mp4', start: 4, gain: 6, a: 'Парк Юрского периода', w: ['Инопланетянин', 'Кинг-Конг', 'Аватар'], info: 'John Williams — Theme from Jurassic Park' },
      { media: 'live/audio/r3-05.mp4', gain: 0.97, a: 'Розовая пантера', w: ['Семейка Аддамс', 'Завтрак у Тиффани', 'Операция «Ы»'], info: 'Henry Mancini — The Pink Panther Theme' },
      { media: 'live/audio/r3-06.mp4', gain: 0.89, a: 'Крёстный отец', w: ['Однажды в Америке', 'Лицо со шрамом', 'Славные парни'], info: 'Nino Rota — Love Theme from The Godfather' },
      { media: 'live/audio/r3-07.mp4', gain: 0.62, a: 'Шрек', w: ['Ледниковый период', 'Мадагаскар', 'История игрушек'], info: 'Smash Mouth — All Star' },
      { media: 'live/audio/r3-08.mp4', gain: 3.11, a: 'Король Лев', w: ['Тарзан', 'Книга джунглей', 'Покахонтас'], info: 'Carmen Twillie, Lebo M — Circle of Life' },
      { media: 'live/audio/r3-09.mp4', gain: 1.17, a: 'Ирония судьбы, или С лёгким паром!', w: ['Служебный роман', 'Москва слезам не верит', 'Карнавальная ночь'], info: 'Сергей Никитин — «Если у вас нету тёти» (музыка М. Таривердиева)' },
      { media: 'live/audio/r3-10.mp4', gain: 0.97, a: 'Бригада', w: ['Бумер', 'Брат 2', 'Бандитский Петербург'], info: 'Алексей Шелыгин — «Бригада (Пролог)»' },
    ],
  },
];
