<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated height-hint="64">
      <q-toolbar>
        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          class="row items-center no-wrap"
        >
          <span class="q-ml-sm">{{ $t('app.name') }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="flex items-center justify-center full-height full-width">
        <q-card bordered style="max-width: 500px" class="q-mt-lg">
          <q-card-section>
            <div class="text-h6">Reset Data</div>
          </q-card-section>
          <q-separator />

          <q-card-section>
            <p>
              {{ $t('error.message') }}
            </p>
            <p>
              {{ $t('error.report') }}
            </p>
          </q-card-section>
          <q-card-actions>
            <q-btn color="negative" @click="clear">{{
              $t('error.delete.monster')
            }}</q-btn>
            <q-btn color="negative" @click="clearSpells">{{
              $t('error.delete.spells')
            }}</q-btn>
            <q-btn color="negative" @click="clearTemplates">{{
              $t('error.delete.templates')
            }}</q-btn>
            <q-btn @click="downloadFile">{{
              $t('error.download.monster')
            }}</q-btn>
            <q-btn @click="downloadSpells">{{
              $t('error.download.spells')
            }}</q-btn>
            <q-btn @click="downloadTemplates">{{
              $t('error.download.spells')
            }}</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-page-container>

    <q-footer elevated> </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { download } from '../components/file/download'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const clear = () => {
      localStorage.removeItem('app.monster')
      window.location.assign(
        `${window.location.origin}${window.location.pathname}`
      )
    }

    const clearSpells = () => {
      localStorage.removeItem('app.spells')
      window.location.assign(
        `${window.location.origin}${window.location.pathname}`
      )
    }

    const clearTemplates = () => {
      localStorage.removeItem('app.templates')
      window.location.assign(
        `${window.location.origin}${window.location.pathname}`
      )
    }

    const downloadFile = () => {
      const data = localStorage.getItem('app.monster')

      if (data) download(data, 'monster-error.json', 'application/json')
    }

    const downloadSpells = () => {
      const data = localStorage.getItem('app.spells')

      if (data) download(data, 'spells-error.json', 'application/json')
    }

    const downloadTemplates = () => {
      const data = localStorage.getItem('app.templates')

      if (data) download(data, 'templates-error.json', 'application/json')
    }

    return {
      clear,
      clearSpells,
      clearTemplates,
      downloadFile,
      downloadSpells,
      downloadTemplates,
    }
  },
})
</script>

<style lang="scss">
.template-search {
  width: 55%;
}
</style>
