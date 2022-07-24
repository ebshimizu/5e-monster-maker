<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="fa-solid fa-dragon"
    :label="$t('editor.legendary.label')"
    :caption="$t('editor.legendary.caption')"
  >
    <q-card> </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useRechargeTimes } from 'src/data/RECHARGE_TIME'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent, computed } from 'vue'
import MonsterTextEditor from './MonsterTextEditor.vue'
import { useAutoUpdateCr } from './useAutoUpdateCr'
import CrAnnotationCard from './CrAnnotationCard.vue'

export default defineComponent({
  name: 'LegendaryActionsEditor',
  // components: { MonsterTextEditor },
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
    }
  },
})
</script>
