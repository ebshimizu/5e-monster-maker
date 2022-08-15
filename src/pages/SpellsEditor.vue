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
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <q-td key="level" :props="props">
            {{ props.cols[1].format(props.row.level) }}
            <q-popup-edit
              v-slot="scope"
              v-model="props.row.level"
              auto-save
              :title="$t('editor.spellcasting.custom.level')"
            >
              <q-select
                v-model="scope.value"
                :options="spellOptions"
                emit-value
                map-options
                :label="$t('editor.spellcasting.custom.level')"
              /> </q-popup-edit
          ></q-td>
          <q-td key="class" :props="props"
            >{{ props.cols[2].format(props.row.class) }}
            <q-popup-edit
              v-slot="scope"
              v-model="props.row.class"
              auto-save
              :title="$t('editor.spellcasting.custom.classes')"
            >
              <q-select
                v-model="scope.value"
                :options="SrdCastingClassOptions"
                multiple
                clearable
                emit-value
                map-options
                new-value-mode="add-unique"
                use-input
                :label="$t('editor.spellcasting.custom.classes')"
                @clear="scope.value = []"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="damage" :props="props"
            >{{ props.row.damage }}
            <q-popup-edit
              v-slot="scope"
              v-model="props.row.damage"
              auto-save
              :title="$t('editor.spellcasting.custom.damage')"
            >
              <q-input
                v-model.number="scope.value"
                type="number"
                min="0"
                :label="$t('editor.spellcasting.custom.damage')"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="multitarget" :props="props">{{
            props.cols[4].format(props.row.multitarget)
          }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { QTableProps } from 'quasar'
import { useSpellLevels } from 'src/components/spell/useSpellLevels'
import { useClasses } from 'src/data/CLASS'
import { useSpellsStore } from 'src/stores/spells-store'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'

export default defineComponent({
  name: 'SpellsEditor',
  setup() {
    const { t } = useI18n()
    const spellStore = useSpellsStore()
    const { ordinalSpellLevels, spellOptions } = useSpellLevels()
    const selected = ref([])

    const spells = computed(() => Object.values(spellStore.customSpells))
    const { SrdCastingClassOptions } = useClasses()

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
        format: (val) => val.map((v: string) => _.capitalize(v)).join(', '),
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
      spellOptions,
      SrdCastingClassOptions,
    }
  },
})
</script>
