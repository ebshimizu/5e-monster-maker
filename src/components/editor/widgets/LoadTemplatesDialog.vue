<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin import-spell-dialog">
      <q-card-section>
        <div class="text-h6">
          {{ $t('editor.template.importDialog') }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row">
        <q-file
          v-model="file"
          class="q-pa-md col-12"
          :label="$t('editor.template.importFile')"
          accept=".5emmt.json"
        />
        <div class="col-6 flex items-center">
          <q-toggle
            v-model="overwrite"
            :label="$t('editor.template.importMode')"
          />
        </div>
        <div class="col-6 flex items-center">
          <q-toggle v-model="isV1" :label="$t('editor.template.legacyImport')">
            <q-tooltip class="text-body2">{{
              $t('editor.template.legacyImportHint')
            }}</q-tooltip>
          </q-toggle>
        </div>
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn
          color="green"
          :label="$t('editor.template.import')"
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
import { useI18n } from 'vue-i18n'
import {
  updateV1Templates,
  useTemplatesStore,
} from 'src/stores/templates-store'
import { DndTemplate } from 'src/components/models'

export default defineComponent({
  name: 'LoadSpellsDialog',
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
    const templateStore = useTemplatesStore()

    // load fields
    const file = ref<File>()
    const overwrite = ref(false)
    const isV1 = ref(false)

    const importTemplates = () => {
      if (file.value != null) {
        const reader = new FileReader()
        reader.addEventListener('load', (e: ProgressEvent<FileReader>) => {
          try {
            const templates = JSON.parse(e.target?.result as string)

            // we don't uhhhhhhhh validate templates? :___D
            // this is a bit of a problem as they're not versioned.
            // Will add a toggle to do the import

            // v1 templates have to be updated
            const importTemplates = Object.values(templates) as DndTemplate[]
            if (isV1.value) {
              console.log('found v1 templates, updating...')
              updateV1Templates(importTemplates)
            }

            const results = templateStore.import(
              importTemplates,
              overwrite.value
            )

            $q.notify({
              message: t(
                'editor.template.importResult',
                { n: results.imported },
                results.imported
              ),
              type: 'positive',
            })

            if (results.skipped > 0) {
              $q.notify({
                message: t(
                  'editor.template.importSkip',
                  { n: results.skipped },
                  results.skipped
                ),
                type: 'warning',
              })
            }
          } catch (e) {
            $q.notify({
              message: t('editor.template.importError', [e]),
              type: 'negative',
            })
            console.error(e)
          }
        })

        reader.addEventListener('error', (e) => {
          $q.notify({
            message: t('editor.template.importError', [e]),
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
        importTemplates()

        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      templateStore,
      // fields
      file,
      overwrite,
      isV1,
    }
  },
})
</script>

<style lang="scss">
.import-spell-dialog {
  width: 600px;
}
</style>
