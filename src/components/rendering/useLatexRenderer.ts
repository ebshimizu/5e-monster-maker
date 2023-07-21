import N2W from 'number-to-words'
import { CR } from 'src/data/CR'
import { useMonsterStore } from 'src/stores/monster-store'
import { useSpellsStore } from 'src/stores/spells-store'
import { useI18n } from 'vue-i18n'
import { MonsterAction } from '../models'
import { renderBonus, statModifier } from './mathRendering'
import { listJoin, useProcessTokens } from './useProcessTokens'
import { useTextRenderer } from './useTextRenderer'

// one change to the LaTeX renderer is that I'm dropping the \DndDice command
// if you're exporting from here you can selectively replace that where you need it, the
// existing formatting is equivalent
// the LaTeX renderer is also more rigid than the other renderers, so formatting might not carry over.
export function useLatexRenderer() {
  const monster = useMonsterStore()
  const spellStore = useSpellsStore()
  const renderer = useTextRenderer()
  const { latexFormatter, processTokens } = useProcessTokens()
  const { t } = useI18n()

  const getTraits = () => {
    const traits = renderer.traits.value
      .map((t) => latexFormatter(t))
      .join('\n')
    return traits
  }

  const getAtWill = () => {
    const spellcasting = monster.spellcasting

    return `${latexFormatter(renderer.innateSpellcastingPreamble.value)}
  \\begin{DndMonsterSpells}
    ${spellcasting.atWill
      .map((s) => {
        return `\\DndInnateSpellLevel${
          s.count > 0 ? `[${s.count}]` : ''
        }{${s.spells.join(', ')}}`
      })
      .join('\n    ')}
  \\end{DndMonsterSpells}
  `
  }

  const getStandard = () => {
    const spellcasting = monster.spellcasting

    const renderedRows = []
    const cantrips = spellcasting.standard.filter((id) => {
      return spellStore.allSpells[id].level === 0
    })

    if (cantrips.length > 0)
      renderedRows.push(`\\DndMonsterSpellLevel{${cantrips.join(', ')}}`)

    for (let i = 0; i < spellcasting.slots.length; i++) {
      if (spellcasting.slots[i] > 0) {
        const level = i + 1
        const spells = spellcasting.standard.filter((id) => {
          return spellStore.allSpells[id].level === level
        })
        if (spells.length === 0) continue

        renderedRows.push(
          `\\DndMonsterSpellLevel[${level}][${
            spellcasting.slots[i]
          }]{${spells.join(', ')}}`
        )
      }
    }

    return `${latexFormatter(renderer.classSpellcastingPreamble.value)}
  \\begin{DndMonsterSpells}
    ${renderedRows.join('\n    ')}
  \\end{DndMonsterSpells}
  `
  }

  // note that the latex formatter does not respect custom formatting
  // due to the way the command is formatted. so this is basically another renderer
  const getAttacks = () => {
    const renderedAttacks = []

    for (const attack of monster.attacks) {
      const showRange = attack.distance !== 'MELEE'
      const showReach = attack.distance !== 'RANGED'
      const distance =
        attack.distance === 'BOTH' ? 'both' : attack.distance.toLowerCase()
      const type = attack.kind.toLowerCase()
      const damageBonus = monster.attackDamageModifier(attack.id)
      const altBonus = attack.alternateDamage.modifier.override
        ? attack.alternateDamage.modifier.overrideValue
        : statModifier(monster.stats[attack.alternateDamage.modifier.stat])

      // library only has one plus damage field so we'll just kinda fill that out manually
      const additionalDamage = attack.additionalDamage.map((ad) => {
        return `\\DndDice{${ad.count}d${ad.dice}} ${ad.type}${ad.note}`
      })

      renderedAttacks.push(`\\DndMonsterAttack[
      name=${attack.name},
      distance=${distance},
      type=${type},
      mod=${renderBonus(monster.attackModifier(attack.id))},
      ${!showReach ? '%' : ''}reach=${attack.range.reach},
      ${!showRange ? '%' : ''}range=${attack.range.standard}/${
        attack.range.long
      },
      targets=${N2W.toWords(attack.targets)} target${
        attack.targets === 1 ? '' : 's'
      },
      dmg=\\DndDice{${attack.damage.count}d${attack.damage.dice}${renderBonus(
        damageBonus
      )}},
      dmg-type=${attack.damage.type},
      ${additionalDamage.length === 0 ? '%' : ''}plus-dmg={${listJoin(
        additionalDamage,
        ', '
      )}},
      ${!attack.alternateDamage.active ? '%' : ''}or-dmg=\\DndDice{${
        attack.alternateDamage.count
      }d${attack.alternateDamage.dice}${renderBonus(altBonus)}},
      ${!attack.alternateDamage.active ? '%' : ''}or-dmg-when={${
        attack.alternateDamage.condition
      }},
      extra={${latexFormatter(
        processTokens(attack.description, attack, monster, 'attack')
      )}}
    ]`)
    }

    return renderedAttacks.join('\n\n  ')
  }

  const getMultiattack = () => {
    return latexFormatter(renderer.multiattacks.value)
  }

  const getActions = () => {
    return renderer.actions.value.map((a) => latexFormatter(a)).join('\n ')
  }

  const getBonusActions = () => {
    if (renderer.bonusActions.value.length > 0) {
      return `\\DndMonsterSection{${t(
        'monster.bonusActions'
      )}}\n${renderer.bonusActions.value
        .map((a) => latexFormatter(a))
        .join('\n ')}`
    }

    return ''
  }

  const getLegendary = () => {
    const preamble = latexFormatter(renderer.legendaryPreamble.value)

    const formattedActions = monster.legendaryActions.actions.map((a) => {
      const action = monster.legendaryAction(a.actionId)

      if (action) {
        // process the name
        const count =
          a.cost > 1 ? t('editor.legendary.renderedCost', [a.cost]) : ''

        let description = ''
        if (action.type === 'action') {
          // process
          if (action.action.legendaryOnly) {
            // need it without the name attached
            description = processTokens(
              action.action.description,
              action.action as MonsterAction,
              monster,
              'action'
            )
          } else {
            description = processTokens(
              t('presets.legendaryAction', [action.action.name]),
              undefined,
              monster,
              'none'
            )
          }
        } else if (action.type === 'attack') {
          // process
          description = processTokens(
            t('presets.legendaryAttack', [action.action.name]),
            undefined,
            monster,
            'none'
          )
        }

        return `\\DndMonsterLegendaryAction{${
          action.action.name
        }${count}}{${latexFormatter(description)}}`
      }
    })

    return `\\DndMonsterSection{Legendary Actions}
  ${preamble}
  \\begin{DndMonsterLegendaryActions}
    ${formattedActions.join('\n  ')}
  \\end{DndMonsterLegendaryActions}`
  }

  const getMythicTrait = () => {
    return latexFormatter(renderer.mythicTrait.value)
  }

  const getMythic = () => {
    const preamble = latexFormatter(renderer.mythicPreamble.value)

    const formattedActions = monster.mythicActions.actions.map((a) => {
      const action = monster.legendaryAction(a.actionId)

      if (action) {
        // process the name
        const count =
          a.cost > 1 ? t('editor.legendary.renderedCost', [a.cost]) : ''

        let description = ''
        if (action.type === 'action') {
          // process
          if (action.action.legendaryOnly) {
            // need it without the name attached
            description = processTokens(
              action.action.description,
              action.action as MonsterAction,
              monster,
              'action'
            )
          } else {
            description = processTokens(
              t('presets.legendaryAction', [action.action.name]),
              undefined,
              monster,
              'none'
            )
          }
        } else if (action.type === 'attack') {
          // process
          description = processTokens(
            t('presets.legendaryAttack', [action.action.name]),
            undefined,
            monster,
            'none'
          )
        }

        return `\\DndMonsterLegendaryAction{${
          action.action.name
        }${count}}{${latexFormatter(description)}}`
      }
    })

    return `\\DndMonsterSection{Mythic Actions}
  ${preamble}
  \\begin{DndMonsterLegendaryActions}
    ${formattedActions.join('\n  ')}
  \\end{DndMonsterLegendaryActions}`
  }

  const getReactions = () => {
    const formattedReactions = renderer.reactions.value.map((r) =>
      latexFormatter(r)
    )

    return `\\DndMonsterSection{Reactions}
    ${formattedReactions.join('\n  ')}
  `
  }

  const getLairActions = () => {
    const preamble = `\\DndMonsterSection{${t('editor.lair.label')}}
${latexFormatter(renderer.lairActionPreamble.value)}`

    const formattedLairActions = renderer.lairActions.value.map((a) => {
      return `\\item ${latexFormatter(a)}`
    })

    return `${preamble}
    \\begin{itemize}
      ${formattedLairActions.join('\n')}
    \\end{itemize}`
  }

  const getRegionalEffects = () => {
    const preamble = `\\DndMonsterSection{${t('editor.regional.label')}}
  ${latexFormatter(renderer.regionalEffectPreamble.value)}`

    const formattedEffects = renderer.regionalEffects.value.map((a) => {
      return `\\item ${latexFormatter(a)}`
    })

    return `${preamble}
    \\begin{itemize}
      ${formattedEffects.join('\n')}
    \\end{itemize}`
  }

  const getInventory = () => {
    return `\\DndMonsterSection{${t(
      'editor.inventory.label'
    )}}\n${latexFormatter(renderer.inventory.value)}`
  }

  // exporter for the rpgtex template
  // https://github.com/rpgtex/DND-5e-LaTeX-Template
  // notes:
  // - latex renderer does not support custom cr values
  const renderLatex = (twoCol = false) => {
    const saves = renderer.saves.value

    return `\\begin{DndMonster}[${twoCol ? 'width=\\textwidth + 8pt' : ''}]{${
      monster.name
    }}
  ${twoCol ? '\\begin{multicols}{2}' : ''}
  \\DndMonsterType{${monster.size} ${monster.type}, ${monster.alignment}}
  \\DndMonsterBasics[
    armor-class = {${monster.AC}${
      monster.ACType === '' ? '' : ` (${monster.ACType})`
    }},
    hit-points = {\\DndDice{${monster.HP.HD}d${monster.HP.type}${renderBonus(
      monster.HP.modifier
    )}}},
    speed = {${renderer.speeds.value}}
  ]

  \\DndMonsterAbilityScores[
    str = ${monster.stats.STR},
    dex = ${monster.stats.DEX},
    con = ${monster.stats.CON},
    int = ${monster.stats.INT},
    wis = ${monster.stats.WIS},
    cha = ${monster.stats.CHA},
  ]

  \\DndMonsterDetails[
    ${saves === '' ? '%' : ''}saving-throws = {${saves}},
    ${monster.skills.length === 0 ? '%' : ''}skills = {${
      renderer.skills.value
    }},
    ${
      monster.vulnerabilities.length === 0 ? '%' : ''
    }damage-vulnerabilities = {${renderer.vulnerabilities.value}},
    ${monster.resistances.length === 0 ? '%' : ''}damage-resistances = {${
      renderer.resistances.value
    }},
    ${monster.immunities.length === 0 ? '%' : ''}damage-immunities = {${
      renderer.immunities.value
    }},
    ${monster.conditions.length === 0 ? '%' : ''}condition-immunities = {${
      renderer.conditions.value
    }},
    senses = {${renderer.senses.value}},
    languages = {${monster.languages}},
    challenge = {${CR[monster.CR].cr}},
  ]

  % Traits
  ${getTraits()}

  ${monster.mythicActions.actions.length > 0 ? getMythicTrait() : ''}

  % Actions
  \\DndMonsterSection{${t('editor.action.label')}}
  ${monster.multiattacks.length > 0 ? getMultiattack() : ''}

  ${getAttacks()}

  ${getActions()}

  % Spellcasting
  ${monster.spellcasting.atWill.length > 0 ? getAtWill() : ''}

  ${monster.spellcasting.standard.length > 0 ? getStandard() : ''}

  ${getBonusActions()}

  ${monster.legendaryActions.count > 0 ? getLegendary() : ''}

  ${monster.mythicActions.actions.length > 0 ? getMythic() : ''}

  ${monster.reactions.length > 0 ? getReactions() : ''}

  ${monster.lairActions.length > 0 ? getLairActions() : ''}

  ${monster.regionalEffects.length > 0 ? getRegionalEffects() : ''}

  ${monster.inventory !== '' ? getInventory() : ''}

  ${twoCol ? '\\end{multicols}' : ''}
\\end{DndMonster}`
  }

  return {
    renderLatex,
  }
}
