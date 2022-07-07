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
                    <template #after>
                      <q-btn
                        push
                        :icon="
                          monster.spellcasting.useCustomClassPreamble
                            ? 'edit'
                            : 'edit_off'
                        "
                        :color="
                          monster.spellcasting.useCustomClassPreamble
                            ? 'warning'
                            : 'dark'
                        "
                        size="md"
                        @click="
                          monster.spellcasting.useCustomClassPreamble =
                            !monster.spellcasting.useCustomClassPreamble
                        "
                      >
                        <q-tooltip class="text-body2">{{
                          monster.spellcasting.useCustomClassPreamble
                            ? $t('editor.spellcasting.slot.useCustomPreamble')
                            : $t('editor.spellcasting.slot.useDefaultPreamble')
                        }}</q-tooltip></q-btn
                      >
                    </template>
                  </q-input>

                  <q-slide-transition>
                    <div
                      v-show="monster.spellcasting.useCustomClassPreamble"
                      class="col-12 q-mt-md"
                    >
                      <monster-text-editor
                        :field="monster.spellcasting.customClassPreamble"
                        i18n-label-key="editor.spellcasting.slot.preamble"
                        token-category="spell"
                        :show-reset="true"
                        @update:model-value="
                          (value: string) =>
                            (monster.spellcasting.customClassPreamble =
                              value)
                        "
                        @reset="
                          monster.spellcasting.customClassPreamble = $t(
                            'presets.classSpellcasting'
                          )
                        "
                      />
                    </div>
                  </q-slide-transition>
                  <q-select
                    v-model="monster.spellcasting.standard"
                    :label="$t('editor.spellcasting.slot.all')"
                    :options="spellOptions"
                    use-chips
                    multiple
                    use-input
                    clearable
                    emit-value
                    input-debounce="0"
                    class="col-12 q-pa-sm"
                    @filter="spellFilter"
                    @clear="monster.spellcasting.standard = []"
                  >
                    <template #after>
                      <q-btn
                        class="q-mr-sm"
                        :color="classFilter ? 'positive' : 'dark'"
                        @click="classFilter = !classFilter"
                      >
                        {{
                          classFilter
                            ? $t('editor.spellcasting.slot.classOnlyOn')
                            : $t('editor.spellcasting.slot.classOnlyOff')
                        }}
                      </q-btn>
                      <q-btn color="primary" @click="showSlots = !showSlots">
                        {{
                          showSlots
                            ? $t('editor.spellcasting.slot.hideSlots')
                            : $t('editor.spellcasting.slot.showSlots')
                        }}
                      </q-btn>
                    </template>
                    <template #option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>{{ scope.opt.label }}</q-item-label>
                          <q-item-label caption>{{
                            scope.opt.classDisplay
                          }}</q-item-label>
                        </q-item-section>
                        <q-item-section side top>
                          <q-badge
                            color="purple-8"
                            :label="scope.opt.levelDisplay"
                          />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </q-card-section>
              <q-slide-transition>
                <div v-show="showSlots">
                  <q-separator />
                  <q-card-section>
                    <div class="row">
                      <template
                        v-for="(ordinal, level) in spellLevels"
                        :key="level"
                      >
                        <div class="col-1 flex flex-center">
                          {{
                            level === 0
                              ? $t('editor.spellcasting.slot.cantrip')
                              : $t('editor.spellcasting.slot.level', {
                                  ordinal,
                                })
                          }}
                        </div>
                        <div
                          v-if="level === 0"
                          class="col-1 text-capitalize flex flex-center"
                        >
                          {{ $t('recharge.AT_WILL') }}
                        </div>
                        <q-input
                          v-else
                          v-model.number="monster.spellcasting.slots[level - 1]"
                          type="number"
                          class="col-1 q-pa-sm"
                          min="0"
                          :label="$t('editor.spellcasting.slot.slots')"
                        />
                        <q-select
                          :model-value="monster.knownSpellsOfLevel(level)"
                          :label="
                            level === 0
                              ? $t('editor.spellcasting.slot.cantrips')
                              : $t('editor.spellcasting.slot.knownAtLevel', {
                                  ordinal,
                                })
                          "
                          :options="
                            spellOptionsByLevel(
                              level,
                              classFilter
                                ? monster.spellcasting.class
                                : undefined
                            )
                          "
                          use-chips
                          multiple
                          emit-value
                          input-debounce="0"
                          class="col-10 q-pa-sm"
                          @update:model-value="
                            (value) => monster.updateSpellsAtLevel(level, value)
                          "
                        >
                          <template #option="scope">
                            <q-item v-bind="scope.itemProps">
                              <q-item-section>
                                <q-item-label>{{
                                  scope.opt.label
                                }}</q-item-label>
                                <q-item-label caption>{{
                                  scope.opt.classDisplay
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </template>
                    </div>
                  </q-card-section>
                </div>
              </q-slide-transition>
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
import LockToggleButton from '../LockToggleButton.vue'
import MonsterTextEditor from './MonsterTextEditor.vue'
import { useClasses } from 'src/data/CLASS'
import { spellArrayFilter } from '../filters'
import N2W from 'number-to-words'

export default defineComponent({
  name: 'SpellcastingEditor',
  components: { LockToggleButton, MonsterTextEditor },
  setup() {
    const showSlots = ref(false)
    const classFilter = ref(false)

    const monster = useMonsterStore()
    const spells = useSpellsStore()
    const { rechargeTimeOptions } = useRechargeTimes()
    const classes = useClasses()
    const baseSpells = computed<SpellOption[]>(() =>
      classFilter.value
        ? spells.allSpellOptions.filter((s) =>
            s.class.find(
              (c) =>
                c.toLowerCase() === monster.spellcasting.class?.toLowerCase()
            )
          )
        : spells.allSpellOptions
    )
    const spellOptions = ref<SpellOption[]>([])
    const spellFilter = spellArrayFilter(baseSpells, spellOptions)
    const spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) =>
      N2W.toOrdinal(l)
    )

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
      updateSpellcastingClass,
      updateSpellcastingSlots,
      classDisplayValue,
      spellOptions,
      spellFilter,
      showSlots,
      classFilter,
      spellLevels,
      spellOptionsByLevel: spells.spellOptionsByLevel,
      ...classes,
    }
  },
})
</script>
