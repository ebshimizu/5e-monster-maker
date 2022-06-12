<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="fa-solid fa-wand-sparkles"
    :label="$t('editor.spellcasting.label')"
    :caption="$t('editor.spellcasting.caption')"
  >
  </q-expansion-item>
</template>

<script lang="ts">
import { useRechargeTimes } from 'src/data/RECHARGE_TIME'
import { useMonsterStore } from 'src/stores/monster-store'
import { useSpellsStore } from 'src/stores/spells-store'
import { defineComponent } from 'vue'
import { useAutoUpdateCr } from './useAutoUpdateCr'

export default defineComponent({
  name: 'SpellcastingEditor',
  setup() {
    const monster = useMonsterStore()
    const spells = useSpellsStore()
    const { rechargeTimeOptions } = useRechargeTimes()
    const { autoUpdateCr, printCrSummary } = useAutoUpdateCr()

    return {
      monster,
      traits: monster.traits,
      rechargeTimeOptions,
      autoUpdateCr,
      printCrSummary,
    }
  },
})
</script>
