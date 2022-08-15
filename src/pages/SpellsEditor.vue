<template>
  <q-page style="min-height: calc(100vh - 120px)">
    <q-table
      v-model:selected="selected"
      :title="$t('editor.spellcasting.custom.title')"
      :rows="spells"
      :columns="columns"
      :pagination="{
        rowsPerPage: 15,
      }"
      row-key="name"
      class="q-mx-auto q-my-md"
      selection="multiple"
      style="width: 98vw"
    />
  </q-page>
</template>

<script lang="ts">
import { QTableProps } from 'quasar'
import { DndSpell } from 'src/components/models'
import { useSpellLevels } from 'src/components/spell/useSpellLevels'
import { useSpellsStore } from 'src/stores/spells-store'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'SpellsEditor',
  setup() {
    const { t } = useI18n()
    const spellStore = useSpellsStore()
    const { ordinalSpellLevels } = useSpellLevels()
    const selected = ref([])

    const spells = computed(() => Object.values(spellStore.customSpells))

    const columns: QTableProps['columns'] = [
      {
        name: 'name',
        field: 'name',
        required: true,
        label: t('editor.spellcasting.custom.name'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'level',
        label: t('editor.spellcasting.custom.level'),
        sortable: true,
        field: (row) => row.level,
        format: (val) =>
          val === 0
            ? t('editor.spellcasting.slot.cantrip')
            : t('editor.spellcasting.slot.level', {
                ordinal: ordinalSpellLevels[val],
              }),
      },
      {
        name: 'class',
        label: t('editor.spellcasting.custom.classes'),
        sortable: false,
        field: 'class',
        format: (val) => val.join(', '),
      },
      {
        name: 'damage',
        label: t('editor.spellcasting.custom.damage'),
        sortable: true,
        field: 'damage',
      },
      {
        name: 'multitarget',
        label: t('editor.spellcasting.custom.multitarget'),
        sortable: false,
        field: 'multitarget',
        format: (val) =>
          val
            ? t('editor.spellcasting.custom.mtTrue')
            : t('editor.spellcasting.custom.mtFalse'),
      },
    ]

    return {
      spells,
      columns,
      selected,
    }
  },
})
</script>
