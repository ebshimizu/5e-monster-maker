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
      </q-toolbar>
    </q-header>

    <app-drawer :left-drawer-open="leftDrawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer id="footer" elevated>
      <q-card class="full-width">
        <q-card-section class="bg-grey-10 no-padding">
          <generic-footer />
        </q-card-section>
      </q-card>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GenericFooter from 'src/components/GenericFooter.vue'

import { useQuasar } from 'quasar'
import AppDrawer from 'src/components/AppDrawer.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    AppDrawer,
    GenericFooter,
  },
  setup() {
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>

<style lang="scss">
.template-search {
  width: 55%;
}
</style>
