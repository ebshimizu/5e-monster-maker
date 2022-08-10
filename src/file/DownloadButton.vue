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
        <q-item v-close-popup clickable @click="saveLatex()">
          <q-item-section>{{ $t('io.export.latex') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="savePng()">
          <q-item-section>{{ $t('io.export.png') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="copyMd()">
          <q-item-section>{{ $t('io.export.mdClip') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useMdRenderer } from 'src/components/rendering/useMdRenderer'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { download, saveJson } from './download'
import copy from 'copy-to-clipboard'
import DomToImage from 'dom-to-image'
import { useLatexRenderer } from 'src/components/rendering/useLatexRenderer'

export default defineComponent({
  name: 'DownloadButton',
  setup() {
    const monster = useMonsterStore()
    const $q = useQuasar()
    const { t } = useI18n()
    const { renderMarkdown } = useMdRenderer()
    const { renderLatex } = useLatexRenderer()

    const save5emm = () => {
      try {
        saveJson(monster.$state, `${monster.name}.5emm.json`)
      } catch (e) {
        console.error(e)

        $q.notify({
          message: t('io.error.json', [e]),
          type: 'negative',
        })
      }
    }

    const saveMd = () => {
      try {
        download(renderMarkdown(), `${monster.name}.md`, 'text/markdown')
      } catch (e) {
        console.error(e)

        $q.notify({
          message: t('io.error.md', [e]),
          type: 'negative',
        })
      }
    }

    const copyMd = () => {
      try {
        copy(renderMarkdown())
        $q.notify({
          message: t('io.copyMd'),
          type: 'positive',
        })
      } catch (e) {
        console.error(e)

        $q.notify({
          message: t('io.error.md', [e]),
          type: 'negative',
        })
      }
    }

    const saveLatex = () => {
      download(renderLatex(), `${monster.name}.tex`, 'text/latex')
    }

    const savePng = () => {
      const node = document.getElementById('render')

      if (node != null) {
        DomToImage.toBlob(node).then(function (image: Blob) {
          download(image, `${monster.name}.png`, 'image/png')
        })
      }
    }

    return {
      save5emm,
      saveMd,
      copyMd,
      saveLatex,
      savePng,
    }
  },
})
</script>
