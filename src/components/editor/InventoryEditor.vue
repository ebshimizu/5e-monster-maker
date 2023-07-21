<script setup lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import MonsterTextEditor from './MonsterTextEditor.vue'

const monster = useMonsterStore()
</script>

<template>
  <q-expansion-item
    expand-separator
    icon="luggage"
    :label="$t('editor.inventory.label')"
  >
    <q-card>
      <q-card-section class="row">
        <div class="col-12 flex justify-start items-center">
          {{ $t('editor.inventory.help') }}
        </div>
        <div class="col-12 q-pa-sm">
          <monster-text-editor
            :field="monster.inventory"
            i18n-label-key="editor.inventory.label"
            :show-reset="true"
            @update:model-value="(value: string) => monster.inventory = value"
            @reset="monster.inventory = ''"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>
