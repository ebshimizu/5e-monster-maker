<template>
  <q-expansion-item
    expand-separator
    icon="mdi-sword"
    :label="$t('editor.attack.label')"
  >
    <q-card>
      <q-card-section class="row">
        <q-list bordered separator class="rounded-borders bg-red-10 full-width">
          <attack-panel
            v-for="(attack, idx) in monster.attacks"
            :id="attack.id"
            :key="attack.id"
            :idx="idx"
          />
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          color="positive"
          class="full-width"
          :label="$t('editor.attack.add')"
          @click="monster.addNewAttack()"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'
import AttackPanel from './widgets/AttackPanel.vue'

export default defineComponent({
  name: 'AttacksEditor',
  components: { AttackPanel },
  setup() {
    const monster = useMonsterStore()
    return {
      monster,
    }
  },
})
</script>
