import { useQuasar } from 'quasar'
import {
  defaultAction,
  defaultAttack,
  defaultTrait,
  DndAttack,
  DndStat,
  Monster,
} from 'src/components/models'
import {
  bonusForSkill,
  saveModifierForStat,
  statModifier,
} from 'src/components/rendering/mathRendering'
import { getCrByString } from 'src/data/CR'
import { SKILL } from 'src/data/SKILL'
import { useMonsterStore } from 'src/stores/monster-store'
import { v4 } from 'uuid'
import { useI18n } from 'vue-i18n'
import { Open5eAction, Open5eMonster } from '../Open5eData'
import _ from 'lodash'
import { useSpellsStore } from 'src/stores/spells-store'
import { useClasses } from 'src/data/CLASS'
import { useAutoUpdateCr } from 'src/components/editor/useAutoUpdateCr'

export function useOpen5eImport() {
  const monster = useMonsterStore()
  const spells = useSpellsStore()
  const { SrdClass } = useClasses()
  const { autoUpdateCr } = useAutoUpdateCr()
  const $q = useQuasar()
  const { t } = useI18n()

  const StatMap: Record<DndStat, string> = {
    STR: 'strength',
    DEX: 'dexterity',
    CON: 'constitution',
    INT: 'intelligence',
    WIS: 'wisdom',
    CHA: 'charisma',
  }

  const StringToStat: Record<string, DndStat> = {
    strength: 'STR',
    dexterity: 'DEX',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'WIS',
    charisma: 'CHA',
  }

  // used for target count parsing.
  // I haven't actually seen more than one but it's possible
  // if more than 9 targets are specified the parser pops a warning.
  const wordToNumber: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  }

  const importNote = (message: string) => {
    $q.notify({
      message,
      type: 'warning',
      timeout: 0,
      multiLine: true,
      actions: [{ label: t('editor.ok'), color: 'white' }],
    })
  }

  const replaceMdStrings = (input: string): string => {
    const bold = RegExp(/\*\*([^\*]+)\*\*/gi)
    let modifiedInput = input.replace(bold, (match, text) => {
      return `<b>${text}</b>`
    })

    modifiedInput = modifiedInput.replaceAll('\n', '<br>')

    return modifiedInput
  }

  const replaceFormattingStrings = (input: string): string => {
    const dice = RegExp(/\d+\s\((\d+)d(\d+)[ ]*([+-][ ]*\d+)?\)/gi)
    const modInput = input.replace(dice, (match, count, dice, modifier) => {
      return `{${count}d${dice}${modifier ? modifier : ''}}`
    })

    return replaceMdStrings(modInput)
  }

  const processAction = (a: Open5eAction, legendaryOnly = false) => {
    // plain actions aren't too bad
    // theoretically we should replace the DCs with the relevant stat but that's work and we'd be guessing.
    const newAction = defaultAction()
    newAction.name = a.name
    newAction.description = a.desc

    // check for recharge
    const recharge = RegExp(/[\w\d\s]*\(recharge (\d-\d)\)/gi)
    const matches = recharge.exec(a.name)
    if (matches != null) {
      newAction.recharge = matches[1]
      newAction.name = a.name.substring(0, a.name.indexOf('(') - 1)
    }

    // check for limited use
    const limited = RegExp(/\((\d+)\/(\w+)\)/gi)
    const limitedMatches = limited.exec(a.name)
    if (limitedMatches != null) {
      newAction.limitedUse.count = parseInt(limitedMatches[1])
      newAction.limitedUse.rate = limitedMatches[2].toUpperCase()
      newAction.name = a.name.substring(0, a.name.indexOf('(') - 1)
    }

    // replace dice strings
    newAction.description = replaceFormattingStrings(newAction.description)
    newAction.legendaryOnly = legendaryOnly

    autoUpdateCr(newAction.description, newAction.crAnnotation)

    // is this a bonus action
    const isBonusAction =
      newAction.description.match(/^as a bonus action/gi) != null
    if (isBonusAction) {
      newAction.bonusAction = true
    }

    monster.actions.push(newAction)

    return newAction.id
  }

  const processSpellcasting = (desc: string) => {
    // oh boy
    const level = new RegExp(/is an? (\d+)(?:st|nd|th)-level/gi)
    const stat = new RegExp(/spellcasting ability is (\w+)/gi)
    const cls = new RegExp(/following (\w+) spells?/gi)
    const dc = new RegExp(/spell save DC (\d+)/gi)
    const toHit = new RegExp(/\+(\d+) to hit/gi)

    // the stat determines the modifiers, though we should check after the fact if the DCs match...
    const levelMatch = level.exec(desc)
    if (levelMatch != null) {
      monster.spellcasting.level = parseInt(levelMatch[1])
    } else {
      importNote(t('import.error.spellcasterLevel', [desc]))
    }

    const clsMatch = cls.exec(desc)
    if (clsMatch != null) {
      monster.spellcasting.class =
        clsMatch[1].toUpperCase() in SrdClass
          ? clsMatch[1].toUpperCase()
          : clsMatch[1]
    }

    const statMatch = stat.exec(desc)
    if (statMatch != null) {
      const stat: DndStat = StringToStat[statMatch[1].toLowerCase()]
      monster.spellcasting.stat = stat

      // modifier check
      const dcMatch = dc.exec(desc)
      const toHitMatch = toHit.exec(desc)
      if (dcMatch != null) {
        const targetSpellSave = parseInt(dcMatch[1])

        if (monster.spellSave !== targetSpellSave) {
          monster.spellcasting.save.override = true
          monster.spellcasting.save.overrideValue = targetSpellSave
        }
      }

      if (toHitMatch != null) {
        const targetToHit = parseInt(toHitMatch[1])

        if (monster.spellAttackModifier !== targetToHit) {
          monster.spellcasting.attack.override = true
          monster.spellcasting.attack.overrideValue = targetToHit
        }
      }
    } else {
      importNote(t('import.error.spellcasterStat', [desc]))
    }

    // spell list time
    const spellLists = [
      ...desc.matchAll(
        /(cantrips?)(?= \(at will\): ([^\n$]+))|(\d+)(?:st|nd|th) level \((\d+) slots?\): ([^\n$]+)/gi
      ),
    ]
    const unavailableSpells = [] as string[]

    // snapshot the spell names, casing issue
    const validSpellNames = Object.keys(spells.allSpells)
    const validSpells = [] as string[]

    spellLists.forEach((sl) => {
      console.log(`[Import] Processing spell list ${sl[0]}`)
      // check if cantrip list or not
      if (sl[1] != null) {
        // cantrip
        const spellNames = sl[2]
          .split(',')
          .map((s) => _.trim(s).replaceAll('*', ''))

        spellNames.forEach((s) => {
          const name = validSpellNames.find((name) => name.toLowerCase() === s)

          if (name != null) {
            validSpells.push(name)
          } else {
            unavailableSpells.push(s)
          }
        })
      } else {
        // not cantrip
        // one of the conditions has to match and if the first one is null then it's a level
        const level = parseInt(sl[3])
        const slots = parseInt(sl[4])
        const spellNames = sl[5]
          .split(',')
          .map((s) => _.trim(s).replaceAll('*', ''))

        monster.spellcasting.slots[level - 1] = slots

        spellNames.forEach((s) => {
          const name = validSpellNames.find((name) => name.toLowerCase() === s)

          if (name != null) {
            validSpells.push(name)
          } else {
            unavailableSpells.push(s)
          }
        })
      }
    })

    monster.spellcasting.standard = validSpells

    if (unavailableSpells.length > 0) {
      importNote(t('import.error.spells', [unavailableSpells.join(', ')]))
    }
  }

  const processTrait = (a: Open5eAction) => {
    console.log(`[Import] Processing trait ${a.name}`)

    // is secretly a bonus action
    const isBonusAction = a.desc.match(/^as a bonus action/gi) != null
    if (isBonusAction) {
      processAction(a, false)
    } else {
      // if we're dealing with spellcasting we're in for a time
      if (a.name.toLowerCase() === 'innate spellcasting') {
        // TODO: parse innate spellcasting
        console.warn('TODO: innate spellcasting')
      } else if (a.name.toLowerCase() === 'spellcasting') {
        // todo: parse spellcasting
        processSpellcasting(a.desc)
      } else {
        const newTrait = defaultTrait()
        newTrait.name = a.name
        newTrait.description = a.desc

        // check for limited use
        const limited = RegExp(/\((\d+)\/(\w+)\)/gi)
        const matches = limited.exec(a.name)
        if (matches != null) {
          newTrait.limitedUse.count = parseInt(matches[1])
          newTrait.limitedUse.rate = matches[2].toUpperCase()
          newTrait.name = a.name.substring(0, a.name.indexOf('(') - 1)
        }

        // replace dice strings
        newTrait.description = replaceFormattingStrings(newTrait.description)
        autoUpdateCr(newTrait.description, newTrait.crAnnotation)

        monster.traits.push(newTrait)
      }
    }
  }

  const guessAttackBonus = (
    target: number,
    order: DndAttack['kind']
  ): DndStat | undefined => {
    const searchOrder: DndStat[] =
      order === 'WEAPON'
        ? ['STR', 'DEX', 'CON', 'CHA', 'WIS', 'INT']
        : ['CHA', 'WIS', 'INT', 'STR', 'DEX', 'CON']

    for (const stat of searchOrder) {
      // check the attack modifier, proficiency assumed
      const modifier = statModifier(monster.stats[stat]) + monster.proficiency

      if (modifier === target) {
        console.log(`[Import] guessing ${stat} for modifier ${target}`)
        return stat
      }
    }

    // use the override
    return undefined
  }

  const processAttack = (a: Open5eAction) => {
    // attacks are going to be an interesting regex test
    const newAttack = defaultAttack()

    // starting with the attack basics
    const attackInfo = RegExp(
      /(Melee|Ranged|Melee or Ranged) (Weapon|Spell) Attack: ([+-]\d+) to hit, (?:reach|range) (\d+|\d+\/\d+) ft\.(?: or (?:reach|range) (\d+)\/(\d+) ft\.)?, (\w+) (?:targets?|creatures?)\./gi
    )

    const infoMatches = attackInfo.exec(a.desc)
    if (infoMatches != null) {
      // run the basics
      // match 1 is the type
      // uppercase conversion
      console.log(
        `[Import] Attack parsing stage 1, info string "${infoMatches[0]}"`
      )

      const dist = infoMatches[1].toUpperCase()
      newAttack.distance =
        dist === 'MELEE OR RANGED' ? 'BOTH' : (dist as DndAttack['distance'])

      // kind, uppercase conversion
      const kind = infoMatches[2].toUpperCase()
      newAttack.kind = kind as DndAttack['kind']

      // modifier is tough, we need to search through the possible attack modifiers and pick a stat,
      // otherwise we need to override it
      const attackStat = guessAttackBonus(
        parseInt(infoMatches[3]),
        newAttack.kind
      )
      if (attackStat != undefined) {
        newAttack.modifier.stat = attackStat
        newAttack.modifier.proficient = true
      } else {
        newAttack.modifier.stat = newAttack.kind === 'SPELL' ? 'WIS' : 'STR'
        newAttack.modifier.override = true
        newAttack.modifier.overrideValue = parseInt(infoMatches[3])
      }

      // range
      const range = infoMatches[4]

      // condition on split range or not
      if (range.includes('/')) {
        // split
        const parts = range.split('/')

        const short = parseInt(parts[0])
        const long = parseInt(parts[1])

        newAttack.range.reach = short
        newAttack.range.standard = short
        newAttack.range.long = long
      } else {
        // single
        newAttack.range.standard = parseInt(range)
        newAttack.range.reach = parseInt(range)
      }

      if (infoMatches[5] != null && infoMatches[6] != null) {
        // versatile
        newAttack.range.standard = parseInt(infoMatches[5])
        newAttack.range.long = parseInt(infoMatches[6])
      }

      // target count
      const targets = wordToNumber[infoMatches[7]]
      if (targets != null) {
        newAttack.targets = targets
      } else {
        importNote(t('import.error.targets', [a.name, infoMatches[7]]))
      }

      // next, parse the damage
      const damageInfo = RegExp(
        /Hit: \d+ \((\d+)d(\d+)\s*([+-]\s*\d+)?\) (\w+) damage\.?(\s?,?\s?plus [^\.]+\.)?(?:,\s?(and [^\.]+\.?))?(.*)/gi
      )
      const damageMatches = damageInfo.exec(a.desc)
      if (damageMatches != null) {
        // complicated
        console.log(
          `[Import] Attack parsing stage 2, damage string "${damageMatches[0]}"`
        )
        // first match is the damage die count, second is the damage die type
        newAttack.damage.count = parseInt(damageMatches[1])
        newAttack.damage.dice = parseInt(damageMatches[2])

        // optional modifier
        if (damageMatches[3] != null) {
          newAttack.damage.modifier.stat = newAttack.modifier.stat

          // ok now check if the damage modifier actually lines up
          const targetDamageMod = parseInt(damageMatches[3].replaceAll(' ', ''))
          if (
            statModifier(monster.stats[newAttack.damage.modifier.stat]) !==
            targetDamageMod
          ) {
            // override if not equal, usually the modifier is based off the attack's attack mod stat
            // but sometimes it's not. we'll assume it is and not do another guess so we just override here
            // to match if needed
            newAttack.damage.modifier.override = true
            newAttack.damage.modifier.overrideValue = targetDamageMod
          }
        } else {
          // override needed for 0 modifier
          newAttack.damage.modifier.override = true
          newAttack.damage.modifier.overrideValue = 0
        }

        // match group 4 is the primary damage type
        // it is possible for this to be missing if the "plus" has the same damage type but if
        // that's the case, then don't put it in plus honestly
        newAttack.damage.type = damageMatches[4]

        // match group 5 is the "plus [x] damage" strings, if any
        if (damageMatches[5] != null) {
          // match damage strings
          console.log(`[Import] parsing additional damage ${damageMatches[5]}`)
          const additionalDamage = [
            ...damageMatches[5].matchAll(/\((\d+)d(\d+)\) (\w+) damage/gi),
          ]

          // should be straight forward from here
          additionalDamage.forEach((match) => {
            newAttack.additionalDamage.push({
              id: v4(),
              dice: parseInt(match[2]),
              count: parseInt(match[1]),
              type: match[3],
              note: '', // TODO: check what conditions we need for this
            })
          })
        }

        // match group 6 is the "and" additional effect, put it in the notes
        if (damageMatches[6] != null) {
          newAttack.description =
            newAttack.description + `, ${damageMatches[6]}`
        }

        // match group 7 is everything else to the end of the string
        if (damageMatches[7] != null) {
          newAttack.description +=
            newAttack.description + ' ' + damageMatches[7]
        }
      } else {
        importNote(t('import.error.attackDamageFail', [a.name, a.desc]))
      }

      newAttack.name = a.name

      // replace dice strings in description
      newAttack.description = replaceFormattingStrings(newAttack.description)
      monster.attacks.push(newAttack)
    } else {
      importNote(t('import.error.attackFail', [a.name, a.desc]))
      return
    }
  }

  const processLegendaryActions = (desc: string, actions: Open5eAction[]) => {
    // first, get the number of actions.
    const laCount = new RegExp(/can take (\d+) legendary actions?/gi)
    const countMatches = laCount.exec(desc)

    monster.legendaryActions.useCustomPreamble = true
    monster.legendaryActions.customPreamble = desc

    if (countMatches != null) {
      monster.legendaryActions.count = parseInt(countMatches[1])
    } else {
      console.log(
        `Legendary action error. Unable to find action count. ${desc}`
      )
      importNote(t('import.error.legendaryCount', [desc]))
    }

    // action iteration
    actions.forEach((a) => {
      // name check
      const actionCount = new RegExp(/\(costs (\d+) actions?\)/gi)
      const actionCountMatches = actionCount.exec(a.name)

      const cost =
        actionCountMatches != null ? parseInt(actionCountMatches[1]) : 1

      // name adjustment
      const name =
        actionCountMatches != null
          ? a.name.substring(0, a.name.indexOf('(') - 1)
          : a.name

      // match an attack
      const existingAttack = monster.attacks.find(
        (atk) => atk.name.toLowerCase().indexOf(a.name) !== -1
      )

      if (existingAttack != null) {
        monster.addLegendaryAction(existingAttack.id, cost)
      } else {
        const id = processAction({ name, desc: a.desc }, true)
        monster.addLegendaryAction(id)
      }
    })
  }

  const importOpen5eMonster = (data: Open5eMonster): boolean => {
    // reset the entire monster
    monster.$reset()

    // let's go in order from the top
    // basics
    monster.name = data.name
    monster.size = data.size
    monster.type = `${data.type}${
      data.subtype === '' ? '' : ` ${data.subtype}`
    }`
    monster.alignment = data.alignment
    monster.AC = data.armor_class
    monster.ACType = data.armor_desc ?? ''
    monster.languages = data.languages

    // challenge rating
    const cr = getCrByString(data.challenge_rating)
    monster.CR = cr.index
    monster.proficiency = cr.proficiency

    // core stats
    Object.entries(StatMap).forEach(([stat, dataKey]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      monster.stats[stat as DndStat] = (data as any)[dataKey]
    })

    // let's parse hp
    const dice = RegExp(/(\d+)d(\d+)[ ]*([+-][ ]*\d+)?/gi)
    const dieMatches = dice.exec(data.hit_dice)

    if (dieMatches) {
      monster.HP.HD = parseInt(dieMatches[1])
      monster.HP.type = parseInt(dieMatches[2])
      monster.HP.modifier = dieMatches[3] == null ? 0 : parseInt(dieMatches[3])
    } else {
      importNote(t('import.error.hp', [data.hit_dice]))
    }

    // speeds
    monster.speeds = []
    for (const spd of Object.entries(data.speed)) {
      monster.speeds.push({
        id: v4(),
        type: spd[0],
        speed: spd[1],
        note: '',
      })
    }

    // saves is interesting in this format
    Object.entries(StatMap).forEach(([stat, dataKey]) => {
      const saveKey = `${dataKey}_save`

      const save: number | null = (data as any)[saveKey]

      if (save != null) {
        // assume proficiency
        monster.saves[stat as DndStat].proficient = true

        // check if the proficient value is the same as the expected
        const expectedSaveValue = saveModifierForStat(monster, stat as DndStat)

        if (expectedSaveValue !== save) {
          // override it instead
          console.log(
            `[Import] Save different than proficiency expected, overriding. ${stat} expected ${expectedSaveValue} got ${save}`
          )
          monster.saves[stat as DndStat].override = true
          monster.saves[stat as DndStat].overrideValue = save
        }
      }
    })

    // check passive perception
    const expectedPassivePerception = monster.computedPassivePerception
    if (expectedPassivePerception !== data.perception) {
      monster.passivePerception.override = true
      monster.passivePerception.overrideValue = data.perception
    }

    // skills
    // note that this will dynamically update passive perception if a large enough bonus
    // is applied
    Object.entries(data.skills).forEach(([name, value]) => {
      const key = name.toUpperCase().replaceAll(' ', '_')

      const skillData = SKILL[key]

      if (skillData != null) {
        const skill = {
          key,
          skill: skillData,
          proficient: false,
          expertise: false,
          override: false,
          overrideValue: value,
        }

        // check what flags we need to set
        const rawStat = bonusForSkill(monster, skill)

        skill.proficient = true
        const profStat = bonusForSkill(monster, skill)

        skill.expertise = true
        const expStat = bonusForSkill(monster, skill)

        // lol gross
        if (value === rawStat) {
          skill.proficient = false
          skill.expertise = false
        } else if (value === profStat) {
          skill.proficient = true
          skill.expertise = false
        } else if (value === expStat) {
          skill.expertise = true
          skill.proficient = false
        } else {
          skill.proficient = false
          skill.expertise = false
          skill.override = true
        }

        monster.skills.push(skill)
      } else {
        console.log(
          `[Import] Failed to resolve skill for key ${key}. Raw value: ${name}`
        )
        importNote(t('import.error.skill', [key, name]))
      }
    })

    // senses
    // need to split the string and look for keywords
    const splitSenses = data.senses.split(',')
    splitSenses.forEach((sense) => {
      // split on the ' ' again and filter empty string
      const fragments = sense.split(' ').filter((s) => s !== '')

      // first element is the name
      const key = fragments[0].toLowerCase()
      if (key in monster.senses) {
        monster.senses[key as keyof Monster['senses']] = parseInt(fragments[1])
      } else if (key !== 'passive') {
        console.log(`[Import] Unknown sense: ${key}`)
        importNote(t('import.error.sense', [key]))
      }
    })

    // condition things!
    // this is far from perfect but you can adjust if you need
    monster.vulnerabilities = data.damage_vulnerabilities
      .split(', ')
      .filter((s) => s !== '')
    monster.resistances = data.damage_resistances
      .split(', ')
      .filter((s) => s !== '')
    monster.immunities = data.damage_immunities
      .split(', ')
      .filter((s) => s !== '')
    monster.conditions = data.condition_immunities
      .split(', ')
      .filter((s) => s !== '')

    // now it's time for suffering
    if (data.actions !== '') {
      data.actions.forEach((a) => {
        // attack or not
        // attacks are very specific so we need to check if the action is an attack
        if (a.desc.startsWith('Melee') || a.desc.startsWith('Ranged')) {
          // process the attack
          console.log(`[Import] Processing attack ${a.name}`)
          processAttack(a)
        } else {
          console.log(`[Import] Processing action ${a.name}`)
          // special case for multiattack
          if (a.name === 'Multiattack') {
            // process multiattack
            importNote(t('import.multiattack'))

            // need to add a group to force the render
            monster.multiattacks.push({
              id: v4(),
              attacks: [],
              actions: [],
            })

            monster.multiattackOptions.useCustomRenderer = true
            monster.multiattackOptions.customMultiattackRenderer =
              replaceFormattingStrings(a.desc)
          } else {
            // process the action
            processAction(a)
          }
        }
      })
    }

    // traits aren't that bad though
    if (data.special_abilities !== '') {
      data.special_abilities.forEach((t) => {
        processTrait(t)
      })
    }

    if (data.reactions !== '') {
      data.reactions.forEach((r) => {
        monster.reactions.push({
          id: v4(),
          name: r.name,
          description: replaceFormattingStrings(r.desc),
        })
      })
    }

    // TODO: legendary actions
    if (data.legendary_desc !== '' && data.legendary_actions != '') {
      processLegendaryActions(data.legendary_desc, data.legendary_actions)
    }

    // force save
    monster.$persist()
    return true
  }

  return {
    importOpen5eMonster,
  }
}
