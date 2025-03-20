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
            <template #header>
              <q-item-section>
                {{ action.name }}
              </q-item-section>

              <q-item-section side>
                <swap-buttons field="actions" :idx="idx" />
              </q-item-section>
            </template>
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
                <q-select
                  v-model="action.stat"
                  :options="statOptions"
                  :label="$t('monster.action.savingThrowStat')"
                  class="col-2 q-pa-sm"
                  @update:model-value="(stat: string) => {
                    action.stat = stat as DndStat | 'none'
                    autoUpdateCr(action.description, action.crAnnotation, action)
                  }"
                />
                <q-input
                  :model-value="saveThrowValueForAction(action)"
                  :label="$t('monster.action.saveDc')"
                  type="number"
                  :disable="!action.save.override"
                  class="col-2 q-pa-sm"
                  @update:model-value="(v: string | number | null) => {
                    action.save.overrideValue = parseInt(`${v}`)
                    autoUpdateCr(action.description, action.crAnnotation, action)
                  }"
                >
                  <template #after>
                    <lock-toggle-button
                      :locked="!action.save.override"
                      :lock-tooltip="$t('monster.action.lockSave')"
                      :unlock-tooltip="$t('monster.action.unlockSave')"
                      @click="
                        () => {
                          action.save.override = !action.save.override
                          autoUpdateCr(
                            action.description,
                            action.crAnnotation,
                            action
                          )
                        }
                      "
                    />
                  </template>
                </q-input>
                <q-input
                  v-model="action.range"
                  class="col-8 q-pa-sm"
                  :label="$t('monster.action.range')"
                >
                  <template #after>
                    <q-btn-dropdown
                      :label="$t('editor.action.addEffect')"
                      color="green"
                      :disable="action.stat === 'none'"
                    >
                      <q-list>
                        <q-item
                          v-close-popup
                          clickable
                          @click="
                            action.effects.push({
                              case: $t('editor.action.effectCase.failure'),
                              effect: '',
                            })
                          "
                        >
                          <q-item-section>
                            <q-item-label>{{
                              $t('editor.action.effectCase.failure')
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item
                          v-close-popup
                          clickable
                          @click="
                            action.effects.push({
                              case: $t('editor.action.effectCase.failByFive'),
                              effect: '',
                            })
                          "
                        >
                          <q-item-section>
                            <q-item-label>{{
                              $t('editor.action.effectCase.failByFive')
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item
                          v-close-popup
                          clickable
                          @click="
                            action.effects.push({
                              case: $t('editor.action.effectCase.success'),
                              effect: $t(
                                'editor.action.effectTemplate.halfDamage'
                              ),
                            })
                          "
                        >
                          <q-item-section>
                            <q-item-label
                              >{{ $t('editor.action.effectCase.success') }}:
                              {{
                                $t('editor.action.effectTemplate.halfDamage')
                              }}</q-item-label
                            >
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </template>
                </q-input>
                <q-card
                  v-if="action.stat !== 'none'"
                  bordered
                  class="row q-ma-sm full-width"
                >
                  <q-card-section class="bg-orange-10 full-width">
                    <div class="text-overline text-uppercase">
                      {{ $t('editor.action.saveDescription') }}
                    </div>
                    <div class="text-caption">
                      {{ $t('editor.action.saveHelp') }}
                    </div>
                  </q-card-section>
                  <q-card-section class="row full-width">
                    <template
                      v-for="(effect, eIdx) of action.effects"
                      :key="eIdx"
                    >
                      <q-input
                        v-model="effect.case"
                        :label="$t('editor.action.condition')"
                        class="col-3 q-pa-sm"
                      />
                      <q-input
                        v-model="effect.effect"
                        :label="$t('editor.action.effect')"
                        class="col-9 q-pa-sm"
                        @update:model-value="(value: string | number | null) => {
                          effect.effect = `${value}`
                          autoUpdateCr(action.description, action.crAnnotation, action)
                        }"
                      >
                        <template #after>
                          <q-btn
                            round
                            color="negative"
                            icon="delete"
                            class="q-mx-sm"
                            @click="
                              () => {
                                action.effects.splice(idx, 1)
                                autoUpdateCr(
                                  action.description,
                                  action.crAnnotation,
                                  action
                                )
                              }
                            "
                          />
                        </template>
                      </q-input>
                    </template>
                  </q-card-section>
                </q-card>
                <monster-text-editor
                  :field="action.description"
                  i18n-label-key="monster.trait.description"
                  token-category="action"
                  @update:model-value="
                    (value: string) => {
                      action.description = value
                      autoUpdateCr(action.description, action.crAnnotation, action)
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DndStat, MonsterAction } from '../models'
import NewTemplateDialog from './widgets/NewTemplateDialog.vue'
import { useTemplatesStore } from 'src/stores/templates-store'
import { useI18n } from 'vue-i18n'
import { validateNumber } from './numberInput'
import SwapButtons from './widgets/SwapButtons.vue'
import { useStats } from 'src/data/STAT'
import LockToggleButton from '../LockToggleButton.vue'

export default defineComponent({
  name: 'ActionsEditor',
  components: {
    MonsterTextEditor,
    CrAnnotationCard,
    SwapButtons,
    LockToggleButton,
  },
  setup() {
    const monster = useMonsterStore()
    const { statOptionsShort } = useStats()
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

    const saveThrowValueForAction = (action: MonsterAction) => {
      if (action.stat !== 'none') {
        return action.save.override
          ? action.save.overrideValue
          : monster.defaultSpellSave(action.stat)
      }

      return 0
    }

    return {
      monster,
      actions: computed(() => monster.actions),
      rechargeTimeOptions,
      autoUpdateCr,
      printCrSummary,
      addTemplate,
      statOptions: ['none', ...statOptionsShort],
      validateNumber: validateNumber,
      saveThrowValueForAction,
    }
  },
})
</script>
