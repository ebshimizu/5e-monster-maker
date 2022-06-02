<template>
  <q-expansion-item
    expand-separator
    icon="shield"
    :label="$t('editor.saves.label')"
    :caption="$t('editor.saves.caption')"
  >
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SavesEditor',
})
</script>
