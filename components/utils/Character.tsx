// Character.ts
export interface Character {
    _id: string;
    name: string;
    title: string;
    maxLevel: number;
    maxSALevel: number;
    rarity: string;
    class: string;
    type: string;
    cost: number;
    id: string;
    imageURL: string;
    leaderSkill: string;
    superAttack: string;
    ultraSuperAttack: string;
    passive: string;
    links: string[];
    categories: string[];
    kiMeter: string[];
    baseHP: number;
    maxLevelHP: number;
    freeDupeHP: number;
    rainbowHP: number;
    baseAttack: number;
    maxLevelAttack: number;
    freeDupeAttack: number;
    rainbowAttack: number;
    baseDefence: number;
    maxDefence: number;
    freeDupeDefence: number;
    rainbowDefence: number;
    kiMultiplier: string;
    transformations: string[];
  }
  