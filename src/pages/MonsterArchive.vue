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
          $t('editor.monsterarchive.export', { n: selected.length })
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
            {{ new Date(props.row.created_at).toLocaleString() }}
          </q-td>
          <q-td key="updated_at">
            {{ new Date(props.row.updated_at).toLocaleString() }}
          </q-td>
          <q-td key="actions">
            <q-btn icon="mode_edit" :title="$t('editor.monsterarchive.load')"
              @click="loadMonster(props.row.monster)"></q-btn>
            <q-btn icon="download" :title="$t('editor.monsterarchive.export_single')"
              @click="downloadSingle(props.row.monster)"></q-btn>
            <q-btn icon="delete" :title="$t('editor.monsterarchive.delete')"
              @click="deleteMonster(props.row.monster)"></q-btn>
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
import { download, saveJson } from 'src/components/file/download'
import { validateNumber } from 'src/components/editor/numberInput'
import { useRouter } from 'vue-router'
import LoadMonsterArchiveDialog from 'src/components/monsterarchive/LoadMonsterArchiveDialog.vue'
import { useFileLoader } from 'src/components/file/useFileLoader'
import { validate } from 'jsonschema'
import { SCHEMA } from 'src/data/SCHEMA'

export default defineComponent({
  name: 'MonsterArchive',
  setup() {
    const { t } = useI18n()
    const $q = useQuasar()
    const monsterArchiveStore = useMonsterArchiveStore()
    const selected = ref([])
    const router = useRouter()
    const monsters = computed(() => Object.values(monsterArchiveStore.allMonsters))
    const { updateMonster } = useFileLoader()
    const monsterStore = useMonsterStore()
    // Define the columns.
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

    /**
     * Load a monster from the archive into the builder and redirect to builder.
     * 
     * @param monster
     *   The monster to load.
     */
    const loadMonster = (monster: Monster) => {
      if (confirm(t('editor.monsterarchive.overwrite_current'))) {
        try {
          // Update archived monster, might be an older version
          updateMonster(monster);
          const valid = validate(monster, SCHEMA[monster.saveVersion]);
          if (valid.valid) {
            // Save updated version back in archive
            const result = monsterArchiveStore.addMonster(monster, true, true)
            if (!result.error) {
              // Load monster into active store
              monsterStore.$state = monster
              $q.notify({
                message: t('editor.monsterarchive.loaded'),
                type: 'positive',
              })
              router.push({ path: '/' })
            }
          } else {
            $q.notify({
              message: t('editor.monsterarchive.loadError', [
                valid.errors.map((e) => e.stack).join(', '),
              ]),
              type: 'negative',
            })
            console.error(valid.errors)
          }
        } catch (e) {
          $q.notify({
            message: t('editor.monsterarchive.loaderror', [e]),
            type: 'negative',
          })
          console.error(e)
        }
      }
    }

    /**
     * Delete a monster from the archive (asking for confirmation).
     * 
     * @param monster
     *   The monster to delete.
     */
    const deleteMonster = (monster: Monster) => {
      if (confirm(t('editor.monsterarchive.delete_confirmation', { n: 1 }))) {
        monsterArchiveStore.deleteMonster(monster)
      }
    }

    /**
     * Delete selected monsters from the archive (asking for confirmation).
     */
    const deleteMonsters = () => {
      if (confirm(t('editor.monsterarchive.delete_confirmation', { n: selected.value.length }))) {
        selected.value.forEach(
          (e: MonsterEntry) => monsterArchiveStore.deleteMonster(e.monster)
        )
        selected.value = []
      }
    }

    /**
     * Download a monster as json (as with download button).
     * 
     * @param monster
     *   The monster to download.
     */
    const downloadSingle = (monster: Monster) => {
      saveJson(monster, `${monster.name}.5emm.json`)
    }

    /**
     * Download all or selected monster as a list in json format.
     */
    const downloadMonsters = () => {
      let list: Record<string, MonsterEntry> = {};
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

    /**
     * Save the current monster.
     */
    const saveMonster = () => {
      let overwrite = false;
      if (monsterArchiveStore.isMonsterSaved(monsterStore.$state)) {
        overwrite = confirm(t('editor.monsterarchive.overwrite_save'))
      }
      const result = monsterArchiveStore.addMonster(monsterStore.$state, overwrite);
      $q.notify({
        message: t(result.message),
        type: result.error ? 'negative' : 'positive',
      })
    }

    /**
     * Open import dialog.
     */
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
      downloadSingle,
      downloadMonsters,
      importMonsters,
      validateNumber,
    }
  },
})
</script>