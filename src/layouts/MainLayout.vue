<template>
  <q-layout view="hHh lpR fFf">
    <q-header id="main-nav" elevated height-hint="64">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          class="row items-center no-wrap"
        >
          <span class="q-ml-sm">{{ $t('app.name') }}</span>
        </q-toolbar-title>

        <q-space />

        <div class="template-bar">
          <template-search />
        </div>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <web-renderer-settings-button />
          <q-btn
            round
            flat
            icon="mdi-folder-open"
            @click="loadFileDialog()"
          ></q-btn>
          <download-button />
          <save-button />
        </div>
      </q-toolbar>
    </q-header>

    <app-drawer :left-drawer-open="leftDrawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer id="footer" elevated>
      <q-card class="full-width">
        <q-card-section class="bg-blue-grey-7 no-padding">
          <cr-footer />
        </q-card-section>
        <q-card-section class="bg-grey-10 no-padding">
          <generic-footer />
        </q-card-section>
      </q-card>
    </q-footer>

    <q-dialog v-model="showDataLoad" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('io.dataUrl.title') }}</div>
          <div class="q-my-sm">
            {{ $t('io.dataUrl.loadText', [queryData.name]) }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('editor.load')"
            color="positive"
            @click="loadFromDataParam"
          />
          <q-btn
            v-close-popup
            flat
            :label="$t('editor.cancel')"
            color="negative"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import CrFooter from 'src/components/cr/CrFooter.vue'
import GenericFooter from 'src/components/GenericFooter.vue'
import { useFileLoader } from 'src/components/file/useFileLoader'
import { popFileDialog } from 'src/components/file/popFileDialog'
import DownloadButton from 'src/components/file/DownloadButton.vue'
import SaveButton from 'src/components/file/SaveButton.vue'
import { useRoute, useRouter } from 'vue-router'

import jsonurl from 'json-url'
import { useQuasar } from 'quasar'
import WebRendererSettingsButton from 'src/components/rendering/WebRendererSettingsButton.vue'
import { useV1Updater } from 'src/components/file/useV1Updater'
import AppDrawer from 'src/components/AppDrawer.vue'
import TemplateSearch from 'src/components/editor/TemplateSearch.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    AppDrawer,
    CrFooter,
    GenericFooter,
    DownloadButton,
    SaveButton,
    WebRendererSettingsButton,
    TemplateSearch,
  },
  setup() {
    const leftDrawerOpen = ref(false)
    const route = useRoute()
    const codec = jsonurl('lzma')
    const $q = useQuasar()
    const { loadMonster } = useFileLoader()

    // run the v1 updater checks
    useV1Updater()

    const { loadFile } = useFileLoader()

    const loadFileDialog = async () => {
      const file = await popFileDialog()

      if (file) {
        loadFile(file)
      }
    }

    const dataParamFound = route.query.data != null

    const showDataLoad = ref(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryData: any = ref({})

    const loadDataParam = async () => {
      try {
        const data = (await codec.decompress(route.query.data)) as string
        const maybeMonster = JSON.parse(data)
        queryData.value = maybeMonster
        showDataLoad.value = true
      } catch (e) {
        $q.notify({
          message: 'Invalid data parameter',
          type: 'negative',
        })

        route.query.data = ''
      }
    }
    // only do this on load
    if (dataParamFound) {
      loadDataParam()
    }

    // TODO: load from data param
    const loadFromDataParam = () => {
      if (dataParamFound) {
        loadMonster(queryData.value)
      }

      showDataLoad.value = false
    }

    const openDnd = () => {
      window.open('https://opendnd.games')
    }

    onMounted(() => {
      // check data param on load, v1 links do not have the right hash
      if (!dataParamFound && window.location.search.startsWith('?data')) {
        // redirect
        // a router replace does some... stuff that might cause the url to be too long
        const data = window.location.search
        window.location.search = ''
        window.location.href = `${window.location.origin}${window.location.pathname}#/${data}`
      }
    })

    return {
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      loadFileDialog,
      dataParamFound,
      showDataLoad,
      queryData,
      loadFromDataParam,
      leftDrawerOpen,
      openDnd,
    }
  },
})
</script>

<style lang="scss">
.template-bar {
  width: 45%;
}
</style>
