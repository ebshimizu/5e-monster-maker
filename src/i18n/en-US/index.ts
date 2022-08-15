export default {
  app: {
    name: '5e Monster Maker',
  },
  monster: {
    name: 'Name',
    cr: 'CR',
    challenge: 'Challenge',
    proficiencyBonus: 'Proficiency Bonus',
    proficiency: {
      lockToCr: 'Lock Bonus to CR',
      unlockFromCr: 'Unlock Bonus from CR',
    },
    size: 'Size',
    hp: {
      label: 'HP',
      full: 'Hit Points',
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
    saves: 'Saving Throws',
    skills: 'Skills',
    setHdByCr: 'Set HD to Match CR',
    type: 'Type',
    alignment: 'Alignment',
    ac: 'AC',
    armorClass: 'Armor Class',
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
    resistances: 'Damage Resistances',
    immunities: 'Damage Immunities',
    vulnerabilities: 'Damage Vulnerabilities',
    conditionImmunities: 'Condition Immunities',
    passivePerception: 'Passive Perception',
    sense: {
      blindsight: 'Blindsight',
      darkvision: 'Darkvision',
      tremorsense: 'Tremorsense',
      truesight: 'Truesight',
    },
    trait: {
      name: 'Name',
      trait: 'Trait',
      limitedUse: {
        count: 'Uses',
        rate: 'Reset Type',
        label: 'Limited Uses',
      },
      description: 'Description',
      save: 'Save Trait',
    },
    spellcasting: {
      class: 'Class',
      level: 'Caster Level',
      ability: 'Spellcasting Ability',
      save: 'Save DC',
      attack: 'Spell Attack Modifier',
      modifier: 'Ability Modifier',
      notes: 'Slot Casting Notes',
      atWillNotes: 'Innate Casting Notes',
      lockSave: 'Save Locked to Stats',
      unlockSave: 'Save Unlocked from Stats',
      lockAttack: 'Spell Attack Locked to Stats',
      unlockAttack: 'Spell Attack Unlocked from Stats',
      lockModifier: 'Spell Modifier Locked to Stats',
      unlockModifier: 'Spell Modifier Unlocked from Stats',
    },
    attack: {
      name: 'Name',
      targets: 'Targets',
      bonus: 'To Hit',
      stat: 'Stat',
      range: 'Range',
      kind: 'Kind',
      reach: 'Reach',
      close: 'Close',
      long: 'Long',
      effectDc: 'Effect DC',
      count: 'Count',
      dieType: 'Die Type',
      damageType: 'Damage Type',
      damageBonus: 'Damage Bonus',
    },
    action: {
      recharge: 'Recharge',
    },
  },
  editor: {
    // caption fields are allocated for each tab but not used at the moment
    basics: {
      label: 'Basics',
      caption: '',
    },
    saves: {
      label: 'Saving Throws',
      caption: '',
    },
    speeds: {
      label: 'Speeds',
      caption: '',
    },
    skills: {
      label: 'Skills',
      caption: '',
    },
    resistances: {
      label: 'Resistances and Immunities',
      caption: '',
    },
    senses: {
      label: 'Senses',
      caption: '',
    },
    traits: {
      label: 'Traits',
      caption: 'Always active passive abilities',
    },
    spellcasting: {
      label: 'Spellcasting',
      caption: 'Innate and Class-based Spellcasting',
      class: {
        label: 'Class Spellcasting',
        caption:
          'Slot-limited spellcasting derived from a player character class',
      },
      innate: {
        label: 'Innate Spellcasting',
        caption: 'At-will spellcasting derived from innate abilities',
        preamble: 'Innate Spellcasting Preamble',
        addNew: 'Add Innate Spell List',
        casts: 'Casts',
        recharge: 'Recharge',
        list: 'Spell List',
        delete: 'Delete List',
      },
      slot: {
        all: 'All Known Spells',
        level: '{ordinal} Level',
        levelOrdinal: 'Ordinal Caster Level',
        knownAtLevel: '{ordinal} Level Spells',
        warlockSlots: '{0}-{1} level ({2} {3} level slots)',
        slotLabel: '{ordinal} level ({slots}): ',
        slotQuantity: '0 slots | 1 slot | {n} slots',
        cantrip: 'Cantrip',
        cantrips: 'Cantrips',
        cantripLabel: 'Cantrips (at will)',
        showSlots: 'Show Slots',
        hideSlots: 'Hide Slots',
        classOnlyOn: 'Class Filter On',
        classOnlyOff: 'Class Filter Off',
        slots: 'Slots',
        useDefaultPreamble: 'Using Default Preamble',
        useCustomPreamble: 'Using Custom Preamble',
        preamble: 'Slot Spellcasting Preamble',
      },
      custom: {
        create: 'Add Custom Spell',
        name: 'Spell Name',
        nameValidator: 'Spell names must be unique',
        level: 'Level',
        classes: 'Available To',
        damage: 'Avg. Single Target Damage',
        multitarget: 'Multitarget',
        title: 'Custom Spells',
        mtTrue: 'Yes',
        mtFalse: 'No',
        delete: 'Delete Spells | Delete 1 Spell | Delete {n} Spells',
        export: 'Export',
        import: 'Import',
      },
    },
    attack: {
      label: 'Attacks',
      caption: '',
      add: 'Add Attack',
      delete: 'Delete Attack',
      primary: 'Primary Damage',
      additional: 'Additional Damage',
      additionalCaption: 'Extra damage applied every hit',
      addAdditional: 'Add Additional Damage',
      additionalNote: 'Notes',
      conditional: 'Conditional Damage',
      condition: 'Condition',
      enableConditional: 'Enabled',
      disableConditional: 'Disabled',
      conditionalCaption:
        'Replaces the Primary Damage when the Condition is met (e.g. Versatile Weapons)',
      lockedToStats: 'Locked to Stats',
      unlockedFromStats: 'Unlocked from Stats',
      description: 'Additional Description or Effects',
      useCustomRenderer: 'Using Custom Renderer',
      useDefaultRenderer: 'Using Default Renderer',
      customRenderer: 'Attack',
      tokenLabel: 'Attack',
      distanceLabel: 'Distance',
      distance: '{0} {1} Attack',
      meleeRange: 'reach {0} ft.',
      rangeRange: 'range {0}/{1} ft.',
      bothRange: 'reach {0} ft. or range {1}/{2} ft.',
      targets: 'no targets | one target | {count} targets',
      damage: '{0} damage',
      conditionalDamage: ', or {0} {1}',
      additionalDamage: ' plus {0}',
      estimatedAttackDamage: '{0} Avg. Damage per Hit',
    },
    multiattack: {
      label: 'Multiattack',
      add: 'Add Multiattack Group',
      addAttack: '',
      none: 'No Multiattack Groups Defined',
      attackHeader: 'Attacks',
      actionHeader: 'Actions',
      group: 'Multiattack Group {0}',
      attack: '{a} attack | {a} attacks',
      action: 'the {a} action {count} time | the {a} action {count} times',
      postscript: 'Postscript',
      help: "Rendered multiattack entries can be accessed with the {'{'}multiattack.rendered{'}'} token. As an example, if you wanted to access the rendered version of the first multiattack group's first attack, you would use {'{'}multiattack.rendered[0].attacks[0]{'}'}.",
      estimatedDamage: '{0} Avg. Damage',
    },
    action: {
      label: 'Actions',
      tokenLabel: 'Action',
      caption: '',
      add: 'Add Action',
      delete: 'Delete Action',
      legendaryOnly: 'Legendary Action Only',
      regular: 'Regular Action',
      legendaryExplanation:
        'Actions marked as Legendary Only will not display in the rendered list of actions, but can still be used as legendary actions.',
      save: 'Save Action',
      recharge: '(Recharge {0})',
      plural: 'action | actions',
    },
    legendary: {
      label: 'Legendary Actions',
      caption: 'Mark existing Attacks or Actions as Legendary',
      preamble: 'Legendary Action Preamble',
      count: 'Actions',
      add: 'Add Legendary Action',
      none: 'No Attacks or Actions Available',
      cost: 'Cost',
      renderedCost: ' (Costs {0} Actions)',
      actionCount: 'Available Actions',
      useCustomPreamble: 'Use Custom Preamble',
      useDefaultPreamble: 'Use Default Preamble',
    },
    proficient: 'Proficient',
    override: 'Override',
    expertise: 'Expertise',
    delete: 'Delete',
    addSpeed: 'Add Speed',
    addSkill: 'Add Skill',
    addTrait: 'Add Trait',
    deleteTrait: 'Delete Trait',
    attackMod: 'Attack Mod',
    statSave: 'Save DC',
    monsterToken: 'Monster',
    trait: 'Trait',
    plainTextNote: 'Plain Text Only',
    reset: 'Reset',
    resetMonster: 'Reset Monster',
    resetTip: 'Reset to Default',
    article: "Use 'The' in NAME Token",
    renderSettings: 'Stat Block Settings',
    columns: 'Columns',
    crAnnotation: {
      title: 'CR Annotation Data',
      manual: 'Using Manual CR Estimation',
      automatic: 'Using Automatic CR Estimation',
      automaticShort: 'Automatic',
      manualShort: 'Manual',
      include: 'Included in CR Calculation',
      exclude: 'Excluded from CR Calculation',
      maxDamage: 'Expected Damage',
      maxSave: 'Highest DC',
      maxModifier: 'Highest Attack Modifier',
      ehpModifier: 'EHP Modifier',
      ehpMultiplier: 'EHP Multiplier',
      acModifier: 'EAC Modifier',
      multitarget: 'Multitarget',
      singletarget: 'Single Target',
      damage: 'damage',
      ehp: 'Effective HP',
    },
    mythic: {
      label: 'Mythic Actions',
      caption: 'Mythic trigger conditions and additional actions',
      traitName: 'Mythic Trait Trigger Name',
      recharge: 'Mythic Trait Recharge Condition',
      description: 'Trait Description',
      preamble: 'Actions Preamble',
      add: 'Add Mythic Action',
    },
    reaction: {
      label: 'Reactions',
      caption: '',
      add: 'Add Reaction',
      delete: 'Delete Reaction',
    },
    lair: {
      label: 'Lair Actions',
      caption: '',
      add: 'Add Lair Action',
      delete: 'Delete Lair Action',
      useCustom: 'Using Custom Preamble',
      useDefault: 'Using Default Preamble',
      preamble: 'Preamble',
      actionItem: 'Lair Action {0}',
      help: 'Lair Actions will appear in the stat block once an action has been added. In the CR calculation, it is assumed that lair actions cannot be used twice in a row (this is not true for all actions, but it is a commonly used pattern).',
    },
    regional: {
      label: 'Regional Effects',
      add: 'Add Regional Effect',
      delete: 'Delete Regional Effect',
      effectItem: 'Regional Effect {0}',
      preamble: 'Regional Effect Preamble',
      help: 'Regional effects will appear after lair actions (if any). Regional effects are not included in the CR calculation and will only appear if at least one effect is in the list.',
    },
    cr: {
      estimated: 'Estimated CR',
      defensive: 'Defensive CR',
      offensive: 'Offensive CR',
      resistance: '{n} Resistance | {n} Resistances',
      immunity: '{n} Immunity | {n} Immunities',
      vulnerability: '{n} Vulnerability | {n} Vulnerabilities',
      atCr: '{0} at CR {1}',
      round: 'Round {0}',
      totalDamage: '{0} Total Damage',
      avgDamage: '{0} Average Damage (3 Rounds)',
      maxAttack: '{0} Max. Attack Bonus',
      attackCrInactive: 'Inactive. Save DC has a higher expected CR.',
      attackCrExplain: 'Offensive CR {0} (Attack Bonus Delta: {1})',
      attackActionsBelowThreshold:
        '{n} Action with +0 or less | {n} Actions with +0 or less',
      dcActionsBelowThreshold: '{n} Action with DC 0 | {n} Actions with DC 0',
      maxDc: 'Max. Save DC {0}',
      dcCrInactive: 'Inactive. Attack Bonus has a higher expected CR.',
      dcCrExplain: 'Offensive CR {0} (Save DC Delta: {1})',
      ehp: '{0} Effective Hit Points',
      baseHp: 'Base Hit Points',
      eac: '{0} Effective Armor Class',
      baseAc: 'Base Armor Class',
      baseAcLow: 'AC below minimum of 12',
      acExplain: 'Defensive CR {0} (AC Delta: {1})',
      saveCount:
        '{n} Proficient or Modified Save | {n} Proficient or Modified Saves',
      type: {
        Attack: 'Attack',
        Multiattack: 'Multiattack',
        Action: 'Action',
        Trait: 'Trait',
        Legendary: 'Legendary Action',
        Spell: 'Spell',
        'Lair Action': 'Lair Action',
      },
    },
    ok: 'OK',
    load: 'Load',
    cancel: 'Cancel',
    save: 'Save',
    monsterReset: 'Monster Reset',
    home: 'Monster Editor',
  },
  io: {
    error: {
      version: 'Load Failed: No Version Detected',
      validation: 'Load Failed: version {0} did not validate. Reasons: {1}',
      unknown: 'Load Failed for unknown reason. Check dev console for error.',
      upload: 'File failed to upload',
      update:
        'Monster failed to validate after update. Please submit a bug report and include the monster file.',
      validationList: 'Validation Errors: {0}',
      md: 'Error exporting markdown file. Check console and file a bug report. {0}',
      json: 'Error exporting json file. Check console and file a bug report. {0}',
    },
    warn: {
      spell:
        "Some spells failed to validate and have been removed from the stat block. These are likely custom spells that don't exist in your database. Please add the spells listed and then re-load the monster. Missing: {0}",
    },
    dataUrl: {
      title: 'Load from URL',
      loadText: 'You are about to load a monster named "{0}". Proceed?',
    },
    success: 'Load Successful',
    copyMd: 'Copied Markdown (Homebrewery Format) to Clipboard',
    export: {
      default: 'Export JSON (5emm format)',
      md: 'Export Markdown (Homebrewery)',
      tarrasque: 'Export JSON (Tarrasque.io format)',
      latex: 'Export LaTeX (rpgtex)',
      png: 'Save as PNG',
      mdClip: 'Copy Markdown to Clipboard (Homebrewery)',
      link: 'Copy 5emm Link (tinyurl)',
    },
    update: {
      v1Spells:
        'Found custom spells from app version 1. In order to use these spells with version 2, we need to update them. This is a potentially destructive operation, so please use the download button below to make a backup. If you encounter issues with this process, please submit a bug report on GitHub and include your backup spell file.',
      v1SpellsError:
        'Error converting v1 Spells to v2. Please submit a bug report. Error: {0}',
      v1SpellsOk: 'Successfully upgraded spells to v2.',
      v1SpellsDownload: 'Download v1 Spells',
    },
  },
  // note: add to these keys to provide additional default options for some of the dropdowns
  // since the monster fields for these keys just output the array contents, it should be (theoretically)
  // easy to swap out translations for default options, but monsters created in en-US won't automatically translate...
  skill: {
    ACROBATICS: 'Acrobatics',
    ANIMAL_HANDLING: 'Animal Handling',
    ARCANA: 'Arcana',
    ATHLETICS: 'Athletics',
    DECEPTION: 'Deception',
    HISTORY: 'History',
    INSIGHT: 'Insight',
    INTIMIDATION: 'Intimidation',
    INVESTIGATION: 'Investigation',
    MEDICINE: 'Medicine',
    NATURE: 'Nature',
    PERCEPTION: 'Perception',
    PERFORMANCE: 'Performance',
    PERSUASION: 'Persuasion',
    RELIGION: 'Religion',
    SLIGHT_OF_HAND: 'Sleight of Hand',
    STEALTH: 'Stealth',
    SURVIVAL: 'Survival',
  },
  damageType: {
    ACID: 'acid',
    BLUDGEONING: 'bludgeoning',
    BLUDEGONING_NM: 'non-magical bludgeoning',
    BLUDGEONING_NM_NA: 'non-magical non-adamintine bludgeoning',
    BLUDGEONING_NM_NS: 'non-magical non-silvered bludgeoning',
    COLD: 'cold',
    TRAPS: 'traps',
    SPELLS: 'spells',
    FIRE: 'fire',
    FORCE: 'force',
    LIGHTNING: 'lightning',
    NECROTIC: 'necrotic',
    PIERCING: 'piercing',
    PIERCING_NM: 'non-magical piercing',
    PIERCING_NM_NA: 'non-magical non-adamantine piercing',
    PIERCING_NM_NS: 'non-magical non-silvered piercing',
    MAGIC_GOOD: 'magical weapons wielded by good creatures',
    MAGIC_EVIL: 'magical weapons wielded by evil creatures',
    MAGIC_NEUTRAL: 'magical weapons wielded by neutral creatures',
    MAGIC_LAWFUL: 'magical weapons wielded by lawful creatures',
    MAGIC_CHAOTIC: 'magical weapons wielded by chaotic creatures',
    POISON: 'poison',
    PSYCHIC: 'psychic',
    RADIANT: 'radiant',
    RANGED: 'ranged attacks',
    MELEE: 'melee attacks',
    SLASHING: 'slashing',
    SLASHING_NM: 'non-magical slashing',
    SLASHING_NM_NA: 'non-magical non-adamantine slashing',
    SLASHING_NM_SN: 'non-magical non-silvered slashing',
    THUNDER: 'thunder',
    ALL_PHYSICAL_NM: 'non-magical slashing, piercing, and bludgeoning',
    ALL_PHYSICAL_NM_NA:
      "bludgeoning, piercing, and slashing from non-magical attacks that aren't adamantine",
  },
  attackType: {
    ACID: 'acid',
    BLUDGEONING: 'bludgeoning',
    COLD: 'cold',
    FIRE: 'fire',
    FORCE: 'force',
    LIGHTNING: 'lightning',
    NECROTIC: 'necrotic',
    PIERCING: 'piercing',
    POISON: 'poison',
    PSYCHIC: 'psychic',
    RADIANT: 'radiant',
    SLASHING: 'slashing',
    THUNDER: 'thunder',
  },
  condition: {
    BLINDED: 'blinded',
    CHARMED: 'charmed',
    DEAFENED: 'deafened',
    DISEASED: 'diseased',
    FRIGHTENED: 'frightened',
    GRAPPLED: 'grappled',
    INCAPACITATED: 'incapacitated',
    INVISIBLE: 'invisible',
    PARALYZED: 'paralyzed',
    PETRIFIED: 'petrified',
    POISONED: 'poisoned',
    PRONE: 'prone',
    RESTRAINED: 'restrained',
    STUNNED: 'stunned',
    UNCONSCIOUS: 'unconscious',
    SLEEP: 'sleep',
    EXHAUSTION: 'exhaustion',
  },
  recharge: {
    DAY: 'day',
    DAY_EACH: 'day each',
    AT_WILL: 'at will',
    LONG_REST: 'long rest',
    SHORT_REST: 'short rest',
    LONG_OR_SHORT: 'long or short rest',
  },
  statFull: {
    STR: 'Strength',
    DEX: 'Dexterity',
    CON: 'Constitution',
    INT: 'Intelligence',
    WIS: 'Wisdom',
    CHA: 'Charisma',
  },
  class: {
    BARBARIAN: 'Barbarian',
    BARD: 'Bard',
    CLERIC: 'Cleric',
    DRUID: 'Druid',
    FIGHTER: 'Fighter',
    MONK: 'Monk',
    PALADIN: 'Paladin',
    RANGER: 'Ranger',
    ROGUE: 'Rogue',
    SORCERER: 'Sorcerer',
    WARLOCK: 'Warlock',
    WIZARD: 'Wizard',
  },
  range: {
    MELEE: 'Melee',
    RANGED: 'Ranged',
    BOTH: 'Melee or Ranged',
  },
  kind: {
    WEAPON: 'Weapon',
    SPELL: 'Spell',
  },
  presets: {
    classSpellcasting:
      "<b><i>Spellcasting.</b></i> {'{'}NAME{'}'} is a {'{'}spellcasting.ordinal{'}'}-level spellcaster. Its spellcasting ability is {'{'}spellcasting.stat{'}'} (spell save {'{'}spellcasting.save{'}'}, {'{'}spellcasting.attack{'}'} to hit with spell attacks). {'{'}spellcasting.notes{'}'} {'{'}NAME{'}'} has the following {'{'}spellcasting.class{'}'} spells prepared:",
    innateSpellcasting:
      "<b><i>Innate Spellcasting.</b></i> {'{'}NAME{'}'}'s innate spellcasting ability is {'{'}spellcasting.stat{'}'} (spell save {'{'}spellcasting.save{'}'}, {'{'}spellcasting.attack{'}'} to hit with spell attacks). {'{'}spellcasting.atWillNotes{'}'} It can cast the following spells, requiring no material components:",
    attack:
      "<b><i>{'{'}attack.name{'}'}.</b></i> <i>{'{'}attack.distance{'}'}:</i> {'{'}attack.modifier{'}'} to hit, {'{'}attack.range{'}'}, {'{'}attack.targets{'}'}. <i>Hit:</i> {'{'}attack.damage{'}'}{'{'}attack.conditionalDamage{'}'}{'{'}attack.additionalDamage{'}'}. {'{'}attack.description{'}'}",
    legendaryActions:
      "{'{'}NAME{'}'} can take {'{'}legendaryActions.count{'}'} legendary {'{'}legendaryActions.actions{'}'}, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. {'{'}NAME{'}'} regains spent legendary actions at the start of its turn.",
    legendaryAttack: "{'{'}NAME{'}'} makes a {0} attack.",
    legendaryAction: "{'{'}NAME{'}'} uses the {0} action.",
    mythicRecharge: 'Recharges after a Short or Long Rest',
    mythicDescription:
      "If {'{'}NAME{'}'} would be reduced to 0 hit points, its current hit point total instead resets to {'{'}monster.hp{'}'} hit points. Additionally, {'{'}NAME{'}'} can now use the options in the \"Mythic Actions\" section for 1 hour. Award a party an additional [x]XP ([x] XP total) for defeating {'{'}NAME{'}'} after this trait activates.",
    mythicPreamble:
      "If {'{'}NAME{'}'}'s mythic trait is active, it can use the options below as legendary actions.",
    lair: "When fighting inside its lair, {'{'}NAME{'}'} can take lair actions. On initiative count 20 (losing initiative ties), {'{'}NAME{'}'} takes a lair action to cause one of the following effects:",
    regional:
      "The region containing {'{'}NAME{'}'}'s lair is warped by {'{'}NAME{'}'}'s magic. When {'{'}NAME{'}'} dies, the effects fade after {'{'}1d10{'}'} days.",
  },
}
