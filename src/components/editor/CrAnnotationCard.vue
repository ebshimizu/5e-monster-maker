<template>
  <div class="full-width">
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
            justify-content: flex-end;
            justify-items: flex-end;
            align-items: center;
            align-content: flex-end;
          "
        >
          <q-btn-group push>
            <lock-toggle-button
              :locked="trait.crAnnotation.automatic"
              :lock-tooltip="$t('editor.crAnnotation.automatic')"
              :unlock-tooltip="$t('editor.crAnnotation.manual')"
              @click="
                () => {
                  trait.crAnnotation.automatic = !trait.crAnnotation.automatic
                  if (trait.crAnnotation.automatic)
                    autoUpdateCr(trait.description, trait.crAnnotation)
                }
              "
            />
            <q-btn
              push
              :icon="trait.crAnnotation.include ? 'code' : 'code_off'"
              :color="trait.crAnnotation.include ? 'positive' : 'dark'"
              size="md"
              @click="trait.crAnnotation.include = !trait.crAnnotation.include"
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
                    :icon="trait.crAnnotation.multitarget ? 'groups' : 'person'"
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
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { useMonsterStore } from 'src/stores/monster-store'
import { useAutoUpdateCr } from './useAutoUpdateCr'
import LockToggleButton from '../LockToggleButton.vue'

export default defineComponent({
  name: 'CrAnnotationCard',
  components: {
    LockToggleButton,
  },
  props: {
    traitIndex: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const monster = useMonsterStore()

    const trait = monster.traits[props.traitIndex]

    return {
      trait,
      ...useAutoUpdateCr(),
    }
  },
})
</script>
