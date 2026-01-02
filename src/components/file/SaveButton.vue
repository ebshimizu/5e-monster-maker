<template>
  <q-btn round flat icon="save" @click="saveMonster()" title="{{ $t('editor.monsterarchive.save-button') }}">
  </q-btn>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useMonsterStore } from '../../stores/monster-store'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMonsterArchiveStore } from 'src/stores/monster-archive-store'

export default defineComponent({
  name: 'SaveButton',
  setup() {
    const monsterStore = useMonsterStore()
    const $q = useQuasar()
    const { t } = useI18n()
    const monsterArchiveStore = useMonsterArchiveStore();

    const saveMonster = () => {
      let overwrite = false;
      if (monsterArchiveStore.isMonsterSaved(monsterStore.$state)) {
        overwrite = confirm(t('editor.monsterarchive.overwrite_save'))
      }
      const result = monsterArchiveStore.addMonster(monsterStore.$state, overwrite);
      $q.notify({
        message: t(result.message),
        type: result.error ? 'negative' : 'positive',
      })
    }

    return {
      saveMonster
    }

  }
})
</script>