<template>
  <q-select
    :model-value="$props.modelValue"
    :label="$props.label"
    :options="spellOptions"
    use-chips
    multiple
    use-input
    clearable
    emit-value
    input-debounce="0"
    @filter="spellFilter"
    @update:model-value="(value) => $emit('update:model-value', value)"
    @clear="$emit('clear')"
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
          <q-item-label caption>{{ scope.opt.classDisplay }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-badge color="purple-8" :label="scope.opt.levelDisplay" />
        </q-item-section>
      </q-item>
    </template>
    <template #after>
      <slot name="after"></slot>
    </template>
  </q-select>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'
import { spellArrayFilter } from 'src/components/filters'
import { SpellOption, useSpellsStore } from 'src/stores/spells-store'
import { computed, ref } from 'vue'

export default defineComponent({
  name: 'SearchableSpellSelect',
  props: {
    modelValue: {
      type: Object as PropType<string[]>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['update:model-value', 'clear'],
  setup() {
    const spells = useSpellsStore()
    const baseSpells = computed(() => spells.allSpellOptions)
    const spellOptions = ref<SpellOption[]>([])
    const spellFilter = spellArrayFilter(baseSpells, spellOptions)

    return {
      spellOptions,
      spellFilter,
    }
  },
})
</script>
