<template>
  <div id="render" class="statblock" :class="blockStyle" :style="columns">
    <h2 class="monster-name">{{ monster.name }}</h2>
    <div class="type">
      {{ monster.size }} {{ monster.type }}, {{ monster.alignment }}
    </div>
    <hr />
    <div class="skill ac">
      <div>
        <span class="name">Armor Class</span> {{ monster.AC
        }}{{ monster.ACType === '' ? '' : ` (${monster.ACType})` }}
      </div>
      <span v-if="blockStyle.mm2024"
        ><b>{{ $t('skill.INITIATIVE') }}</b> {{ initiative }}</span
      >
    </div>
    <div class="skill"><span class="name">Hit Points</span> {{ hp }}</div>
    <div class="skill"><span class="name">Speed</span> {{ speeds }}</div>
    <hr />
    <div v-if="blockStyle.mm2014" class="row no-wrap" style="width: 100%">
      <div v-for="stat in stats" :key="stat.stat" class="stat-container">
        <div class="stat-name">{{ stat.stat }}</div>
        <div class="stat">
          <div class="score">{{ stat.score }}</div>
          <div class="modifier">({{ stat.renderedModifier }})</div>
        </div>
      </div>
    </div>
    <div
      v-else-if="blockStyle.mm2024"
      class="row no-wrap stats"
      style="width: 100%"
    >
      <div class="stat-table">
        <div class="header-label mod">{{ $t('editor.mod') }}</div>
        <div class="header-label save">{{ $t('editor.save') }}</div>
        <div class="stat one">
          {{ statsAndSavesByKey.STR.stat.toLowerCase() }}
        </div>
        <div class="score one">{{ statsAndSavesByKey.STR.score }}</div>
        <div class="mod one">{{ statsAndSavesByKey.STR.renderedModifier }}</div>
        <div class="save one">{{ statsAndSavesByKey.STR.renderedSave }}</div>
        <div class="stat two">
          {{ statsAndSavesByKey.INT.stat.toLowerCase() }}
        </div>
        <div class="score two">{{ statsAndSavesByKey.INT.score }}</div>
        <div class="mod two">{{ statsAndSavesByKey.INT.renderedModifier }}</div>
        <div class="save two">{{ statsAndSavesByKey.INT.renderedSave }}</div>
      </div>
      <div class="stat-table">
        <div class="header-label mod">{{ $t('editor.mod') }}</div>
        <div class="header-label save">{{ $t('editor.save') }}</div>
        <div class="stat one">
          {{ statsAndSavesByKey.DEX.stat.toLowerCase() }}
        </div>
        <div class="score one">{{ statsAndSavesByKey.DEX.score }}</div>
        <div class="mod one">{{ statsAndSavesByKey.DEX.renderedModifier }}</div>
        <div class="save one">{{ statsAndSavesByKey.DEX.renderedSave }}</div>
        <div class="stat two">
          {{ statsAndSavesByKey.WIS.stat.toLowerCase() }}
        </div>
        <div class="score two">{{ statsAndSavesByKey.WIS.score }}</div>
        <div class="mod two">{{ statsAndSavesByKey.WIS.renderedModifier }}</div>
        <div class="save two">{{ statsAndSavesByKey.WIS.renderedSave }}</div>
      </div>
      <div class="stat-table">
        <div class="header-label mod">{{ $t('editor.mod') }}</div>
        <div class="header-label save">{{ $t('editor.save') }}</div>
        <div class="stat one">
          {{ statsAndSavesByKey.CON.stat.toLowerCase() }}
        </div>
        <div class="score one">{{ statsAndSavesByKey.CON.score }}</div>
        <div class="mod one">{{ statsAndSavesByKey.CON.renderedModifier }}</div>
        <div class="save one">{{ statsAndSavesByKey.CON.renderedSave }}</div>
        <div class="stat two">
          {{ statsAndSavesByKey.CHA.stat.toLowerCase() }}
        </div>
        <div class="score two">{{ statsAndSavesByKey.CHA.score }}</div>
        <div class="mod two">{{ statsAndSavesByKey.CHA.renderedModifier }}</div>
        <div class="save two">{{ statsAndSavesByKey.CHA.renderedSave }}</div>
      </div>
    </div>
    <hr />
    <div v-show="blockStyle.mm2014 && saves !== ''" class="skill">
      <span class="name">{{ $t('monster.saves') }}</span> {{ saves }}
    </div>
    <div v-show="skills !== ''" class="skill">
      <span class="name">{{ $t('monster.skills') }}</span> {{ skills }}
    </div>
    <div
      v-show="
        blockStyle.mm2024 &&
        monster.inventory !== '' &&
        monster.inventory !== '<br>'
      "
      class="skill"
    >
      <span class="name">{{ $t('monster.gear') }}</span
      >&nbsp;
      <span v-html="inventory"></span>
    </div>
    <div
      v-show="monster.resistances && monster.resistances.length > 0"
      class="skill"
    >
      <span class="name">{{
        blockStyle.mm2024
          ? $t('monster.resistances')
          : $t('monster.resistances2014')
      }}</span>
      {{ resistances }}
    </div>
    <div
      v-show="
        monster.immunities &&
        monster.immunities.length +
          (blockStyle.mm2024 ? monster.conditions.length : 0) >
          0
      "
      class="skill"
    >
      <span class="name">{{
        blockStyle.mm2024
          ? $t('monster.immunities')
          : $t('monster.immunities2014')
      }}</span>
      {{ blockStyle.mm2024 ? immunitiesAndConditions : immunities }}
    </div>
    <div
      v-show="monster.vulnerabilities && monster.vulnerabilities.length > 0"
      class="skill"
    >
      <span class="name">{{
        blockStyle.mm2024
          ? $t('monster.vulnerabilities')
          : $t('monster.vulnerabilities2014')
      }}</span>
      {{ vulnerabilities }}
    </div>
    <div
      v-show="
        blockStyle.mm2014 && monster.conditions && monster.conditions.length > 0
      "
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
      <span v-if="blockStyle.mm2014" style="float: right"
        ><b>Proficiency Bonus</b> +{{ monster.proficiency }}</span
      >
    </div>
    <hr />
    <h3 v-if="blockStyle.mm2024 && traits.length > 0" class="section first">
      {{ $t('editor.traits.label') }}
    </h3>
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
    <div
      v-if="monster.multiattacks.length > 0"
      class="multiattack"
      v-html="multiattacks"
    ></div>
    <div
      v-for="(attack, idx) in attacks"
      :key="idx"
      class="attack"
      v-html="attack"
    ></div>
    <div
      v-for="(action, idx) in actions"
      :key="idx"
      class="action"
      v-html="action"
    ></div>
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
    <div v-if="blockStyle.mm2014 && monster.inventory !== ''" class="inventory">
      <h3 class="section">{{ $t('editor.inventory.label') }}</h3>
      <div v-html="inventory"></div>
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

    const blockStyle = computed(() => ({
      mm2014: editorStore.style === '2014',
      mm2024: editorStore.style === '2024',
    }))

    const cr = computed(() => sanitizeWebString(textRenderer.cr.value))

    const inventory = computed(() =>
      sanitizeWebString(textRenderer.inventory.value)
    )

    const initiative = computed(() =>
      sanitizeWebString(textRenderer.initiative.value)
    )

    return {
      monster,
      ...textRenderer,
      cr,
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
      inventory,
      blockStyle,
      initiative,
    }
  },
})
</script>

<style>
/* i don't know why scoped doesn't work but this does */
.statblock b {
  font-family: ff-scala-sans-pro;
  font-style: normal;
  font-weight: 700;
}

.statblock i {
  font-family: ff-scala-sans-pro;
  font-style: italic;
}

.statblock b > i,
.statblock i > b {
  font-family: ff-scala-sans-pro;
  font-style: italic;
  font-weight: 700;
}
</style>

<style lang="scss" scoped>
.statblock {
  background-color: #fdf1dc;
  color: #000;
  font-family: ff-scala-sans-pro;
  font-size: 1rem;
  letter-spacing: 0.01em;
  padding: 8px;
  width: 100%;

  .monster-name {
    font-family: mrs-eaves-roman-small-caps, MrEaves;
    color: #58180d;
    font-weight: 800;
    font-size: 2.2em;
    margin: 0;
    line-height: 2.5rem;
  }

  .type,
  .attack .distance,
  .attack .hit {
    font-family: ff-scala-sans-pro, ScalySansItalic;
    font-style: italic;
  }

  hr {
    border: 1px solid #9c2b1b;
    margin: 4px 0;
  }

  .skill {
    line-height: 1.2rem;
    color: #58180d;

    .name {
      font-family: ff-scala-sans-pro, ScalySansBold;
      font-weight: 700;
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
      font-family: ff-scala-sans-pro, ScalySansBold;
      font-weight: 700;
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
        font-family: ff-scala-sans-pro, ScalySansItalic;
        font-style: italic;
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
      font-family: ff-scala-sans-pro, ScalySansBoldItalic;
      font-weight: 700;
      font-style: italic;
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
    font-family: ScalaSansCaps;
    font-weight: 400;
    letter-spacing: normal;
    color: #58180d;
    border-bottom: 1px solid #58180d;
    margin-bottom: 4px;
    line-height: 1.5rem;
  }
}

/** 2024 overrides */
.statblock.mm2024 {
  background-color: #e4e2d9;
  border-radius: 12px;
  border: 2px solid #69665f;
  outline: 2px solid #69665f;
  outline-offset: -6px;
  padding: 10px;

  .monster-name {
    font-family: ScalaSansCaps;
    letter-spacing: -1px;
    font-size: 1.8em;
    border-bottom: 1px solid #58180d;
    line-height: 2rem;
  }

  .type {
    color: #69665f;
    margin-top: 2px;
  }

  hr {
    margin: 0.5rem 0;
    border: none;
  }

  .ac {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }

  .skill {
    padding-left: 18px;
    text-indent: -18px;
  }

  .first.section {
    margin-top: 0.5em;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    gap: 10px;
    margin-bottom: 1em;

    .stat-table {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, auto);
      grid-template-areas: 'blank blank mod save' 'stat-1 score-1 mod-1 save-1' 'stat-2 score-2 mod-2 save-2';

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #58180d;
      }

      .header-label {
        font-family: ScalaSansCaps;
        font-size: 12px;
        color: #69665f;
        text-transform: uppercase;
      }

      .header-label.mod {
        grid-area: mod;
      }

      .header-label.save {
        grid-area: save;
      }

      .stat {
        font-weight: bold;
        font-family: ScalaSansCaps;
        text-transform: capitalize;
      }

      .stat.one,
      .score.one {
        background-color: #dcd2ba;
      }

      .stat.two,
      .score.two {
        background-color: #d0d5b5;
      }

      .mod.one,
      .save.one {
        background-color: #d7c9c2;
      }

      .mod.two,
      .save.two {
        background-color: #d4c8db;
      }

      .stat.one {
        grid-area: stat-1;
      }

      .score.one {
        grid-area: score-1;
      }

      .mod.one {
        grid-area: mod-1;
      }

      .save.one {
        grid-area: save-1;
      }

      .stat.two {
        grid-area: stat-2;
      }

      .score.two {
        grid-area: score-2;
      }

      .mod.two {
        grid-area: mod-2;
      }

      .save.two {
        grid-area: save-2;
      }
    }
  }
}
</style>
