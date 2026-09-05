export type TableLevel = {
  id: number;
  letters: string[];
  words: string[];
  bonusWords: string[];
};

export const tableLevels: TableLevel[] = [
  {
    id: 1,
    letters: ["م", "ا", "د", "ر"],
    words: ["ما", "دار", "مادر"],
    bonusWords: [
      "در",
      "مار",
      "رام",
      "دام",
      "مد",
      "راد",
      "را",
      "ماد",
    ],
  },

  {
    id: 2,
    letters: ["س", "ا", "ر", "ب"],
    words: ["سر", "بار", "ارس"],
    bonusWords: [
      "با",
      "بس",
      "سرب",
      "اسب",
      "سراب",
      "سار",
      "بارس",
      "راس",
    ],
  },

  {
    id: 3,
    letters: ["ب", "ا", "ز", "ی"],
    words: ["باز", "بازی", "زیبا"],
    bonusWords: [
      "با",
      "بی",
      "از",
      "ای",
      "زی",
      "زیب",
      "یاب",
      "بای",
    ],
  },

  {
    id: 4,
    letters: ["ک", "ت", "ا", "ب"],
    words: ["کت", "تاب", "کتاب"],
    bonusWords: [
      "باک",
      "تب",

      "تاک",
      "اب",
      "تک",


    ],
  },

  {
    id: 5,
    letters: ["خ", "و", "ر", "ش"],
    words: ["خور", "خوش", "خورش"],
    bonusWords: [
      "رود",
      "ور",
      "خو",
      "شور",
      "خروش",
      "روش",
      "رخ",
      "شر",
    ],
  },

  {
    id: 6,
    letters: ["ک", "ر", "م", "ز", "ت"],
    words: ["کرم", "رمز", "تمرکز", "ترمز"],
    bonusWords: [
      "کم",
      "کر",
      "مرکز",
      "رک",
      "مرز",
      "ترک",
      "متر",
      "تمر",
      "رزم",
    ],
  },

  {
    id: 7,
    letters: ["ش", "ا", "د", "ن"],
    words: ["شاد", "شنا", "ندا", "دانش"],
    bonusWords: [
      "دنا",
      "ان",
      "شن",
      "نشا",
      "شان",
      "دانا",
      "ناد",

    ],
  },

  {
    id: 8,
    letters: ["ف", "ک", "ر", "ت", "س"],
    words: ["تفکر", "فکر", "ترس", "کرفس"],
    bonusWords: [
      "سفر",
      "رفت",
      "سفت",
      "کف",
      "فک",
      "سر",
      "ترک",
      "شر",
    ],
  },

  {
    id: 9,
    letters: ["پ", "ی", "ا", "م", "ن"],
    words: ["امن", "میان", "پیام", "پیمان"],
    bonusWords: [
      "نیا",
      "پین",
      "ما",
      "ایمن",
      "نام",
      "ایمن",
      "پام",
      "نامی",
      "یمن",

    ],
  },

  {
    id: 10,
    letters: ["گ", "ه", "م", "ا", "ن"],
    words: ["نگاه", "نامه", "گام", "گناه"],
    bonusWords: [
      "هاگ",
      "نگه",
      "امن",
      "گمان",
      "هنگام",
      "هما",
      "همان",

      "منها",

      "گام",
      "هان",


    ],
  },

  {
    id: 11,
    letters: ["ب", "ه", "ا", "ر", "ن"],
    words: ["بهار", "بره", "برهان", "بنا"],
    bonusWords: [
      "اره",
      "هار",
      "ران",
      "بار",
      "نار",
      "هنر",
      "اهر",
      "رب",
      "ابر",
      "بهران",
      "رهن",
      "ابهر",
      "نهر",

    ],
  },

  {
    id: 12,
    letters: ["خ", "ا", "ن", "ه", "و"],
    words: ["خانه", "اهن", "خون", "نوا"],
    bonusWords: [
      "هوا",
      "خان",
      "نه",
      "وان",
      "اهو",
      "نوه",
      "ناو",



    ],
  },

  {
    id: 13,
    letters: ["ک", "ا", "ر", "م", "ی"],
    words: ["کار", "کریم", "مکار", "مری"],
    bonusWords: [
      "کاری",
      "رام",
      "کام",
      "کرم",
      "مکار",
      "ارم",
      "یار",
      "رای",
      "ریکا",
      "اکرم",
      "امیر",
      "امر",
      "کاری",

    ],
  },

  {
    id: 14,
    letters: ["س", "ا", "ل", "م", "ی"],
    words: ["سال", "مال", "سالم", "سلام"],
    bonusWords: [

      "ملس",
      "سم",
      "مس",
      "لام",
      "سلیم",
      "لمس",
      "یال",
      "لیس",
      "میل",
      "ملی",
      "مال",
      "مالی",
      "سیم",
      "سیما",
      "سام",

    ],
  },

  {
    id: 15,
    letters: ["ن", "ا", "ر", "ا", "ب"],
    words: ["باران", "ناب", "برنا", "بار", "بنا"],
    bonusWords: [
      "با",
      "بر",
      "نا",
      "نار",
      "ران",
      "ابر",
      "آن",
      "را",
      "بارا",
      "نابا",
    ],
  },

  {
    id: 16,
    letters: ["د", "ا", "ر", "ی", "ا"],
    words: ["دریا", "دیار", "دارا", "اداری", "یاد"],
    bonusWords: [
      "ارادی",
      "رای",
      "یار",
      "دار",
      "آری",
      "راد",
      "داری",
      "دایر",
      "ایراد",
    ],
  },
  {
    id: 17,

    letters: ["ن", "ک", "د", "ر", "ا", "م"],

    words: [
      "کارمند",
      "درمان",
      "اردک",
      "کنار",
      "مدار",
   
    ],

    bonusWords: [
      "مادر",
      "کمان",
      "دکان",
      "نمک",
      "نام",
      "دام",
      "مار",
      "کار",
      "کمد",
      "مادر",
      "مرد",
      "مکان",
      "نادم",
      "درام",
      "نرم",
      "درک",
      "کادر",
      "کارد",
    ],
  },
 
{
  id: 18,

  letters: ["م", "م", "ا", "ر", "ن", "ی"],

  words: [
    "مار",    
    "نام",    
    "مینا",   
    "ایمن",   
    "مرام",
    "مریم",

  ],

  bonusWords: [
    "نیم",
    "یار",
    "رام",
    "نای",
    "رمان",
    "نیما",
    "امن",
  
    
  ],
},
{
  id: 19,

  letters: ["ت", "د", "ی", "ر", "ی", "م"],

  words: [
    "مدیریت",
    "مدیر",
    "مرید",
    "تیر",
    "دیر",
  ],

  bonusWords: [
    "مرد",
    "دری",
    "دیم",
    "ریتم",
    "میت",
  ],
},
{
  id: 20,

  letters: ["ت", "ر", "ر", "پ", "ا", "س"],

  words: [
    "پرستار",
    "پارس",
    "سپر",
    "پرت",
    "تار",
  ],

  bonusWords: [
    "پرس",
    "رسا",
    "راست",
    "است",
    "پارت",
    "تراس",
  
  ],
},

  


];

export function getTableLevel(
  levelId: number
): TableLevel | undefined {
  return tableLevels.find(
    (level) => level.id === levelId
  );
}

export function normalizeWord(
  word: string
): string {
  return word
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, "");
}

export function checkTableWord(
  levelId: number,
  word: string
): boolean {
  const level = getTableLevel(levelId);

  if (!level) {
    return false;
  }

  const normalizedWord = normalizeWord(word);

  return level.words.some(
    (item) =>
      normalizeWord(item) === normalizedWord
  );
}

export function isBonusWord(
  levelId: number,
  word: string
): boolean {
  const level = getTableLevel(levelId);

  if (!level) {
    return false;
  }

  const normalizedWord = normalizeWord(word);

  // کلمه‌ای که در هر مرحله‌ای کلمه اصلی است،
  // هیچ‌وقت نباید به عنوان کلمه جایزه ثبت شود.
  const isMainWord = tableLevels.some(
    (item) =>
      item.words.some(
        (mainWord) =>
          normalizeWord(mainWord) ===
          normalizedWord
      )
  );

  if (isMainWord) {
    return false;
  }

  return level.bonusWords.some(
    (bonusWord) =>
      normalizeWord(bonusWord) ===
      normalizedWord
  );
}