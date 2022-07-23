<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="mdi-sword-cross"
    :label="$t('editor.multiattack.label')"
  >
    <q-card>
      <q-card-section> None </q-card-section>
      <q-card-actions>
        <q-btn
          color="positive"
          class="full-width"
          :label="$t('editor.multiattack.add')"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MultiattackEditor',
  setup() {
    const monster = useMonsterStore()
    return {
      monster,
    }
  },
})
</script>
