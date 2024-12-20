import { useMonsterStore } from 'src/stores/monster-store'
import { useI18n } from 'vue-i18n'
import { DndStat, MonsterAction, MonsterCrAnnotation } from '../models'
import { avgRoll, renderBonus } from '../rendering/mathRendering'

export function useAutoUpdateCr() {
  const monster = useMonsterStore()
  const { t } = useI18n()

  const autoUpdateCr = function (
    description: string,
    annotation: MonsterCrAnnotation,
    action?: MonsterAction
  ) {
    if (!annotation.automatic) return

    // parse the damage out of the description
    // if we have an action, augment the description with the effect clauses
    // this is a bit of a lazy hack, but we're really just looking for the largest die roll
    const actionDescriptions = action
      ? action.effects.map((e) => e.effect).join(' ')
      : ''

    description = `${description}${actionDescriptions}`

    // dice: {xdy+z}
    const dice = RegExp(/\{(\d+)d(\d+)[ ]*([+-][ ]*\d+)?\}/gi)
    const diceMatches = [...description.matchAll(dice)]

    let maxDamage = 0

    for (const match of diceMatches) {
      const count = parseInt(match[1])
      const type = parseInt(match[2])
      const modifier = match[3] != null ? parseInt(match[3]) : 0

      const roll = avgRoll(count, type) + modifier

      if (roll > maxDamage) maxDamage = roll
    }

    annotation.maxDamage = maxDamage

    // TODO: see if this can be detected a bit later (prefixes to damage, mention of attack radius?)
    annotation.multitarget = false

    // saves
    const save = RegExp(/\{DC:(\w{3})\}/gi)
    const saveMatches = [...description.matchAll(save)]

    let maxSave = 0

    for (const match of saveMatches) {
      const save = monster.defaultSpellSave(match[1] as DndStat)

      if (save > maxSave) maxSave = save
    }

    annotation.maxSave = maxSave

    // attack modifier
    const attack = RegExp(/\{A:(\w{3})\}/gi)
    const attackMatches = [...description.matchAll(attack)]

    let maxAttack = 0

    for (const match of attackMatches) {
      const save = monster.defaultSpellAttackModifier(match[1] as DndStat)

      if (save > maxAttack) maxAttack = save
    }

    annotation.maxModifier = maxAttack

    // actions now have more data we could use so we overwrite stuff here
    if (action) {
      // check the save
      if (action.stat !== 'none') {
        annotation.maxSave = action.save.override
          ? action.save.overrideValue
          : monster.defaultSpellSave(action.stat)
      }
    }

    // reset to defaults if someone changed them
    annotation.ehpModifier = 0
    annotation.ehpMultiplier = 1
    annotation.acModifier = 0
  }

  function printCrSummary(annotation: MonsterCrAnnotation) {
    const damage = `${annotation.maxDamage} ${t('editor.crAnnotation.damage')}${
      annotation.multitarget ? ` (${t('editor.crAnnotation.multitarget')})` : ''
    }`
    const modifiers = `, DC ${annotation.maxSave}/${renderBonus(
      annotation.maxModifier
    )}`
    const ehp =
      annotation.ehpModifier !== 0 || annotation.ehpMultiplier !== 1
        ? `, ${t('editor.crAnnotation.ehp')} ${renderBonus(
            annotation.ehpModifier
          )}/x${annotation.ehpMultiplier}`
        : ''
    const ac =
      annotation.acModifier !== 0
        ? `, ${t('monster.ac')} ${renderBonus(annotation.acModifier)}`
        : ''

    return `${[damage, modifiers, ehp, ac].join('')}`
  }

  return {
    autoUpdateCr,
    printCrSummary,
  }
}
