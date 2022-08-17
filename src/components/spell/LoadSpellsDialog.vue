<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin import-spell-dialog">
      <q-card-section>
        <div class="text-h6">
          {{ $t('editor.spellcasting.custom.importDialog') }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row">
        <q-file
          v-model="file"
          class="q-pa-md col-12"
          :label="$t('editor.spellcasting.custom.importFile')"
          accept=".5emms.json"
        />
        <div class="col-12 flex items-center">
          <q-toggle
            v-model="overwrite"
            :label="$t('editor.spellcasting.custom.importMode')"
          />
        </div>
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn
          color="green"
          :label="$t('editor.spellcasting.custom.import')"
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
import { useSpellsStore } from 'src/stores/spells-store'
import { validate } from 'jsonschema'
import { SPELL_SCHEMA } from 'src/data/SCHEMA'
import { useI18n } from 'vue-i18n'
import { DndSpell } from '../models'

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
    const spellStore = useSpellsStore()

    // load fields
    const file = ref<File>()
    const overwrite = ref(false)

    const importSpells = () => {
      if (file.value != null) {
        const reader = new FileReader()
        reader.addEventListener('load', (e: ProgressEvent<FileReader>) => {
          try {
            const spells = JSON.parse(e.target?.result as string)

            // validate
            // v1 uses array syntax
            const schema = Array.isArray(spells)
              ? SPELL_SCHEMA.v1
              : SPELL_SCHEMA.v2

            const valid = validate(spells, schema)
            if (valid.valid) {
              // jank, but should support both formats
              const results = spellStore.import(
                Array.isArray(spells)
                  ? (spells as DndSpell[])
                  : (Object.values(spells) as DndSpell[]),
                overwrite.value
              )

              $q.notify({
                message: t(
                  'editor.spellcasting.custom.importResult',
                  { n: results.imported },
                  results.imported
                ),
                type: 'positive',
              })

              if (results.skipped > 0) {
                $q.notify({
                  message: t(
                    'editor.spellcasting.custom.importSkip',
                    { n: results.skipped },
                    results.skipped
                  ),
                  type: 'warning',
                })
              }
            } else {
              $q.notify({
                message: t('editor.spellcasting.custom.importInvalid', [
                  valid.errors.map((e) => e.stack).join(', '),
                ]),
                type: 'negative',
              })

              console.error(valid.errors)
            }
          } catch (e) {
            $q.notify({
              message: t('editor.spellcasting.custom.importError', [e]),
              type: 'negative',
            })
            console.error(e)
          }
        })

        reader.addEventListener('error', (e) => {
          $q.notify({
            message: t('editor.spellcasting.custom.importError', [e]),
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
        importSpells()

        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      spellStore,
      // fields
      file,
      overwrite,
    }
  },
})
</script>

<style lang="scss">
.import-spell-dialog {
  width: 600px;
}
</style>
