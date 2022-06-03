<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="fa-solid fa-dice-d20"
    :label="$t('editor.skills.label')"
    :caption="$t('editor.skills.caption')"
  >
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { computed, defineComponent, ref } from 'vue'
import { STANDARD_MOVEMENTS } from 'src/data/MOVEMENT'
import { useI18n } from 'vue-i18n'
import { basicArrayFilter } from '../filters'

export default defineComponent({
  name: 'SpeedsEditor',
  setup() {
    const { t } = useI18n()

    const monster = useMonsterStore()

    return {}
  },
})
</script>
