<template>
  <q-expansion-item
    expand-separator
    icon="home"
    :label="$t('editor.lair.label')"
    :caption="$t('editor.lair.caption')"
  >
    <q-card>
      <q-card-section class="row">
        <div class="col flex justify-start items-center">
          {{ $t('editor.lair.help') }}
        </div>
        <div class="col-2 flex justify-end items-center">
          <q-btn
            push
            :icon="monster.useCustomLairActionPreamble ? 'edit' : 'edit_off'"
            :color="monster.useCustomLairActionPreamble ? 'warning' : 'dark'"
            size="md"
            @click="
              monster.useCustomLairActionPreamble =
                !monster.useCustomLairActionPreamble
            "
          >
            <q-tooltip class="text-body2">{{
              monster.useCustomLairActionPreamble
                ? $t('editor.lair.useCustom')
                : $t('editor.lair.useDefault')
            }}</q-tooltip></q-btn
          >
        </div>
        <q-slide-transition>
          <div
            v-show="monster.useCustomLairActionPreamble"
            class="col-12 q-pa-sm"
          >
            <monster-text-editor
              :field="monster.lairActionPreamble"
              i18n-label-key="editor.lair.preamble"
              :show-reset="true"
              @update:model-value="(value: string) => monster.lairActionPreamble = value"
              @reset="monster.lairActionPreamble = $t('presets.lair')"
            />
          </div>
        </q-slide-transition>
      </q-card-section>
      <q-card-section class="row">
        <div class="col-12">
          <q-list
            bordered
            separator
            class="rounded-borders bg-blue-10 full-width"
          >
            <q-expansion-item
              v-for="(action, idx) in monster.lairActions"
              :key="action.id"
              :label="$t('editor.lair.actionItem', [idx + 1])"
              expand-separator
            >
              <q-card>
                <q-card-section class="row">
                  <monster-text-editor
                    :field="action.description"
                    i18n-label-key="monster.trait.description"
                    @update:model-value="
                      (value: string) => {
                        action.description = value
                        autoUpdateCr(action.description, action.crAnnotation)
                      }
                    "
                  />
                  <cr-annotation-card field="lairActions" :index="idx" />
                </q-card-section>
                <q-card-actions align="center">
                  <q-btn
                    color="negative"
                    class="full-width"
                    :label="$t('editor.lair.delete')"
                    @click="() => monster.deleteLairAction(action.id)"
                  />
                </q-card-actions>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          color="positive"
          class="full-width"
          :label="$t('editor.lair.add')"
          @click="monster.addLairAction"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'
import { useAutoUpdateCr } from './useAutoUpdateCr'
import MonsterTextEditor from './MonsterTextEditor.vue'
import CrAnnotationCard from './CrAnnotationCard.vue'

export default defineComponent({
  name: 'LairActionsEditor',
  components: {
    MonsterTextEditor,
    CrAnnotationCard,
  },
  setup() {
    const monster = useMonsterStore()
    const { autoUpdateCr } = useAutoUpdateCr()

    return {
      monster,
      autoUpdateCr,
    }
  },
})
</script>
