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
    <div
      v-show="monster.resistances && monster.resistances.length > 0"
      class="skill"
    >
      <span class="name">Damage Resistances</span> {{ resistances }}
    </div>
    <div
      v-show="monster.immunities && monster.immunities.length > 0"
      class="skill"
    >
      <span class="name">Damage Immunities</span> {{ immunities }}
    </div>
    <div
      v-show="monster.vulnerabilities && monster.vulnerabilities.length > 0"
      class="skill"
    >
      <span class="name">Damage Vulnerabilities</span> {{ vulnerabilities }}
    </div>
    <div
      v-show="monster.conditions && monster.conditions.length > 0"
      class="skill"
    >
      <span class="name">Condition Immunities</span> {{ conditions }}
    </div>
    <div class="skill"><span class="name">Senses</span> {{ senses }}</div>
    <div class="skill">
      <span class="name">Languages</span>
      {{ monster.languages !== '' ? monster.languages : '&mdash;' }}
    </div>
    <div class="skill">
      <span class="name">Challenge</span> {{ cr }}
      <span style="float: right"
        ><b>Proficiency Bonus</b> +{{ monster.proficiency }}</span
      >
    </div>
    <hr />
    <div class="traits">
      <div
        v-for="(trait, idx) in traits"
        :key="idx"
        class="trait"
        v-html="trait"
      ></div>
    </div>
    <!--
      <div class="trait" v-if="monster.mythicActions.actions.length > 0">
        <span class="name"
          >{{ monster.mythicActions.triggerName }} ({{
            monster.mythicActions.triggerRecharge
          }}.</span
        >
        {{ processTokens(monster.mythicActions.triggerDescription) }}
      </div>
    </div>
    -->
    <div
      v-if="monster.spellcasting.atWill.length > 0"
      class="innate-spellcasting"
    >
      <div v-html="sanitizedInnateSpellcastingPreamble"></div>
      <div class="spell-list">
        <div
          v-for="innate in innateSpellcastingLists"
          :key="innate.id"
          class="spell-row"
        >
          <span class="spell-label">{{ innate.renderedLabel }}: </span>
          <span class="spell-list-entries">{{ innate.renderedSpells }}</span>
        </div>
      </div>
    </div>
    <div v-if="monster.spellcasting.standard.length > 0" class="spellcasting">
      <div v-html="sanitizedClassSpellcastingPreamble"></div>
      <div class="spell-list">
        <div v-if="monster.knownSpellsOfLevel(0).length > 0" class="spell-row">
          <span class="spell-label"
            >{{ $t('editor.spellcasting.slot.cantripLabel') }}:
          </span>
          <span class="spell-list-entries">{{
            monster.knownSpellsOfLevel(0).join(', ')
          }}</span>
        </div>
        <div v-if="monster.spellcasting.class === 'Warlock'">
          <div class="spell-row">
            <span class="spell-label"
              >{{ classSpellcastingWarlockLabel }}:
            </span>
            <span class="spell-list-entries">{{
              monster.spellcasting.standard.join(', ')
            }}</span>
          </div>
        </div>
        <template v-else>
          <div
            v-for="slot in classSpellcastingSlots"
            :key="slot.level"
            class="spell-row"
          >
            <span class="spell-label">{{ slot.renderedLabel }}</span>
            <span class="spell-list-entries">{{ slot.renderedSpells }}</span>
          </div>
        </template>
      </div>
    </div>
    <h3 class="section">Actions</h3>
    <!--
    <div class="multiattack" v-if="monster.multiattacks.length > 0">
      <span class="name">Multiattack.</span>
      {{ renderMultiattacks() }}
    </div>
    -->
    <div
      v-for="(attack, idx) in attacks"
      :key="idx"
      class="attack"
      v-html="attack"
    ></div>
    <!--
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
import { computed, defineComponent, inject } from 'vue'
import { useMonsterStore } from 'src/stores/monster-store'
import { useTextRenderer } from './useTextRenderer'
import { sanitizeWebString } from './processTokens'

export default defineComponent({
  name: 'WebRenderer',
  setup() {
    const monster = useMonsterStore()
    const textRenderer = inject('textRenderer') as ReturnType<
      typeof useTextRenderer
    >

    const traits = computed(() =>
      textRenderer.traits.value.map((t) => sanitizeWebString(t))
    )

    const sanitizedClassSpellcastingPreamble = computed(() =>
      sanitizeWebString(textRenderer.classSpellcastingPreamble.value)
    )

    const sanitizedInnateSpellcastingPreamble = computed(() =>
      sanitizeWebString(textRenderer.innateSpellcastingPreamble.value)
    )

    const attacks = computed(() =>
      textRenderer.attacks.value.map((a) => sanitizeWebString(a))
    )

    return {
      monster,
      ...textRenderer,
      sanitizedClassSpellcastingPreamble,
      sanitizedInnateSpellcastingPreamble,
      traits,
      attacks,
    }
  },
})
</script>

<style>
/* i don't know why scoped doesn't work but this does */
.statblock b {
  font-family: ScalySansBold;
  font-style: normal;
}

.statblock i {
  font-family: ScalySansItalic;
  font-style: normal;
}

.statblock b > i,
.statblock i > b {
  font-family: ScalySansBoldItalic;
  font-style: normal;
}
</style>

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
