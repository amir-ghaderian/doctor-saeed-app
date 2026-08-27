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
    bonusWords: ["در", "دام", "مار", "رام", "مدار"],
  },
  {
    id: 2,
    letters: ["س", "ا", "ر", "ت"],
    words: ["سر", "است", "راست"],
    bonusWords: ["را", "رس", "سار", "تار", "رسا"],
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