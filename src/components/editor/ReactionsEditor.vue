<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="mdi-account-reactivate"
    :label="$t('editor.reaction.label')"
  >
    <q-card>
      <q-card-section class="row">
        <q-list
          bordered
          separator
          class="rounded-borders bg-blue-10 full-width"
        >
        </q-list>
      </q-card-section>

      <q-card-actions align="center">
        <!-- <q-btn
          color="positive"
          class="full-width"
          :label="$t('editor.reaction.add')"
          @click="monster.addReaction"
        /> -->
      </q-card-actions>
    </q-card>
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
  name: 'ReactionsEditor',
  // components: { MonsterTextEditor, CrAnnotationCard },
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
    }
  },
})
</script>
