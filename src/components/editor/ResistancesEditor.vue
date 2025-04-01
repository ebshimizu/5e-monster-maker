<template>
  <q-expansion-item
    expand-separator
    icon="shield"
    :label="$t('editor.resistances.label')"
    :caption="$t('editor.resistances.caption')"
  >
    <q-card>
      <q-card-section class="row">
        <q-select
          v-model="monster.resistances"
          :options="resistanceOptions"
          use-chips
          multiple
          clearable
          new-value-mode="add-unique"
          class="col-12 q-pa-sm q-mb-sm"
          use-input
          input-debounce="0"
          :label="$t('monster.resistances')"
          bottom-slots
          @filter="resistanceFilter"
          @clear="monster.resistances = []"
        >
          <template #hint>
            {{ $t('editor.customAllowed') }}
          </template>
        </q-select>
        <q-select
          v-model="monster.immunities"
          :options="immunityOptions"
          use-chips
          multiple
          clearable
          new-value-mode="add-unique"
          class="col-12 q-pa-sm q-mb-sm"
          use-input
          input-debounce="0"
          :label="$t('monster.immunities')"
          bottom-slots
          @filter="immunityFilter"
          @clear="monster.immunities = []"
        >
          <template #hint>
            {{ $t('editor.customAllowed') }}
          </template>
        </q-select>
        <q-select
          v-model="monster.vulnerabilities"
          :options="vulnerabilityOptions"
          use-chips
          multiple
          clearable
          new-value-mode="add-unique"
          class="col-12 q-pa-sm q-mb-sm"
          use-input
          input-debounce="0"
          :label="$t('monster.vulnerabilities')"
          bottom-slots
          @filter="vulnerabilityFilter"
          @clear="monster.vulnerabilities = []"
        >
          <template #hint>
            {{ $t('editor.customAllowed') }}
          </template>
        </q-select>
        <q-select
          v-model="monster.conditions"
          :options="conditionOptions"
          use-chips
          multiple
          clearable
          new-value-mode="add-unique"
          class="col-12 q-pa-sm q-mb-sm"
          use-input
          input-debounce="0"
          :label="$t('monster.conditionImmunities')"
          bottom-slots
          @filter="conditionFilter"
          @clear="monster.conditions = []"
        >
          <template #hint>
            {{ $t('editor.customAllowed') }}
          </template>
        </q-select>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useConditionDefaults } from 'src/data/CONDITION'
import { useDamageTypeDefaults } from 'src/data/DAMAGE_TYPE'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent, ref } from 'vue'
import { basicArrayFilter } from '../filters'

export default defineComponent({
  name: 'ResistancesEditor',
  setup() {
    const monster = useMonsterStore()
    const { damageTypeDefaults } = useDamageTypeDefaults()
    const resistanceOptions = ref([])

    const resistanceFilter = basicArrayFilter(
      damageTypeDefaults,
      resistanceOptions
    )

    const immunityOptions = ref([])
    const immunityFilter = basicArrayFilter(damageTypeDefaults, immunityOptions)

    const vulnerabilityOptions = ref([])
    const vulnerabilityFilter = basicArrayFilter(
      damageTypeDefaults,
      vulnerabilityOptions
    )

    const { conditionDefaults } = useConditionDefaults()
    const conditionOptions = ref([])
    const conditionFilter = basicArrayFilter(
      conditionDefaults,
      conditionOptions
    )

    return {
      monster,
      resistanceOptions,
      resistanceFilter,
      immunityOptions,
      immunityFilter,
      vulnerabilityOptions,
      vulnerabilityFilter,
      conditionOptions,
      conditionFilter,
    }
  },
})
</script>
