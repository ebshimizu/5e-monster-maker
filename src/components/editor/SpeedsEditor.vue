<template>
  <q-expansion-item
    expand-separator
    icon="speed"
    :label="$t('editor.speeds.label')"
    :caption="$t('editor.speeds.caption')"
  >
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SpeedsEditor',
})
</script>
