export type WordJar = {
    words: string[];
    coins: number;
  };
  
  export const initialWordJar: WordJar = {
    words: [],
    coins: 0,
  };
  
  export function addBonusWord(
    jar: WordJar,
    word: string
  ): WordJar {
    if (jar.words.includes(word)) {
      return jar;
    }
  
    return {
      words: [...jar.words, word],
      coins: jar.coins + 1,
    };
  }
  
  export function spendCoins(
    jar: WordJar,
    amount: number
  ): WordJar {
    if (jar.coins < amount) {
      return jar;
    }
  
    return {
      ...jar,
      coins: jar.coins - amount,
    };
  }