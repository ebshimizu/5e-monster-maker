import { MaybeRef } from '@vueuse/core'
import { useMonsterStore } from 'src/stores/monster-store'
import { unref } from 'vue'
import { Monster, MonsterTrait } from '../models'
import { avgRoll, renderBonus } from './mathRendering'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import N2W from 'number-to-words'
import { useClasses } from 'src/data/CLASS'

export type MonsterContext = MonsterTrait | Monster['spellcasting']

export type MonsterContextType = 'none' | 'trait' | 'attack' | 'spell'

export function processMonsterTokens(
  input: string,
  monster: ReturnType<typeof useMonsterStore>
) {
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
    const avg = avgRoll(parseInt(count), parseInt(dice)) + cleanModifier
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
    `${monster.useArticleInToken ? 'the ' : ''}${monster.name}`
  )

  // generic tokens
  const generic = RegExp(/\{monster.([\w\d\[\].]+)}/gi)
  input = input.replace(generic, (match, prop) => {
    const value = _.get(monster, prop)

    return value
  })

  return input
}

export function processTraitTokens(input: string, context: MonsterTrait) {
  const { t } = useI18n()

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

export function processSpellTokens(
  input: string,
  context: Monster['spellcasting'],
  monster: ReturnType<typeof useMonsterStore>
) {
  const { t } = useI18n()
  const classes = useClasses()

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

  // generic tokens
  const generic = RegExp(/\{spellcasting.([\w\d\[\].]+)}/gi)
  input = input.replace(generic, (match, prop) => {
    const value = _.get(context, prop)

    return value
  })

  return input
}

export function processContextTokens(
  input: string,
  context: MonsterContext,
  contextType: MonsterContextType,
  monster: ReturnType<typeof useMonsterStore>
) {
  if (contextType === 'trait') {
    input = processTraitTokens(input, context as MonsterTrait)
  } else if (contextType === 'spell') {
    input = processSpellTokens(
      input,
      context as Monster['spellcasting'],
      monster
    )
  }

  // generic tokens
  const generic = RegExp(/\{(?:trait|attack).([\w\d\[\].]+)}/gi)
  input = input.replace(generic, (match, prop) => {
    const value = _.get(context, prop)

    return value
  })

  return input
}

export function processTokens(
  input: string,
  context: MonsterContext,
  monster: ReturnType<typeof useMonsterStore>,
  contextType: MonsterContextType
) {
  // general parsing
  input = processMonsterTokens(input, monster)

  // specific parsing
  input = processContextTokens(input, context, contextType, monster)

  return input
}

export function processTrait(
  contextRef: MaybeRef<MonsterTrait>,
  monster: ReturnType<typeof useMonsterStore>
) {
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

export function processClassSpellcasting(
  contextRef: MaybeRef<Monster['spellcasting']>,
  monster: ReturnType<typeof useMonsterStore>
) {
  const { t } = useI18n()
  const context = unref(contextRef)

  if (context.useCustomClassPreamble) {
    return processTokens(context.customClassPreamble, context, monster, 'spell')
  } else {
    return processTokens(
      t('presets.classSpellcasting'),
      context,
      monster,
      'spell'
    )
  }
}

export function processInnateSpellcasting(
  contextRef: MaybeRef<Monster['spellcasting']>,
  monster: ReturnType<typeof useMonsterStore>
) {
  const { t } = useI18n()
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
      t('presets.innateSpellcasting'),
      context,
      monster,
      'spell'
    )
  }
}

export function sanitizeWebString(input: string) {
  // allowed tags are: bold, italic, underline
  input = input.replace(/>/gi, '&gt;')
  input = input.replace(/</gi, '&lt;')

  // allow b/i/u
  const allowedTags = /\&lt;(\/?[b|i|u])\&gt;/gi
  input = input.replace(allowedTags, (match, tag) => {
    return `<${tag}>`
  })

  // linebreak time
  const linebreak = /\&lt;div\&gt;\&lt;br\&gt;\&lt;\/div\&gt;/gi
  input = input.replace(linebreak, () => {
    return '<div><br></div>'
  })

  return input
}
