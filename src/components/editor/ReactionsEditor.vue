<template>
  <q-expansion-item
    expand-separator
    icon="mdi-account-reactivate"
    :label="$t('editor.reaction.label')"
  >
    <q-card>
      <q-card-section class="row">
        <q-list
          bordered
          separator
          class="rounded-borders bg-blue-10 full-width"
        >
          <q-expansion-item
            v-for="(reaction, idx) in monster.reactions"
            :key="reaction.id"
            :label="reaction.name"
            expand-separator
          >
            <template #header>
              <q-item-section>
                {{ reaction.name }}
              </q-item-section>

              <q-item-section side>
                <swap-buttons field="reactions" :idx="idx" />
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="row">
                <q-input
                  v-model="reaction.name"
                  :label="$t('monster.trait.name')"
                  class="col-12 q-pa-sm"
                />
                <monster-text-editor
                  :field="reaction.description"
                  i18n-label-key="monster.trait.description"
                  @update:model-value="
                    (value: string) => {
                      reaction.description = value
                    }
                  "
                />
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  color="negative"
                  class="full-width"
                  :label="$t('editor.reaction.delete')"
                  @click="() => monster.deleteReaction(reaction.id)"
                />
              </q-card-actions>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          color="positive"
          class="full-width"
          :label="$t('editor.reaction.add')"
          @click="monster.addReaction"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'
import MonsterTextEditor from './MonsterTextEditor.vue'
import SwapButtons from './widgets/SwapButtons.vue'

export default defineComponent({
  name: 'ReactionsEditor',
  components: { MonsterTextEditor, SwapButtons },
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
    }
  },
})
</script>
