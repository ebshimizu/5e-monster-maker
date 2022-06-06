<template>
  <q-expansion-item
    expand-separator
    icon="settings_input_antenna"
    :label="$t('editor.senses.label')"
    :caption="$t('editor.senses.caption')"
  >
    <q-card class="row">
      <q-input
        v-for="(_, sense) in monster.senses"
        :key="sense"
        v-model.number="monster.senses[sense]"
        type="number"
        :label="$t(`monster.sense.${sense}`)"
        suffix="ft"
        min="0"
        step="5"
        class="col q-pa-sm"
      />
      <q-input
        type="number"
        :model-value="monster.computedPassivePerception"
        class="col-3 q-pa-sm"
        :label="$t(`monster.passivePerception`)"
        :disable="!passivePerception?.override ?? true"
        @update:model-value="
          (value) => (passivePerception.overrideValue = parseInt(`${value}`))
        "
      >
        <template #after>
          <q-btn
            round
            :color="passivePerception.override ? 'warning' : 'dark'"
            icon="handyman"
            @click="passivePerception.override = !passivePerception.override"
          >
            <q-tooltip class="text-body2">{{
              $t('editor.override')
            }}</q-tooltip>
          </q-btn>
        </template>
      </q-input>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SavesEditor',
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
      passivePerception: monster.passivePerception,
      senses: Object.entries(monster.senses).map(([k, v]) => {
        return { sense: k, range: v }
      }),
    }
  },
})
</script>
