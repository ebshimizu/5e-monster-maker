<template>
  <q-page class="row items-start">
    <q-splitter
      id="splitter"
      v-model="splitterModel"
      reverse
      unit="px"
      style="height: calc(100vh - 177px); width: 100%"
    >
      <template #before>
        <div id="editor" class="q-pa-md" style="width: 100%">
          <q-list bordered separator class="rounded-borders">
            <basics-editor />
            <inventory-editor />
            <saves-editor />
            <speeds-editor />
            <skills-editor />
            <senses-editor />
            <resistances-editor />
            <traits-editor />
            <spellcasting-editor />
            <attacks-editor />
            <actions-editor />
            <multiattack-editor />
            <reactions-editor />
            <legendary-actions-editor />
            <mythic-actions-editor />
            <lair-actions-editor />
            <regional-effects-editor />
          </q-list>
        </div>
      </template>

      <template #after>
        <div class="q-pa-md">
          <web-renderer id="renderer" />
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { computed, defineComponent, ref, watch } from 'vue'
import BasicsEditor from 'src/components/editor/BasicsEditor.vue'
import WebRenderer from 'src/components/rendering/WebRenderer.vue'
import SavesEditor from 'src/components/editor/SavesEditor.vue'
import SpeedsEditor from 'src/components/editor/SpeedsEditor.vue'
import SkillsEditor from 'src/components/editor/SkillsEditor.vue'
import SensesEditor from 'src/components/editor/SensesEditor.vue'
import ResistancesEditor from 'src/components/editor/ResistancesEditor.vue'
import TraitsEditor from 'src/components/editor/TraitsEditor.vue'
import SpellcastingEditor from 'src/components/editor/SpellcastingEditor.vue'
import AttacksEditor from 'src/components/editor/AttacksEditor.vue'
import MultiattackEditor from 'src/components/editor/MultiattackEditor.vue'
import ActionsEditor from '../components/editor/ActionsEditor.vue'
import LegendaryActionsEditor from 'src/components/editor/LegendaryActionsEditor.vue'
import MythicActionsEditor from 'src/components/editor/MythicActionsEditor.vue'
import ReactionsEditor from 'src/components/editor/ReactionsEditor.vue'
import LairActionsEditor from 'src/components/editor/LairActionsEditor.vue'
import RegionalEffectsEditor from 'src/components/editor/RegionalEffectsEditor.vue'
import InventoryEditor from 'src/components/editor/InventoryEditor.vue'
import { useEditorStore } from 'src/stores/editor-store'

export default defineComponent({
  name: 'MonsterBuilder',
  components: {
    BasicsEditor,
    WebRenderer,
    SavesEditor,
    SpeedsEditor,
    SkillsEditor,
    SensesEditor,
    ResistancesEditor,
    TraitsEditor,
    SpellcastingEditor,
    AttacksEditor,
    MultiattackEditor,
    ActionsEditor,
    LegendaryActionsEditor,
    MythicActionsEditor,
    ReactionsEditor,
    LairActionsEditor,
    RegionalEffectsEditor,
    InventoryEditor,
  },
  setup() {
    const monster = useMonsterStore()
    const editorStore = useEditorStore()
    const splitterModel = ref(editorStore.statBlockColumns === 1 ? 500 : 800)

    // automatically resize on column change
    watch(
      () => editorStore.statBlockColumns,
      (newCols, oldCols) => {
        if (newCols !== oldCols) {
          if (newCols === 1) {
            splitterModel.value = 500
          } else {
            splitterModel.value = 800
          }
        }
      }
    )

    return {
      splitterModel,
      monster,
    }
  },
})
</script>
