<template>
  <q-expansion-item
    expand-separator
    icon="fa-solid fa-wand-sparkles"
    :label="$t('editor.spellcasting.label')"
    :caption="$t('editor.spellcasting.caption')"
  >
    <q-card>
      <!-- basics -->
      <div class="row">
        <q-select
          v-model="monster.spellcasting.stat"
          :options="statOptions"
          :label="$t('monster.spellcasting.ability')"
          class="col-2 q-pa-sm"
        />
        <q-input
          :model-value="spellSaveValue"
          :label="$t('monster.spellcasting.save')"
          type="number"
          :disable="!monster.spellcasting.save.override"
          class="col q-pa-sm"
          @update:model-value="
            (v: string | number | null) => (monster.spellcasting.save.overrideValue = parseInt(`${v}`))
          "
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.spellcasting.save.override"
              :lock-tooltip="$t('monster.spellcasting.lockSave')"
              :unlock-tooltip="$t('monster.spellcasting.unlockSave')"
              @click="
                monster.spellcasting.save.override =
                  !monster.spellcasting.save.override
              "
            />
          </template>
        </q-input>
        <q-input
          :model-value="spellAttackValue"
          :label="$t('monster.spellcasting.attack')"
          type="number"
          :disable="!monster.spellcasting.attack.override"
          class="col q-pa-sm"
          @update:model-value="
            (v: string | number | null) =>
              (monster.spellcasting.attack.overrideValue = parseInt(`${v}`))
          "
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.spellcasting.attack.override"
              :lock-tooltip="$t('monster.spellcasting.lockAttack')"
              :unlock-tooltip="$t('monster.spellcasting.unlockAttack')"
              @click="
                monster.spellcasting.attack.override =
                  !monster.spellcasting.attack.override
              "
            />
          </template>
        </q-input>
        <q-input
          :model-value="spellModifierValue"
          :label="$t('monster.spellcasting.modifier')"
          type="number"
          :disable="!monster.spellcasting.modifier.override"
          class="col q-pa-sm"
          @update:model-value="
            (v: string | number | null) =>
              (monster.spellcasting.modifier.overrideValue = parseInt(`${v}`))
          "
        >
          <template #after>
            <lock-toggle-button
              :locked="!monster.spellcasting.modifier.override"
              :lock-tooltip="$t('monster.spellcasting.lockModifier')"
              :unlock-tooltip="$t('monster.spellcasting.unlockModifier')"
              @click="
                monster.spellcasting.modifier.override =
                  !monster.spellcasting.modifier.override
              "
            />
            <q-btn
              icon="add"
              round
              color="primary"
              class="q-ml-md"
              @click="addSpell"
            >
              <q-tooltip class="text-body2">{{
                $t('editor.spellcasting.custom.create')
              }}</q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </div>
      <!-- class spellcasting -->
      <div class="q-pa-sm full-width">
        <q-list bordered separator class="rounded-borders">
          <class-casting-editor />
          <at-will-casting-editor />
        </q-list>
      </div>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { useSpellsStore } from 'src/stores/spells-store'
import { computed, defineComponent } from 'vue'
import LockToggleButton from '../LockToggleButton.vue'
import ClassCastingEditor from './ClassCastingEditor.vue'
import { useClasses } from 'src/data/CLASS'
import AtWillCastingEditor from './AtWillCastingEditor.vue'
import { useStats } from 'src/data/STAT'
import { useQuasar } from 'quasar'
import NewSpellDialog from '../spell/NewSpellDialog.vue'

export default defineComponent({
  name: 'SpellcastingEditor',
  components: { LockToggleButton, ClassCastingEditor, AtWillCastingEditor },
  setup() {
    const monster = useMonsterStore()
    const spells = useSpellsStore()
    const classes = useClasses()
    const { statOptionsShort } = useStats()
    const $q = useQuasar()

    const classDisplayValue = computed(() => {
      if (monster.spellcasting.class == null) return ''

      return monster.spellcasting.class in classes.SrdClass.value
        ? classes.SrdClass.value[
            monster.spellcasting.class as keyof typeof classes.SrdClass.value
          ]
        : monster.spellcasting.class
    })

    const spellSaveValue = computed(() =>
      monster.spellcasting.save.override
        ? monster.spellcasting.save.overrideValue
        : monster.defaultSpellSave(monster.spellcasting.stat)
    )
    const spellAttackValue = computed(() =>
      monster.spellcasting.attack.override
        ? monster.spellcasting.attack.overrideValue
        : monster.defaultSpellAttackModifier(monster.spellcasting.stat)
    )
    const spellModifierValue = computed(() =>
      monster.spellcasting.modifier.override
        ? monster.spellcasting.modifier.overrideValue
        : monster.defaultSpellModifier(monster.spellcasting.stat)
    )

    const addSpell = () => {
      $q.dialog({
        component: NewSpellDialog,
      })
    }

    return {
      monster,
      statOptions: statOptionsShort,
      spellSaveValue,
      spellAttackValue,
      spellModifierValue,
      classDisplayValue,
      spellOptionsByLevel: spells.spellOptionsByLevel,
      addSpell,
      ...classes,
    }
  },
})
</script>
