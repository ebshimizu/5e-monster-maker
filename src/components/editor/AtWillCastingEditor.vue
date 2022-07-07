<template>
  <q-expansion-item
    expand-separator
    :label="$t('editor.spellcasting.innate.label')"
    :caption="$t('editor.spellcasting.innate.caption')"
    header-class="bg-purple-10"
  >
    <q-card>
      <q-card-section>
        <div class="row"></div>
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
