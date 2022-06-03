// This is just an example,
// so you can safely delete all default props below

export default {
  monster: {
    name: 'Name',
    cr: 'CR',
    proficiencyBonus: 'Proficiency Bonus',
    proficiency: {
      lockToCr: 'Lock Bonus to CR',
      unlockFromCr: 'Unlock Bonus from CR',
    },
    size: 'Size',
    hp: {
      label: 'HP',
      hd: 'HD Count',
      type: 'HD Type',
      modifier: 'HP Modifier',
      lockToSize: 'Lock Hit Die Type to Size',
      unlockFromSize: 'Unlock Hit Die Type from Size',
      lockModifier: 'Lock HP Modifier to HD and CON',
      unlockModifier: 'Unlock HP Modifier from HD and CON',
    },
    stat: {
      STR: 'STR',
      DEX: 'DEX',
      CON: 'CON',
      INT: 'INT',
      WIS: 'WIS',
      CHA: 'CHA',
    },
    setHdByCr: 'Set HD to Match CR',
    type: 'Type',
    alignment: 'Alignment',
    ac: 'AC',
    setAcByCr: 'Set AC to Match CR',
    acType: 'AC Type',
    languages: 'Languages',
    movement: {
      type: {
        label: 'Movement Type',
        walk: 'walk',
        fly: 'fly',
        burrow: 'burrow',
        climb: 'climb',
        swim: 'swim',
      },
      speed: 'Speed',
      note: 'Note',
    },
  },
  editor: {
    basics: {
      label: 'Basics',
      caption: 'Essential Monster Stats',
    },
    saves: {
      label: 'Saving Throws',
      caption: 'Monster Defenses',
    },
    speeds: {
      label: 'Speeds',
      caption: 'Move Your Monster',
    },
    proficient: 'Proficient',
    override: 'Override',
  },
}
