import {
  CR,
  getCrByAc,
  getCrByAttack,
  getCrByDamage,
  getCrByDc,
  getCrByHp,
  getCrByNumber,
} from 'src/data/CR'
import { useMonsterStore } from 'src/stores/monster-store'
import { computed } from 'vue'
import _ from 'lodash'
import {
  CrActionInfo,
  CrAttackInfo,
  CrDamageInfo,
  CrLegendaryInfo,
  CrSpellInfo,
  CrTraitInfo,
} from './models'
import { useSpellsStore } from 'src/stores/spells-store'
import { renderBonus } from './rendering/mathRendering'

// unsure if i'll move this into util at some point
const ACTION_COLOR = {
  HP: 'green darken-2',
  Attack: 'red darken-4',
  Multiattack: 'red darken-4',
  Action: 'amber darken-4',
  Trait: 'teal darken-4',
  Legendary: 'cyan darken-4',
  Spell: 'deep-purple darken-4',
  'Lair Action': 'blue darken-4',
}

type CrInfo =
  | CrAttackInfo
  | CrActionInfo
  | CrSpellInfo
  | CrTraitInfo
  | CrLegendaryInfo
type CrActionSequence = CrInfo[]
type CrToHitInfo =
  | CrAttackInfo
  | CrActionInfo
  | CrTraitInfo
  | CrLegendaryInfo
  | { name: string; type: 'Spell'; toHit: number }

export const useCr = () => {
  const monster = useMonsterStore()
  const spells = useSpellsStore()

  // bunch of helper functions go here
  const legendaryCombo = (la: CrLegendaryInfo[], count: number) => {
    const returnData: { totalDamage: number; actions: CrLegendaryInfo[] } = {
      totalDamage: 0,
      actions: [],
    }

    if (la.length === 0) return returnData

    // returns the highest damage per round combo of actions
    // assuming everything can be used multiple times per round right now, ignoring limited use data (?)
    // find the highest cost item and associated damage
    // repeat until we run out of actions to take
    let currentActions = Array.from(la)
    while (count > 0 && currentActions.length > 0) {
      let highestCost = 1
      let highestCostDamage = 0

      // first, figure out if we have multi-cost items
      for (const action of currentActions) {
        if (action.cost >= highestCost) {
          highestCost = action.cost
          if (action.damage > highestCostDamage) {
            highestCostDamage = action.damage
          }
        }
      }

      // now that we know the highest remaining cost and the damage that's expected, check to see
      // if any lower cost items can match that damage
      const adjustedDamageActions = currentActions.map((a) => {
        return {
          adjustedDamage: a.damage * Math.floor(highestCost / a.cost),
          addCount: Math.floor(highestCost / a.cost),
          ...a,
        }
      })

      // sort descending and pick highest, adding a number of times consistent with cost
      adjustedDamageActions.sort((a, b) => b.adjustedDamage - a.adjustedDamage)

      for (let i = 0; i < adjustedDamageActions[0].addCount; i++) {
        returnData.totalDamage += adjustedDamageActions[0].damage
        returnData.actions.push(adjustedDamageActions[0])
        count -= adjustedDamageActions[0].cost
      }

      currentActions = currentActions.filter((a) => a.cost <= count)
    }

    return returnData
  }

  const highestDamage = (data: CrDamageInfo) => {
    // check first element of actions, attacks, and spells return highest damage
    // but first validate that we have data to get
    const allActions = (
      [] as (CrAttackInfo | CrActionInfo | CrSpellInfo)[]
    ).concat(data.attacks, data.actions, data.spells)

    if (allActions.length === 0) return null

    allActions.sort((a, b) => {
      return b.damage - a.damage
    })

    return allActions[0]
  }

  const resMultiplier = (cr: number) => {
    if (monster.resistances == null || monster.resistances.length === 0)
      return 1

    if (cr <= 4) return 2
    if (cr <= 10) return 1.5
    if (cr <= 16) return 1.25

    return 1
  }

  const immuneMultiplier = (cr: number) => {
    if (monster.immunities == null || monster.immunities.length === 0) return 1

    if (cr <= 10) return 2
    if (cr <= 16) return 1.5

    return 1.25
  }

  const vulnMultiplier = () => {
    if (monster.vulnerabilities != null && monster.vulnerabilities.length > 0)
      return 0.5

    return 1
  }

  const actionTypeColor = (type: keyof typeof ACTION_COLOR) => {
    return ACTION_COLOR[type]
  }

  // an array of the highest damage actions/traits per round for up to 5 rounds
  const actionSequence = computed(() => {
    // the operations done here are actually destructive. to avoid changing
    // the info object, we're gonna clone it for this calculation.
    const data = _.cloneDeep(monster.attackInfo)

    // we can actually pre-compute legendary action damage since it's basically the same each round under most circumstances
    // and if not, well, this tool might not be complex enough to handle you my dude
    const legendaryRound = legendaryCombo(data.legendary, data.legendaryCount)

    // for 3 rounds
    const sequence = []
    let heldLairAction = null

    for (let i = 0; i < 3; i++) {
      const round: { totalDamage: number; actions: CrActionSequence } = {
        totalDamage: 0,
        actions: [],
      }

      // check highest damage actions and attacks
      const action = highestDamage(data)

      // if action is null, we don't have anything to do here, but traits might still work
      if (action) {
        // update the round
        round.actions.push(action)
        round.totalDamage += action.damage

        // if the action is limited use or rechargeable, adjust the limited use and remove if 0
        // recharge abilities just get removed straight up since it's a bit random.
        if ('limited' in action && action.limited) {
          action.uses -= 1

          if (action.uses <= 0) {
            // we pulled action 0 (sorted, guaranteed from highestDamage function)
            // attacks can't be limited use so this has to be an action if limited exists
            data.actions.splice(0, 1)
          }
        } else if (action.type === 'Spell') {
          // spells just get deleted byeeeeee
          if (spells.allSpells[action.name].level > 0) data.spells.splice(0, 1)
        }
      }

      // trait damage
      // assume stuff that adds bonus damage (like a smite) applies once per round (which might low-ball this estimate),
      // but is much simpler to handle than doing once per attack or somethin
      for (const trait of data.traits) {
        if (trait.damage > 0) {
          // don't need to check inclusion, handled by attackInfo
          round.actions.push(trait)
          round.totalDamage += trait.damage

          if (trait.limited && trait.uses > 0) {
            trait.uses -= 1
            trait.remove = trait.uses <= 0
          }
        }
      }
      data.traits = data.traits.filter((t) => !t.remove)

      // lair actions
      // many of the lair actions assume that you can't use them twice in a row so let's enforce that.
      if (data.lairActions.length > 0) {
        const la = data.lairActions[0]

        // apply damage, if it's non-zero
        if (la.damage > 0) {
          round.actions.push(la)
          round.totalDamage += la.damage
        }

        // adjust held action
        if (heldLairAction) {
          data.lairActions.push(heldLairAction)
        }

        heldLairAction = la

        // remove, held action is at the end
        data.lairActions = data.lairActions.slice(1)
        data.lairActions.sort((a, b) => {
          return b.damage - a.damage
        })
      }

      // legendary actions
      // this gets put on top of everything in a round, assumes the most damaging combination of abilities is used each round
      round.totalDamage += legendaryRound.totalDamage
      round.actions = round.actions.concat(legendaryRound.actions)

      sequence.push(round)
    }

    return sequence
  })

  const damagePerRound = computed(() => {
    if (actionSequence.value.length < 3) return 0

    let sum = 0
    for (let i = 0; i < 3; i++) {
      sum += actionSequence.value[i].totalDamage
    }

    return sum / 3
  })

  const damageCr = computed(() => {
    return getCrByDamage(damagePerRound.value)
  })

  const dcActions = computed(() => {
    // return a sorted all actions list
    const allActions: CrActionSequence = ([] as CrActionSequence).concat(
      monster.attackInfo.attacks,
      monster.attackInfo.actions,
      monster.attackInfo.traits,
      monster.attackInfo.legendary,
      monster.attackInfo.lairActions
    )

    // inject the spellcasting mod if it exists
    if (monster.isSpellcaster) {
      allActions.push({
        name: 'Spell Save DC',
        type: 'Spell',
        damage: 0,
        save: monster.spellSave,
      })
    }

    allActions.sort((a, b) => {
      return (b.save ?? 0) - (a.save ?? 0)
    })

    // filter to positive to hits?
    return allActions
  })

  const filteredDcActions = computed(() => {
    return dcActions.value.filter((a) => (a.save ?? 0) > 0)
  })

  const maxDc = computed(() => {
    if (dcActions.value.length === 0) return 0

    return dcActions.value[0].save
  })

  const toHitActions = computed(() => {
    // return a sorted all actions list without spells
    const allActions: CrToHitInfo[] = dcActions.value.filter(
      (a) => a.type !== 'Spell'
    ) as CrToHitInfo[]

    // inject the spellcasting mod if it exists
    if (monster.isSpellcaster) {
      allActions.push({
        name: 'Spell Attack Modifier',
        type: 'Spell',
        toHit: monster.spellAttackModifier,
      })
    }

    allActions.sort((a, b) => {
      return (b.toHit ?? 0) - a.toHit
    })

    // filter to positive to hits?
    return allActions
  })

  const filteredToHitActions = computed(() => {
    return toHitActions.value
      .map((a) => {
        return { toHitRender: renderBonus(a.toHit), ...a }
      })
      .filter((a) => a.toHit > 0)
  })

  const maxAttack = computed(() => {
    // this is already sorted
    if (toHitActions.value.length === 0) return 0

    return toHitActions.value[0].toHit
  })

  const maxAttackRender = computed(() => {
    return renderBonus(maxAttack.value)
  })

  const dcStepDelta = computed(() => {
    return (maxDc.value ?? 0) - damageCr.value.saveDc
  })

  const attackStepDelta = computed(() => {
    return maxAttack.value - damageCr.value.attack
  })

  const dcStepDeltaRender = computed(() => {
    return renderBonus(dcStepDelta.value)
  })

  const attackStepDeltaRender = computed(() => {
    return renderBonus(attackStepDelta.value)
  })

  const dcCr = computed(() => {
    return getCrByDc(maxDc.value ?? 0)
  })

  const attackCr = computed(() => {
    return getCrByAttack(maxAttack.value)
  })

  const useDc = computed(() => {
    return dcCr.value.numeric >= attackCr.value.numeric
  })

  const offensiveCr = computed(() => {
    const damageCRStep = damageCr.value.index

    // branching cases based on higher dc or attack mod
    let stepDelta = 0
    if (useDc.value) {
      // DC
      // get the delta between the DC suggested by damage output and the max DC for this creature
      stepDelta = dcStepDelta.value
    } else {
      // get delta between the attack mod suggested by damage output and the max bonus for this creature
      stepDelta = attackStepDelta.value
    }

    stepDelta /= 2

    // final cr is then
    // really need a "towards 0" function
    const offensiveStep =
      damageCRStep +
      (stepDelta < 0 ? Math.ceil(stepDelta) : Math.floor(stepDelta))

    return CR[Math.max(0, Math.min(CR.length - 1, offensiveStep))]
  })

  const attackCrDelta = computed(() => {
    const delta = offensiveCr.value.numeric - damageCr.value.numeric
    return renderBonus(delta)
  })

  const attackCrExplain = computed(() => {
    if (useDc.value) return 'Inactive. Save DC has a higher expected CR.'

    return `Offensive CR ${attackCrDelta.value} (Attack Bonus Delta: ${attackStepDeltaRender.value})`
  })

  const dcCrExplain = computed(() => {
    if (!useDc.value) return 'Inactive. Attack Bonus has a higher expected CR'

    return `Offensive CR ${attackCrDelta.value} (Save DC Delta: ${dcStepDeltaRender.value})`
  })

  const ehpModifierList = computed(() => {
    // renders out modifiers and multipliers to a list for display
    const mods = []

    // TODO: add toggle for using monster's set CR instead of computed
    const resMult = resMultiplier(offensiveCr.value.numeric)
    const immuneMult = immuneMultiplier(offensiveCr.value.numeric)
    const vulnMult = vulnMultiplier()

    // multipliers
    if (resMult > 1) {
      mods.push({
        title: 'Resistances',
        subtitle: `${monster.resistances?.length} Resistance${
          monster.resistances?.length === 1 ? '' : 's'
        } at CR ${offensiveCr.value.cr}`,
        value: `x${resMult}`,
        type: 'HP',
      })
    }

    if (immuneMult > 1) {
      mods.push({
        title: 'Immunities',
        subtitle: `${monster.immunities?.length} Immunit${
          monster.immunities?.length === 1 ? 'y' : 'ies'
        } at CR ${offensiveCr.value.cr}`,
        value: `x${immuneMult}`,
        type: 'HP',
      })
    }

    if (vulnMult < 1) {
      mods.push({
        title: 'Vulnerabilities',
        subtitle: `${monster.vulnerabilities?.length} Vulnerabilit${
          monster.vulnerabilities?.length === 1 ? 'y' : 'ies'
        } at CR ${offensiveCr.value.cr}`,
        value: `x${vulnMult}`,
        type: 'HP',
      })
    }

    // action and trait mults
    for (const action of monster.actions) {
      if (
        action.crAnnotation.include &&
        action.crAnnotation.ehpMultiplier !== 1
      ) {
        mods.push({
          title: action.name,
          subtitle: 'Action',
          type: 'Action',
          value: `x${action.crAnnotation.ehpMultiplier.toFixed(1)}`,
        })
      }
    }

    for (const trait of monster.traits) {
      if (
        trait.crAnnotation.include &&
        trait.crAnnotation.ehpMultiplier !== 1
      ) {
        mods.push({
          title: trait.name,
          subtitle: 'Trait',
          type: 'Trait',
          value: `x${trait.crAnnotation.ehpMultiplier.toFixed(1)}`,
        })
      }
    }

    for (const idx in monster.lairActions) {
      const action = monster.lairActions[idx]

      if (
        action.crAnnotation.include &&
        action.crAnnotation.ehpMultiplier !== 1
      ) {
        mods.push({
          title: `Lair Action ${idx + 1}`,
          subtitle: 'Lair Action',
          type: 'Lair Action',
          value: `x${action.crAnnotation.ehpMultiplier.toFixed(1)}`,
        })
      }
    }

    // action and trait additions
    for (const action of monster.actions) {
      if (
        action.crAnnotation.include &&
        action.crAnnotation.ehpModifier !== 0
      ) {
        mods.push({
          title: action.name,
          subtitle: 'Action',
          type: 'Action',
          value: renderBonus(action.crAnnotation.ehpModifier),
        })
      }
    }

    for (const trait of monster.traits) {
      if (trait.crAnnotation.include && trait.crAnnotation.ehpModifier !== 0) {
        mods.push({
          title: trait.name,
          subtitle: 'Trait',
          type: 'Trait',
          value: renderBonus(trait.crAnnotation.ehpModifier),
        })
      }
    }

    for (const idx in monster.lairActions) {
      const action = monster.lairActions[idx]

      if (
        action.crAnnotation.include &&
        action.crAnnotation.ehpModifier !== 0
      ) {
        mods.push({
          title: `Lair Action ${idx + 1}`,
          subtitle: 'Lair Action',
          type: 'Lair Action',
          value: renderBonus(action.crAnnotation.ehpModifier),
        })
      }
    }

    return mods
  })

  const ehp = computed(() => {
    // ehp actually kinda needs a CR estimate first, so assuming we don't have that, we will base expected CR on attacks
    // ok so use the overall offensive CR for anything that requires it here
    const baseHP = monster.avgHp
    let ehp = baseHP

    // TODO: add toggle for using specified CR instead of computed
    // built-in adjustments
    // resistances and immunities
    // combine the multipliers
    const resMult =
      resMultiplier(offensiveCr.value.numeric) *
      immuneMultiplier(offensiveCr.value.numeric) *
      vulnMultiplier()
    ehp *= resMult

    // get the trait and action adjustments. These will happen iteratively after conditions
    // addition happens at the end, so this is a two pass operation
    for (const action of monster.actions) {
      if (action.crAnnotation.include) {
        ehp *= action.crAnnotation.ehpMultiplier
      }
    }

    for (const action of monster.lairActions) {
      if (action.crAnnotation.include) {
        ehp *= action.crAnnotation.ehpMultiplier
      }
    }

    for (const trait of monster.traits) {
      if (trait.crAnnotation.include) {
        ehp *= trait.crAnnotation.ehpMultiplier
      }
    }

    // ok now add
    for (const action of monster.actions) {
      if (action.crAnnotation.include) {
        ehp += action.crAnnotation.ehpModifier
      }
    }

    for (const action of monster.lairActions) {
      if (action.crAnnotation.include) {
        ehp += action.crAnnotation.ehpModifier
      }
    }

    for (const trait of monster.traits) {
      if (trait.crAnnotation.include) {
        ehp += trait.crAnnotation.ehpModifier
      }
    }

    return ehp
  })

  const saveCount = computed(() => {
    return Object.values(monster.saves).filter((save) => {
      return save.proficient || (save.override && save.overrideValue > 0)
    }).length
  })

  const saveAcBonus = computed(() => {
    if (saveCount.value < 3) return 0
    if (saveCount.value < 5) return 2

    return 4
  })

  const eacModifierList = computed(() => {
    const mods = []

    if (saveAcBonus.value > 0) {
      mods.push({
        title: 'Saving Throws',
        subtitle: `${saveCount.value} Proficient or Modified Saves`,
        type: 'HP',
        value: `+${saveAcBonus.value}`,
      })
    }

    // action and trait modifiers
    for (const action of monster.actions) {
      if (action.crAnnotation.include && action.crAnnotation.acModifier !== 0) {
        mods.push({
          title: action.name,
          subtitle: 'Action',
          type: 'Action',
          value: renderBonus(action.crAnnotation.acModifier),
        })
      }
    }

    for (const idx in monster.lairActions) {
      const action = monster.lairActions[idx]
      if (action.crAnnotation.include && action.crAnnotation.acModifier !== 0) {
        mods.push({
          title: `Lair Action ${idx + 1}`,
          subtitle: 'Lair Action',
          type: 'Lair Action',
          value: renderBonus(action.crAnnotation.acModifier),
        })
      }
    }

    for (const trait of monster.traits) {
      if (trait.crAnnotation.include && trait.crAnnotation.acModifier !== 0) {
        mods.push({
          title: trait.name,
          subtitle: 'Trait',
          type: 'Trait',
          value: renderBonus(trait.crAnnotation.acModifier),
        })
      }
    }

    return mods
  })

  const eac = computed(() => {
    // the beginning of this is at least easy
    // save modifiers
    let eac = monster.AC + saveAcBonus.value

    // action and trait modifiers
    for (const action of monster.actions) {
      if (action.crAnnotation.include) {
        eac += action.crAnnotation.acModifier
      }
    }

    for (const action of monster.lairActions) {
      if (action.crAnnotation.include) {
        eac += action.crAnnotation.acModifier
      }
    }

    for (const trait of monster.traits) {
      if (trait.crAnnotation.include) {
        eac += trait.crAnnotation.acModifier
      }
    }

    // the effective AC doesn't affect CR if it's lower than 12, so floor it
    return Math.max(12, eac)
  })

  const hpCr = computed(() => {
    return getCrByHp(ehp.value)
  })

  const acCr = computed(() => {
    return getCrByAc(eac.value)
  })

  const defensiveCr = computed(() => {
    // so the actual cr is a lil funky here
    // first get the CR step suggested by ehp
    const ehpStep = hpCr.value.index

    // then, get the delta between ehp's CR AC and the effective AC
    const acDelta = (eac.value - hpCr.value.ac) / 2

    // adjust the cr step
    const defensiveStep =
      ehpStep + (acDelta < 0 ? Math.ceil(acDelta) : Math.floor(acDelta))

    // return the proper cr object, clamping to 0/CR max length
    return CR[Math.max(0, Math.min(CR.length - 1, defensiveStep))]
  })

  const acCrDelta = computed(() => {
    const delta = defensiveCr.value.numeric - hpCr.value.numeric
    return renderBonus(delta)
  })

  const attackChipColor = computed(() => {
    return !useDc.value ? 'red-10' : 'dark'
  })

  const dcChipColor = computed(() => {
    return useDc.value ? 'red-10' : 'dark'
  })

  const acCrExplain = computed(() => {
    return `Defensive CR ${acCrDelta.value} (AC Delta: ${renderBonus(
      acCr.value.ac - defensiveCr.value.ac
    )})`
  })

  // this, logically, goes at the bottom
  const estimatedCr = computed(() => {
    const avgCr = (offensiveCr.value.numeric + defensiveCr.value.numeric) / 2
    return getCrByNumber(avgCr)
  })

  return {
    attackCrExplain,
    damagePerRound,
    damageCr,
    maxDc,
    maxAttackRender,
    attackCrDelta,
    attackChipColor,
    dcChipColor,
    offensiveCr,
    ehp,
    hpCr,
    ehpModifierList,
    eac,
    acCrDelta,
    defensiveCr,
    estimatedCr,
  }
}
