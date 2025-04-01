<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="info"
    :label="$t('editor.basics.label')"
    :caption="$t('editor.basics.caption')"
  >
    <q-card>
      <div class="row">
        <q-input
          v-model="monster.name"
          :label="$t('monster.name')"
          class="q-pa-sm col-6"
          debounce="500"
        />
        <q-select
          v-if="!monster.useCrDisplayOverride"
          :model-value="monster.CR"
          :options="crValues"
          :display-value="crValues[monster.CR].label"
          emit-value
          :label="$t('monster.cr')"
          class="col-3 q-pa-sm"
          @update:model-value="(value: number | undefined) => {
            if (value != null) {
              monster.setCR(value)
            } else {
              monster.setCR(0)
            }
          }"
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.useCrDisplayOverride"
              :lock-tooltip="$t('editor.cr.standard')"
              :unlock-tooltip="$t('editor.cr.visualOverride')"
              @click="
                monster.useCrDisplayOverride = !monster.useCrDisplayOverride
              "
            />
          </template>
        </q-select>
        <q-input
          v-else
          v-model="monster.crOverride"
          :label="$t('monster.cr')"
          class="col-2 q-pa-sm"
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.useCrDisplayOverride"
              :lock-tooltip="$t('editor.cr.standard')"
              :unlock-tooltip="$t('editor.cr.visualOverride')"
              @click="
                monster.useCrDisplayOverride = !monster.useCrDisplayOverride
              "
            />
          </template>
        </q-input>
        <q-input
          :model-value="monster.proficiency"
          type="number"
          :label="$t('monster.proficiencyBonus')"
          class="col-3 q-pa-sm"
          :disable="!monster.proficiencyOverride"
          @update:model-value="
            (value: string | number | null) => (monster.proficiency = validateNumber(value, 0))
          "
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.proficiencyOverride"
              :lock-tooltip="$t('monster.proficiency.unlockFromCr')"
              :unlock-tooltip="$t('monster.proficiency.lockToCr')"
              @click="monster.toggleProficiencyOverride"
            />
          </template>
        </q-input>
        <q-input
          v-model="monster.nickname"
          :label="$t('monster.nickname')"
          class="q-pa-sm col-6"
          debounce="500"
        />
        <q-select
          v-if="!monster.useCrDisplayOverride"
          :model-value="monster.lairCr"
          :options="lairCrValues"
          :display-value="lairCrValues[monster.lairCr + 1].label"
          emit-value
          :label="$t('monster.lairCr')"
          class="col-2 q-pa-sm"
          @update:model-value="(value: number | undefined) => {
            monster.lairCr = value ?? -1
          }"
        ></q-select>
        <q-input
          v-model="monster.lairCrNote"
          :label="$t('monster.lairCrNote')"
          :disable="monster.lairCr === -1"
          class="q-pa-sm col-4"
          debounce="500"
        />
        <q-select
          :model-value="monster.size"
          :options="sizeValues"
          :label="$t('monster.size')"
          class="col-2 q-pa-sm"
          @update:model-value="monster.setSize"
        />
        <q-select
          v-model="monster.type"
          :options="typeOptions"
          use-input
          input-debounce="0"
          :label="$t('monster.type')"
          class="col-6 q-pa-sm"
          new-value-mode="add-unique"
          bottom-slots
          @filter="typeFilter"
        >
          <template #hint>
            {{ $t('editor.customAllowed') }}
          </template>
        </q-select>
        <q-select
          v-model="monster.alignment"
          :options="alignmentOptions"
          input-debounce="0"
          use-input
          :label="$t('monster.alignment')"
          class="col-4 q-pa-sm"
          new-value-mode="add-unique"
          bottom-slots
          @filter="alignmentFilter"
        >
          <template #hint>
            {{ $t('editor.customAllowed') }}
          </template>
        </q-select>
        <q-input
          :model-value="monster.AC"
          type="number"
          :label="$t('monster.ac')"
          min="0"
          class="col-2 q-pa-sm"
          @update:model-value="(value: string | number | null) => (monster.AC = validateNumber(value, 0))"
        >
          <template #after>
            <q-btn
              round
              color="primary"
              size="md"
              icon="auto_fix_high"
              @click="monster.setAcByCr"
            >
              <q-tooltip class="text-body2">{{
                $t('monster.setAcByCr')
              }}</q-tooltip>
            </q-btn>
          </template>
        </q-input>
        <q-input
          v-model="monster.ACType"
          :label="$t('monster.acType')"
          class="col-4 q-pa-sm"
        />
        <q-input
          :model-value="monster.HP.HD"
          type="number"
          :label="$t('monster.hp.hd')"
          min="0"
          class="col-2 q-pa-sm"
          @update:model-value="
            (value: number | string | null) => monster.setHpModifier(value, monster.stats.CON)
          "
        >
          <template #after>
            <q-btn
              round
              color="primary"
              size="md"
              icon="auto_fix_high"
              @click="monster.setHdByCr"
            >
              <q-tooltip class="text-body2">{{
                $t('monster.setHdByCr')
              }}</q-tooltip>
            </q-btn>
          </template>
        </q-input>
        <q-select
          v-model="monster.HP.type"
          :options="diceOptions"
          emit-value
          :display-value="diceLookup[monster.HP.type]"
          :label="$t('monster.hp.type')"
          class="col-2 q-pa-sm"
          :disable="!monster.hpDieTypeOverride"
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.hpDieTypeOverride"
              :lock-tooltip="$t('monster.hp.unlockFromSize')"
              :unlock-tooltip="$t('monster.hp.lockToSize')"
              @click="monster.toggleDieTypeOverride"
            />
          </template>
        </q-select>
        <q-input
          :model-value="monster.HP.modifier"
          :disable="!monster.hpModifierOverride"
          type="number"
          :label="$t('monster.hp.modifier')"
          class="col-2 q-pa-sm"
          @update:model-value="
            (value: string | number | null) => (monster.HP.modifier = validateNumber(value, 0))
          "
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.hpModifierOverride"
              :lock-tooltip="$t('monster.hp.unlockModifier')"
              :unlock-tooltip="$t('monster.hp.lockModifier')"
              @click="monster.toggleHpModifierOverride"
            />
          </template>
        </q-input>
        <q-input
          v-for="stat in statKeys"
          :key="stat"
          :model-value="monster.stats[stat]"
          type="number"
          :label="$t(`monster.stat.${stat}`)"
          class="col-2 q-pa-sm"
          @update:model-value="(value: number | string | null) => updateStat(stat, value)"
        />
        <q-input
          v-model="monster.languages"
          :label="$t('monster.languages')"
          class="col-12 q-pa-sm"
        />
      </div>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { STANDARD_ALIGNMENT } from 'src/data/ALIGNMENT'
import { CR_SELECT, LAIR_CR_SELECT } from 'src/data/CR'
import { DICE_SELECT, DIE_LOOKUP } from 'src/data/DICE'
import { CREATURE_SIZE } from 'src/data/SIZE'
import { STANDARD_CREATURE_TYPE } from 'src/data/TYPE'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent, ref } from 'vue'
import { basicArrayFilter } from '../filters'
import LockToggleButton from '../LockToggleButton.vue'
import { validateNumber } from './numberInput'

export default defineComponent({
  name: 'BasicsEditor',
  components: { LockToggleButton },
  setup() {
    const monster = useMonsterStore()
    const typeOptions = ref(STANDARD_CREATURE_TYPE)
    const alignmentOptions = ref(STANDARD_ALIGNMENT)
    const diceOptions = DICE_SELECT
    const diceLookup = DIE_LOOKUP
    const statKeys = Object.keys(
      monster.stats
    ) as (keyof typeof monster.stats)[]

    const typeFilter = basicArrayFilter(STANDARD_CREATURE_TYPE, typeOptions)
    const alignmentFilter = basicArrayFilter(
      STANDARD_ALIGNMENT,
      alignmentOptions
    )

    const updateStat = function (
      stat: keyof typeof monster.stats,
      value: number | string | null
    ) {
      if (stat === 'CON') {
        monster.setHpModifier(monster.HP.HD, value)
      } else {
        monster.stats[stat] = parseInt(`${value}`)
      }
    }

    return {
      monster,
      crValues: CR_SELECT,
      lairCrValues: LAIR_CR_SELECT,
      sizeValues: CREATURE_SIZE,
      typeOptions,
      typeFilter,
      alignmentOptions,
      alignmentFilter,
      diceOptions,
      diceLookup,
      statKeys,
      updateStat,
      validateNumber: validateNumber,
    }
  },
})
</script>
