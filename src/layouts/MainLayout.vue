<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated height-hint="64">
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
          <span class="q-ml-sm">5e Monster Maker</span>
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
          <q-btn round flat>
            <q-tooltip>Export</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" overlay elevated>
      <q-list>
        <q-item clickable @click="reset">
          <q-item-section>Reset Monster</q-item-section>
        </q-item>
        <q-separator />
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

    <q-footer elevated>
      <q-card class="full-width">
        <q-card-section class="bg-blue-grey-7 no-padding">
          <cr-footer />
        </q-card-section>
        <q-card-section class="bg-grey-10 no-padding">
          <generic-footer />
        </q-card-section>
      </q-card>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent, ref } from 'vue'
import CrFooter from 'src/components/cr/CrFooter.vue'
import GenericFooter from 'src/components/GenericFooter.vue'

export default defineComponent({
  name: 'MainLayout',

  components: { CrFooter, GenericFooter },

  setup() {
    const leftDrawerOpen = ref(false)

    // TODO: link this to the template search
    const search = ref('')

    const monster = useMonsterStore()
    const reset = () => monster.$reset()

    return {
      leftDrawerOpen,
      search,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      reset,
    }
  },
})
</script>

<style lang="scss">
.template-search {
  width: 55%;
}
</style>
