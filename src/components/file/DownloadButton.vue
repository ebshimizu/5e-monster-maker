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
        <q-item v-close-popup clickable @click="saveTio()">
          <q-item-section>{{ $t('io.export.tarrasque') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="savePng()">
          <q-item-section>{{ $t('io.export.png') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="copyMd()">
          <q-item-section>{{ $t('io.export.mdClip') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="copyLink()">
          <q-item-section>{{ $t('io.export.link') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useMdRenderer } from '../rendering/useMdRenderer'
import { useMonsterStore } from '../../stores/monster-store'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { download, saveJson } from './download'
import copy from 'copy-to-clipboard'
import DomToImage from 'dom-to-image'
import { useLatexRenderer } from '../rendering/useLatexRenderer'
import { useTarrasqueRenderer } from '../rendering/useTarrasqueRenderer'

import * as jsonurl from 'json-url'
import { useEditorStore } from 'src/stores/editor-store'

export default defineComponent({
  name: 'DownloadButton',
  setup() {
    const monster = useMonsterStore()
    const $q = useQuasar()
    const { t } = useI18n()
    const { renderMarkdown } = useMdRenderer()
    const { renderLatex } = useLatexRenderer()
    const { renderTarrasqueJson } = useTarrasqueRenderer()
    const codec = jsonurl('lzma')
    const editorStore = useEditorStore()

    // who needs a library i guess
    const shorten = async (url: string) => {
      const data = await fetch(
        'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url)
      )

      const short = await data.text()
      return short
    }

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
        download(
          renderMarkdown(editorStore.statBlockColumns === 2),
          `${monster.name}.md`,
          'text/markdown'
        )
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
        copy(renderMarkdown(editorStore.statBlockColumns === 2))
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
      download(
        renderLatex(editorStore.statBlockColumns === 2),
        `${monster.name}.tex`,
        'text/latex'
      )
    }

    const saveTio = () => {
      download(
        renderTarrasqueJson(),
        `${monster.name}.tio.json`,
        'application/json'
      )
    }

    const savePng = () => {
      const node = document.getElementById('renderer')
      console.log(node)

      if (node != null) {
        DomToImage.toBlob(node).then(function (image: Blob) {
          download(image, `${monster.name}.png`, 'image/png')
        })
      }
    }

    const copyLink = async () => {
      try {
        const b64 = await codec.compress(JSON.stringify(monster.$state))
        const url = `${window.location.origin}${window.location.pathname}#/?data=${b64}`

        try {
          const short = await shorten(url)
          copy(short)
          $q.notify({
            message: 'Copied Sharable Link to Clipboard',
            type: 'positive',
          })
        } catch (e) {
          $q.notify({
            message: 'Copied long link to Clipboard (unable to shorten)',
            type: 'warning',
          })
          console.log(e)

          copy(url)
        }
      } catch (e) {
        $q.notify({
          message: 'Error encoding url. Check console for details.',
          type: 'negative',
        })

        console.log(e)
      }
    }

    return {
      save5emm,
      saveMd,
      copyMd,
      saveLatex,
      saveTio,
      savePng,
      copyLink,
    }
  },
})
</script>