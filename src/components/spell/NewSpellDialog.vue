<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin new-spell-dialog">
      <q-card-section>
        <div class="text-h6">{{ $t('editor.spellcasting.custom.create') }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row">
        <q-input
          ref="nameInput"
          v-model="name"
          :label="$t('editor.spellcasting.custom.name')"
          class="col-12 q-pa-sm"
          :rules="[
            (val) =>
              !(val in spellStore.allSpells) ||
              $t('editor.spellcasting.custom.nameValidator'),
          ]"
        />
        <q-select
          v-model="level"
          class="col-6 q-pa-sm"
          :options="spellOptions"
          emit-value
          map-options
          :label="$t('editor.spellcasting.custom.level')"
        />
        <q-select
          v-model="classes"
          class="col-6 q-pa-sm"
          :options="SrdCastingClassOptions"
          multiple
          clearable
          emit-value
          map-options
          new-value-mode="add-unique"
          use-input
          :label="$t('editor.spellcasting.custom.classes')"
          @clear="classes = []"
        />
        <q-input
          :model-value="damage"
          class="col-6 q-pa-sm"
          type="number"
          min="0"
          :label="$t('editor.spellcasting.custom.damage')"
          @update:model-value="(value) => (damage = validateNumber(value, 0))"
        />
        <div class="col-6 flex items-center">
          <q-toggle
            v-model="multitarget"
            :label="$t('editor.spellcasting.custom.multitarget')"
          />
        </div>
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn
          color="green"
          :label="$t('editor.save')"
          :disabled="!nameInput?.validate() || name.length === 0"
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
import { QInput, useDialogPluginComponent } from 'quasar'
import { useSpellsStore } from 'src/stores/spells-store'
import { useSpellLevels } from './useSpellLevels'
import { useClasses } from 'src/data/CLASS'
import _ from 'lodash'
import { validateNumber } from '../editor/numberInput'

export default defineComponent({
  name: 'NewSpellDialog',
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

    const spellStore = useSpellsStore()
    const { spellOptions } = useSpellLevels()
    const { SrdCastingClassOptions } = useClasses()

    // spell field, commits on save
    const name = ref('')
    const level = ref(0)
    const classes = ref<string[]>([])
    const damage = ref(0)
    const multitarget = ref(false)
    const nameInput = ref<QInput | null>(null)

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // add the thing
        spellStore.addSpell({
          name: name.value,
          level: level.value,
          class: classes.value.map((c) => _.capitalize(c)),
          damage: damage.value,
          multitarget: multitarget.value,
          srd: false,
          custom: true,
        })

        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      spellStore,
      spellOptions,
      SrdCastingClassOptions,
      // fields
      name,
      level,
      classes,
      damage,
      multitarget,
      nameInput,
      validateNumber,
    }
  },
})
</script>

<style lang="scss">
.new-spell-dialog {
  width: 600px;
}
</style>
