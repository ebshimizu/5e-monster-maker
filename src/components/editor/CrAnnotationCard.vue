<template>
  <div class="full-width">
    <q-card flat bordered>
      <q-card-section class="bg-indigo-10 row">
        <div class="col">
          <div class="text-overline text-uppercase">
            {{ $t('editor.crAnnotation.title') }}
          </div>
          <div class="text-subtitle">
            {{ printCrSummary(crData.crAnnotation) }}
          </div>
        </div>
        <div
          class="col-2"
          style="
            display: flex;
            justify-content: flex-end;
            justify-items: flex-end;
            align-items: center;
            align-content: flex-end;
          "
        >
          <q-btn-group push>
            <lock-toggle-button
              :locked="crData.crAnnotation.automatic"
              :lock-tooltip="$t('editor.crAnnotation.automatic')"
              :unlock-tooltip="$t('editor.crAnnotation.manual')"
              @click="
                () => {
                  crData.crAnnotation.automatic = !crData.crAnnotation.automatic
                  if (crData.crAnnotation.automatic)
                    autoUpdateCr(crData.description, crData.crAnnotation)
                }
              "
            />
            <q-btn
              push
              :icon="crData.crAnnotation.include ? 'code' : 'code_off'"
              :color="crData.crAnnotation.include ? 'positive' : 'dark'"
              size="md"
              @click="
                crData.crAnnotation.include = !crData.crAnnotation.include
              "
            >
              <q-tooltip class="text-body2">
                {{
                  crData.crAnnotation.include
                    ? $t('editor.crAnnotation.include')
                    : $t('editor.crAnnotation.exclude')
                }}
              </q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>
      </q-card-section>

      <q-slide-transition>
        <div v-show="!crData.crAnnotation.automatic">
          <q-separator />
          <q-card-section>
            <div class="row">
              <q-input
                v-model.number="crData.crAnnotation.maxDamage"
                type="number"
                :disable="crData.crAnnotation.automatic"
                :label="$t('editor.crAnnotation.maxDamage')"
                min="0"
                class="col-12 col-sm-6 col-md-3 col-lg-2 q-pa-sm"
                @blur="validate('maxDamage', 0)"
              >
                <template #after>
                  <q-btn
                    push
                    :icon="
                      crData.crAnnotation.multitarget ? 'groups' : 'person'
                    "
                    color="primary"
                    @click="
                      crData.crAnnotation.multitarget =
                        !crData.crAnnotation.multitarget
                    "
                  >
                    <q-tooltip class="text-body2">
                      {{
                        crData.crAnnotation.multitarget
                          ? $t('editor.crAnnotation.multitarget')
                          : $t('editor.crAnnotation.singletarget')
                      }}
                    </q-tooltip>
                  </q-btn>
                </template>
              </q-input>
              <q-input
                v-model.number="crData.crAnnotation.maxSave"
                type="number"
                :label="$t('editor.crAnnotation.maxSave')"
                :disable="crData.crAnnotation.automatic"
                min="0"
                class="col-12 col-sm-6 col-md-3 col-lg-2 q-pa-sm"
                @blur="validate('maxSave', 0)"
              />
              <q-input
                v-model.number="crData.crAnnotation.maxModifier"
                type="number"
                :label="$t('editor.crAnnotation.maxModifier')"
                :disable="crData.crAnnotation.automatic"
                min="0"
                class="col-12 col-sm-6 col-md-3 col-lg-2 q-pa-sm"
                @blur="validate('maxModifier', 0)"
              />
              <q-input
                v-model.number="crData.crAnnotation.ehpModifier"
                type="number"
                :label="$t('editor.crAnnotation.ehpModifier')"
                :disable="crData.crAnnotation.automatic"
                min="0"
                class="col-12 col-sm-6 col-md-3 col-lg-2 q-pa-sm"
                @blur="validate('ehpModifier', 0)"
              />
              <q-input
                v-model.number="crData.crAnnotation.ehpMultiplier"
                type="number"
                :label="$t('editor.crAnnotation.ehpMultiplier')"
                :disable="crData.crAnnotation.automatic"
                min="0"
                class="col-12 col-sm-6 col-md-3 col-lg-2 q-pa-sm"
                @blur="validate('ehpMultiplier', 1)"
              />
              <q-input
                v-model.number="crData.crAnnotation.acModifier"
                type="number"
                :label="$t('editor.crAnnotation.acModifier')"
                :disable="crData.crAnnotation.automatic"
                min="0"
                class="col-12 col-sm-6 col-md-3 col-lg-2 q-pa-sm"
                @blur="validate('acModifier', 0)"
              />
            </div>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'
import { useMonsterStore } from 'src/stores/monster-store'
import { useAutoUpdateCr } from './useAutoUpdateCr'
import LockToggleButton from '../LockToggleButton.vue'
import {
  Monster,
  MonsterAction,
  MonsterCrAnnotation,
  MonsterTrait,
} from '../models'

export type CrAnnotatedField = MonsterTrait[] | MonsterAction[]

export default defineComponent({
  name: 'CrAnnotationCard',
  components: {
    LockToggleButton,
  },
  props: {
    field: {
      required: true,
      type: String as PropType<keyof Monster>,
    },
    index: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const monster = useMonsterStore()

    const crData = (monster[props.field] as CrAnnotatedField)[props.index]

    const validate = (
      field:
        | 'maxDamage'
        | 'maxSave'
        | 'maxModifier'
        | 'ehpMultiplier'
        | 'ehpModifier'
        | 'acModifier',
      defaultValue: number
    ) => {
      // bit of wiggliness here, the number input type sometimes returns strings (fun)
      const value = crData.crAnnotation[field] as string | number | null

      if (typeof value === 'string' || value == null) {
        crData.crAnnotation[field] = defaultValue
      }
    }

    return {
      crData,
      validate,
      ...useAutoUpdateCr(),
    }
  },
})
</script>
