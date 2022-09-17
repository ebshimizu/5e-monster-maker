<template>
  <q-expansion-item
    expand-separator
    icon="fa-solid fa-dna"
    :label="$t('editor.traits.label')"
    :caption="$t('editor.traits.caption')"
  >
    <q-card>
      <q-card-section class="row">
        <q-list
          bordered
          separator
          class="rounded-borders bg-teal-10 full-width"
        >
          <q-expansion-item
            v-for="(trait, idx) in traits"
            :key="trait.id"
            :label="trait.name"
            expand-separator
          >
            <template #header>
              <q-item-section>
                {{ trait.name }}
              </q-item-section>

              <q-item-section v-if="!monster.alphaTraits" side>
                <swap-buttons field="traits" :idx="idx" />
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="row">
                <q-input
                  v-model="trait.name"
                  :label="$t('monster.trait.name')"
                  class="col-7 q-pa-sm"
                />
                <q-input
                  :model-value="trait.limitedUse.count"
                  type="number"
                  min="0"
                  class="col-2 q-pa-sm"
                  :label="$t('monster.trait.limitedUse.count')"
                  @update:model-value="
                    (value: string | number | null) =>
                      (trait.limitedUse.count = validateNumber(value, 0))
                  "
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
                    <q-btn
                      round
                      icon="save"
                      color="primary"
                      @click="addTemplate(trait)"
                    >
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
                    (value: string) => {
                      trait.description = value
                      autoUpdateCr(trait.description, trait.crAnnotation)
                    }
                  "
                />
                <cr-annotation-card field="traits" :index="idx" />
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
import { defineComponent, computed } from 'vue'
import MonsterTextEditor from './MonsterTextEditor.vue'
import { useAutoUpdateCr } from './useAutoUpdateCr'
import CrAnnotationCard from './CrAnnotationCard.vue'
import { useQuasar } from 'quasar'
import { useTemplatesStore } from 'src/stores/templates-store'
import { useI18n } from 'vue-i18n'
import { MonsterTrait } from '../models'
import NewTemplateDialog from './widgets/NewTemplateDialog.vue'
import { validateNumber } from './numberInput'
import SwapButtons from './widgets/SwapButtons.vue'

export default defineComponent({
  name: 'TraitsEditor',
  components: { MonsterTextEditor, CrAnnotationCard, SwapButtons },
  setup() {
    const monster = useMonsterStore()
    const { rechargeTimeOptions } = useRechargeTimes()
    const { autoUpdateCr, printCrSummary } = useAutoUpdateCr()

    const $q = useQuasar()
    const { t } = useI18n()
    const templateStore = useTemplatesStore()

    const addTemplate = (target: MonsterTrait) => {
      $q.dialog({
        component: NewTemplateDialog,
        componentProps: {
          targetName: target.name,
        },
      }).onOk(({ name, icon }: { name: string; icon: string }) => {
        templateStore.addCustomTrait(target, name, icon)

        $q.notify({
          message: t('editor.template.added', [name]),
          type: 'positive',
        })
      })
    }

    return {
      monster,
      traits: computed(() => monster.traits),
      rechargeTimeOptions,
      autoUpdateCr,
      printCrSummary,
      addTemplate,
      validateNumber,
    }
  },
})
</script>
