<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="fa-solid fa-hand-fist"
    :label="$t('editor.attack.label')"
  >
    <q-card>
      <q-card-section class="row">
        <q-list
          bordered
          separator
          class="rounded-borders bg-blue-10 full-width"
        >
          <attack-panel
            v-for="attack in monster.attacks"
            :id="attack.id"
            :key="attack.id"
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
    <div class="q-pa-sm">
      <q-card bordered>
        <q-card-section class="bg-blue-10">
          <div class="text-body2 text-bold">Multiattacks</div>
        </q-card-section>
        <q-card-section> None </q-card-section>
        <q-card-actions>
          <q-btn
            color="positive"
            class="full-width"
            :label="$t('editor.multiattack.add')"
          />
        </q-card-actions>
      </q-card>
    </div>
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
