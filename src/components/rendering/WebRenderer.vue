<template>
  <div id="render" class="statblock">
    <h2 class="monster-name">{{ monster.name }}</h2>
    <div class="type">
      {{ monster.size }} {{ monster.type }}, {{ monster.alignment }}
    </div>
    <hr />
    <div class="skill">
      <span class="name">Armor Class</span> {{ monster.AC
      }}{{ monster.ACType === '' ? '' : ` (${monster.ACType})` }}
    </div>
    <div class="skill"><span class="name">Hit Points</span> {{ hp }}</div>
    <div class="skill"><span class="name">Speed</span> {{ speeds }}</div>
    <hr />
    <div class="row" style="width: 100%">
      <div v-for="stat in stats" :key="stat.stat" class="stat-container">
        <div class="stat-name">{{ stat.stat }}</div>
        <div class="stat">
          <div class="score">{{ stat.score }}</div>
          <div class="modifier">({{ stat.renderedModifier }})</div>
        </div>
      </div>
    </div>
    <hr />
    <div v-show="saves !== ''" class="skill">
      <span class="name">Saving Throws</span> {{ saves }}
    </div>
    <div v-show="monster.skills.length > 0" class="skill">
      <span class="name">Skills</span> {{ skills }}
    </div>
    <!--
    <div class="skill" v-show="this.monster.resistances.length > 0">
      <span class="name">Damage Resistances</span> {{ resistances }}
    </div>
    <div class="skill" v-show="this.monster.immunities.length > 0">
      <span class="name">Damage Immunities</span> {{ immunities }}
    </div>
    <div class="skill" v-show="this.monster.vulnerabilities.length > 0">
      <span class="name">Damage Vulnerabilities</span> {{ vulnerabilities }}
    </div>
    <div class="skill" v-show="this.monster.conditions.length > 0">
      <span class="name">Condition Immunities</span> {{ conditions }}
    </div>
    <div class="skill"><span class="name">Senses</span> {{ senses }}</div>
    -->
    <div v-show="monster.languages !== ''" class="skill">
      <span class="name">Languages</span> {{ monster.languages }}
    </div>
    <!--
    <div class="skill"><span class="name">Challenge</span> {{ cr }}</div>
    <v-divider></v-divider>
    <div class="traits">
      <div class="trait" v-for="trait in monster.traits" :key="trait.id">
        <span class="name">{{ trait.name }}{{ limitedUse(trait) }}.</span>
        {{ processTokens(trait.description) }}
      </div>
      <div class="trait" v-if="monster.mythicActions.actions.length > 0">
        <span class="name"
          >{{ monster.mythicActions.triggerName }} ({{
            monster.mythicActions.triggerRecharge
          }}.</span
        >
        {{ processTokens(monster.mythicActions.triggerDescription) }}
      </div>
    </div>
    <div
      v-if="monster.spellcasting.atWill.length > 0"
      class="innate-spellcasting"
    >
      <span class="name">Innate Spellcasting.</span> The {{ monster.name }}'s
      innate spellcasting ability is {{ statFull(monster.spellcasting.stat) }}
      {{ spellStats() }}.
      {{ monster.spellcasting.atWillNotes }}
      It can cast the following spells, requiring no material components:
      <div class="spell-list">
        <div
          class="spell-row"
          v-for="innate in monster.spellcasting.atWill"
          :key="innate.id"
        >
          <span class="spell-label">{{ formatInnateSpellLabel(innate) }} </span>
          <span class="spell-list-entries">{{ innate.spells.join(', ') }}</span>
        </div>
      </div>
    </div>
    <div v-if="monster.spellcasting.standard.length > 0" class="spellcasting">
      <span class="name">Spellcasting.</span> The {{ monster.name }} is a
      {{ casterLevel }} spellcaster. Its spellcasting ability is
      {{ statFull(monster.spellcasting.stat) }} {{ spellStats() }}.
      {{ monster.spellcasting.notes }}
      The {{ monster.name }} has the following{{
        monster.spellcasting.class ? ` ${monster.spellcasting.class}` : ''
      }}
      spells prepared:
      <div class="spell-list">
        <div class="spell-row" v-if="cantrips.length > 0">
          <span class="spell-label">Cantrips (at will): </span>
          <span class="spell-list-entries">{{ cantrips }}</span>
        </div>
        <div v-if="monster.spellcasting.class === 'Warlock'">
          <div class="spell-row">
            <span class="spell-label">{{ warlockLabel }}: </span>
            <span class="spell-list-entries">{{
              monster.spellcasting.standard.join(', ')
            }}</span>
          </div>
        </div>
        <template v-else>
          <div class="spell-row" v-for="slot in spellsBySlot" :key="slot.level">
            <span class="spell-label">{{ slot.levelRender }} </span>
            <span class="spell-list-entries">{{ slot.spells }}</span>
          </div>
        </template>
      </div>
    </div>
    <h3 class="section">Actions</h3>
    <div class="multiattack" v-if="monster.multiattacks.length > 0">
      <span class="name">Multiattack.</span>
      {{ renderMultiattacks() }}
    </div>
    <div class="attack" v-for="attack in monster.attacks" :key="attack.id">
      <span class="name">{{ attack.name }}. </span>
      <span class="distance"
        >{{ attack.distance }} {{ attack.kind }} Attack:
      </span>
      <span class="to-hit">{{ toHit(attack.modifier) }}</span> to hit,
      <span
        ><span class="reach">{{ attackReach(attack) }}, </span>
        {{ targets(attack.targets) }}. <span class="hit">Hit: </span>
        {{ baseDamage(attack.damage) }} {{ attack.damage.type }} damage</span
      >
      <span v-if="attack.alternateDamage.active"
        >, or {{ baseDamage(attack.alternateDamage) }}
        {{ attack.alternateDamage.type }} damage
        {{ attack.alternateDamage.condition }}</span
      >
      <span v-if="attack.additionalDamage.length > 0">
        plus {{ additionalDamage(attack.additionalDamage) }}</span
      >.
      <span class="description">{{ processTokens(attack.description) }}</span>
    </div>
    <div class="other-actions">
      <div
        class="action"
        v-for="action in nonLegendaryOnlyActions"
        :key="action.id"
      >
        <span class="name"
          >{{ action.name }}{{ rechargeOrLimited(action) }}.</span
        >
        {{ processTokens(action.description) }}
      </div>
    </div>
    <div class="legendary-actions" v-if="monster.legendaryActions.count > 0">
      <h3 class="section">Legendary Actions</h3>
      <div class="preamble">
        The {{ monster.name }} can take
        {{ monster.legendaryActions.count }} legendary action{{
          monster.legendaryActions.count === 1 ? '' : 's'
        }}, choosing from the options below. Only one legendary action option
        can be used at a time and only at the end of another creature's turn.
        The {{ monster.name }} regains spent legendary actions at the start of
        its turn.
      </div>
      <div
        class="action legendary"
        v-for="action in resolvedLegendaryActions"
        :key="action.id"
      >
        <span class="name"
          >{{ action.name
          }}{{
            action.cost > 1 ? ` (Costs ${action.cost} Actions)` : ''
          }}.</span
        >
        {{
          action.legendaryOnly
            ? processTokens(action.description)
            : duplicateLegendary(action)
        }}
      </div>
    </div>
    <div class="mythic-actions" v-if="monster.mythicActions.actions.length > 0">
      <h3 class="section">Mythic Actions</h3>
      <div class="preamble">
        {{ processTokens(monster.mythicActions.preamble) }}
      </div>
      <div
        class="action legendary"
        v-for="action in resolvedMythicActions"
        :key="action.id"
      >
        <span class="name"
          >{{ action.name
          }}{{
            action.cost > 1 ? ` (Costs ${action.cost} Actions)` : ''
          }}.</span
        >
        {{
          action.legendaryOnly
            ? processTokens(action.description)
            : duplicateLegendary(action)
        }}
      </div>
    </div>
    <div class="reactions" v-if="monster.reactions.length > 0">
      <h3 class="section">Reactions</h3>
      <div
        class="action reaction"
        v-for="reaction in monster.reactions"
        :key="reaction.id"
      >
        <span class="name">{{ reaction.name }}. </span
        >{{ processTokens(reaction.description) }}
      </div>
    </div>
    <div class="lair-actions" v-if="monster.lairActions.length > 0">
      <h3 class="section">Lair Actions</h3>
      <div class="preamble">
        When fighting inside its lair, the {{ monster.name }} can take lair
        actions. On initiative count 20 (losing initiative ties), the
        {{ monster.name }} takes a lair action to cause one of the following
        effects:
      </div>
      <ul>
        <li
          class="action lair"
          v-for="action in monster.lairActions"
          :key="action.id"
        >
          {{ processTokens(action.description) }}
        </li>
      </ul>
    </div>
    <div class="regional-effects" v-if="monster.regionalEffects.length > 0">
      <h3 class="section">Regional Effects</h3>
      <div class="preamble">
        {{ processTokens(monster.regionalEffectDescription) }}
      </div>
      <ul>
        <li
          class="action regional"
          v-for="effect in monster.regionalEffects"
          :key="effect.id"
        >
          {{ processTokens(effect.description) }}
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import N2W from 'number-to-words'
import { useMonsterStore } from 'src/stores/monster-store'
import { bonusForSkill, renderBonus, statModifier } from './mathRendering'
import { saveModifierForStat } from './mathRendering'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'WebRenderer',
  setup() {
    const { t } = useI18n()

    const monster = useMonsterStore()
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

    return {
      monster,
      stats,
      hp,
      saves,
      speeds,
      skills,
    }
  },
})
</script>

<style lang="scss" scoped>
.statblock {
  background-color: #fdf1dc;
  color: #000;
  font-family: ScalySans;
  font-size: 1rem;
  padding: 8px;
  width: 100%;

  .monster-name {
    font-family: MrEaves;
    color: #58180d;
    font-weight: 800;
    font-size: 2.2em;
    margin: 0;
  }

  .type,
  .attack .distance,
  .attack .hit {
    font-family: ScalySansItalic;
  }

  hr {
    border: 1px solid #9c2b1b;
    margin: 2px 0;
  }

  .skill {
    line-height: 1.3rem;

    .name {
      font-family: ScalySansBold;
    }
  }

  .stat-container {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #58180d;

    .stat-name {
      font-family: ScalySansBold;
    }

    .stat {
      display: flex;
      font-size: 0.95rem;
      .score {
        margin-right: 4px;
      }
    }
  }

  .spell-list {
    margin-top: 0.8rem;

    .spell-row {
      margin-left: 20px;
      text-indent: -20px;

      .spell-list-entries {
        font-family: ScalySansItalic;
      }
    }
  }

  .legendary.action {
    margin-bottom: 0.1rem;
    margin-left: 20px;
    text-indent: -20px;
  }

  .trait,
  .attack,
  .action,
  .innate-spellcasting,
  .spellcasting,
  .legendary-actions .preamble,
  .mythic-actions .preamble,
  .lair-actions .preamble,
  .regional-effects .preamble,
  .multiattack {
    line-height: 1.15rem;
    margin-bottom: 0.8rem;

    .name {
      font-family: ScalySansBoldItalic;
    }
  }

  .lair-actions,
  .regional-effects {
    li {
      margin-bottom: 0;
    }
  }

  h3.section {
    font-size: 1.3rem;
    font-weight: 200;
    color: #58180d;
    border-bottom: 1px solid #58180d;
    margin-bottom: 4px;
  }
}
</style>
