<template>
  <q-expansion-item
    expand-separator
    :label="$t('editor.spellcasting.innate.label')"
    :caption="$t('editor.spellcasting.innate.caption')"
    header-class="bg-purple-10"
  >
    <q-card>
      <q-card-section>
        <div class="row">
          <q-input
            v-model="monster.spellcasting.atWillNotes"
            class="col-12 q-pa-sm"
            bottom-slots
            :label="$t('monster.spellcasting.atWillNotes')"
          >
            <template #hint>{{ $t('editor.plainTextNote') }}</template>
            <template #after>
              <q-btn
                push
                :icon="
                  monster.spellcasting.useCustomInnatePreamble
                    ? 'edit'
                    : 'edit_off'
                "
                :color="
                  monster.spellcasting.useCustomInnatePreamble
                    ? 'warning'
                    : 'dark'
                "
                size="md"
                @click="
                  monster.spellcasting.useCustomInnatePreamble =
                    !monster.spellcasting.useCustomInnatePreamble
                "
              >
                <q-tooltip class="text-body2">{{
                  monster.spellcasting.useCustomInnatePreamble
                    ? $t('editor.spellcasting.slot.useCustomPreamble')
                    : $t('editor.spellcasting.slot.useDefaultPreamble')
                }}</q-tooltip></q-btn
              >
            </template>
          </q-input>
          <q-slide-transition>
            <div
              v-show="monster.spellcasting.useCustomInnatePreamble"
              class="col-12 q-mt-md"
            >
              <monster-text-editor
                :field="monster.spellcasting.customInnatePreamble"
                i18n-label-key="editor.spellcasting.innate.preamble"
                token-category="spell"
                :show-reset="true"
                @update:model-value="
                          (value: string) =>
                            (monster.spellcasting.customInnatePreamble =
                              value)
                        "
                @reset="
                  monster.spellcasting.customInnatePreamble = $t(
                    'presets.innateSpellcasting'
                  )
                "
              />
            </div>
          </q-slide-transition>
          <div class="col-12 q-py-md q-px-sm">
            <q-btn
              class="full-width"
              color="positive"
              @click="monster.addInnateSpellList"
              >{{ $t('editor.spellcasting.innate.addNew') }}</q-btn
            >
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { useClasses } from 'src/data/CLASS'
import { useRechargeTimes } from 'src/data/RECHARGE_TIME'
import { useMonsterStore } from 'src/stores/monster-store'
import { useSpellsStore, SpellOption } from 'src/stores/spells-store'
import { ref, computed } from 'vue'
import { spellArrayFilter } from '../filters'
import MonsterTextEditor from './MonsterTextEditor.vue'
import N2W from 'number-to-words'

export default defineComponent({
  name: 'ClassCastingEditor',
  components: { MonsterTextEditor },
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

    return {
      monster,
      rechargeTimeOptions,
      spellOptions,
      spellFilter,
      showSlots,
      classFilter,
      spellOptionsByLevel: spells.spellOptionsByLevel,
      ...classes,
    }
  },
})
</script>
