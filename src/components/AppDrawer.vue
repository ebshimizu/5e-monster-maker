<template>
  <q-drawer ref="drawerRef" :model-value="leftDrawerOpen" overlay elevated>
    <q-list>
      <q-item clickable to="/"
        ><q-item-section>{{ $t('editor.home') }}</q-item-section></q-item
      >
      <q-item clickable to="/spells">
        <q-item-section>{{ $t('editor.customSpells') }}</q-item-section>
      </q-item>
      <q-item clickable to="/templates">
        <q-item-section>{{ $t('editor.template.title') }}</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="createSpell()">
        <q-item-section>{{
          $t('editor.spellcasting.custom.create')
        }}</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="reset">
        <q-item-section>{{ $t('editor.resetMonster') }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { QDrawer, useQuasar } from 'quasar'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NewSpellDialog from './spell/NewSpellDialog.vue'

export default defineComponent({
  name: 'AppDrawer',
  props: {
    leftDrawerOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const drawerRef = ref<QDrawer | null>(null)
    const monster = useMonsterStore()
    const $q = useQuasar()
    const { t } = useI18n()

    const reset = () => {
      drawerRef.value?.hide()

      monster.$reset()

      $q.notify({
        message: t('editor.monsterReset'),
        type: 'positive',
      })
    }

    const createSpell = () => {
      // the dialog actually handles basically everything
      drawerRef.value?.hide()

      $q.dialog({
        component: NewSpellDialog,
      })
    }

    return {
      reset,
      createSpell,
      drawerRef,
    }
  },
})
</script>
