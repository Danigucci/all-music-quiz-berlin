// Question bank for the live quiz (live-host.html + live.html).
// The right answer is always "a", wrong ones in "w"; options are shuffled per game.
// Media lives in /live/audio (and /live/photos for a photo round) and only plays on the host screen.
// `start` is the second of the clip to start from, `gain` evens out loudness between clips (1 = as is).
// Prizes for the top 3, shown to players before the game and on the final podium.
// `logo` is a path on the site (square picture, shown in a circle).
export const PRIZES = [
  { text: 'Кальян на выбор в @shadow.berlin', logo: 'live/prizes/shadow-berlin.png' },
  { text: 'Gutschein на 20 € в баре @kvartira62', logo: 'live/prizes/kvartira62.png' },
  { text: 'Порция пельменей от @pelmennaia__berlin' },
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

// "Romantic Collection" — a second, love-themed game. Clips are live/audio/m*.mp4.
export const ROMANTIC_ROUNDS = [
  {
    id: 'love', kind: 'audio', title: 'Песни о любви',
    rule: 'Звучит фрагмент песни о любви — выбери исполнителя и название.',
    prompt: 'Что это за песня?',
    questions: [
      { media: 'live/audio/m1-01.mp4', gain: 1.06, a: 'Elvis Presley — Can\'t Help Falling in Love', w: ['Elvis Presley — Love Me Tender', 'Frank Sinatra — Strangers in the Night', 'The Platters — Only You'], info: 'Из фильма «Голубые Гавайи», 1961' },
      { media: 'live/audio/m1-02.mp4', gain: 0.89, a: 'Lionel Richie — Hello', w: ['Lionel Richie — Say You, Say Me', 'Stevie Wonder — I Just Called to Say I Love You', 'Phil Collins — Against All Odds'], info: 'Альбом «Can\'t Slow Down», 1983' },
      { media: 'live/audio/m1-03.mp4', gain: 0.82, a: 'Bryan Adams — Heaven', w: ['Bryan Adams — (Everything I Do) I Do It for You', 'Richard Marx — Right Here Waiting', 'Foreigner — I Want to Know What Love Is'], info: 'Альбом «Reckless», 1984' },
      { media: 'live/audio/m1-04.mp4', gain: 0.9, a: 'Adele — Someone Like You', w: ['Adele — Hello', 'Amy Winehouse — Back to Black', 'Sam Smith — Stay with Me'], info: 'Альбом «21», 2011' },
      { media: 'live/audio/m1-05.mp4', gain: 0.61, a: 'Bruno Mars — Just the Way You Are', w: ['Bruno Mars — When I Was Your Man', 'Jason Mraz — I\'m Yours', 'Maroon 5 — Sugar'], info: 'Альбом «Doo-Wops & Hooligans», 2010' },
      { media: 'live/audio/m1-06.mp4', gain: 0.71, a: 'John Legend — All of Me', w: ['John Legend — Ordinary People', 'James Arthur — Say You Won\'t Let Go', 'Sam Smith — I\'m Not the Only One'], info: 'Альбом «Love in the Future», 2013' },
      { media: 'live/audio/m1-07.mp4', gain: 0.84, a: 'Ed Sheeran — Perfect', w: ['Ed Sheeran — Thinking Out Loud', 'Lewis Capaldi — Someone You Loved', 'Shawn Mendes — Treat You Better'], info: 'Альбом «÷», 2017' },
      { media: 'live/audio/m1-08.mp4', gain: 1.5, a: 'Алла Пугачёва — Миллион алых роз', w: ['Алла Пугачёва — Позови меня с собой', 'София Ротару — Лаванда', 'Валерий Леонтьев — Дельтаплан'], info: 'Музыка Раймонда Паулса, слова Андрея Вознесенского' },
      { media: 'live/audio/m1-09.mp4', gain: 0.48, a: 'Звери — Всё, что тебя касается', w: ['Звери — Районы-кварталы', 'Мумий Тролль — Владивосток 2000', 'Сплин — Романс'], info: 'Роман Билык и группа «Звери»' },
      { media: 'live/audio/m1-10.mp4', gain: 0.55, a: 'Валерий Меладзе — Красиво', w: ['Валерий Меладзе — Сэра', 'Григорий Лепс — Натали', 'Леонид Агутин — Хоп хей лала лей'], info: 'Музыка и слова Константина Меладзе' },
    ],
  },
  {
    id: 'duets', kind: 'audio', title: 'Дуэты',
    rule: 'Звучит песня о любви на два голоса — угадай, кто её поёт.',
    prompt: 'Кто поёт этот дуэт?',
    questions: [
      { media: 'live/audio/m2-01.mp4', start: 3, gain: 1.28, a: 'Lady Gaga & Bradley Cooper', w: ['Lady Gaga & Tony Bennett', 'Pink & Nate Ruess', 'Miley Cyrus & Billy Ray Cyrus'], info: 'Shallow — из фильма «Звезда родилась», 2018' },
      { media: 'live/audio/m2-02.mp4', gain: 0.93, a: 'Elton John & Kiki Dee', w: ['Elton John & George Michael', 'Rod Stewart & Tina Turner', 'Paul McCartney & Stevie Wonder'], info: 'Don\'t Go Breaking My Heart, 1976' },
      { media: 'live/audio/m2-03.mp4', gain: 0.74, a: 'Marvin Gaye & Tammi Terrell', w: ['Diana Ross & Lionel Richie', 'Ike & Tina Turner', 'Sonny & Cher'], info: 'Ain\'t No Mountain High Enough, 1967' },
      { media: 'live/audio/m2-04.mp4', gain: 1.06, a: 'Dolly Parton & Kenny Rogers', w: ['Johnny Cash & June Carter', 'Shania Twain & Bryan White', 'Willie Nelson & Julio Iglesias'], info: 'Islands in the Stream, 1983 — песню написали Bee Gees' },
      { media: 'live/audio/m2-05.mp4', gain: 1.27, a: 'Céline Dion & Peabo Bryson', w: ['Céline Dion & Andrea Bocelli', 'Mariah Carey & Luther Vandross', 'Whitney Houston & Bobby Brown'], info: 'Beauty and the Beast — из мультфильма «Красавица и Чудовище», 1991' },
      { media: 'live/audio/m2-06.mp4', gain: 0.78, a: 'Rihanna & Mikky Ekko', w: ['Rihanna & Eminem', 'Rihanna & Calvin Harris', 'Selena Gomez & Kygo'], info: 'Stay, 2012' },
      { media: 'live/audio/m2-07.mp4', gain: 0.5, a: 'ZAYN & Taylor Swift', w: ['Taylor Swift & Ed Sheeran', 'Shawn Mendes & Camila Cabello', 'Harry Styles & Dua Lipa'], info: 'I Don\'t Wanna Live Forever — из фильма «На пятьдесят оттенков темнее», 2016' },
      { media: 'live/audio/m2-08.mp4', gain: 0.81, a: 'Леонид Агутин & Анжелика Варум', w: ['Филипп Киркоров & Алла Пугачёва', 'Владимир Пресняков & Наталья Подольская', 'Дмитрий Маликов & Наталья Ветлицкая'], info: 'Королева' },
      { media: 'live/audio/m2-09.mp4', gain: 0.63, a: 'Валерия & Стас Пьеха', w: ['Ани Лорак & Григорий Лепс', 'Жасмин & Стас Михайлов', 'Валерия & Иосиф Пригожин'], info: 'Ты грустишь' },
      { media: 'live/audio/m2-10.mp4', gain: 0.65, a: 'Artik & Asti', w: ['Мот & Бьянка', 'Баста & Полина Гагарина', 'Егор Крид & Нюша'], info: 'Неделимы, 2017' },
    ],
  },
  {
    id: 'romfilm', kind: 'audio', title: 'Романтическое кино',
    rule: 'Звучит песня или музыка из фильма о любви — угадай фильм.',
    prompt: 'Из какого фильма?',
    questions: [
      { media: 'live/audio/m3-01.mp4', gain: 1.04, a: 'Титаник', w: ['Пёрл-Харбор', 'Унесённые ветром', 'Великий Гэтсби'], info: 'Céline Dion — My Heart Will Go On, 1997' },
      { media: 'live/audio/m3-02.mp4', gain: 1.34, a: 'Грязные танцы', w: ['Бриолин', 'Флэшдэнс', 'Шаг вперёд'], info: 'Bill Medley & Jennifer Warnes — (I\'ve Had) The Time of My Life, 1987' },
      { media: 'live/audio/m3-03.mp4', gain: 0.89, a: 'Красотка', w: ['Сбежавшая невеста', 'Свадьба лучшего друга', 'Как отделаться от парня за 10 дней'], info: 'Roy Orbison — Oh, Pretty Woman' },
      { media: 'live/audio/m3-04.mp4', gain: 1.15, a: 'Ноттинг Хилл', w: ['Реальная любовь', 'Четыре свадьбы и одни похороны', 'Дневник Бриджит Джонс'], info: 'Elvis Costello — She, 1999' },
      { media: 'live/audio/m3-05.mp4', gain: 1.81, a: 'Привидение', w: ['Дневник памяти', 'Город ангелов', 'Офицер и джентльмен'], info: 'The Righteous Brothers — Unchained Melody' },
      { media: 'live/audio/m3-06.mp4', gain: 2.34, a: 'Телохранитель', w: ['Неспящие в Сиэтле', 'Ромео + Джульетта', 'Предложение'], info: 'Whitney Houston — I Will Always Love You, 1992' },
      { media: 'live/audio/m3-07.mp4', gain: 1.31, a: 'Ла-Ла Ленд', w: ['Звезда родилась', 'Величайший шоумен', 'Мулен Руж'], info: 'Ryan Gosling — City of Stars, 2016' },
      { media: 'live/audio/m3-08.mp4', gain: 0.76, a: 'Сумерки', w: ['Дневник памяти', 'Виноваты звёзды', 'После'], info: 'Christina Perri — A Thousand Years («Сумерки. Сага. Рассвет», 2011)' },
      { media: 'live/audio/m3-09.mp4', gain: 1.2, a: 'Амели', w: ['Вечное сияние чистого разума', '500 дней лета', 'Полночь в Париже'], info: 'Yann Tiersen — Comptine d\'un autre été, 2001' },
      { media: 'live/audio/m3-10.mp4', gain: 1.33, a: 'Москва слезам не верит', w: ['Служебный роман', 'Ирония судьбы, или С лёгким паром!', 'Покровские ворота'], info: 'Татьяна и Сергей Никитины — «Александра», 1979' },
    ],
  },
];

// "Музыка в кино" — a film-music game. Clips are live/audio/c*.mp4.
export const CINEMA_ROUNDS = [
  {
    id: 'cinehits', kind: 'audio', title: 'Хиты из фильмов',
    rule: 'Звучит песня из фильма — угадай фильм.',
    prompt: 'Из какого фильма эта песня?',
    questions: [
      { media: 'live/audio/c1-01.mp4', gain: 1.68, a: 'Охотники за привидениями', w: ['Гремлины', 'Битлджус', 'Назад в будущее'], info: 'Ray Parker Jr. — Ghostbusters, 1984' },
      { media: 'live/audio/c1-02.mp4', gain: 2.37, a: 'Рокки 3', w: ['Рэмбо: Первая кровь', 'Парень-каратист', 'Лучший стрелок'], info: 'Survivor — Eye of the Tiger, 1982' },
      { media: 'live/audio/c1-03.mp4', gain: 1.17, a: 'Лучший стрелок', w: ['Грязные танцы', 'Флэшдэнс', 'Офицер и джентльмен'], info: 'Berlin — Take My Breath Away, 1986' },
      { media: 'live/audio/c1-04.mp4', gain: 1.97, a: 'Назад в будущее', w: ['Охотники за привидениями', 'Феррис Бьюллер берёт выходной', 'Гремлины'], info: 'Huey Lewis & The News — The Power of Love, 1985' },
      { media: 'live/audio/c1-05.mp4', gain: 1.43, a: 'Свободные (Footloose)', w: ['Флэшдэнс', 'Грязные танцы', 'Бриолин'], info: 'Kenny Loggins — Footloose, 1984' },
      { media: 'live/audio/c1-06.mp4', gain: 0.74, a: 'Криминальное чтиво', w: ['Убить Билла', 'Бешеные псы', 'Однажды в… Голливуде'], info: 'Dick Dale — Misirlou' },
      { media: 'live/audio/c1-07.mp4', gain: 0.76, a: 'Холодное сердце', w: ['Рапунцель: Запутанная история', 'Моана', 'Энканто'], info: 'Idina Menzel — Let It Go, 2013' },
      { media: 'live/audio/c1-08.mp4', gain: 3.63, a: '007: Координаты «Скайфолл»', w: ['Казино «Рояль»', 'Квант милосердия', '007: Спектр'], info: 'Adele — Skyfall, 2012 — «Оскар» за лучшую песню' },
      { media: 'live/audio/c1-09.mp4', gain: 0.97, a: 'Стражи Галактики', w: ['Мстители', 'Дэдпул', 'Тор: Рагнарёк'], info: 'Blue Swede — Hooked on a Feeling' },
      { media: 'live/audio/c1-10.mp4', gain: 0.69, a: 'Барби', w: ['Дрянные девчонки', 'Блондинка в законе', 'Бедные-несчастные'], info: 'Dua Lipa — Dance the Night, 2023' },
    ],
  },
  {
    id: 'themes', kind: 'audio', title: 'Великие темы',
    rule: 'Звучит инструментальная тема — угадай фильм или сериал.',
    prompt: 'Из какого фильма или сериала?',
    questions: [
      { media: 'live/audio/c2-01.mp4', gain: 1.23, a: 'Звёздные войны', w: ['Звёздный путь', 'Супермен', 'Дюна'], info: 'John Williams — Main Title, 1977' },
      { media: 'live/audio/c2-02.mp4', gain: 5.5, a: 'Гарри Поттер', w: ['Хроники Нарнии', 'Властелин колец', 'Золотой компас'], info: 'John Williams — Hedwig\'s Theme, 2001' },
      { media: 'live/audio/c2-03.mp4', start: 3, gain: 0.88, a: 'Пираты Карибского моря', w: ['Гладиатор', 'Остров головорезов', 'Хозяин морей'], info: 'Klaus Badelt — He\'s a Pirate, 2003' },
      { media: 'live/audio/c2-04.mp4', gain: 1.78, a: 'Гладиатор', w: ['Троя', 'Царство небесное', 'Храброе сердце'], info: 'Lisa Gerrard & Hans Zimmer — Now We Are Free, 2000' },
      { media: 'live/audio/c2-05.mp4', gain: 1.93, a: 'Интерстеллар', w: ['Начало', 'Гравитация', 'Марсианин'], info: 'Hans Zimmer — Cornfield Chase, 2014' },
      { media: 'live/audio/c2-06.mp4', gain: 5.62, a: 'Форрест Гамп', w: ['Зелёная миля', 'Побег из Шоушенка', 'Изгой'], info: 'Alan Silvestri — Feather Theme, 1994' },
      { media: 'live/audio/c2-07.mp4', gain: 1.41, a: 'Терминатор', w: ['Робокоп', 'Хищник', 'Чужие'], info: 'Brad Fiedel — The Terminator Theme, 1984' },
      { media: 'live/audio/c2-08.mp4', gain: 1.2, a: 'Хороший, плохой, злой', w: ['Великолепная семёрка', 'Джанго освобождённый', 'За пригоршню долларов'], info: 'Ennio Morricone — Main Title, 1966' },
      { media: 'live/audio/c2-09.mp4', gain: 3.8, a: 'Один дома', w: ['Гринч — похититель Рождества', 'Эльф', 'Полярный экспресс'], info: 'John Williams — Somewhere in My Memory, 1990' },
      { media: 'live/audio/c2-10.mp4', gain: 1.08, a: 'Игра престолов', w: ['Викинги', 'Ведьмак', 'Властелин колец: Кольца власти'], info: 'Ramin Djawadi — Main Title, 2011' },
    ],
  },
  {
    id: 'ourfilm', kind: 'audio', title: 'Наше кино',
    rule: 'Звучит песня из советского или российского фильма — угадай фильм.',
    prompt: 'Из какого фильма эта песня?',
    questions: [
      { media: 'live/audio/c3-01.mp4', gain: 1.97, a: 'Бриллиантовая рука', w: ['Кавказская пленница', 'Операция «Ы»', 'Джентльмены удачи'], info: 'Юрий Никулин — «Песня про зайцев», 1968' },
      { media: 'live/audio/c3-02.mp4', gain: 1.22, a: 'Кавказская пленница', w: ['Бриллиантовая рука', 'Иван Васильевич меняет профессию', 'Джентльмены удачи'], info: 'Аида Ведищева — «Песенка о медведях», 1967' },
      { media: 'live/audio/c3-03.mp4', gain: 1.17, a: 'Иван Васильевич меняет профессию', w: ['Бриллиантовая рука', 'Не может быть!', 'Двенадцать стульев'], info: 'Валерий Золотухин — «Разговор со счастьем», 1973' },
      { media: 'live/audio/c3-04.mp4', gain: 1.51, a: 'Гардемарины, вперёд!', w: ['Д\'Артаньян и три мушкетёра', 'Гусарская баллада', 'Тот самый Мюнхгаузен'], info: 'Дмитрий Харатьян, Олег Анофриев — «Не вешать нос», 1987' },
      { media: 'live/audio/c3-05.mp4', gain: 1.48, a: 'Д\'Артаньян и три мушкетёра', w: ['Гардемарины, вперёд!', 'Собака на сене', 'Тот самый Мюнхгаузен'], info: '«Песня мушкетёров» (Пора-пора-порадуемся), 1979' },
      { media: 'live/audio/c3-06.mp4', gain: 1.6, a: 'Приключения Электроника', w: ['Гостья из будущего', 'Чучело', 'Усатый нянь'], info: '«Крылатые качели», 1979' },
      { media: 'live/audio/c3-07.mp4', gain: 3.67, a: 'Служебный роман', w: ['Гараж', 'Москва слезам не верит', 'Ирония судьбы, или С лёгким паром!'], info: 'Алиса Фрейндлих — «Моей душе покоя нет», 1977' },
      { media: 'live/audio/c3-08.mp4', gain: 0.44, a: 'Мимино', w: ['Кин-дза-дза!', 'Не горюй!', 'Джентльмены удачи'], info: 'Вахтанг Кикабидзе — «Чито-грито», 1977' },
      { media: 'live/audio/c3-09.mp4', gain: 1.08, a: 'Белое солнце пустыни', w: ['Неуловимые мстители', 'Свой среди чужих, чужой среди своих', 'Офицеры'], info: 'Павел Луспекаев — «Ваше благородие, госпожа Удача», 1970' },
      { media: 'live/audio/c3-10.mp4', gain: 2.45, a: 'Брат', w: ['Бумер', 'Жмурки', 'Война'], info: 'Наутилус Помпилиус — «Крылья», 1997' },
    ],
  },
];

// Games the host can open. The first one is the default.
export const SETS = [
  { id: 'cinema', title: 'Музыка в кино', rounds: CINEMA_ROUNDS },
  { id: 'main', title: 'Основная игра', rounds: ROUNDS },
  { id: 'romantic', title: 'Romantic Collection', rounds: ROMANTIC_ROUNDS },
];
