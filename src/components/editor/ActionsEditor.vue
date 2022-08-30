<template>
  <q-expansion-item
    expand-separator
    icon="mdi-movie-open"
    :label="$t('editor.action.label')"
  >
    <q-card>
      <q-card-section class="row">
        <q-list
          bordered
          separator
          class="rounded-borders bg-amber-10 full-width"
        >
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
                    <q-btn-group push class="q-mr-sm">
                      <q-btn
                        push
                        :color="action.legendaryOnly ? 'positive' : 'dark'"
                        icon="fa-solid fa-dragon"
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
                      <q-btn
                        push
                        :color="action.bonusAction ? 'positive' : 'dark'"
                        :label="
                          action.bonusAction
                            ? $t('editor.action.bonusAction')
                            : $t('editor.action.fullAction')
                        "
                        @click="action.bonusAction = !action.bonusAction"
                      ></q-btn>
                    </q-btn-group>
                    <q-btn
                      round
                      icon="save"
                      color="primary"
                      @click="addTemplate(action)"
                    >
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
                  :model-value="action.limitedUse.count"
                  type="number"
                  min="0"
                  class="col-4 q-pa-sm"
                  :label="$t('monster.trait.limitedUse.count')"
                  @update:model-value="
                    (value: string | number | null) =>
                      (action.limitedUse.count = validateNumber(value, 0))
                  "
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
                    (value: string) => {
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
import { useQuasar } from 'quasar'
import { MonsterAction } from '../models'
import NewTemplateDialog from './widgets/NewTemplateDialog.vue'
import { useTemplatesStore } from 'src/stores/templates-store'
import { useI18n } from 'vue-i18n'
import { validateNumber } from './numberInput'

export default defineComponent({
  name: 'ActionsEditor',
  components: { MonsterTextEditor, CrAnnotationCard },
  setup() {
    const monster = useMonsterStore()
    const { rechargeTimeOptions } = useRechargeTimes()
    const { autoUpdateCr, printCrSummary } = useAutoUpdateCr()
    const $q = useQuasar()
    const { t } = useI18n()
    const templateStore = useTemplatesStore()

    const addTemplate = (target: MonsterAction) => {
      $q.dialog({
        component: NewTemplateDialog,
        componentProps: {
          targetName: target.name,
        },
      }).onOk(({ name, icon }: { name: string; icon: string }) => {
        templateStore.addCustomAction(target, name, icon)

        $q.notify({
          message: t('editor.template.added', [name]),
          type: 'positive',
        })
      })
    }

    return {
      monster,
      actions: computed(() => monster.actions),
      rechargeTimeOptions,
      autoUpdateCr,
      printCrSummary,
      addTemplate,
      validateNumber: validateNumber,
    }
  },
})
</script>
