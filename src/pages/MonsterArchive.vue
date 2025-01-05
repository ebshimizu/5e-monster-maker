<template>
  <q-page style="min-height: calc(100vh - 120px)">
    <q-table v-model:selected="selected" :title="$t('editor.monsterarchive.title')" :rows="monsters" :columns="columns"
      :pagination="{
        rowsPerPage: 15,
        sortBy: 'updated_at',
        descending: true
      }" row-key="created_at" class="q-mx-auto q-my-md" selection="multiple" style="width: 98vw">
      <template #top>
        <div class="text-h6">{{ $t('editor.monsterarchive.title') }}</div>
        <q-space />
        <q-btn v-show="selected.length !== 0" color="negative" class="q-mr-md" @click="deleteMonsters">
          {{ $t('editor.monsterarchive.delete', selected.length) }}</q-btn>
        <q-btn color="primary" class="q-mr-md" @click="importMonsters">{{
          $t('editor.monsterarchive.import')
          }}</q-btn>
        <q-btn color="primary" class="q-mr-md" @click="downloadMonsters">{{
          $t('editor.monsterarchive.export', {n: selected.length})
          }}</q-btn>
        <q-btn color="positive" @click="saveMonster">{{
          $t('editor.monsterarchive.save_current')
          }}</q-btn>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="name" :props="props">{{ props.row.monster.name }}</q-td>
          <q-td key="created_at">
            {{ props.row.created_at.toLocaleString() }}
          </q-td>
          <q-td key="updated_at">
            {{ props.row.updated_at.toLocaleString() }}
          </q-td>
          <q-td key="actions">
            <q-btn icon="mode_edit" @click="loadMonster(props.row.monster)"></q-btn>
            <q-btn icon="delete" @click="deleteMonster(props.row.monster)"></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { QTableProps, useQuasar } from 'quasar'
import { useMonsterStore } from 'src/stores/monster-store'
import { useMonsterArchiveStore } from 'src/stores/monster-archive-store'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Monster, MonsterEntry } from 'src/components/models'
import { download } from 'src/components/file/download'
import { validateNumber } from 'src/components/editor/numberInput'
import { useRouter } from 'vue-router'
import LoadMonsterArchiveDialog from 'src/components/monsterarchive/LoadMonsterArchiveDialog.vue'
import saveMonster from 'src/components/file/SaveButton.vue'

export default defineComponent({
  name: 'MonsterArchive',
  setup() {
    const { t } = useI18n()
    const $q = useQuasar()
    const monsterArchiveStore = useMonsterArchiveStore()
    const selected = ref([])
    const router = useRouter()
    const monsters = computed(() => Object.values(monsterArchiveStore.allMonsters))

    const columns: QTableProps['columns'] = [
      {
        name: 'name',
        field: 'name',
        required: true,
        label: t('editor.monsterarchive.name'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_at',
        field: 'created_at',
        required: true,
        label: t('editor.monsterarchive.created_at'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'updated_at',
        field: 'updated_at',
        required: true,
        label: t('editor.monsterarchive.updated_at'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        field: 'actions',
        required: true,
        label: t('editor.monsterarchive.actions'),
        align: 'left',
        sortable: true,
      },
    ]

    const loadMonster = (monster: Monster) => {
      if (confirm(t('editor.monsterarchive.overwrite_current') + " Overwrite current monster with archived one?")) {
        monsterArchiveStore.loadMonster(monster);
        $q.notify({
          message: t('editor.monsterarchive.loaded'),
          type: 'positive',
        })
        router.push({ path: '/' })
      }
    }

    const deleteMonster = (monster: Monster) => {
      if (confirm(t('editor.monsterarchive.delete_confirmation', {n: 1}))) {
      monsterArchiveStore.deleteMonster(monster)
      }
    }

    const deleteMonsters = () => {
      if (confirm(t('editor.monsterarchive.delete_confirmation', {n: selected.value.length}))) {
        selected.value.forEach(
          (e: MonsterEntry) => monsterArchiveStore.deleteMonster(e.monster)
        )
      selected.value = []
      }
    }

    const downloadMonsters = () => {
      let list = {}; // monsterArchiveStore.monsters
      if (selected.value.length > 0) {
        selected.value.forEach(
          (e: MonsterEntry) => list[e.monster.name] = monsterArchiveStore.monsters[e.monster.name]
        )
      } else {
        list = monsterArchiveStore.monsters
      }
      download(
        JSON.stringify(list),
        'monster-archive.5emms.json',
        'application/json'
      )
    }

    const saveMonster = () => {
      const result = monsterArchiveStore.addMonster(useMonsterStore().$state);
      $q.notify({
        message: t(result.message),
        type: result.error ? 'negative' : 'positive',
      })
    }

    const importMonsters = () => {
      $q.dialog({
        component: LoadMonsterArchiveDialog,
      })
    }

    return {
      monsters,
      columns,
      selected,
      saveMonster,
      loadMonster,
      deleteMonster,
      deleteMonsters,
      downloadMonsters,
      importMonsters,
      validateNumber,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable {
  cursor: pointer;
  transition-property: background-color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;
}

.editable:hover {
  // blue-grey-7
  background-color: #546e7a;
}
</style>
