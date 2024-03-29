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
        :model-value="monster.senses[sense]"
        type="number"
        :label="$t(`monster.sense.${sense}`)"
        suffix="ft"
        min="0"
        step="5"
        class="col q-pa-sm"
        @update:model-value="
          (value: string | number | null) => (monster.senses[sense] = validateNumber(value, 0))
        "
      />
      <q-input
        type="number"
        :model-value="monster.computedPassivePerception"
        class="col-3 q-pa-sm"
        :label="$t(`monster.passivePerception`)"
        :disable="!passivePerception?.override ?? true"
        @update:model-value="
          (value: string | number | null) => (passivePerception.overrideValue = validateNumber(value, 0))
        "
      >
        <template #after>
          <q-btn
            push
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
      <q-input
        :model-value="monster.sensesNotes"
        :label="$t('monster.sensesNotes')"
        class="col-12 q-pa-sm"
        @update:model-value="(value: string | number | null) => monster.sensesNotes = `${value ?? ''}`"
      />
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { computed, defineComponent } from 'vue'
import { validateNumber } from './numberInput'

export default defineComponent({
  name: 'SavesEditor',
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
      passivePerception: computed(() => monster.passivePerception),
      senses: Object.entries(monster.senses).map(([k, v]) => {
        return { sense: k, range: v }
      }),
      validateNumber: validateNumber,
    }
  },
})
</script>
