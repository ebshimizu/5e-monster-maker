<template>
  <q-btn round flat icon="settings">
    <q-menu style="width: 300px">
      <div class="row no-wrap q-pa-md">
        <div class="row">
          <div class="text-h6 q-mb-md col-12">
            {{ $t('editor.renderSettings') }}
          </div>
          <div class="col-12 flex items-center">
            <div class="text-body1 q-mr-md">{{ $t('editor.columns') }}</div>
            <q-btn-toggle
              v-model="editorStore.statBlockColumns"
              :label="$t('editor.settings.cols')"
              :options="[
                {
                  label: $t('editor.settings.one'),
                  value: 1,
                },
                { label: $t('editor.settings.two'), value: 2 },
              ]"
            ></q-btn-toggle>
          </div>
          <q-toggle
            v-model="monsterStore.useArticleInToken"
            class="col-12"
            :label="$t('editor.settings.article')"
          />
          <q-toggle
            v-model="monsterStore.alphaTraits"
            class="col-12"
            :label="$t('editor.settings.alphaTrait')"
          />
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { useEditorStore } from 'src/stores/editor-store'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WebRendererSettingsButton',
  setup() {
    const monsterStore = useMonsterStore()
    const editorStore = useEditorStore()

    return {
      monsterStore,
      editorStore,
    }
  },
})
</script>
