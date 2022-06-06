<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="fa-solid fa-dna"
    :label="$t('editor.traits.label')"
    :caption="$t('editor.traits.caption')"
  >
    <q-card>
      <q-card-section class="row"> </q-card-section>

      <q-card-actions align="center">
        <q-btn
          color="positive"
          class="full-width"
          :label="$t('editor.addTrait')"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TraitsEditor',
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
    }
  },
})
</script>
