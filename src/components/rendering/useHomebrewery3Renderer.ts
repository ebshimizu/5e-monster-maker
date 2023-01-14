// this file is a mess
// the autoformatter is allowed to run here it's just ugly af
// due to the whitespace sensitivity of markdown
import { useMonsterStore } from 'src/stores/monster-store'
import { useTextRenderer } from './useTextRenderer'
import { avgRoll, renderBonus, renderModifier } from './mathRendering'
import { DndStat } from '../models'
import { useI18n } from 'vue-i18n'
import { useProcessTokens } from './useProcessTokens'

export function useMd3Renderer() {
  const monster = useMonsterStore()
  const renderer = useTextRenderer()
  const { mdFormatter } = useProcessTokens()

  const { t } = useI18n()

  const getTraits = () => {
    const traits = renderer.traits.value

    const mdTraits =
      monster.traits.length === 0
        ? ''
        : `${traits.map((t) => `${mdFormatter(t)}`).join('\n:\n')}\n`
    return mdTraits
  }

  const getInnate = () => {
    const preamble = mdFormatter(renderer.innateSpellcastingPreamble.value)

    const lists = renderer.innateSpellcastingLists.value.map(
      (sl) => `${sl.renderedLabel}: *${sl.renderedSpells}*`
    )
    return `\n:\n${preamble}\n:\n${lists.join('\n')}`
  }

  const getSpellcasting = () => {
    const renderedRows = []
    const cantrips = monster.knownSpellsOfLevel(0)

    if (cantrips.length > 0)
      renderedRows.push(
        `${t('editor.spellcasting.slot.cantripLabel')}: *${cantrips.join(
          ', '
        )}*  `
      )

    renderer.classSpellcastingSlots.value.forEach((slot) => {
      renderedRows.push(`${slot.renderedLabel} *${slot.renderedSpells}*  `)
    })

    const preamble = mdFormatter(renderer.classSpellcastingPreamble.value)

    return `\n:\n${preamble}\n:\n${renderedRows.join('\n')}`
  }

  const getAttacks = () => {
    if (renderer.attacks.value.length === 0) return ''

    const attacks = renderer.attacks.value.map((a) => mdFormatter(a))
    return `\n${attacks.join('\n:\n')}`
  }

  const getActions = () => {
    if (renderer.actions.value.length === 0) return ''

    const actions = renderer.actions.value.map((a) => mdFormatter(a))
    return `\n:\n${actions.join('\n:\n')}`
  }

  const getBonusActions = () => {
    if (renderer.bonusActions.value.length === 0) return ''

    const actions = renderer.bonusActions.value.map((a) => `${mdFormatter(a)}`)
    return `\n### ${t('monster.bonusActions')}\n${actions.join('\n:\n')}\n`
  }

  const getLegendaryActions = () => {
    if (renderer.legendaryActions.value.length === 0) return ''

    const preamble = `### ${t('editor.legendary.label')}
${mdFormatter(renderer.legendaryPreamble.value)}`

    const legendaryActions = renderer.legendaryActions.value.map((la) =>
      mdFormatter(la)
    )

    return `\n${preamble}\n:\n${legendaryActions.join('\n:\n')}\n`
  }

  const getMythicTrait = () => {
    if (monster.mythicActions.actions.length === 0) return ''

    return `:\n${mdFormatter(renderer.mythicTrait.value)}\n`
  }

  const getMythicActions = () => {
    if (renderer.mythicActions.value.length === 0) return ''

    const preamble = `### ${t('editor.mythic.label')}
${mdFormatter(renderer.mythicPreamble.value)}`

    const actions = renderer.mythicActions.value

    const formattedActions = actions.map((a) => {
      return `${mdFormatter(a)}`
    })

    return `\n${preamble}\n:\n${formattedActions.join('\n:\n')}\n`
  }

  const getReactions = () => {
    if (renderer.reactions.value.length === 0) return ''

    const formattedReactions = renderer.reactions.value.map((r) => {
      return mdFormatter(r)
    })

    return `\n### ${t('editor.reaction.label')}\n${formattedReactions.join(
      '\n:\n'
    )}\n`
  }

  const getLairActions = () => {
    if (monster.lairActions.length === 0) return ''

    const preamble = `### ${t('editor.lair.label')}
${mdFormatter(renderer.lairActionPreamble.value)}`

    const formattedLair = renderer.lairActions.value.map((r) => {
      return `- ${mdFormatter(r)}`
    })

    return `\n${preamble}\n${formattedLair.join('\n')}\n`
  }

  const getRegionalEffects = () => {
    if (monster.regionalEffects.length === 0) return ''

    const preamble = `### ${t('editor.regional.label')}
${renderer.regionalEffectPreamble.value}`

    const formattedEffects = renderer.regionalEffects.value.map((e) => {
      return `- ${mdFormatter(e)}`
    })

    return `\n${preamble}\n${formattedEffects.join('\n')}`
  }

  // formatted for the Homebrewery system, version 3
  // https://homebrewery.naturalcrit.com/
  const renderMarkdownV3 = (twoCol = false) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s: any = {}
    for (const stat in monster.stats) {
      s[stat] = {
        score: monster.stats[stat as DndStat],
        bonus: renderModifier(monster.stats[stat as DndStat]),
      }
    }

    const saves = `**${t('monster.saves')}** :: ${renderer.saves.value}`
    const skills =
      monster.skills.length === 0
        ? ''
        : `\n**${t('monster.skills')}** :: ${renderer.skills.value}`
    const vuln =
      monster.vulnerabilities.length === 0
        ? ''
        : `\n**${t('monster.vulnerabilities')}** :: ${
            renderer.vulnerabilities.value
          }`
    const resist =
      monster.resistances.length === 0
        ? ''
        : `\n**${t('monster.resistances')}** :: ${
            renderer.vulnerabilities.value
          }`
    const immune =
      monster.immunities.length === 0
        ? ''
        : `\n**${t('monster.immunities')}** :: ${renderer.immunities.value}`
    const condition =
      monster.conditions.length === 0
        ? ''
        : `\n${t('monster.conditionImmunities')}** :: ${
            renderer.immunities.value
          }`
    const traits = getTraits()
    const mythicTrait = getMythicTrait()
    const spellcasting = getSpellcasting()
    const innate = getInnate()
    const multi =
      monster.multiattacks.length === 0
        ? ''
        : `\n***Multiattack.*** ${mdFormatter(renderer.multiattacks.value)}\n:`
    const attacks = getAttacks()
    const actions = getActions()
    const bonusActions = getBonusActions()
    const legendary = getLegendaryActions()
    const mythic = getMythicActions()
    const reactions = getReactions()
    const lair = getLairActions()
    const regional = getRegionalEffects()

    return `{{monster,frame${twoCol ? ',wide' : ''}
## ${monster.name}
*${monster.size} ${monster.type}, ${monster.alignment}*
___
**${t('monster.armorClass')}** :: ${monster.AC} ${
      monster.ACType === '' ? '' : `(${monster.ACType})`
    }
**${t('monster.hp.full')}** :: ${
      avgRoll(monster.HP.HD, monster.HP.type) + monster.HP.modifier
    } (${monster.HP.HD}d${monster.HP.type}${renderBonus(monster.HP.modifier)})
**${t('monster.movement.speed')}** :: ${monster.speeds
      .map((s) => `${s.speed} ft. ${s.type}${s.note === '' ? '' : s.note}`)
      .join(', ')}
___
|  STR  |  DEX  |  CON  |  INT  |  WIS  |  CHA  |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
|${s.STR.score} (${s.STR.bonus})|${s.DEX.score} (${s.DEX.bonus})|${
      s.CON.score
    } (${s.CON.bonus})|${s.INT.score} (${s.INT.bonus})|${s.WIS.score} (${
      s.WIS.bonus
    })|${s.CHA.score} (${s.CHA.bonus})|
___
${saves !== '' ? saves : ''}${skills}${vuln}${resist}${immune}${condition}
**${t('editor.senses.label')}** :: ${renderer.senses.value}
**${t('monster.languages')}** :: ${monster.languages}
**${t('monster.challenge')}** :: ${renderer.cr.value}
___
${traits}${mythicTrait}### ${t(
      'editor.action.label'
    )}${multi}${attacks}${actions}${
      monster.spellcasting.standard.length === 0 ? '' : `${spellcasting}`
    }${
      monster.spellcasting.atWill.length === 0 ? '' : `${innate}`
    }${bonusActions}${legendary}${mythic}${reactions}${lair}${regional}
}}`
  }

  return {
    renderMarkdownV3,
  }
}
