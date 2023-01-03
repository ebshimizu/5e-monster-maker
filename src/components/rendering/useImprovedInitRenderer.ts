import { CR } from 'src/data/CR'
import { useMonsterStore } from 'src/stores/monster-store'
import { useI18n } from 'vue-i18n'
import { DndStat, MonsterAction } from '../models'
import { avgRoll, renderBonus, statModifier } from './mathRendering'
import { useProcessTokens } from './useProcessTokens'
import { useTextRenderer } from './useTextRenderer'
import slugify from 'slugify'

const statMap = {
  STR: 'Str',
  DEX: 'Dex',
  CON: 'Con',
  INT: 'Int',
  WIS: 'Wis',
  CHA: 'Cha',
}

const attackNoName =
  '<i>{attack.distance}:</i> {attack.modifier} to hit, {attack.range}, {attack.targets}. <i>Hit:</i> {attack.damage}{attack.conditionalDamage}{attack.additionalDamage}. {attack.description}'

export function useImprovedInitRenderer() {
  const monster = useMonsterStore()
  const renderer = useTextRenderer()
  const { processTokens, stripTags } = useProcessTokens()
  const { t } = useI18n()

  // https://www.improved-initiative.com/
  const renderImprovedInitJson = async () => {
    // improved init has a manifest for what creatures are in the data file
    // manifest
    const iiManifest = [slugify(monster.name)]

    // listen i'm not writing an interface for this i'm guessing at the types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ii: any = {}

    // basics
    ii.Id = iiManifest[0] // slugified id
    ii.Name = monster.name
    ii.Path = ''

    // could put the full data link here but i don't see this field on
    // improved initiative?
    ii.Link = 'https://ebshimizu.github.io/5emm/'

    ii.SearchHint = `${monster.name}\n${monster.type}\n${monster.alignment}`
    ii.FilterDimensions = {
      Level: CR[monster.CR].cr,
      Source: "Homebrew (Falindrith's Monster Maker)",
      Type: `${monster.size} ${monster.type}, ${monster.alignment}`,
    }
    ii.LastUpdateMs = 0
    ii.Version = '1.0.0'
    ii.Source = "Homebrew (Falindrith's Monster Maker)"
    ii.Type = `${monster.size} ${monster.type}, ${monster.alignment}`
    ii.HP = {
      Value: avgRoll(monster.HP.HD, monster.HP.type) + monster.HP.modifier,
      Notes: `(${monster.HP.HD}d${monster.HP.type}${renderBonus(
        monster.HP.modifier
      )})`,
    }
    ii.InitiativeModifier = statModifier(monster.stats.DEX)
    ii.InitiativeAdvantage = false // TODO: 5emm needs a flag for that maybe
    ii.Speed = []
    monster.speeds.forEach((s) => {
      ii.Speed.push(`${s.type ?? 'walk'} ${s.speed} ft.`)
    })
    ii.AC = {
      Value: monster.AC,
      Notes: monster.ACType,
    }

    ii.Abilities = {}
    ii.Saves = []

    // stats
    for (const stat in monster.stats) {
      ii.Abilities[statMap[stat as DndStat]] = monster.stats[stat as DndStat]

      // save, only add if proficient or overridden
      const save = monster.saves[stat as DndStat]

      if (save.override) {
        ii.Saves.push({
          Name: statMap[stat as DndStat],
          Modifier: save.overrideValue,
        })
      } else if (save.proficient) {
        ii.Saves.push({
          Name: statMap[stat as DndStat],
          Modifier: monster.defaultSaveBonus(stat as DndStat),
        })
      }
    }

    ii.DamageVulnerabilities = monster.vulnerabilities
    ii.DamageResistances = monster.resistances
    ii.DamageImmunities = monster.immunities
    ii.ConditionImmunities = monster.conditions

    // skills
    ii.Skills = []
    // convert to lower case and replace ' ' with '_' (idk if this is how it actually works)S
    for (const skill of monster.skills) {
      const key = skill.skill.label

      if (skill.override) {
        ii.Skills.push({
          Name: key,
          Modifier: skill.overrideValue,
        })
      } else {
        ii.Skills.push({
          Name: key,
          Modifier: monster.defaultSkillBonus(skill),
        })
      }
    }

    // immunities, resistances, senses, languages
    ii.Senses = []
    Object.entries(monster.senses).forEach(([sense, range]) => {
      if (range > 0) {
        ii.Senses.push(`${sense} ${range} ft.`)
      }
    })
    ii.Senses.push(`passive Perception ${monster.computedPassivePerception}`)

    ii.Languages = monster.languages.split(',')
    ii.Challenge = CR[monster.CR].cr

    // traits
    ii.Traits = []
    for (const trait of monster.traits) {
      // name includes uses
      const name = processTokens(
        '{trait.name}{trait.limitedUse}',
        trait,
        monster,
        'trait'
      )

      ii.Traits.push({
        Name: name,
        Content: stripTags(
          processTokens(trait.description, trait, monster, 'trait')
        ),
      })
    }

    // actions includes multiattack, regular attack, and extra actions
    ii.Actions = []

    // tarrasque io likes to have multiattack first looks like
    if (monster.multiattacks.length > 0) {
      ii.Actions.push({
        Name: 'Multiattack',
        Content: stripTags(
          processTokens(
            '{multiattack.all}. {multiattack.postscript}',
            monster.multiattacks,
            monster,
            'multiattack'
          )
        ),
      })
    }

    // attacks next
    for (const attack of monster.attacks) {
      ii.Actions.push({
        Name: attack.name,
        Content: stripTags(
          processTokens(attackNoName, attack, monster, 'attack')
        ),
      })
    }

    // full actions
    const regularActions = monster.actions.filter(
      (a) => !a.legendaryOnly && !a.bonusAction
    )

    for (const action of regularActions) {
      const name = stripTags(
        processTokens(
          '{action.name}{action.limitedUse}',
          action,
          monster,
          'action'
        )
      )

      ii.Actions.push({
        Name: name,
        Content: stripTags(
          processTokens(action.description, action, monster, 'action')
        ),
      })
    }

    // bonus actions
    const bonusActions = monster.actions.filter((a) => a.bonusAction)
    for (const ba of bonusActions) {
      const name = stripTags(
        processTokens('{action.name}{action.limitedUse}', ba, monster, 'action')
      )

      ii.Actions.push({
        Name: name,
        Content: stripTags(
          processTokens(ba.description, ba, monster, 'action')
        ),
      })
    }

    // legendary actions
    // Improved init doesn't have a preamble
    ii.LegendaryActions = []
    if (monster.legendaryActions.actions.length > 0) {
      for (const a of monster.legendaryActions.actions) {
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

          ii.LegendaryActions.push({
            Name: action.action.name + count,
            Content: stripTags(description),
          })
        }
      }
    }

    // mythic actions
    // same as legendary with the words replaced
    if (monster.mythicActions.actions.length > 0) {
      for (const a of monster.mythicActions.actions) {
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

          ii.MythicActions.push({
            Name: action.action.name + count,
            Content: stripTags(description),
          })
        }
      }
    }

    // spellcasting
    // this counts as a special ability
    // we're just gonna basically copy-pasta the markdown exporter for the description...
    const spellcasting = monster.spellcasting
    if (spellcasting.standard.length > 0) {
      const renderedRows = []
      const cantrips = monster.knownSpellsOfLevel(0)

      if (cantrips.length > 0)
        renderedRows.push(
          `> ${t('editor.spellcasting.slot.cantripLabel')} *${cantrips.join(
            ', '
          )}*  `
        )

      renderer.classSpellcastingSlots.value.forEach((slot) => {
        renderedRows.push(`${slot.renderedLabel} ${slot.renderedSpells}`)
      })

      const preamble = renderer.classSpellcastingPreamble.value
      const renderedSpellcasting = `${preamble}\n• ${renderedRows.join('\n• ')}`

      ii.Actions.push({
        Name: t('editor.spellcasting.class.label'),
        Content: stripTags(renderedSpellcasting),
      })
    }

    // innate
    // more pasta
    if (spellcasting.atWill.length > 0) {
      const atWillRendered = renderer.innateSpellcastingLists.value
        .map((list) => `${list.renderedLabel} ${list.renderedSpells}`)
        .join('\n• ')

      ii.Actions.push({
        Name: t('editor.spellcasting.innate.label'),
        Content: stripTags(
          `${renderer.innateSpellcastingPreamble.value}\n• ${atWillRendered}`
        ),
      })
    }

    // hold up reaction time
    ii.Reactions = []
    if (monster.reactions.length > 0) {
      for (const reaction of monster.reactions) {
        ii.Reactions.push({
          Name: reaction.name,
          Content: stripTags(
            processTokens(reaction.description, undefined, monster, 'none')
          ),
        })
      }
    }

    // i don't know what these fields are
    ii.Description = ''
    ii.Player = ''
    ii.ImageURL = '' // ok well i do know what this one is but we don't use it

    return JSON.stringify({
      Creatures: iiManifest,
      [`Creatures.${iiManifest[0]}`]: ii,
    })
  }

  return {
    renderImprovedInitJson,
  }
}
