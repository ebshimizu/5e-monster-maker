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

        <q-input
          v-model="search"
          class="template-search"
          dense
          standout
          placeholder="Search for Actions, Traits, and Attacks"
        >
          <template #prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>

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
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer ref="drawerRef" v-model="leftDrawerOpen" overlay elevated>
      <q-list>
        <q-item clickable @click="reset">
          <q-item-section>{{ $t('editor.resetMonster') }}</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="createSpell()">
          <q-item-section>{{
            $t('editor.spellcasting.custom.create')
          }}</q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>Edit Custom Spells</q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>Edit Custom Templates</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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
        <q-card-section class="row items-center">
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
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent, ref } from 'vue'
import CrFooter from 'src/components/cr/CrFooter.vue'
import GenericFooter from 'src/components/GenericFooter.vue'
import { useFileLoader } from 'src/components/file/useFileLoader'
import { popFileDialog } from 'src/components/file/popFileDialog'
import DownloadButton from 'src/components/file/DownloadButton.vue'
import { useRoute } from 'vue-router'

import * as jsonurl from 'json-url'
import { QDrawer, useQuasar } from 'quasar'
import WebRendererSettingsButton from 'src/components/rendering/WebRendererSettingsButton.vue'
import { useV1Updater } from 'src/components/file/useV1Updater'
import NewSpellDialog from 'src/components/spell/NewSpellDialog.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'MainLayout',
  components: {
    CrFooter,
    GenericFooter,
    DownloadButton,
    WebRendererSettingsButton,
  },
  setup() {
    const leftDrawerOpen = ref(false)
    const drawerRef = ref<QDrawer | null>(null)
    const route = useRoute()
    const codec = jsonurl('lzma')
    const $q = useQuasar()
    const { loadMonster } = useFileLoader()
    const { t } = useI18n()

    // run the v1 updater checks
    useV1Updater()

    // TODO: link this to the template search
    const search = ref('')

    const monster = useMonsterStore()
    const reset = () => {
      drawerRef.value?.hide()

      monster.$reset()

      $q.notify({
        message: t('editor.monsterReset'),
        type: 'positive',
      })
    }

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
        const data = await codec.decompress(route.query.data)
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

    const createSpell = () => {
      // the dialog actually handles basically everything
      drawerRef.value?.hide()

      $q.dialog({
        component: NewSpellDialog,
      })
    }

    return {
      leftDrawerOpen,
      search,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      reset,
      loadFileDialog,
      dataParamFound,
      showDataLoad,
      queryData,
      loadFromDataParam,
      createSpell,
      drawerRef,
    }
  },
})
</script>

<style lang="scss">
.template-search {
  width: 55%;
}
</style>
