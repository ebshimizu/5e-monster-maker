import { CR } from 'src/data/CR'
import { useMonsterStore } from 'src/stores/monster-store'
import { useI18n } from 'vue-i18n'
import { DndAttack, DndStat, MonsterAction } from '../models'
import { avgRoll, renderBonus } from './mathRendering'
import { useProcessTokens } from './useProcessTokens'
import { useTextRenderer } from './useTextRenderer'

const statMap = {
  STR: 'strength',
  DEX: 'dexterity',
  CON: 'constitution',
  INT: 'intelligence',
  WIS: 'wisdom',
  CHA: 'charisma',
}

const attackNoName =
  '<i>{attack.distance}:</i> {attack.modifier} to hit, {attack.range}, {attack.targets}. <i>Hit:</i> {attack.damage}{attack.conditionalDamage}{attack.additionalDamage}. {attack.description}'

// this one's for tarrasque.io
// since i like using niche things, it exists here
export function useTarrasqueRenderer() {
  const monster = useMonsterStore()
  const renderer = useTextRenderer()
  const { processTokens, stripTags } = useProcessTokens()
  const { t } = useI18n()

  // does not account for versatile
  const attackDamageDice = (attack: DndAttack) => {
    const base = `${attack.damage.count}d${attack.damage.dice}`

    const extra =
      attack.additionalDamage.length > 0
        ? `+${attack.additionalDamage
            .map((ad) => `${ad.count}d${ad.dice}`)
            .join('+')}`
        : ''

    return base + extra
  }

  // Tarrasque.io also uses JSON so we'll corral the 5emm monster data into tarrasque's format
  const renderTarrasqueJson = () => {
    const tio: any = {}

    // basics
    tio.name = monster.name
    tio.size = monster.size
    tio.type = monster.type
    tio.subtype = '' // 5emm doesn't have a subtype field
    tio.alignment = monster.alignment
    tio.armor_class = monster.AC
    tio.armor_type = monster.ACType
    tio.hit_points =
      avgRoll(monster.HP.HD, monster.HP.type) + monster.HP.modifier
    tio.hit_dice = `${monster.HP.HD}d${monster.HP.type}${renderBonus(
      monster.HP.modifier
    )}`
    tio.speed = monster.speeds
      .map((s) => `${s.speed} ft. ${s.type}${s.note === '' ? '' : s.note}`)
      .join(', ')

    tio.speed_json = {}
    monster.speeds.forEach((s) => {
      tio.speed_json[s.type ?? 'unknown'] = s.speed
    })

    // stats
    for (const stat in monster.stats) {
      tio[statMap[stat as DndStat]] = monster.stats[stat as DndStat]

      // save, only add if proficient or overridden
      const save = monster.saves[stat as DndStat]
      const key = `${statMap[stat as DndStat]}_save`

      if (save.override) {
        tio[key] = save.overrideValue
      } else if (save.proficient) {
        tio[key] = monster.defaultSaveBonus(stat as DndStat)
      }
    }

    // skills
    // convert to lower case and replace ' ' with '_' (idk if this is how it actually works)S
    for (const skill of monster.skills) {
      const key = skill.skill.label.toLowerCase().replace(' ', '_')

      if (skill.override) {
        tio[key] = skill.overrideValue
      } else {
        tio[key] = monster.defaultSkillBonus(skill)
      }
    }

    // immunities, resistances, senses, languages
    tio.damage_vulnerabilities = renderer.vulnerabilities.value
    tio.damage_resistances = renderer.resistances.value
    tio.damage_immunities = renderer.immunities.value
    tio.condition_immunities = renderer.immunities.value
    tio.senses = renderer.senses.value

    tio.languages = monster.languages
    tio.challenge_rating = CR[monster.CR].cr

    // traits
    // tarrasque.io calls these special abilities
    tio.special_abilities = []
    for (const trait of monster.traits) {
      // name includes uses
      const name = processTokens(
        '{trait.name}{trait.limitedUse}',
        trait,
        monster,
        'trait'
      )

      tio.special_abilities.push({
        name,
        desc: stripTags(
          processTokens(trait.description, trait, monster, 'trait')
        ),
        attack_bonus: trait.crAnnotation.maxModifier,
      })
    }

    // actions includes multiattack, regular attack, and extra actions
    tio.actions = []

    // tarrasque io likes to have multiattack first looks like
    if (monster.multiattacks.length > 0) {
      tio.actions.push({
        name: 'Multiattack',
        desc: stripTags(
          processTokens(
            '{multiattack.all}. {multiattack.postscript}',
            monster.multiattacks,
            monster,
            'multiattack'
          )
        ),
        attack_bonus: 0,
      })
    }

    // attacks next
    for (const attack of monster.attacks) {
      tio.actions.push({
        name: attack.name,
        desc: stripTags(processTokens(attackNoName, attack, monster, 'attack')),
        attack_bonus: monster.attackModifier(attack.id),
        damage_dice: attackDamageDice(attack),
        damage_bonus: monster.attackDamageModifier(attack.id),
      })
    }

    // generic actions
    // I don't currently have a "damage dice" field for this so we're gonna leave it blank and hope it doesn't explode
    const regularActions = monster.actions.filter((a) => !a.legendaryOnly)

    for (const action of regularActions) {
      const name = stripTags(
        processTokens(
          '{action.name}{action.limitedUse}',
          action,
          monster,
          'action'
        )
      )

      tio.actions.push({
        name,
        desc: stripTags(
          processTokens(action.description, action, monster, 'action')
        ),
        attack_bonus: action.crAnnotation.maxModifier,
      })
    }

    // legendary actions
    if (monster.legendaryActions.actions.length > 0) {
      tio.legendary_desc = renderer.legendaryPreamble.value

      tio.legendary_actions = []
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

          tio.legendary_actions.push({
            name: action.action.name + count,
            desc: stripTags(description),
            attack_bonus: 0,
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

      tio.special_abilities.push({
        name: t('editor.spellcasting.class.label'),
        desc: stripTags(renderedSpellcasting),
        attack_bonus: 0,
      })
    }

    // innate
    // more pasta
    if (spellcasting.atWill.length > 0) {
      const atWillRendered = renderer.innateSpellcastingLists.value.join('\n• ')

      tio.special_abilities.push({
        name: t('editor.spellcasting.innate.label'),
        desc: stripTags(
          `${renderer.innateSpellcastingPreamble.value}\n• ${atWillRendered}`
        ),
        attack_bonus: 0,
      })
    }

    const spells = monster.spellcasting.standard
    for (const atWill of monster.spellcasting.atWill) {
      spells.push(...atWill.spells)
    }

    if (spells.length > 0) tio.spellList = spells

    // hold up reaction time
    if (monster.reactions.length > 0) {
      tio.reactions = []
      for (const reaction of monster.reactions) {
        tio.reactions.push({
          name: reaction.name,
          desc: stripTags(
            processTokens(reaction.description, undefined, monster, 'none')
          ),
          attack_bonus: 0,
        })
      }
    }

    tio.group = 'Custom (5e Monster Maker)'
    return JSON.stringify(tio)
  }

  return {
    renderTarrasqueJson,
  }
}
