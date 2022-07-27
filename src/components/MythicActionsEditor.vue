<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="fa-solid fa-building-columns"
    :label="$t('editor.mythic.label')"
    :caption="$t('editor.mythic.caption')"
  >
    <q-card> </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MythicActionsEditor',
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
    }
  },
})
</script>
