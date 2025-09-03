import { MaybeRef } from '@vueuse/core'
import { useMonsterStore } from 'src/stores/monster-store'
import { unref } from 'vue'
import {
  DndAttack,
  Monster,
  MonsterAction,
  MonsterReaction,
  MonsterTrait,
} from '../models'
import { avgRoll, renderBonus, saveForAction } from './mathRendering'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import N2W from 'number-to-words'
import { useClasses } from 'src/data/CLASS'
import { getCrByNumber, getCrByString } from 'src/data/CR'
import { useEditorStore } from 'src/stores/editor-store'

export type MonsterContext =
  | MonsterTrait
  | Monster['spellcasting']
  | DndAttack
  | MonsterAction
  | Monster['multiattacks']
  | Monster['legendaryActions']
  | Monster['mythicActions']
  | MonsterReaction
  | undefined

export type MonsterContextType =
  | 'none'
  | 'trait'
  | 'attack'
  | 'spell'
  | 'action'
  | 'multiattack'
  | 'legendary'
  | 'mythic'
  | 'reaction'

export function listJoin(list: string[], sep: string) {
  if (list.length === 1) return list[0]

  const part1 = list.slice(0, list.length - 1).join(sep)
  return `${part1}, and ${list[list.length - 1]}`
}

export function useProcessTokens() {
  const { t } = useI18n()
  const classes = useClasses()
  const editorStore = useEditorStore()

  const processMonsterTokens = (
    input: string,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    // hehe cheating
    // monster hp
    const hp = RegExp(/\{monster.hp\}/gi)
    input = input.replace(hp, () => {
      return `{${monster.HP.HD}d${monster.HP.type}+${monster.HP.modifier}}`
    })

    // dice: {xdy+z}
    const dice = RegExp(/\{(\d+)d(\d+)[ ]*([+-][ ]*\d+)?\}/gi)
    input = input.replace(dice, (match, count, dice, modifier) => {
      const cleanModifier =
        modifier && modifier !== '' ? parseInt(modifier.replace(' ', '')) : 0

      const diceVal = parseInt(dice)
      const countVal = parseInt(count)

      const avg = avgRoll(countVal, diceVal) + cleanModifier

      if (diceVal === 1 || countVal === 0) {
        return `${avg}`
      }

      return `${avg} (${count}d${dice}${
        modifier ? renderBonus(cleanModifier) : ''
      })`
    })

    // saves
    const save = RegExp(/\{DC:(\w{3})\}/gi)
    input = input.replace(save, (match, stat) => {
      if (stat in monster.stats) {
        return `DC ${monster.defaultSpellSave(stat)}`
      } else return match
    })

    // attack modifier
    const attack = RegExp(/\{A:(\w{3})\}/gi)
    input = input.replace(attack, (match, stat) => {
      if (stat in monster.stats) {
        return renderBonus(monster.defaultSpellAttackModifier(stat))
      } else return match
    })

    // monster name
    // TODO: this is en-us specific
    input = input.replace(
      /\{NAME\}/gi,
      `${monster.useArticleInToken ? 'the ' : ''}${
        monster.nickname !== '' ? monster.nickname : monster.name
      }`
    )

    // continuing with caps for name token
    // this is case sensitive actually
    input = input.replace(/(?:\.\s*|^)\s*(?:<\/?[b|i]>)*\s*(the)/gm, (match) =>
      match.replace('the', 'The')
    )

    // XP rendering
    const xp = RegExp(/\{XP:([\d/]+|monster)(\+)?\}/gi)
    input = input.replace(xp, (match, cr, additive) => {
      // change lookup based on token used
      const crData =
        cr.toLowerCase() === 'monster'
          ? getCrByNumber(monster.CR)
          : getCrByString(cr)

      if (crData) {
        if (additive != null) {
          // add xp to the monster's cr
          const monsterCr = getCrByNumber(monster.CR)

          return `${(crData.xp + monsterCr.xp).toLocaleString()} XP`
        } else {
          return `${crData.xp.toLocaleString()} XP`
        }
      } else {
        return match
      }
    })

    // generic tokens
    const generic = RegExp(/\{monster.([\w\d\[\].]+)}/gi)
    input = input.replace(generic, (match, prop) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value: any = _.get(monster, prop)

      return value
    })

    return input
  }

  const processTraitTokens = (input: string, context: MonsterTrait) => {
    // limitedUse is a special case
    const limitedUse = ` (${context.limitedUse.count}/${t(
      `recharge.${context.limitedUse.rate}`
    )})`
    input = input.replace(
      /\{trait.limitedUse\}/gi,
      `${context.limitedUse.count > 0 ? limitedUse : ''}`
    )

    // localize the rate string
    input = input.replace(
      /\{trait.limitedUse.rate\}/gi,
      t(`recharge.${context.limitedUse.rate}`)
    )

    return input
  }

  const processSpellTokens = (
    input: string,
    context: Monster['spellcasting'],
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    // level but ordinal
    input = input.replace(
      /\{spellcasting.ordinal\}/gi,
      N2W.toOrdinal(context.level)
    )

    // stat
    input = input.replace(
      /\{spellcasting.stat\}/gi,
      t(`statFull.${context.stat}`)
    )

    // spell save
    input = input.replace(/\{spellcasting.save\}/gi, `DC ${monster.spellSave}`)

    // spell attack
    input = input.replace(
      /\{spellcasting.attack\}/gi,
      renderBonus(monster.spellAttackModifier)
    )

    // ability modifier
    input = input.replace(
      /\{spellcasting.ability\}/gi,
      renderBonus(monster.spellAbilityModifier)
    )

    // class
    if (context.class && context.class in classes.SrdClass.value) {
      input = input.replace(
        /\{spellcasting.class\}/gi,
        t(`class.${context.class}`)
      )
    } else {
      input = input.replace(/\{spellcasting.class\}/gi, context.class ?? '')
    }

    return input
  }

  const processAttackTokens = (
    input: string,
    context: DndAttack,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    // attack is a... complicated bit of rendering
    // attack distance
    const distance =
      editorStore.style === '2024'
        ? t('editor.attack.distance', [t(`range.${context.distance}`)])
        : t('editor.attack.distance2014', [
            t(`range.${context.distance}`),
            t(`kind.${context.kind}`),
          ])

    input = input.replace(/\{attack.distance\}/gi, `${distance}`)

    // attack modifier
    input = input.replace(
      /\{attack.modifier\}/gi,
      renderBonus(monster.attackModifier(context.id))
    )

    // range
    const meleeRange = t('editor.attack.meleeRange', [context.range.reach])
    const rangeRange = t('editor.attack.rangeRange', [
      context.range.standard,
      context.range.long,
    ])
    const bothRange = t('editor.attack.bothRange', [
      context.range.reach,
      context.range.standard,
      context.range.long,
    ])

    input = input.replace(
      /\{attack.range\}/gi,
      context.distance === 'MELEE'
        ? meleeRange
        : context.distance === 'RANGED'
        ? rangeRange
        : bothRange
    )

    // targets
    input = input.replace(
      /\{attack.targets\}/gi,
      t(
        'editor.attack.targets',
        {
          count: N2W.toWords(context.targets),
        },
        context.targets
      )
    )

    // primary damage
    const damageModifier = monster.attackDamageModifier(context.id)
    const modifier =
      damageModifier < 0 ? `${damageModifier}` : `+${damageModifier}`
    const primary = t('editor.attack.damage', [
      `{${context.damage.count}d${context.damage.dice}${
        damageModifier === 0 ? '' : modifier
      }} ${context.damage.type}`,
    ])
    input = input.replace(/\{attack.damage\}/gi, primary)

    // conditional damage
    const conditionalDamageModifier = monster.conditionalDamageModifier(
      context.id
    )
    const condMod =
      conditionalDamageModifier < 0
        ? `${conditionalDamageModifier}`
        : `+${conditionalDamageModifier}`
    const conditional = t('editor.attack.damage', [
      `{${context.alternateDamage.count}d${context.alternateDamage.dice}${
        conditionalDamageModifier === 0 ? '' : condMod
      }} ${context.alternateDamage.type}`,
    ])
    input = input.replace(
      /\{attack.conditionalDamage\}/gi,
      context.alternateDamage.active
        ? t('editor.attack.conditionalDamage', [
            conditional,
            context.alternateDamage.condition,
          ])
        : ''
    )

    // additional damage
    const additional = context.additionalDamage.map((d) => {
      const damage = `{${d.count}d${d.dice}} ${d.type}`

      if (d.note !== '') {
        return `${t('editor.attack.damage', [damage])} ${d.note}`
      } else {
        return t('editor.attack.damage', [damage])
      }
    })
    input = input.replace(
      /\{attack.additionalDamage\}/gi,
      context.additionalDamage.length > 0
        ? t('editor.attack.additionalDamage', [listJoin(additional, ', ')])
        : ''
    )

    return input
  }

  const processActionTokens = (input: string, context: MonsterAction) => {
    // format the effects
    // we run this replacement first, because the effects can have other tokens in them
    const effects = context.effects
      .map((e) => `<i>${e.case}:</i> ${e.effect}`)
      .join(' ')
    input = input.replace(/\{action.effects\}/gi, effects)

    // limitedUse is a special case
    const limitedUse =
      context.recharge === ''
        ? ` (${context.limitedUse.count}/${t(
            `recharge.${context.limitedUse.rate}`
          )})`
        : ` ${t('editor.action.recharge', [context.recharge])}`

    input = input.replace(
      /\{action.limitedUse\}/gi,
      `${
        context.limitedUse.count > 0 || context.recharge !== ''
          ? limitedUse
          : ''
      }`
    )

    // localize the rate string
    input = input.replace(
      /\{action.limitedUse.rate\}/gi,
      t(`recharge.${context.limitedUse.rate}`)
    )

    return input
  }

  const processReactionTokens = (input: string, context: MonsterReaction) => {
    // limitedUse is a special case
    const limitedUse = ` (${context.limitedUse.count}/${t(
      `recharge.${context.limitedUse.rate}`
    )})`

    input = input.replace(
      /\{reaction.limitedUse\}/gi,
      `${context.limitedUse.count > 0 ? limitedUse : ''}`
    )

    // localize the rate string
    input = input.replace(
      /\{reaction.limitedUse.rate\}/gi,
      t(`recharge.${context.limitedUse.rate}`)
    )

    return input
  }

  const processMultiattackTokens = (
    input: string,
    context: Monster['multiattacks'],
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    // multiattack is a rather unique renderer at the moment
    // we're going to construct a different data structure while rendering (this might form the basis
    // of the planned revision in 2.1)
    const renderedMa: { attacks: string[]; actions: string[]; full: string }[] =
      []

    for (const ma of context) {
      // map attacks
      const collatedAttacks: Record<string, number> = {}

      ma.attacks.forEach((aId) => {
        if (!(aId in collatedAttacks)) {
          collatedAttacks[aId] = 0
        }

        collatedAttacks[aId] += 1
      })

      // render attacks
      const attacks = Object.entries(collatedAttacks).map(([id, count]) => {
        return t(
          'editor.multiattack.attack',
          { a: `${N2W.toWords(count)} ${monster.attackName(id)}` },
          count
        )
      })

      // map actions
      const collatedActions: Record<string, number> = {}

      ma.actions.forEach((aId) => {
        if (!(aId in collatedActions)) {
          collatedActions[aId] = 0
        }

        collatedActions[aId] += 1
      })

      // render actions
      const actions = Object.entries(collatedActions).map(([id, count]) => {
        return t(
          'editor.multiattack.action',
          {
            a: monster.actionName(id),
            count: N2W.toWords(count),
          },
          count
        )
      })

      // the full string
      // TODO: this isn't very i18n friendly
      let multiattackAll = ''
      if (actions.length > 0) {
        multiattackAll = `uses ${listJoin(actions, ', ')}${
          actions.length > 0 ? ` followed by ${listJoin(attacks, ', ')}` : ''
        }`
      } else {
        multiattackAll = `makes ${listJoin(attacks, ', ')}`
      }

      renderedMa.push({
        attacks,
        actions,
        full: multiattackAll,
      })
    }

    // render everything
    const multiattackAll = `{NAME} ${renderedMa
      .map((ma) => ma.full)
      .join(' or ')}`

    // ok so now the renderedMa object is the context
    input = input.replace(/\{multiattack.all\}/gi, multiattackAll)

    input = input.replace(
      /\{multiattack.postscript\}/gi,
      monster.multiattackOptions.postscript
    )

    // context tokens accessible via "rendered"
    const generic = RegExp(/\{(?:multiattack).([\w\d\[\].]+)}/gi)
    input = input.replace(generic, (match, prop) => {
      const value = _.get({ rendered: renderedMa }, prop)

      return value
    })

    return input
  }

  const processLegendaryTokens = (
    input: string,
    context: Monster['legendaryActions']
  ) => {
    input = input.replace(
      /\{legendaryActions.actions\}/gi,
      t('editor.action.plural', context.count)
    )

    return input
  }

  const processContextTokens = (
    input: string,
    context: MonsterContext,
    contextType: MonsterContextType,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    // context tokens first
    if (contextType === 'trait') {
      input = processTraitTokens(input, context as MonsterTrait)
    } else if (contextType === 'spell') {
      input = processSpellTokens(
        input,
        context as Monster['spellcasting'],
        monster
      )
    } else if (contextType === 'attack') {
      input = processAttackTokens(input, context as DndAttack, monster)
    } else if (contextType === 'action') {
      input = processActionTokens(input, context as MonsterAction)
    } else if (contextType === 'multiattack') {
      input = processMultiattackTokens(
        input,
        context as Monster['multiattacks'],
        monster
      )
    } else if (contextType === 'legendary') {
      input = processLegendaryTokens(
        input,
        context as Monster['legendaryActions']
      )
    } else if (contextType === 'reaction') {
      input = processReactionTokens(input, context as MonsterReaction)
    }

    if (context != null) {
      // generic tokens
      const generic = RegExp(
        /\{(?:trait|attack|action|spellcasting|legendaryActions|mythicActions|reaction).([\w\d\[\].]+)}/gi
      )
      input = input.replace(generic, (match, prop) => {
        const value = _.get(context, prop)

        return value
      })
    }

    return input
  }

  const processTokens = (
    input: string,
    context: MonsterContext,
    monster: ReturnType<typeof useMonsterStore>,
    contextType: MonsterContextType
  ) => {
    // specific parsing
    input = processContextTokens(input, context, contextType, monster)

    // general parsing
    input = processMonsterTokens(input, monster)

    return input
  }

  const processTrait = (
    contextRef: MaybeRef<MonsterTrait>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)

    if (context.customPreamble) {
      return processTokens(context.description, context, monster, 'trait')
    } else {
      return processTokens(
        `<b><i>{trait.name}{trait.limitedUse}.</i></b> ${context.description}`,
        context,
        monster,
        'trait'
      )
    }
  }

  const processAction = (
    contextRef: MaybeRef<MonsterAction>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)

    if (context.customPreamble) {
      return processTokens(context.description, context, monster, 'action')
    } else if (context.stat !== 'none') {
      return processTokens(
        `<b><i>{action.name}{action.limitedUse}.</i></b> <i>${t(
          `statFull.${context.stat}`
        )} Saving Throw:</i> DC ${saveForAction(
          monster,
          context.stat,
          context.save
        )}, {action.range}. {action.effects} ${context.description}`,
        context,
        monster,
        'action'
      )
    } else {
      return processTokens(
        `<b><i>{action.name}{action.limitedUse}.</i></b> ${context.description}`,
        context,
        monster,
        'action'
      )
    }
  }

  const processReaction = (
    contextRef: MaybeRef<MonsterReaction>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)

    // case on the presence of a Trigger to choose old style rendering or new
    if (context.trigger === '') {
      return processTokens(
        `<b><i>${context.name}{reaction.limitedUse}.</i></b> ${context.description}`,
        context,
        monster,
        'reaction'
      )
    } else {
      return processTokens(
        `<b><i>${context.name}{reaction.limitedUse}.</i></b> <i>${t(
          'monster.reaction.trigger'
        )}:</i> ${context.trigger} <i>${t('monster.reaction.response')}:</i> ${
          context.description
        }`,
        context,
        monster,
        'reaction'
      )
    }
  }

  const processAttack = (
    contextRef: MaybeRef<DndAttack>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)

    if (context.useCustomRenderer) {
      return processTokens(context.customRenderer, context, monster, 'attack')
    } else {
      return processTokens(t('presets.attack'), context, monster, 'attack')
    }
  }

  const processClassSpellcasting = (
    contextRef: MaybeRef<Monster['spellcasting']>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)

    if (context.useCustomClassPreamble) {
      return processTokens(
        context.customClassPreamble,
        context,
        monster,
        'spell'
      )
    } else {
      return processTokens(
        t('presets.classSpellcasting'),
        context,
        monster,
        'spell'
      )
    }
  }

  const processInnateSpellcasting = (
    contextRef: MaybeRef<Monster['spellcasting']>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)

    if (context.useCustomInnatePreamble) {
      return processTokens(
        context.customInnatePreamble,
        context,
        monster,
        'spell'
      )
    } else {
      return processTokens(
        editorStore.style === '2014'
          ? t('presets.innateSpellcasting2014')
          : t('presets.innateSpellcasting'),
        context,
        monster,
        'spell'
      )
    }
  }

  const processMultiattack = (
    contextRef: MaybeRef<Monster['multiattacks']>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)
    if (monster.multiattackOptions.useCustomRenderer) {
      return processTokens(
        monster.multiattackOptions.customMultiattackRenderer,
        context,
        monster,
        'multiattack'
      )
    } else {
      // not doing i18n for this right now since it's just tokens.
      return processTokens(
        `<b><i>${t(
          'editor.multiattack.label'
        )}.</i></b> {multiattack.all}. {multiattack.postscript}`,
        context,
        monster,
        'multiattack'
      )
    }
  }

  const processLegendaryPreamble = (
    contextRef: MaybeRef<Monster['legendaryActions']>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)

    if (monster.legendaryActions.useCustomPreamble) {
      return processTokens(
        monster.legendaryActions.customPreamble,
        context,
        monster,
        'legendary'
      )
    } else {
      return processTokens(
        t('presets.legendaryActions'),
        context,
        monster,
        'legendary'
      )
    }
  }

  const processLegendaryAction = (
    actionId: string,
    cost: number,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const action = monster.legendaryAction(actionId)

    if (action) {
      // process the name
      const count = cost > 1 ? t('editor.legendary.renderedCost', [cost]) : ''

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

      return `<b><i>${action.action.name}${count}.</b></i> ${description}`
    }

    return '[Invalid Attack or Action ID]'
  }

  const processMythicActionTrait = (
    contextRef: MaybeRef<Monster['mythicActions']>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)

    const trait = processTokens(
      context.triggerDescription,
      context,
      monster,
      'mythic'
    )

    return `<b><i>${context.triggerName} (${context.triggerRecharge}).</b></i> ${trait}`
  }

  const processMythicActionPreamble = (
    contextRef: MaybeRef<Monster['mythicActions']>,
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    const context = unref(contextRef)

    const preamble = processTokens(context.preamble, context, monster, 'mythic')

    return preamble
  }

  const processLairActionPreamble = (
    monster: ReturnType<typeof useMonsterStore>
  ) => {
    if (monster.useCustomLairActionPreamble) {
      return processTokens(
        monster.lairActionPreamble,
        undefined,
        monster,
        'none'
      )
    } else {
      return processTokens(t('presets.lair'), undefined, monster, 'none')
    }
  }

  const sanitizeWebString = (input: string) => {
    // allowed tags are: bold, italic, underline
    input = input.replace(/>/gi, '&gt;')
    input = input.replace(/</gi, '&lt;')

    // allow b/i/u
    const allowedTags = /\&lt;(\/?[b|i|u]|br)\&gt;/gi
    input = input.replace(allowedTags, (match, tag) => {
      return `<${tag}>`
    })

    // linebreak time
    const linebreak = /\&lt;div\&gt;\&lt;br\&gt;\&lt;\/div\&gt;/gi
    input = input.replace(linebreak, () => {
      return '<div><br></div>'
    })

    // div wrapper?
    const allowedDiv = /\&lt;(\/?div)\&gt;/gi
    input = input.replace(allowedDiv, (match, tag) => {
      return `<${tag}>`
    })

    return input
  }

  const stripTags = (input: string) => {
    const allowedTags = /<(\/?[b|i|u])>/gi
    input = input.replace(allowedTags, () => {
      return ''
    })

    // linebreak time
    const linebreak = /<div><br><\/div>/gi
    input = input.replace(linebreak, () => {
      return '\n'
    })

    return input
  }

  const mdFormatter = (input: string) => {
    // three tiers of *s
    // b/i and i/b
    const bi = /<[bi]><[bi]>(.+)<\/[bi]><\/[bi]>/gi
    input = input.replace(bi, (match, content) => {
      return `***${content}***`
    })

    // b
    const b = /<\s*b[^>]*>(.*?)<\s*\/\s*b>/gi
    input = input.replace(b, (match, content) => {
      return `**${content}**`
    })

    // i
    const i = /<\s*i[^>]*>(.*?)<\s*\/\s*i>/gi
    input = input.replace(i, (match, content) => {
      return `*${content}*`
    })

    // brs
    // linebreak time
    const linebreak = /<div><br><\/div>/gi
    input = input.replace(linebreak, () => {
      return '\n'
    })

    // linebreaks
    input = input.replace(/\n/g, '\n> ')

    return input
  }

  const latexFormatter = (input: string) => {
    const biStart = /^<[bi]><[bi]>(.+)<\/[bi]><\/[bi]>/gi
    input = input.replace(biStart, (match, content) => {
      return `\\DndMonsterAction{${content.replace(/\.$/gi, '')}}`
    })

    // three tiers of *s
    // b/i and i/b
    const bi = /<[bi]><[bi]>(.+)<\/[bi]><\/[bi]>/gi
    input = input.replace(bi, (match, content) => {
      return `\\emph{\\textbf{${content}}`
    })

    // b
    const b = /<\s*b[^>]*>(.*?)<\s*\/\s*b>/gi
    input = input.replace(b, (match, content) => {
      return `\\textbf{${content}}`
    })

    // i
    const i = /<\s*i[^>]*>(.*?)<\s*\/\s*i>/gi
    input = input.replace(i, (match, content) => {
      return `\\emph{${content}}`
    })

    // brs
    // linebreak time
    const linebreak = /<div><br><\/div>/gi
    input = input.replace(linebreak, () => {
      return '\n'
    })

    // nonbreaking spaces
    const nbsp = '&nbsp;'
    input = input.replaceAll(nbsp, ' ')

    return input
  }

  return {
    processMonsterTokens,
    processTraitTokens,
    processSpellTokens,
    processAttackTokens,
    processActionTokens,
    processMultiattackTokens,
    processContextTokens,
    processTokens,
    processTrait,
    processAction,
    processReaction,
    processAttack,
    processMultiattack,
    processClassSpellcasting,
    processInnateSpellcasting,
    processLegendaryPreamble,
    processLegendaryAction,
    processMythicActionTrait,
    processMythicActionPreamble,
    processLairActionPreamble,
    sanitizeWebString,
    mdFormatter,
    latexFormatter,
    stripTags,
  }
}
