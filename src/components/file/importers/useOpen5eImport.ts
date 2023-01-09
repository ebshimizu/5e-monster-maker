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
import { getCrByNumber } from 'src/data/CR'
import { SKILL } from 'src/data/SKILL'
import { useMonsterStore } from 'src/stores/monster-store'
import { v4 } from 'uuid'
import { useI18n } from 'vue-i18n'
import { Open5eAction, Open5eMonster } from '../Open5eData'

export function useOpen5eImport() {
  const monster = useMonsterStore()
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
      actions: [{ label: t('editor.ok'), color: 'white' }],
    })
  }

  const replaceDiceStrings = (input: string): string => {
    const dice = RegExp(/\d+\s\((\d+)d(\d+)[ ]*([+-][ ]*\d+)?\)/gi)
    return input.replace(dice, (match, count, dice, modifier) => {
      return `{${count}d${dice}${modifier ? modifier : ''}}`
    })
  }

  const processAction = (a: Open5eAction) => {
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
    newAction.description = replaceDiceStrings(newAction.description)

    monster.actions.push(newAction)
  }

  const processTrait = (a: Open5eAction) => {
    console.log(`[Import] Processing trait ${a.name}`)

    // if we're dealing with spellcasting we're in for a time
    if (a.name.toLowerCase() === 'innate spellcasting') {
      // TODO: parse innate spellcasting
      console.warn('TODO: innate spellcasting')
    } else if (a.name.toLowerCase() === 'spellcasting') {
      // todo: parse spellcasting
      console.warn('TODO: spellcasting')
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
      newTrait.description = replaceDiceStrings(newTrait.description)

      monster.traits.push(newTrait)
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
      /(Melee|Ranged) (Weapon|Spell) Attack: ([+-]\d+) to hit, (?:reach|range) (\d+|\d+\/\d+) ft\., (\w+) target\./gi
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
      newAttack.distance = dist as DndAttack['distance']

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

      // target count
      const targets = wordToNumber[infoMatches[5]]
      if (targets != null) {
        newAttack.targets = targets
      } else {
        importNote(t('import.error.targets', [a.name, infoMatches[5]]))
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
        if (damageMatches[3] !== '') {
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
      newAttack.description = replaceDiceStrings(newAttack.description)
      monster.attacks.push(newAttack)
    } else {
      importNote(t('import.error.attackFail', [a.name, a.desc]))
      return
    }
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
    monster.ACType = data.armor_desc
    monster.languages = data.languages

    // challenge rating
    const cr = getCrByNumber(parseFloat(data.challenge_rating))
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
      monster.HP.modifier = parseInt(dieMatches[3])
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
              replaceDiceStrings(a.desc)
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
          description: replaceDiceStrings(r.desc),
        })
      })
    }

    // TODO: legendary actions

    // force save
    monster.$persist()
    return true
  }

  return {
    importOpen5eMonster,
  }
}
