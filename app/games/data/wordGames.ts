
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
    bonusWords: ["در", "مار", "رام", "دام", "مد"],
  },
  {
    id: 2,
    letters: ["س", "ا", "ر", "ت"],
    words: ["سر", "راس", "است"],
    bonusWords: ["را", "رس", "تا", "تار", "رسا"],
  },
  {
    id: 3,
    letters: ["ب", "ا", "ز", "ی"],
    words: ["باز", "بازی", "زی"],
    bonusWords: ["با", "بی", "از", "ای", "زیب"],
  },
  {
    id: 4,
    letters: ["ک", "ت", "ا", "ب"],
    words: ["کت", "تاب", "کتاب"],
    bonusWords: ["با", "تا", "تب", "کات", "تاک"],
  },
  {
    id: 5,
    letters: ["خ", "و", "ر", "ش"],
    words: ["خور", "روش", "خورش"],
    bonusWords: ["رو", "ور", "خو", "رش", "خوش"],
  },
];

export function getTableLevel(
  levelId: number
): TableLevel | undefined {
  return tableLevels.find(
    (level) => level.id === levelId
  );
}

export function checkTableWord(
  levelId: number,
  word: string
): boolean {
  const level = getTableLevel(levelId);

  if (!level) {
    return false;
  }

  return level.words.includes(word);
}

export function isBonusWord(
  levelId: number,
  word: string
): boolean {
  const level = getTableLevel(levelId);

  if (!level) {
    return false;
  }

  return level.bonusWords.includes(word);
}
