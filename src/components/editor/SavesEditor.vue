<template>
  <q-expansion-item
    expand-separator
    icon="shield"
    :label="$t('editor.saves.label')"
    :caption="$t('editor.saves.caption')"
  >
    <q-card class="row">
      <q-input
        v-for="(save, stat) in saves"
        :key="stat"
        type="number"
        :model-value="saveModifierForStat(monster, stat)"
        class="col-sm-12 col-md-4 q-pa-sm"
        :label="$t(`monster.stat.${stat}`)"
        :disable="!save?.override ?? true"
        @update:model-value="
          (value) => (monster.saves[stat].overrideValue = parseInt(`${value}`))
        "
      >
        <template #after>
          <q-btn-group push>
            <q-btn
              push
              :color="saves[stat].proficient ? 'positive' : 'dark'"
              icon="keyboard_arrow_up"
              @click="saves[stat].proficient = !saves[stat].proficient"
            >
              <q-tooltip class="text-body2">{{
                $t('editor.proficient')
              }}</q-tooltip>
            </q-btn>
            <q-btn
              push
              :color="saves[stat].override ? 'warning' : 'dark'"
              icon="handyman"
              @click="saves[stat].override = !saves[stat].override"
            >
              <q-tooltip class="text-body2">{{
                $t('editor.override')
              }}</q-tooltip>
            </q-btn>
          </q-btn-group>
        </template>
      </q-input>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'
import { saveModifierForStat } from '../rendering/mathRendering'

export default defineComponent({
  name: 'SavesEditor',
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
      saves: monster.saves,
      saveModifierForStat,
    }
  },
})
</script>
