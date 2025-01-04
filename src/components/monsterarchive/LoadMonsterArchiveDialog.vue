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
        <q-file
          v-model="file"
          class="q-pa-md col-12"
          :label="$t('editor.monsterarchive.importFile')"
          accept=".5emms.json"
        />
        <div class="col-12 flex items-center">
          <q-toggle
            v-model="overwrite"
            :label="$t('editor.monsterarchive.importMode')"
          />
        </div>
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn
          color="green"
          :label="$t('editor.monsterarchive.import')"
          :disabled="file == null"
          @click="onOKClick"
        />
        <q-btn
          color="primary"
          :label="$t('editor.cancel')"
          @click="onCancelClick"
        />
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

    // load fields
    const file = ref<File>()
    const overwrite = ref(false)

    const importMonsterArchive = () => {
      if (file.value != null) {
        const reader = new FileReader()
        reader.addEventListener('load', (e: ProgressEvent<FileReader>) => {
          try {
            let monsters = JSON.parse(e.target?.result as string)
            monsters = (Object.values(monsters) as MonsterEntry[])
            const results = monsterArchiveStore.import(monsters, overwrite.value)

            $q.notify({
              message: t(
                'editor.monsterarchive.importResult',
                { n: results.imported },
                results.imported
              ),
              type: 'positive',
            })

            if (results.skipped > 0) {
              $q.notify({
                message: t(
                  'editor.monsterarchive.importSkip',
                  { n: results.skipped },
                  results.skipped
                ),
                type: 'warning',
              })
            }
            if (results.invalid > 0) {
              $q.notify({
                message: t(
                  'editor.monsterarchive.importInvalid',
                  { n: results.invalid },
                  results.invalid
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

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        importMonsterArchive()

        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
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
