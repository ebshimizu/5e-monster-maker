<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="perm_identity"
    label="Basics"
    caption="Essential Monster Stats"
  >
    <q-card>
      <div class="row">
        <q-input
          v-model="monster.name"
          label="Name"
          class="q-pa-sm col-8"
          debounce="500"
        />
        <q-input
          v-model.number="monster.proficiency"
          type="number"
          label="Proficiency Bonus"
          class="col-2 q-pa-sm"
        />
        <q-select
          v-model="monster.CR"
          :options="crValues"
          :display-value="crValues[monster.CR].label"
          emit-value
          label="CR"
          class="col-2 q-pa-sm"
        />
        <q-select
          v-model="monster.size"
          :options="sizeValues"
          label="Size"
          class="col-2 q-pa-sm"
        />
        <q-select
          v-model="monster.type"
          :options="typeOptions"
          use-input
          input-debounce="0"
          label="Type"
          class="col-6 q-pa-sm"
          new-value-mode="add-unique"
          @filter="typeFilter"
        />
        <q-select
          v-model="monster.alignment"
          :options="alignmentOptions"
          input-debounce="0"
          use-input
          label="Alignment"
          class="col-4 q-pa-sm"
          new-value-mode="add-unique"
          @filter="alignmentFilter"
        />
        <q-input
          v-model.number="monster.AC"
          type="number"
          label="AC"
          min="0"
          class="col-2 q-pa-sm"
        />
        <q-input
          v-model="monster.ACType"
          label="AC Type"
          class="col-4 q-pa-sm"
        />
        <q-input
          v-model.number="monster.HP.HD"
          type="number"
          label="HD Count"
          min="0"
          class="col-2 q-pa-sm"
        />
        <q-select
          v-model.number="monster.HP.type"
          :options="diceOptions"
          emit-value
          :display-value="diceLookup[monster.HP.type]"
          label="HD Type"
          class="col-2 q-pa-sm"
        />
        <q-input
          v-model.number="monster.HP.modifier"
          type="number"
          label="HP Modifier"
          class="col-2 q-pa-sm"
        />
        <q-input
          v-for="stat in statKeys"
          :key="stat"
          v-model.number="monster.stats[stat]"
          type="number"
          :label="stat"
          class="col-2 q-pa-sm"
        />
        <q-input
          v-model="monster.languages"
          label="Languages"
          class="col-12 q-pa-sm"
        />
      </div>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { STANDARD_ALIGNMENT } from 'src/data/ALIGNMENT'
import { CR_SELECT } from 'src/data/CR'
import { DICE_SELECT, DIE_LOOKUP } from 'src/data/DICE'
import { CREATURE_SIZE } from 'src/data/SIZE'
import { STANDARD_CREATURE_TYPE } from 'src/data/TYPE'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'BasicsEditor',
  setup() {
    const monster = useMonsterStore()
    const typeOptions = ref(STANDARD_CREATURE_TYPE)
    const alignmentOptions = ref(STANDARD_ALIGNMENT)
    const diceOptions = DICE_SELECT
    const diceLookup = DIE_LOOKUP
    const statKeys = Object.keys(
      monster.stats
    ) as (keyof typeof monster.stats)[]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typeFilter = function (val: string, update: any) {
      update(() => {
        if (val === '') {
          typeOptions.value = STANDARD_CREATURE_TYPE
        } else {
          const needle = val.toLowerCase()
          typeOptions.value = STANDARD_CREATURE_TYPE.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const alignmentFilter = function (val: string, update: any) {
      update(() => {
        if (val === '') {
          alignmentOptions.value = STANDARD_ALIGNMENT
        } else {
          const needle = val.toLowerCase()
          alignmentOptions.value = STANDARD_ALIGNMENT.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    }

    return {
      monster,
      crValues: CR_SELECT,
      sizeValues: CREATURE_SIZE,
      typeOptions,
      typeFilter,
      alignmentOptions,
      alignmentFilter,
      diceOptions,
      diceLookup,
      statKeys,
    }
  },
})
</script>
