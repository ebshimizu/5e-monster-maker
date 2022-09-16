<template>
  <div id="render" class="statblock" :style="columns">
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
      <span class="name">{{ $t('monster.saves') }}</span> {{ saves }}
    </div>
    <div v-show="monster.skills.length > 0" class="skill">
      <span class="name">{{ $t('monster.skills') }}</span> {{ skills }}
    </div>
    <div
      v-show="monster.resistances && monster.resistances.length > 0"
      class="skill"
    >
      <span class="name">{{ $t('monster.resistances') }}</span>
      {{ resistances }}
    </div>
    <div
      v-show="monster.immunities && monster.immunities.length > 0"
      class="skill"
    >
      <span class="name">{{ $t('monster.immunities') }}</span> {{ immunities }}
    </div>
    <div
      v-show="monster.vulnerabilities && monster.vulnerabilities.length > 0"
      class="skill"
    >
      <span class="name">{{ $t('monster.vulnerabilities') }}</span>
      {{ vulnerabilities }}
    </div>
    <div
      v-show="monster.conditions && monster.conditions.length > 0"
      class="skill"
    >
      <span class="name">{{ $t('monster.conditionImmunities') }}</span>
      {{ conditions }}
    </div>
    <div class="skill">
      <span class="name">{{ $t('monster.senses') }}</span> {{ senses }}
    </div>
    <div class="skill">
      <span class="name">{{ $t('monster.languages') }}</span>
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
      <div
        v-if="monster.mythicActions.actions.length > 0"
        class="trait"
        v-html="mythicTrait"
      ></div>
    </div>
    <h3 class="section">{{ $t('editor.action.label') }}</h3>
    <div v-if="monster.multiattacks.length > 0" class="multiattack">
      <span class="name">{{ $t('editor.multiattack.label') }}.</span>
      {{ multiattacks }}
    </div>
    <div
      v-for="(attack, idx) in attacks"
      :key="idx"
      class="attack"
      v-html="attack"
    ></div>
    <div class="other-actions">
      <div
        v-for="(action, idx) in actions"
        :key="idx"
        class="action"
        v-html="action"
      ></div>
    </div>
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
    <div v-if="bonusActions.length > 0" class="bonus-actions">
      <h3 class="section">{{ $t('monster.bonusActions') }}</h3>
      <div
        v-for="(action, idx) in bonusActions"
        :key="idx"
        class="action"
        v-html="action"
      ></div>
    </div>
    <div v-if="monster.legendaryActions.count > 0" class="legendary-actions">
      <h3 class="section">{{ $t('editor.legendary.label') }}</h3>
      <div class="preamble" v-html="legendaryPreamble"></div>
      <div
        v-for="(action, idx) in legendaryActions"
        :key="idx"
        class="action legendary"
        v-html="action"
      ></div>
    </div>
    <div v-if="monster.mythicActions.actions.length > 0" class="mythic-actions">
      <h3 class="section">{{ $t('editor.mythic.label') }}</h3>
      <div class="preamble" v-html="mythicPreamble"></div>
      <div
        v-for="(action, idx) in mythicActions"
        :key="idx"
        class="action legendary"
        v-html="action"
      ></div>
    </div>
    <div v-if="monster.reactions.length > 0" class="reactions">
      <h3 class="section">{{ $t('editor.reaction.label') }}</h3>
      <div
        v-for="(reaction, idx) in reactions"
        :key="idx"
        class="action reaction"
        v-html="reaction"
      ></div>
    </div>
    <div v-if="monster.lairActions.length > 0" class="lair-actions">
      <h3 class="section">{{ $t('editor.lair.label') }}</h3>
      <div class="preamble" v-html="lairActionPreamble"></div>
      <ul>
        <li
          v-for="(lairAction, idx) in lairActions"
          :key="idx"
          class="action lair"
          v-html="lairAction"
        ></li>
      </ul>
    </div>
    <div v-if="monster.regionalEffects.length > 0" class="regional-effects">
      <h3 class="section">{{ $t('editor.regional.label') }}</h3>
      <div class="preamble" v-html="regionalEffectPreamble"></div>
      <ul>
        <li
          v-for="(effect, idx) in regionalEffects"
          :key="idx"
          class="action regional"
          v-html="effect"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, StyleValue } from 'vue'
import { useMonsterStore } from 'src/stores/monster-store'
import { useTextRenderer } from './useTextRenderer'
import { useProcessTokens } from './useProcessTokens'
import { useEditorStore } from 'src/stores/editor-store'

export default defineComponent({
  name: 'WebRenderer',
  setup() {
    const monster = useMonsterStore()
    const { sanitizeWebString } = useProcessTokens()
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

    const actions = computed(() =>
      textRenderer.actions.value.map((a) => sanitizeWebString(a))
    )

    const bonusActions = computed(() =>
      textRenderer.bonusActions.value.map((a) => sanitizeWebString(a))
    )

    const multiattacks = computed(() =>
      sanitizeWebString(textRenderer.multiattacks.value)
    )

    const legendaryPreamble = computed(() =>
      sanitizeWebString(textRenderer.legendaryPreamble.value)
    )

    const legendaryActions = computed(() =>
      textRenderer.legendaryActions.value.map((a) => sanitizeWebString(a))
    )

    const mythicTrait = computed(() =>
      sanitizeWebString(textRenderer.mythicTrait.value)
    )

    const mythicPreamble = computed(() =>
      sanitizeWebString(textRenderer.mythicPreamble.value)
    )

    const mythicActions = computed(() =>
      textRenderer.mythicActions.value.map((a) => sanitizeWebString(a))
    )

    const reactions = computed(() =>
      textRenderer.reactions.value.map((r) => sanitizeWebString(r))
    )

    const lairActionPreamble = computed(() =>
      sanitizeWebString(textRenderer.lairActionPreamble.value)
    )

    const lairActions = computed(() =>
      textRenderer.lairActions.value.map((la) => sanitizeWebString(la))
    )

    const regionalEffectPreamble = computed(() =>
      sanitizeWebString(textRenderer.regionalEffectPreamble.value)
    )

    const regionalEffects = computed(() =>
      textRenderer.regionalEffects.value.map((re) => sanitizeWebString(re))
    )

    const editorStore = useEditorStore()
    const columns = computed<StyleValue>(() => {
      return {
        columnCount: editorStore.statBlockColumns,
      }
    })

    return {
      monster,
      ...textRenderer,
      sanitizedClassSpellcastingPreamble,
      sanitizedInnateSpellcastingPreamble,
      traits,
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
      columns,
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
    line-height: 2.5rem;
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
    line-height: 1.5rem;
  }
}
</style>
