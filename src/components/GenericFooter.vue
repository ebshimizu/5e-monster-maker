<template>
  <div class="generic-footer q-py-xs text-center text-body1">
    <span class="ogl-link" @click.stop="oglDialog = true"
      >Open Gaming Licence</span
    >
    |
    <span class="version" @click="changelog = true"
      >v{{ majorVersion }}.{{ minorVersion }}.{{ revision }} build
      {{ buildNumber }}</span
    >
    | Created by <strong>Falindrith</strong> |
    <q-btn
      round
      icon="mdi-twitter"
      class="q-mx-1"
      @click="openLink('https://twitter.com/falindrith')"
    />
    <q-btn
      round
      icon="mdi-github"
      class="q-mr-1"
      @click="openLink('https://github.com/ebshimizu/5e-monster-maker')"
    />
    <q-btn round @click="openLink('https://ko-fi.com/E1E2KHZ3')"
      ><q-tooltip class="text-body2">Tip Jar</q-tooltip
      ><q-avatar size="36px"><img src="../assets/ko-fi-icon.png" /></q-avatar
    ></q-btn>
  </div>
  <q-dialog v-model="oglDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('editor.ogl') }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll" v-html="oglText">
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Done" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="changelog" full-height>
    <q-card style="width: 100%; max-width: 75vw">
      <q-card-section>
        <div class="text-h6">{{ $t('changelog') }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll">
        <changelog-content />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Close" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAppVersion } from './useAppVersion'
import ogl from '../data/OGL.txt?raw'
import ChangelogContent from './ChangelogContent.vue'
import { useEditorStore } from 'src/stores/editor-store'

// TODO: don't forget to change the target changelog when the app has an update
// that should trigger a notice
const TARGET_CHANGELOG = 'v2.1.0'

export default defineComponent({
  name: 'GenericFooter',
  components: { ChangelogContent },
  setup() {
    const appVersion = useAppVersion()
    const editorStore = useEditorStore()

    const changelog = ref(false)
    if (editorStore.changelogShown !== TARGET_CHANGELOG) {
      changelog.value = true
      // show once
      editorStore.changelogShown = TARGET_CHANGELOG
    }

    return {
      openLink: (url: string) => window.open(url),
      oglDialog: ref(false),
      changelog,
      oglText: ogl.replace(/\n/g, '<br />'),
      ...appVersion,
    }
  },
})
</script>

<style lang="scss" scoped>
.ogl-link,
.version {
  color: #03a9f4;
  cursor: pointer;
}

.ogl-link:hover,
.version:hover {
  color: #81d4fa;
}
</style>
