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
import { over, result } from 'lodash'

export default defineComponent({
  name: 'SaveButton',
  setup() {
    const monster = useMonsterStore()
    const $q = useQuasar()
    const { t } = useI18n()
    const monsterArchiveStore = useMonsterArchiveStore();

    const saveMonster = () => {
      const result = monsterArchiveStore.addMonster(monster.$state);
      $q.notify({
        message: t(result.message),
        type: result.error ? 'negative' : 'positive',
      })
      return

      const existingMonster = monsterArchiveStore.isMonsterSaved(monster);
      let overwrite = true;
      try {
        if (existingMonster) {
          overwrite = confirm(t('editor.monsterarchive.overwrite_save'));
        }
        monsterArchiveStore.addMonster(monster.$state, overwrite);
        if (monsterArchiveStore.isMonsterSaved(monster) && overwrite) {
          if (existingMonster) {
            $q.notify({
              message: t('editor.monsterarchive.overwrite_saved'),
              type: 'positive',
            })
          } else {
            $q.notify({
              message: t('editor.monsterarchive.saved'),
              type: 'positive',
            })
          }

        }
      } catch (e) {
        console.error(e)

        $q.notify({
          message: t('io.error.json', [e]),
          type: 'negative',
        })
      }
    }

    return {
      saveMonster
    }

  }
})
</script>