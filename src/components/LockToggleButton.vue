<template>
  <q-btn
    push
    :icon="locked ? 'lock' : 'lock_open'"
    :color="locked ? 'dark' : 'warning'"
    size="md"
  >
    <q-tooltip class="text-body2">
      {{ locked ? lockTooltip : unlockTooltip }}
    </q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'LockToggleButton',
  props: {
    locked: {
      type: Boolean,
      required: true,
    },
    lockTooltip: {
      type: String,
      required: true,
    },
    unlockTooltip: {
      type: String,
      required: true,
    },
  },
})
</script>
