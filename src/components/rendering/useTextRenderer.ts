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
import N2W from 'number-to-words'
import { useProcessTokens } from './useProcessTokens'
import _ from 'lodash'
import { useEditorStore } from 'src/stores/editor-store'
import { DndStat, Monster } from '../models'

// rendering strings for whatever needs it
export function useTextRenderer() {
  const monster = useMonsterStore()
  const editorStore = useEditorStore()
  const { t } = useI18n()
  const {
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
  } = useProcessTokens()

  const stats = computed(() => {
    return monster.statsWithModifiers.map((s) => {
      return {
        ...s,
        renderedModifier: renderBonus(statModifier(s.score)),
      }
    })
  })

  const hpModifier = computed(() =>
    monster.HP.modifier === 0 ? '' : `+${monster.HP.modifier}`
  )
  const hp = computed(
    () =>
      `${monster.avgHp} (${monster.HP.HD}d${monster.HP.type}${hpModifier.value})`
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

  /**
   * the 2024 renderer has a specific layout so we need to be able to access these by key
   */
  const statsAndSavesByKey = computed(() => {
    const data: Record<
      string,
      {
        stat: DndStat
        score: number
        modifier: number
        renderedModifier: string
        renderedSave: string
      }
    > = {}

    // pull the saves while we're doing the mods
    monster.statsWithModifiers.forEach((s) => {
      const save = monster.saves[s.stat]

      const renderedSave = save.override
        ? renderBonus(save.overrideValue)
        : renderBonus(
            saveModifierForStat(monster, s.stat as keyof typeof monster.saves)
          )

      data[s.stat] = {
        ...s,
        renderedModifier: renderBonus(statModifier(s.score)),
        renderedSave,
      }
    })

    return data
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
    const monsterSkills = monster.skills
      .filter((s) => {
        // hide initiative from skills list in the 2024 block
        if (editorStore.style === '2024' && s.key === 'INITIATIVE') {
          return false
        }

        return true
      })
      .map((s) => {
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

  const immunitiesAndConditions = computed(() =>
    [...(monster.immunities ?? []), ...(monster.conditions ?? [])].join(', ')
  )

  const senses = computed(() => {
    const nonZero = Object.entries(monster.senses)
      .map(([k, v]) => {
        return { name: k, value: v }
      })
      .filter((s) => s.value > 0)

    nonZero.push({
      name: 'Passive Perception',
      value: monster.computedPassivePerception ?? 0,
    })

    const senses = nonZero.map(
      (s) =>
        `${s.name} ${s.value}${s.name !== 'Passive Perception' ? ' ft.' : ''}`
    )

    if (monster.sensesNotes !== '') {
      senses.push(
        processTokens(monster.sensesNotes, undefined, monster, 'none')
      )
    }

    return senses.join(', ')
  })

  const cr = computed(() => {
    if (monster.useCrDisplayOverride) return monster.crOverride

    const lair =
      monster.lairCr > -1
        ? t('presets.cr', [
            CR[monster.lairCr].xp.toLocaleString('en-US'),
            monster.lairCrNote,
          ])
        : ''

    return `${CR[monster.CR].cr} (${CR[monster.CR].xp.toLocaleString(
      'en-US'
    )} XP${lair}${
      editorStore.style === '2024' ? `, PB +${monster.proficiency}` : ''
    })`
  })

  const traits = computed(() => {
    if (monster.alphaTraits) {
      return _.sortBy(monster.traits, 'name').map((trait) =>
        processTrait(trait, monster)
      )
    } else {
      return monster.traits.map((trait) => processTrait(trait, monster))
    }
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
        renderedLabel:
          s.rate === 'AT_WILL'
            ? t('recharge.AT_WILL')
            : `${s.count}/${t(`recharge.${s.rate}`)}`,
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
      .filter((a) => !a.legendaryOnly && !a.bonusAction)
      .map((a) => processAction(a, monster))
  })

  const bonusActions = computed(() => {
    return monster.actions
      .filter((a) => !a.legendaryOnly && a.bonusAction)
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

  const inventory = computed(() =>
    processTokens(monster.inventory, undefined, monster, 'none')
  )

  const initiative = computed(() => {
    return `${monster.initiative.mod >= 0 ? '+' : ''}${
      monster.initiative.mod
    } (${monster.initiative.passive})`
  })

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
    bonusActions,
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
    inventory,
    initiative,
    statsAndSavesByKey,
    immunitiesAndConditions,
  }
}
