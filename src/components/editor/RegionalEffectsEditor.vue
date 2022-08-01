<template>
  <q-expansion-item
    expand-separator
    icon="public"
    :label="$t('editor.regional.label')"
  >
    <q-card>
      <q-card-section class="row">
        <div class="col-12 flex justify-start items-center">
          {{ $t('editor.regional.help') }}
        </div>
        <div class="col-12 q-pa-sm">
          <monster-text-editor
            :field="monster.regionalEffectDescription"
            i18n-label-key="editor.regional.preamble"
            :show-reset="true"
            @update:model-value="(value: string) => monster.regionalEffectDescription = value"
            @reset="monster.regionalEffectDescription = $t('presets.regional')"
          />
        </div>
      </q-card-section>
      <q-card-section class="row">
        <div class="col-12">
          <q-list
            bordered
            separator
            class="rounded-borders bg-blue-10 full-width"
          >
            <q-expansion-item
              v-for="(effect, idx) in monster.regionalEffects"
              :key="effect.id"
              :label="$t('editor.regional.effectItem', [idx + 1])"
              expand-separator
            >
              <q-card>
                <q-card-section class="row">
                  <monster-text-editor
                    :field="effect.description"
                    i18n-label-key="monster.trait.description"
                    @update:model-value="
                      (value: string) => {
                        effect.description = value
                      }
                    "
                  />
                </q-card-section>
                <q-card-actions align="center">
                  <q-btn
                    color="negative"
                    class="full-width"
                    :label="$t('editor.regional.delete')"
                    @click="() => monster.deleteRegionalEffect(effect.id)"
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
          :label="$t('editor.regional.add')"
          @click="monster.addRegionalEffect"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'
import MonsterTextEditor from './MonsterTextEditor.vue'

export default defineComponent({
  name: 'RegionalEffectsEditor',
  components: {
    MonsterTextEditor,
  },
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
    }
  },
})
</script>
