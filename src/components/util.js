import DICE from '../data/DICE';
import DAMAGE_TYPE from '../data/DAMAGE_TYPE';
import { RANGE } from '../data/ATTACK';
import { v4 as uuidv4 } from 'uuid';
import { AT_WILL_DEFAULT_RATES } from '../data/SPELLS';
import SKILL from '../data/SKILL';
import MOVEMENT from '../data/MOVEMENT';
import STAT from '../data/STAT';
import _ from 'lodash';

export const SAVE_VERSION = 1;

export function avgHP(HP) {
  return Math.floor(HP.HD * ((HP.type + 1) / 2) + HP.modifier);
}

export function avgRoll(count, dice) {
  if (dice === 1) return count;

  return Math.floor(count * ((dice + 1) / 2));
}

export function statModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function renderModifier(score) {
  return renderBonus(statModifier(score));
}

export function isNumber(value) {
  return !isNaN(parseInt(value)) ? true : 'Not a Number';
}

export function saveModifier(score, proficiency) {
  return statModifier(score) + proficiency;
}

export function renderBonus(number, spaces = false) {
  return `${spaces ? ' ' : ''}${number >= 0 ? '+' : ''}${
    spaces ? ' ' : ''
  }${number}`;
}

export function newAttackAdditionalDamage() {
  return {
    id: uuidv4(),
    dice: DICE.d6,
    count: 1,
    type: DAMAGE_TYPE.FIRE,
    note: '',
  };
}

export function newMonster() {
  return {
    name: 'My New Monster',
    saveVersion: SAVE_VERSION,
    size: 'Medium',
    type: 'humanoid',
    alignment: '',
    AC: 10,
    ACType: '',
    CR: 0,
    proficiency: 4,
    HP: {
      HD: 1,
      type: DICE.d6,
      modifier: 0,
    },
    speeds: [
      {
        id: uuidv4(),
        type: MOVEMENT.WALK,
        speed: 30,
        note: '',
      },
    ],
    stats: {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 12,
      WIS: 10,
      CHA: 10,
    },
    saves: {
      STR: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      DEX: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      CON: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      INT: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      WIS: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      CHA: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
    },
    skills: [
      {
        skill: SKILL.PERCEPTION,
        proficient: false,
        override: false,
        overrideValue: 0,
      },
    ],
    resistances: [],
    immunities: [],
    vulnerabilities: [],
    conditions: [],
    senses: {
      blindsight: 0,
      darkvision: 0,
      tremorsense: 0,
      truesight: 0,
    },
    passivePerception: {
      override: false,
      overrideValue: 0,
    },
    languages: '',
    attacks: [],
    multiattacks: [],
    spellcasting: {
      stat: STAT.INT,
      save: {
        override: false,
        overrideValue: 0,
      },
      modifier: {
        override: false,
        overrideValue: 0,
      },
      attack: {
        override: false,
        overrideValue: 0,
      },
      class: '',
      level: 1,
      slots: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      atWill: [],
      standard: [],
      notes: '',
      atWillNotes: '',
    },
    traits: [],
    actions: [],
    legendaryActions: {
      count: 0,
      actions: [],
    },
    reactions: [],
  };
}

export function newAttack() {
  return {
    name: 'New Attack',
    id: uuidv4(),
    distance: RANGE.MELEE,
    kind: 'Weapon',
    modifier: {
      override: false,
      overrideValue: 0,
      stat: 'STR',
      proficient: true,
    },
    range: {
      standard: 0,
      long: 0,
      reach: 5,
    },
    targets: 1,
    damage: {
      dice: DICE.d8,
      count: 1,
      modifier: {
        override: false,
        overrideValue: 0,
        stat: 'STR',
      },
      type: DAMAGE_TYPE.SLASHING,
    },
    alternateDamage: {
      dice: DICE.d10,
      count: 1,
      modifier: {
        override: false,
        overrideValue: 0,
        stat: 'STR',
      },
      type: DAMAGE_TYPE.SLASHING,
      condition: '',
      active: false,
    },
    additionalDamage: [],
    save: 0,
    description: '',
    legendaryOnly: false,
  };
}

export function newTrait() {
  return {
    name: 'New Trait',
    id: uuidv4(),
    description: '',
    limitedUse: {
      count: 0,
      rate: AT_WILL_DEFAULT_RATES.DAY,
    },
    crAnnotation: {
      maxDamage: 0,
      maxSave: 0,
      maxModifier: 0,
      bonusModifier: 0,
      multitarget: false,
      ehpMultiplier: 1,
      ehpModifier: 0,
      acModifier: 0,
      include: true,
    },
  };
}

export function newAction() {
  return {
    name: 'New Action',
    id: uuidv4(),
    description: '',
    recharge: '',
    legendaryOnly: false,
    limitedUse: {
      count: 0,
      rate: AT_WILL_DEFAULT_RATES.DAY,
    },
    crAnnotation: {
      maxDamage: 0,
      maxSave: 0,
      maxModifier: 0,
      bonusModifier: 0,
      multitarget: false,
      ehpMultiplier: 1,
      ehpModifier: 0,
      acModifier: 0,
      include: true,
    },
  };
}

export function newReaction() {
  return {
    name: 'New Reaction',
    id: uuidv4(),
    description: '',
  };
}

export function listJoin(list, sep) {
  if (list.length === 1) return list;

  const part1 = list.slice(0, list.length - 1).join(sep);
  return `${part1}, and ${list[list.length - 1]}`;
}

function download(content, fileName, contentType) {
  var a = document.createElement('a');
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export function saveJSON(data, filename) {
  download(JSON.stringify(data), filename, 'text/json');
}

export function attackTemplateSubtitle(template) {
  // displays a quick damage summary
  const altDamage = `${template.alternateDamage.count}d${template.alternateDamage.dice} + ${template.alternateDamage.modifier.stat} ${template.alternateDamage.type}`;
  const plusDamage = template.additionalDamage
    .map((ad) => `${ad.count}d${ad.dice} ${ad.type}`)
    .join(', ');
  return `${template.distance} ${template.kind}. ${template.damage.count}d${
    template.damage.dice
  } + ${template.damage.modifier.stat} ${template.damage.type}${
    template.alternateDamage.active ? ` / ${altDamage}` : ''
  }${template.additionalDamage.length > 0 ? ` plus ${plusDamage}` : ''}.`;
}

export function cloneFromTemplate(template) {
  const obj = _.cloneDeep(template);
  
  // delete template stuff
  delete obj.templateName;
  delete obj.icon;
  delete obj.subtitle;
  
  // add id
  obj.id = uuidv4();

  // return instance
  return obj;
}