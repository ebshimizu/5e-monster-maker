<template>
  <q-expansion-item
    expand-separator
    icon="speed"
    :label="$t('editor.speeds.label')"
    :caption="$t('editor.speeds.caption')"
  >
    <q-card>
      <q-card-section class="row"> editors </q-card-section>

      <q-card-actions align="center">
        <q-btn class="full-width" color="positive" label="Add Speed" />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SpeedsEditor',
})
</script>
