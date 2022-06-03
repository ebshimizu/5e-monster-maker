<template>
  <q-page class="row items-start">
    <q-splitter v-model="splitterModel" style="min-height: 90vh; width: 100%">
      <template #before>
        <!-- todo: editing panels go here -->
        <div class="q-pa-md" style="width: 100%">
          <q-list bordered class="rounded-borders">
            <basics-editor />
            <saves-editor />
            <speeds-editor />
          </q-list>
        </div>
      </template>

      <template #after>
        <!-- todo: stat block renderer goes here -->
        <div class="q-pa-md">
          <web-renderer />
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent, ref } from 'vue'
import BasicsEditor from 'src/components/editor/BasicsEditor.vue'
import WebRenderer from 'src/components/rendering/WebRenderer.vue'
import SavesEditor from 'src/components/editor/SavesEditor.vue'
import SpeedsEditor from 'src/components/editor/SpeedsEditor.vue'

export default defineComponent({
  name: 'MonsterBuilder',
  components: { BasicsEditor, WebRenderer, SavesEditor, SpeedsEditor },
  setup() {
    const splitterModel = ref(66)
    const monster = useMonsterStore()
    return {
      splitterModel,
      monster,
    }
  },
})
</script>
