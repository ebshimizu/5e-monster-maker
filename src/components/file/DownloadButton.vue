<template>
  <q-btn round flat icon="download">
    <q-menu>
      <q-list>
        <q-item v-close-popup clickable @click="save5emm()">
          <q-item-section>{{ $t('io.export.default') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="saveMd3()">
          <q-item-section>{{ $t('io.export.md3') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="saveImprovedInit()">
          <q-item-section>{{ $t('io.export.improvedInit') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="saveLatex()">
          <q-item-section>{{ $t('io.export.latex') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="saveTio()">
          <q-item-section>{{ $t('io.export.tarrasque') }}</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="saveMd()">
          <q-item-section>{{ $t('io.export.md') }}</q-item-section>
        </q-item>
        <q-separator />
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
import { useMd3Renderer } from '../rendering/useHomebrewery3Renderer'
import { useMonsterStore } from '../../stores/monster-store'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { download, saveJson } from './download'
import copy from 'copy-to-clipboard'
import { useLatexRenderer } from '../rendering/useLatexRenderer'
import { useTarrasqueRenderer } from '../rendering/useTarrasqueRenderer'
import { useImprovedInitRenderer } from '../rendering/useImprovedInitRenderer'
import domToImage from 'dom-to-image-more'

import jsonurl from 'json-url'
import { useEditorStore } from 'src/stores/editor-store'

export default defineComponent({
  name: 'DownloadButton',
  setup() {
    const monster = useMonsterStore()
    const $q = useQuasar()
    const { t } = useI18n()
    const { renderMarkdown } = useMdRenderer()
    const { renderMarkdownV3 } = useMd3Renderer()
    const { renderLatex } = useLatexRenderer()
    const { renderTarrasqueJson } = useTarrasqueRenderer()
    const { renderImprovedInitJson } = useImprovedInitRenderer()
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

    const saveMd3 = () => {
      try {
        download(
          renderMarkdownV3(editorStore.statBlockColumns === 2),
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
        copy(renderMarkdownV3(editorStore.statBlockColumns === 2))
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

      if (node != null) {
        if (
          editorStore.statBlockColumns > 1 &&
          window.navigator.userAgent.includes('Mozilla')
        ) {
          $q.notify({
            message: t('editor.ffMulticolPngWarning'),
            type: 'warning',
          })
        }

        domToImage
          .toPng(node, {
            height: node.clientHeight,
            width: node.clientWidth,
            scale: 2,
            copyDefaultStyles: false,
          } as any)
          .then(function (image: string) {
            const link = document.createElement('a')
            link.download = `${monster.name}.png`
            link.href = image
            link.click()
          })
      }
    }

    const saveImprovedInit = async () => {
      download(
        await renderImprovedInitJson(),
        `${monster.name}.improved-initiative.json`,
        'application/json'
      )
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
      saveMd3,
      copyMd,
      saveLatex,
      saveTio,
      savePng,
      saveImprovedInit,
      copyLink,
    }
  },
})
</script>
