// subtypes used in various parts of the monster
export interface DndDice {
  HD: number;
  type: number;
  modifier: number;
}

// the big one is the monster definition
export interface Monster {
  name: string;
  saveVersion: number;
  size: string;
  type: string;
  alignment: string;
  AC: number;
  ACType: string;
  CR: number;
  proficiency: 4;
  HP: DndDice;
  stats: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
}
