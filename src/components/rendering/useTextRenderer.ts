import { CR } from 'src/data/CR'
import { useMonsterStore } from 'src/stores/monster-store'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  renderBonus,
  statModifier,
  saveModifierForStat,
  bonusForSkill,
} from './mathRendering'
import {
  processAction,
  processAttack,
  processClassSpellcasting,
  processInnateSpellcasting,
  processLairActionPreamble,
  processLegendaryAction,
  processLegendaryPreamble,
  processMultiattack,
  processMythicActionPreamble,
  processMythicActionTrait,
  processReaction,
  processTokens,
  processTrait,
} from './processTokens'
import N2W from 'number-to-words'

// rendering strings for whatever needs it
export function useTextRenderer() {
  const monster = useMonsterStore()
  const { t } = useI18n()

  const stats = computed(() => {
    return monster.statsWithModifiers.map((s) => {
      return {
        ...s,
        renderedModifier: renderBonus(statModifier(s.score)),
      }
    })
  })

  const hp = computed(
    () =>
      `${monster.avgHp} (${monster.HP.HD}d${monster.HP.type}+${monster.HP.modifier})`
  )

  // maybe pull these into a separate file? idk if i'll need to reuse later so can always split later
  // string renderer for saves
  const saves = computed(() => {
    const allSaves = Object.entries(monster.saves).map(([stat, save]) => {
      if (save.override) {
        return `${stat} ${renderBonus(save.overrideValue)}`
      } else if (save.proficient) {
        // i guess typescript can't infer that save is a key of monster.saves from the map?
        return `${stat} ${renderBonus(
          saveModifierForStat(monster, stat as keyof typeof monster.saves)
        )}`
      } else {
        return ''
      }
    })

    return allSaves.filter((s) => s !== '').join(', ')
  })

  // string renderer for speeds
  const speeds = computed(() => {
    const speeds = monster.speeds.map((s) => {
      const note = s.note === '' ? '' : ` (${s.note})`
      const type =
        s.type != null && s.type.toLowerCase() === 'walk' ? '' : ` ${s.type}`
      return `${s.speed} ft.${type}${note}`
    })

    return speeds.join(', ')
  })

  // skills renderer
  const skills = computed(() => {
    const monsterSkills = monster.skills.map((s) => {
      if (s.override) {
        return `${t(`skill.${s.key}`)} ${renderBonus(s.overrideValue)}`
      } else {
        return `${t(`skill.${s.key}`)} ${renderBonus(
          bonusForSkill(monster, s)
        )}`
      }
    })

    return monsterSkills.join(', ')
  })

  const resistances = computed(() => monster.resistances?.join(', ') ?? '')
  const immunities = computed(() => monster.immunities?.join(', ') ?? '')
  const vulnerabilities = computed(
    () => monster.vulnerabilities?.join(', ') ?? ''
  )
  const conditions = computed(() => monster.conditions?.join(', ') ?? '')

  const senses = computed(() => {
    const nonZero = Object.entries(monster.senses)
      .map(([k, v]) => {
        return { name: k, value: v }
      })
      .filter((s) => s.value > 0)

    nonZero.push({
      name: 'Passive Perception',
      value: monster.computedPassivePerception,
    })

    return nonZero
      .map(
        (s) =>
          `${s.name} ${s.value} ${s.name !== 'Passive Perception' ? 'ft.' : ''}`
      )
      .join(', ')
  })

  const cr = computed(() => {
    return `${CR[monster.CR].cr} (${CR[monster.CR].xp.toLocaleString(
      'en-US'
    )} XP)`
  })

  const traits = computed(() => {
    return monster.traits.map((t) => processTrait(t, monster))
  })

  const classSpellcastingPreamble = computed(() => {
    return processClassSpellcasting(monster.spellcasting, monster)
  })

  const innateSpellcastingPreamble = computed(() => {
    return processInnateSpellcasting(monster.spellcasting, monster)
  })

  const classSpellcastingWarlockLabel = computed(() => {
    // find the highest level slot and note the quantity
    // this is such a weird way to write this
    const slots = monster.spellcasting.slots
    for (let idx = 8; idx >= 0; idx--) {
      if (slots[idx] > 0) {
        return t('editor.spellcasting.slot.warlockSlots', [
          N2W.toOrdinal(1),
          N2W.toOrdinal(idx + 1),
          slots[idx],
          N2W.toOrdinal(idx + 1),
        ])
      }
    }

    return ''
  })

  const classSpellcastingSlots = computed(() => {
    const spellsBySlot = monster.spellsBySlot

    return spellsBySlot.map((s) => {
      return {
        ...s,
        renderedLabel: t('editor.spellcasting.slot.slotLabel', {
          ordinal: N2W.toOrdinal(s.level),
          slots: t('editor.spellcasting.slot.slotQuantity', s.slots),
        }),
        renderedSpells: s.spells.join(', '),
      }
    })
  })

  const innateSpellcastingLists = computed(() => {
    return monster.spellcasting.atWill.map((s) => {
      return {
        ...s,
        renderedLabel: `${s.count}/${t(`recharge.${s.rate}`)}`,
        renderedSpells: s.spells.join(', '),
      }
    })
  })

  const attacks = computed(() => {
    return monster.attacks.map((a) => processAttack(a, monster))
  })

  // non-legendary only actions
  const actions = computed(() => {
    return monster.actions
      .filter((a) => !a.legendaryOnly)
      .map((a) => processAction(a, monster))
  })

  const multiattacks = computed(() =>
    processMultiattack(monster.multiattacks, monster)
  )

  const legendaryPreamble = computed(() =>
    processLegendaryPreamble(monster.legendaryActions, monster)
  )

  const legendaryActions = computed(() =>
    monster.legendaryActions.actions.map((a) =>
      processLegendaryAction(a.actionId, a.cost, monster)
    )
  )

  const mythicTrait = computed(() =>
    processMythicActionTrait(monster.mythicActions, monster)
  )

  const mythicPreamble = computed(() =>
    processMythicActionPreamble(monster.mythicActions, monster)
  )

  const mythicActions = computed(() =>
    monster.mythicActions.actions.map((a) =>
      processLegendaryAction(a.actionId, a.cost, monster)
    )
  )

  const reactions = computed(() =>
    monster.reactions.map((r) => processReaction(r, monster))
  )

  const lairActionPreamble = computed(() => processLairActionPreamble(monster))

  const lairActions = computed(() =>
    monster.lairActions.map((la) =>
      processTokens(la.description, undefined, monster, 'none')
    )
  )

  const regionalEffectPreamble = computed(() =>
    processTokens(monster.regionalEffectDescription, undefined, monster, 'none')
  )

  const regionalEffects = computed(() =>
    monster.regionalEffects.map((re) =>
      processTokens(re.description, undefined, monster, 'none')
    )
  )

  return {
    stats,
    hp,
    saves,
    speeds,
    skills,
    resistances,
    immunities,
    vulnerabilities,
    conditions,
    senses,
    cr,
    traits,
    classSpellcastingPreamble,
    classSpellcastingWarlockLabel,
    classSpellcastingSlots,
    innateSpellcastingPreamble,
    innateSpellcastingLists,
    attacks,
    actions,
    multiattacks,
    legendaryPreamble,
    legendaryActions,
    mythicTrait,
    mythicPreamble,
    mythicActions,
    reactions,
    lairActionPreamble,
    lairActions,
    regionalEffectPreamble,
    regionalEffects,
  }
}
