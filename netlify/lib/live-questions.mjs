// Question bank for the live quiz (live-host.html + live.html).
// The right answer is always "a", wrong ones in "w"; options are shuffled per game.
// Media lives in /live/audio and /live/photos and is only shown on the host screen.
export const ROUNDS = [
  {
    id: 'hits', kind: 'audio', title: 'Угадай хит',
    rule: 'Звучит фрагмент песни — выбери исполнителя и название.',
    prompt: 'Что это за песня?',
    questions: [
      { media: 'live/audio/r1-01.mp4', a: 'Nirvana — Smells Like Teen Spirit', w: ['Pearl Jam — Alive', 'Red Hot Chili Peppers — Californication', 'Foo Fighters — Everlong'], info: 'Альбом «Nevermind», 1991' },
      { media: 'live/audio/r1-02.mp4', a: 'Michael Jackson — Billie Jean', w: ['Michael Jackson — Beat It', 'Prince — Kiss', 'George Michael — Faith'], info: 'Альбом «Thriller», 1982' },
      { media: 'live/audio/r1-03.mp4', a: 'Кино — Группа крови', w: ['Кино — Звезда по имени Солнце', 'Алиса — Трасса Е95', 'ДДТ — Что такое осень'], info: 'Альбом «Группа крови», 1988' },
      { media: 'live/audio/r1-04.mp4', a: 'Земфира — Хочешь?', w: ['Земфира — Искала', 'Сплин — Выхода нет', 'Ночные Снайперы — 31-я весна'], info: 'Альбом «Прости меня моя любовь», 2000' },
      { media: 'live/audio/r1-05.mp4', a: 'The Weeknd — Blinding Lights', w: ['The Weeknd — Save Your Tears', "Dua Lipa — Don't Start Now", 'Harry Styles — As It Was'], info: 'Альбом «After Hours», 2019' },
      { media: 'live/audio/r1-06.mp4', a: 'ABBA — Dancing Queen', w: ['ABBA — Mamma Mia', 'Boney M. — Rasputin', "Bee Gees — Stayin' Alive"], info: 'Альбом «Arrival», 1976' },
      { media: 'live/audio/r1-07.mp4', a: 't.A.T.u. — Нас не догонят', w: ['t.A.T.u. — Я сошла с ума', "Глюк'oZa — Невеста", 'ВИА Гра — Попытка №5'], info: 'Альбом «200 по встречной», 2001' },
      { media: 'live/audio/r1-08.mp4', a: 'The White Stripes — Seven Nation Army', w: ['The Black Keys — Lonely Boy', 'Arctic Monkeys — Do I Wanna Know?', 'The Strokes — Last Nite'], info: 'Альбом «Elephant», 2003' },
      { media: 'live/audio/r1-09.mp4', a: 'Мумий Тролль — Утекай', w: ['Мумий Тролль — Владивосток 2000', 'Сплин — Орбит без сахара', 'Би-2 — Моя любовь'], info: 'Альбом «Морская», 1997' },
      { media: 'live/audio/r1-10.mp4', a: 'Би-2 — Полковнику никто не пишет', w: ['Би-2 — Мой рок-н-ролл', 'Сплин — Моё сердце', 'Мумий Тролль — Невеста?'], info: 'Альбом «Би-2», 2000' },
    ],
  },
  {
    id: 'kids', kind: 'photo', title: 'Звёзды в детстве',
    rule: 'Детское фото музыканта — узнай, кто вырос из этого ребёнка.',
    prompt: 'Кто это?',
    questions: [
      { media: 'live/photos/r2-01.jpg', a: 'Бейонсе', w: ['Алиша Киз', 'Келли Роуленд', 'Бренди'], info: "В 9 лет попала в девичью группу Girl's Tyme, из которой потом выросли Destiny's Child." },
      { media: 'live/photos/r2-02.jpg', a: 'Дрейк', w: ['The Weeknd', 'Канье Уэст', 'Крис Браун'], info: 'До музыки снимался в канадском молодёжном сериале «Деграсси: Следующее поколение».' },
      { media: 'live/photos/r2-03.jpg', a: 'Майли Сайрус', w: ['Селена Гомес', 'Деми Ловато', 'Хилари Дафф'], info: 'Дочь кантри-певца Билли Рэя Сайруса. При рождении её назвали Destiny Hope.' },
      { media: 'live/photos/r2-04.jpg', a: 'Рианна', w: ['Ники Минаж', 'Сиара', 'Джанет Джексон'], info: 'Родилась в 1988 году на Барбадосе, в 16 лет переехала в США ради контракта.' },
      { media: 'live/photos/r2-05.jpg', a: 'Тейлор Свифт', w: ['Кэти Перри', 'Кеша', 'Аврил Лавин'], info: 'Детство провела на рождественской ёлочной ферме в Пенсильвании.' },
      { media: 'live/photos/r2-06.jpg', a: 'Алсу', w: ['Юлия Савичева', 'Жасмин', 'Анжелика Варум'], info: 'Родилась в Бугульме в 1983 году, а в 16 лет взяла второе место на Евровидении.' },
      { media: 'live/photos/r2-07.jpg', a: 'Джиган', w: ['Тимати', 'Баста', 'Гуф'], info: 'Настоящее имя — Денис Устименко-Вайнштейн, родился в Одессе.' },
      { media: 'live/photos/r2-08.jpg', a: 'Дмитрий Маликов', w: ['Николай Басков', 'Филипп Киркоров', 'Валерий Меладзе'], info: 'Окончил Московскую консерваторию по классу фортепиано.' },
      { media: 'live/photos/r2-09.jpg', a: 'Егор Крид', w: ['Макс Барских', 'Дима Билан', 'Джарахов'], info: 'Настоящая фамилия — Булаткин, родился в Пензе в 1994 году.' },
      { media: 'live/photos/r2-10.jpg', a: 'Земфира', w: ['Диана Арбенина', 'Светлана Сурганова', 'Мара'], info: 'Родилась в Уфе, в юности была капитаном юниорской сборной России по баскетболу.' },
    ],
  },
  {
    id: 'film', kind: 'audio', title: 'Музыка в кино',
    rule: 'Звучит саундтрек — угадай фильм или сериал.',
    prompt: 'Из какого фильма или сериала?',
    questions: [
      { media: 'live/audio/r3-01.mp4', a: 'Звёздные войны', w: ['Звёздный путь', 'Супермен', 'Дюна'], info: 'John Williams — Star Wars (Main Theme)' },
      { media: 'live/audio/r3-02.mp4', a: 'Гарри Поттер', w: ['Хроники Нарнии', 'Один дома', 'Властелин колец'], info: "John Williams — Hedwig's Theme" },
      { media: 'live/audio/r3-03.mp4', a: 'Пираты Карибского моря', w: ['Гладиатор', 'Хозяин морей', 'Код да Винчи'], info: "Klaus Badelt — He's a Pirate" },
      { media: 'live/audio/r3-04.mp4', a: 'Титаник', w: ['Телохранитель', 'Армагеддон', 'Пёрл-Харбор'], info: 'Céline Dion — My Heart Will Go On' },
      { media: 'live/audio/r3-05.mp4', a: 'Игра престолов', w: ['Викинги', 'Ведьмак', 'Властелин колец: Кольца власти'], info: 'Ramin Djawadi — Main Title' },
      { media: 'live/audio/r3-06.mp4', a: 'Криминальное чтиво', w: ['Убить Билла', 'Бешеные псы', 'Карты, деньги, два ствола'], info: 'Dick Dale — Misirlou' },
      { media: 'live/audio/r3-07.mp4', a: 'Рокки', w: ['Лучший стрелок', 'Парень-каратист', 'Бойцовский клуб'], info: 'Bill Conti — Gonna Fly Now' },
      { media: 'live/audio/r3-08.mp4', a: 'Гостья из будущего', w: ['Приключения Электроника', 'Чародеи', 'Кин-дза-дза!'], info: 'Е. Крылатов, Ю. Энтин — Прекрасное далёко' },
      { media: 'live/audio/r3-09.mp4', a: 'Бриллиантовая рука', w: ['Кавказская пленница', 'Джентльмены удачи', 'Иван Васильевич меняет профессию'], info: 'Андрей Миронов — Остров невезения' },
      { media: 'live/audio/r3-10.mp4', a: 'Охотники за привидениями', w: ['Назад в будущее', 'Гремлины', 'Люди в чёрном'], info: 'Ray Parker Jr. — Ghostbusters' },
    ],
  },
];
