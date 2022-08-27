<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin new-spell-dialog">
      <q-card-section>
        <div class="text-h6">
          {{ $t('editor.template.create', [targetName]) }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row">
        <q-input
          ref="nameInput"
          v-model="name"
          :label="$t('editor.template.name')"
          class="col-12 q-pa-sm"
          reactive-rules
          :rules="rules"
          bottom-slots
        >
          <template #hint>
            {{ $t('editor.template.nameHint') }}
          </template>
        </q-input>
        <q-input
          v-model="icon"
          class="col-12 q-pa-sm"
          :label="$t('editor.template.icon')"
        />
        <div class="col-12 q-pa-sm text-subtitle1">
          <i18n-t keypath="editor.template.availableIcons">
            <a
              href="https://quasar.dev/vue-components/icon#webfont-usage"
              target="_blank"
              >{{ $t('editor.template.link0') }}</a
            >
            <a
              href="https://fonts.google.com/icons?selected=Material+Icons&icon.style=Filled"
              target="_blank"
              >{{ $t('editor.template.link1') }}</a
            >
            <a href="https://materialdesignicons.com/" target="_blank">{{
              $t('editor.template.link2')
            }}</a>
            <a href="https://fontawesome.com/search?m=free" target="_blank">{{
              $t('editor.template.link3')
            }}</a>
          </i18n-t>
        </div>
        <div class="col-12 q-pa-sm">
          <q-toggle
            v-model="override"
            :label="$t('editor.template.override')"
          />
        </div>
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn
          color="green"
          :label="$t('editor.save')"
          :disabled="!override && (!nameInput?.validate() || name.length === 0)"
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
import { computed, defineComponent, ref } from 'vue'
import { QInput, useDialogPluginComponent } from 'quasar'
import { useTemplatesStore } from 'src/stores/templates-store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'NewTemplateDialog',
  props: {
    targetName: {
      type: String,
      default: '',
    },
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    const templateStore = useTemplatesStore()
    const { t } = useI18n()

    // spell field, commits on save
    const icon = ref('')
    const name = ref(props.targetName)
    const override = ref(false)
    const nameInput = ref<QInput | null>(null)

    const rules = computed(() => {
      if (override.value) {
        // this is... questionable due to side effects happening in a computed prop
        // but it does work so whatever
        nameInput.value?.resetValidation()
        return []
      }

      return [
        (val: string) =>
          !(val in templateStore.allTemplates) ||
          t('editor.template.nameValidator'),
      ]
    })

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // call onDialogOK (with optional payload)
        // caller needs to handle this due to different template types
        // could handle it here but would rather have the caller do it since it has all type data available
        // also, override just lets you click the save anyway, the function overrides by default
        onDialogOK({
          name: name.value,
          icon: icon.value,
        })
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      icon,
      name,
      nameInput,
      override,
      templateStore,
      rules,
    }
  },
})
</script>

<style lang="scss">
.new-spell-dialog {
  width: 600px;
}
</style>
