<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated height-hint="64">
      <q-toolbar>
        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          class="row items-center no-wrap"
        >
          <span class="q-ml-sm">5e Monster Maker</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="flex items-center justify-center full-height full-width">
        <q-card bordered style="max-width: 400px" class="q-mt-lg">
          <q-card-section>
            <div class="text-h6">Reset Data</div>
          </q-card-section>
          <q-separator />

          <q-card-section>
            Uh oh! If you're seeing this, it means the app crashed. Usually this
            happens due to badly formatted monster data, and you can fix the
            issue by using the buttons below. The monster you're working on will
            be deleted. If you're able to, submit a bug report on GitHub and
            attach the monster that caused this problem.
          </q-card-section>
          <q-card-actions>
            <q-btn color="negative" @click="clear">Clear Data</q-btn>
            <q-btn @click="downloadFile">Download Data</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-page-container>

    <q-footer elevated> </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { download } from 'src/file/download'
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

    const downloadFile = () => {
      const data = localStorage.getItem('app.monster')

      if (data) download(data, 'monster-error.5emm.json', 'application/json')
    }

    return {
      clear,
      downloadFile,
    }
  },
})
</script>

<style lang="scss">
.template-search {
  width: 55%;
}
</style>
