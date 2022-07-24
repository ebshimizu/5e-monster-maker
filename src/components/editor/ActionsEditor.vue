<template>
  <q-expansion-item
    expand-separator
    icon="mdi-movie-open"
    :label="$t('editor.action.label')"
  >
    <q-card>
      <q-card-section class="row">
        <q-list bordered class="rounded-borders bg-blue-10 full-width">
          <q-expansion-item
            v-for="(action, idx) in actions"
            :key="action.id"
            :label="action.name"
            expand-separator
          >
            <q-card>
              <q-card-section class="row">
                <q-input
                  v-model="action.name"
                  :label="$t('monster.trait.name')"
                  class="col-12 q-pa-sm"
                >
                  <template #after>
                    <q-btn
                      push
                      :color="action.legendaryOnly ? 'positive' : 'dark'"
                      icon="fa-solid fa-dragon"
                      class="q-mr-sm"
                      :label="
                        action.legendaryOnly
                          ? $t('editor.action.legendaryOnly')
                          : $t('editor.action.regular')
                      "
                      @click="action.legendaryOnly = !action.legendaryOnly"
                    >
                      <q-tooltip class="text-body2">{{
                        $t('editor.action.legendaryExplanation')
                      }}</q-tooltip>
                    </q-btn>
                    <q-btn round icon="save" color="primary">
                      <q-tooltip class="text-body2">{{
                        $t('editor.action.save')
                      }}</q-tooltip></q-btn
                    >
                  </template>
                </q-input>
                <q-input
                  v-model="action.recharge"
                  class="col-4 q-pa-sm"
                  :label="$t('monster.action.recharge')"
                />
                <q-input
                  v-model.number="action.limitedUse.count"
                  type="number"
                  min="0"
                  class="col-4 q-pa-sm"
                  :label="$t('monster.trait.limitedUse.count')"
                />
                <q-select
                  v-model="action.limitedUse.rate"
                  :display-value="$t(`recharge.${action.limitedUse.rate}`)"
                  :options="rechargeTimeOptions"
                  emit-value
                  :label="$t('monster.trait.limitedUse.rate')"
                  class="col-4 q-pa-sm"
                />
                <monster-text-editor
                  :field="action.description"
                  i18n-label-key="monster.trait.description"
                  token-category="action"
                  @update:model-value="
                    (value) => {
                      action.description = value
                      autoUpdateCr(action.description, action.crAnnotation)
                    }
                  "
                />
                <cr-annotation-card field="actions" :index="idx" />
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  color="negative"
                  class="full-width"
                  :label="$t('editor.action.delete')"
                  @click="() => monster.deleteAction(action.id)"
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
          :label="$t('editor.action.add')"
          @click="monster.addAction"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useRechargeTimes } from 'src/data/RECHARGE_TIME'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent, computed } from 'vue'
import MonsterTextEditor from './MonsterTextEditor.vue'
import { useAutoUpdateCr } from './useAutoUpdateCr'
import CrAnnotationCard from './CrAnnotationCard.vue'

export default defineComponent({
  name: 'ActionsEditor',
  components: { MonsterTextEditor, CrAnnotationCard },
  setup() {
    const monster = useMonsterStore()
    const { rechargeTimeOptions } = useRechargeTimes()
    const { autoUpdateCr, printCrSummary } = useAutoUpdateCr()

    return {
      monster,
      actions: computed(() => monster.actions),
      rechargeTimeOptions,
      autoUpdateCr,
      printCrSummary,
    }
  },
})
</script>
