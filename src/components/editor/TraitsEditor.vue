<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="fa-solid fa-dna"
    :label="$t('editor.traits.label')"
    :caption="$t('editor.traits.caption')"
  >
    <q-card>
      <q-card-section class="row">
        <q-list bordered class="rounded-borders bg-blue-10 full-width">
          <q-expansion-item
            v-for="trait in traits"
            :key="trait.id"
            :label="trait.name"
            expand-separator
          >
            <q-card>
              <q-card-section class="row">
                <q-input
                  v-model="trait.name"
                  :label="$t('monster.trait.name')"
                  class="col-7 q-pa-sm"
                />
                <q-input
                  v-model.number="trait.limitedUse.count"
                  type="number"
                  min="0"
                  class="col-2 q-pa-sm"
                  :label="$t('monster.trait.limitedUse.count')"
                />
                <q-select
                  v-model="trait.limitedUse.rate"
                  :display-value="$t(`recharge.${trait.limitedUse.rate}`)"
                  :options="rechargeTimeOptions"
                  emit-value
                  :label="$t('monster.trait.limitedUse.rate')"
                  class="col-3 q-pa-sm"
                >
                  <template #after>
                    <q-btn round icon="save" color="primary">
                      <q-tooltip class="text-body2">{{
                        $t('monster.trait.save')
                      }}</q-tooltip></q-btn
                    >
                  </template>
                </q-select>
                <monster-text-editor
                  :field="trait.description"
                  i18n-label-key="monster.trait.description"
                  token-category="trait"
                  @update:model-value="
                    (value) => {
                      trait.description = value
                      autoUpdateCr(trait.description, trait.crAnnotation)
                    }
                  "
                />
                <div class="full-width">
                  <!-- todo: componentize this -->
                  <q-card flat bordered>
                    <q-card-section class="bg-indigo-10 row">
                      <div class="col">
                        <div class="text-overline">CR ESTIMATION</div>
                        <div class="text-subtitle">
                          {{ printCrSummary(trait.crAnnotation) }}
                        </div>
                      </div>
                      <div
                        class="col-2"
                        style="
                          display: flex;
                          justify-content: center;
                          justify-items: center;
                          align-items: center;
                          align-content: center;
                        "
                      >
                        <q-btn-group push>
                          <lock-toggle-button
                            :locked="trait.crAnnotation.automatic"
                            :lock-tooltip="$t('editor.crAnnotation.automatic')"
                            :unlock-tooltip="$t('editor.crAnnotation.manual')"
                            @click="
                              () => {
                                trait.crAnnotation.automatic =
                                  !trait.crAnnotation.automatic
                                if (trait.crAnnotation.automatic)
                                  autoUpdateCr(
                                    trait.description,
                                    trait.crAnnotation
                                  )
                              }
                            "
                          />
                          <q-btn
                            push
                            :icon="
                              trait.crAnnotation.include ? 'code' : 'code_off'
                            "
                            :color="
                              trait.crAnnotation.include ? 'positive' : 'dark'
                            "
                            size="md"
                            @click="
                              trait.crAnnotation.include =
                                !trait.crAnnotation.include
                            "
                          >
                            <q-tooltip class="text-body2">
                              {{
                                trait.crAnnotation.include
                                  ? $t('editor.crAnnotation.include')
                                  : $t('editor.crAnnotation.exclude')
                              }}
                            </q-tooltip>
                          </q-btn>
                        </q-btn-group>
                      </div>
                    </q-card-section>

                    <q-slide-transition>
                      <div v-show="!trait.crAnnotation.automatic">
                        <q-separator />
                        <q-card-section>
                          <div class="row">
                            <q-input
                              v-model.number="trait.crAnnotation.maxDamage"
                              type="number"
                              :disable="trait.crAnnotation.automatic"
                              :label="$t('editor.crAnnotation.maxDamage')"
                              min="0"
                              class="col-2 q-pa-sm"
                            >
                              <template #after>
                                <q-btn
                                  push
                                  :icon="
                                    trait.crAnnotation.multitarget
                                      ? 'groups'
                                      : 'person'
                                  "
                                  color="primary"
                                  @click="
                                    trait.crAnnotation.multitarget =
                                      !trait.crAnnotation.multitarget
                                  "
                                >
                                  <q-tooltip class="text-body2">
                                    {{
                                      trait.crAnnotation.multitarget
                                        ? $t('editor.crAnnotation.multitarget')
                                        : $t('editor.crAnnotation.singletarget')
                                    }}
                                  </q-tooltip>
                                </q-btn>
                              </template>
                            </q-input>
                            <q-input
                              v-model.number="trait.crAnnotation.maxSave"
                              type="number"
                              :label="$t('editor.crAnnotation.maxSave')"
                              :disable="trait.crAnnotation.automatic"
                              min="0"
                              class="col-2 q-pa-sm"
                            />
                            <q-input
                              v-model.number="trait.crAnnotation.maxModifier"
                              type="number"
                              :label="$t('editor.crAnnotation.maxModifier')"
                              :disable="trait.crAnnotation.automatic"
                              min="0"
                              class="col-2 q-pa-sm"
                            />
                            <q-input
                              v-model.number="trait.crAnnotation.ehpModifier"
                              type="number"
                              :label="$t('editor.crAnnotation.ehpModifier')"
                              :disable="trait.crAnnotation.automatic"
                              min="0"
                              class="col-2 q-pa-sm"
                            />
                            <q-input
                              v-model.number="trait.crAnnotation.ehpMultiplier"
                              type="number"
                              :label="$t('editor.crAnnotation.ehpMultiplier')"
                              :disable="trait.crAnnotation.automatic"
                              min="0"
                              class="col-2 q-pa-sm"
                            />
                            <q-input
                              v-model.number="trait.crAnnotation.acModifier"
                              type="number"
                              :label="$t('editor.crAnnotation.acModifier')"
                              :disable="trait.crAnnotation.automatic"
                              min="0"
                              class="col-2 q-pa-sm"
                            />
                          </div>
                        </q-card-section>
                      </div>
                    </q-slide-transition>
                  </q-card>
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  color="negative"
                  class="full-width"
                  :label="$t('editor.deleteTrait')"
                  @click="() => monster.deleteTrait(trait.id)"
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
          :label="$t('editor.addTrait')"
          @click="monster.addTrait"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useRechargeTimes } from 'src/data/RECHARGE_TIME'
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'
import MonsterTextEditor from './MonsterTextEditor.vue'
import LockToggleButton from '../LockToggleButton.vue'
import { useAutoUpdateCr } from './useAutoUpdateCr'

export default defineComponent({
  name: 'TraitsEditor',
  components: { MonsterTextEditor, LockToggleButton },
  setup() {
    const monster = useMonsterStore()
    const { rechargeTimeOptions } = useRechargeTimes()
    const { autoUpdateCr, printCrSummary } = useAutoUpdateCr()

    return {
      monster,
      traits: monster.traits,
      rechargeTimeOptions,
      autoUpdateCr,
      printCrSummary,
    }
  },
})
</script>
