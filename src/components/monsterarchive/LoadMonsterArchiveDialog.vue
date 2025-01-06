<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin import-monster-archive-dialog">
      <q-card-section>
        <div class="text-h6">
          {{ $t('editor.monsterarchive.importDialog') }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row">
        <q-file v-model="file" class="q-pa-md col-12" :label="$t('editor.monsterarchive.importFile')"
          accept=".5emms.json" />
        <div class="col-12 flex items-center">
          <q-toggle v-model="overwrite" :label="$t('editor.monsterarchive.importMode')" />
        </div>
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="green" :label="$t('editor.monsterarchive.import')" :disabled="file == null" @click="onOKClick" />
        <q-btn color="primary" :label="$t('editor.cancel')" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useMonsterArchiveStore } from 'src/stores/monster-archive-store'
import { validate } from 'jsonschema'
import { SCHEMA } from 'src/data/SCHEMA'
import { useI18n } from 'vue-i18n'
import { MonsterEntry } from '../models'
import { useFileLoader } from 'src/components/file/useFileLoader'

export default defineComponent({
  name: 'LoadMonsterArchiveDialog',
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    const $q = useQuasar()
    const { t } = useI18n()
    const monsterArchiveStore = useMonsterArchiveStore()
    const { updateMonster } = useFileLoader()

    // load fields
    const file = ref<File>()
    const overwrite = ref(false)

    /**
     * Import the uploaded archive.
     */
    const importMonsterArchive = () => {
      if (file.value != null) {
        const reader = new FileReader()
        reader.addEventListener('load', (e: ProgressEvent<FileReader>) => {
          try {
            let imported = 0;
            let skipped = 0;
            let invalid = 0;
            let monsters = JSON.parse(e.target?.result as string)
            monsters = (Object.values(monsters) as MonsterEntry[])
            monsters.forEach((entry: MonsterEntry) => {
              updateMonster(entry.monster)
              const valid = validate(entry.monster, SCHEMA[entry.monster.saveVersion])
              if (valid.valid) {
                let result = monsterArchiveStore.import(entry, overwrite.value)
                if (result) {
                  imported++
                } else if (!overwrite.value) {
                  skipped++
                }
              } else {
                invalid++
              }
            })
            $q.notify({
              message: t(
                'editor.monsterarchive.importResult',
                { n: imported },
                imported
              ),
              type: 'positive',
            })

            if (skipped > 0) {
              $q.notify({
                message: t(
                  'editor.monsterarchive.importSkip',
                  { n: skipped },
                  skipped
                ),
                type: 'warning',
              })
            }
            if (invalid > 0) {
              $q.notify({
                message: t(
                  'editor.monsterarchive.importInvalid',
                  { n: invalid },
                  invalid
                ),
                type: 'warning',
              })
            }
          } catch (e) {
            $q.notify({
              message: t('editor.monsterarchive.importError', [e]),
              type: 'negative',
            })
            console.error(e)
          }
        })

        reader.addEventListener('error', (e) => {
          $q.notify({
            message: t('editor.monsterarchive.importError', [e]),
            type: 'negative',
          })
          console.error(e)
        })

        reader.readAsText(file.value)
      }
    }

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // Process ok click.
      onOKClick() {
        // Run upload and import.
        importMonsterArchive()
        // Propagate OK click.
        onDialogOK()
      },

      onCancelClick: onDialogCancel,

      monsterArchiveStore,
      // fields
      file,
      overwrite,
    }
  },
})
</script>

<style lang="scss">
.import-monster-archive-dialog {
  width: 600px;
}
</style>
