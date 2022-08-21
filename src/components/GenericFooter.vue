<template>
  <div class="generic-footer q-py-xs text-center text-body1">
    <span class="ogl-link" @click.stop="oglDialog = true"
      >Open Gaming Licence</span
    >
    | v{{ majorVersion }}.{{ minorVersion }} build {{ buildNumber }} | Created
    by <strong>Falindrith</strong> |
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAppVersion } from './useAppVersion'
import ogl from '../data/OGL.txt'

export default defineComponent({
  name: 'GenericFooter',
  setup() {
    const appVersion = useAppVersion()

    return {
      openLink: (url: string) => window.open(url),
      oglDialog: ref(false),
      oglText: ogl.replace(/\n/g, '<br />'),
      ...appVersion,
    }
  },
})
</script>

<style lang="scss" scoped>
.ogl-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
