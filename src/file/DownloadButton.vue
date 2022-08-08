<template>
  <q-btn round flat icon="download">
    <q-menu>
      <q-list>
        <q-item v-close-popup clickable @click="save5emm()">
          <q-item-section>{{ $t('io.export.default') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="saveMd()">
          <q-item-section>{{ $t('io.export.md') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { useMdRenderer } from 'src/components/rendering/useMdRenderer'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'
import { download, saveJson } from './download'

export default defineComponent({
  name: 'DownloadButton',
  setup() {
    const monster = useMonsterStore()
    const { renderMarkdown } = useMdRenderer()

    const save5emm = () => {
      saveJson(monster.$state, `${monster.name}.5emm.json`)
    }
    const saveMd = () => {
      download(renderMarkdown(), `${monster.name}.md`, 'text/markdown')
    }

    return {
      save5emm,
      saveMd,
    }
  },
})
</script>
