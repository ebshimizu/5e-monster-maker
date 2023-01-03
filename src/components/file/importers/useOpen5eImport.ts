import { useQuasar } from 'quasar'
import { defaultAction, DndStat, Monster } from 'src/components/models'
import {
  bonusForSkill,
  saveModifierForStat,
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

  const importNote = (message: string) => {
    $q.notify({
      message,
      type: 'warning',
      timeout: 0,
      actions: [{ label: t('editor.ok'), color: 'white' }],
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

    // replace dice strings
    const dice = RegExp(/\d+\s\((\d+)d(\d+)[ ]*([+-][ ]*\d+)?\)/gi)
    newAction.description = newAction.description.replace(
      dice,
      (match, count, dice, modifier) => {
        return `{${count}d${dice}${modifier ? modifier : ''}}`
      }
    )

    monster.actions.push(newAction)
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
        } else {
          console.log(`[Import] Processing action ${a.name}`)
          // special case for multiattack
          if (a.name === 'Multiattack') {
            // process multiattack
          } else {
            // process the action
            processAction(a)
          }
        }
      })
    }

    return true
  }

  return {
    importOpen5eMonster,
  }
}
