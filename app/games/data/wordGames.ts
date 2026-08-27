export type TableLevel = {
    id: number;
    letters: string[];
    words: string[];
  };
  
  export const tableLevels: TableLevel[] = [
    {
        id: 1,
        letters: ["م", "ا", "د", "ر"],
        words: ["ما", "در", "دار", "مادر"],
      },
  ];
  
  export function getTableLevel(levelId: number): TableLevel | undefined {
    return tableLevels.find((level) => level.id === levelId);
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