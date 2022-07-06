<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="fa-solid fa-wand-sparkles"
    :label="$t('editor.spellcasting.label')"
    :caption="$t('editor.spellcasting.caption')"
  >
    <q-card>
      <!-- basics -->
      <div class="row">
        <q-select
          v-model="monster.spellcasting.stat"
          :options="statOptions"
          :label="$t('monster.spellcasting.ability')"
          class="col q-pa-sm"
        />
        <q-input
          :model-value="spellSaveValue"
          :label="$t('monster.spellcasting.save')"
          type="number"
          :disable="!monster.spellcasting.save.override"
          class="col q-pa-sm"
          @update:model-value="
            (v) => (monster.spellcasting.save.overrideValue = parseInt(`${v}`))
          "
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.spellcasting.save.override"
              :lock-tooltip="$t('monster.spellcasting.lockSave')"
              :unlock-tooltip="$t('monster.spellcasting.unlockSave')"
              @click="
                monster.spellcasting.save.override =
                  !monster.spellcasting.save.override
              "
            />
          </template>
        </q-input>
        <q-input
          :model-value="spellAttackValue"
          :label="$t('monster.spellcasting.attack')"
          type="number"
          :disable="!monster.spellcasting.attack.override"
          class="col q-pa-sm"
          @update:model-value="
            (v) =>
              (monster.spellcasting.attack.overrideValue = parseInt(`${v}`))
          "
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.spellcasting.attack.override"
              :lock-tooltip="$t('monster.spellcasting.lockAttack')"
              :unlock-tooltip="$t('monster.spellcasting.unlockAttack')"
              @click="
                monster.spellcasting.attack.override =
                  !monster.spellcasting.attack.override
              "
            />
          </template>
        </q-input>
        <q-input
          :model-value="spellModifierValue"
          :label="$t('monster.spellcasting.modifier')"
          type="number"
          :disable="!monster.spellcasting.modifier.override"
          class="col q-pa-sm"
          @update:model-value="
            (v) =>
              (monster.spellcasting.modifier.overrideValue = parseInt(`${v}`))
          "
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.spellcasting.modifier.override"
              :lock-tooltip="$t('monster.spellcasting.lockModifier')"
              :unlock-tooltip="$t('monster.spellcasting.unlockModifier')"
              @click="
                monster.spellcasting.modifier.override =
                  !monster.spellcasting.modifier.override
              "
            />
          </template>
        </q-input>
      </div>
      <!-- class spellcasting -->
      <div class="q-pa-sm full-width">
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            expand-separator
            :label="$t('editor.spellcasting.class.label')"
            :caption="$t('editor.spellcasting.class.caption')"
            header-class="bg-purple-10"
          >
            <q-card>
              <q-card-section>
                <div class="row">
                  <q-select
                    :label="$t('monster.spellcasting.class')"
                    :model-value="monster.spellcasting.class"
                    :display-value="classDisplayValue"
                    :options="SrdCastingClassOptions"
                    new-value-mode="add-unique"
                    use-input
                    emit-value
                    class="col-2 q-pa-sm"
                    @update:model-value="updateSpellcastingClass"
                  />
                  <q-input
                    v-model.number="monster.spellcasting.level"
                    :label="$t('monster.spellcasting.level')"
                    type="number"
                    min="1"
                    max="20"
                    class="col-2 q-pa-sm"
                    @update:model-value="updateSpellcastingSlots"
                  />
                  <q-input
                    v-model="monster.spellcasting.notes"
                    :label="$t('monster.spellcasting.notes')"
                    class="col q-pa-sm"
                    bottom-slots
                  >
                    <template #hint>{{ $t('editor.plainTextNote') }}</template>
                  </q-input>
                  <q-select
                    v-model="monster.spellcasting.standard"
                    :label="$t('editor.spellcasting.slot.all')"
                    :options="spellOptions"
                    use-chips
                    multiple
                    use-input
                    input-debounce="0"
                    class="col-12 q-pa-sm"
                    @filter="spellFilter"
                  >
                  </q-select>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useRechargeTimes } from 'src/data/RECHARGE_TIME'
import { useMonsterStore } from 'src/stores/monster-store'
import { SpellOption, useSpellsStore } from 'src/stores/spells-store'
import { computed, defineComponent, ref } from 'vue'
import { DndStat } from '../models'
import { useAutoUpdateCr } from './useAutoUpdateCr'
import LockToggleButton from '../LockToggleButton.vue'
import { useClasses } from 'src/data/CLASS'
import { spellArrayFilter } from '../filters'

export default defineComponent({
  name: 'SpellcastingEditor',
  components: { LockToggleButton },
  setup() {
    const monster = useMonsterStore()
    const spells = useSpellsStore()
    const { rechargeTimeOptions } = useRechargeTimes()
    const { autoUpdateCr, printCrSummary } = useAutoUpdateCr()
    const classes = useClasses()
    const baseSpells = computed<SpellOption[]>(() => spells.allSpellOptions)
    const spellOptions = ref<SpellOption[]>([])
    const spellFilter = spellArrayFilter(baseSpells, spellOptions)

    const classDisplayValue = computed(() => {
      if (monster.spellcasting.class == null) return ''

      return monster.spellcasting.class in classes.SrdClass.value
        ? classes.SrdClass.value[
            monster.spellcasting.class as keyof typeof classes.SrdClass.value
          ]
        : monster.spellcasting.class
    })

    // TODO: come back and lift this out if a different component needs it
    const statOptions = computed<DndStat[]>(() => [
      'STR',
      'CON',
      'DEX',
      'INT',
      'WIS',
      'CHA',
    ])
    const spellSaveValue = computed(() =>
      monster.spellcasting.save.override
        ? monster.spellcasting.save.overrideValue
        : monster.defaultSpellSave(monster.spellcasting.stat)
    )
    const spellAttackValue = computed(() =>
      monster.spellcasting.attack.override
        ? monster.spellcasting.attack.overrideValue
        : monster.defaultSpellAttackModifier(monster.spellcasting.stat)
    )
    const spellModifierValue = computed(() =>
      monster.spellcasting.modifier.override
        ? monster.spellcasting.modifier.overrideValue
        : monster.defaultSpellModifier(monster.spellcasting.stat)
    )

    const updateSpellcastingClass = (value: string | undefined) => {
      // if it's a class that actually casts
      if (value != null && value in classes.ClassCastingStat) {
        // input the data
        const classKey = value as keyof typeof classes.ClassCastingStat
        const slots = classes.ClassSpellSlots[classKey]

        // the preset class names are special and get localized renders
        // we also need the key for adjusting slots based on level
        monster.spellcasting.class = classKey
        monster.spellcasting.stat = classes.ClassCastingStat[classKey] ?? 'INT'
        monster.spellcasting.slots =
          slots != null
            ? slots[monster.spellcasting.level - 1]
            : [0, 0, 0, 0, 0, 0, 0, 0, 0]
      } else {
        // leave it alone but update the monster
        monster.spellcasting.class = value
      }
    }

    const updateSpellcastingSlots = (value: string | number | null) => {
      if (
        typeof value === 'number' &&
        monster.spellcasting.class &&
        monster.spellcasting.class in classes.ClassCastingStat
      ) {
        const classKey = monster.spellcasting
          .class as keyof typeof classes.ClassCastingStat
        const slots = classes.ClassSpellSlots[classKey]

        // the preset class names are special and get localized renders
        // we also need the key for adjusting slots based on level
        monster.spellcasting.slots =
          slots != null ? slots[value - 1] : [0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    }

    return {
      monster,
      rechargeTimeOptions,
      statOptions,
      spellSaveValue,
      spellAttackValue,
      spellModifierValue,
      autoUpdateCr,
      printCrSummary,
      updateSpellcastingClass,
      updateSpellcastingSlots,
      classDisplayValue,
      spellOptions,
      spellFilter,
      ...classes,
    }
  },
})
</script>
