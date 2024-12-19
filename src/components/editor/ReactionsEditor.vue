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
                >
                  <template #after>
                    <q-btn
                      round
                      icon="save"
                      color="primary"
                      @click="addTemplate(reaction)"
                    >
                      <q-tooltip class="text-body2">{{
                        $t('editor.reaction.save')
                      }}</q-tooltip></q-btn
                    >
                  </template>
                </q-input>
                <q-input
                  v-model="reaction.limitedUse.count"
                  type="number"
                  min="0"
                  class="col-2 q-pa-sm"
                  :label="$t('monster.trait.limitedUse.count')"
                  @update:model-value="(value: string | number | null) => (reaction.limitedUse.count = validateNumber(value, 0))"
                />
                <q-select
                  v-model="reaction.limitedUse.rate"
                  :display-value="$t(`recharge.${reaction.limitedUse.rate}`)"
                  :options="rechargeTimeOptions"
                  emit-value
                  :label="$t('monster.trait.limitedUse.rate')"
                  class="col-2 q-pa-sm"
                />
                <q-input
                  v-model="reaction.trigger"
                  class="col-8 q-pa-sm"
                  :label="$t('monster.reaction.trigger')"
                />
                <monster-text-editor
                  :field="reaction.description"
                  i18n-label-key="monster.reaction.response"
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
import { useTemplatesStore } from 'src/stores/templates-store'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { MonsterReaction } from '../models'
import NewTemplateDialog from './widgets/NewTemplateDialog.vue'
import MonsterTextEditor from './MonsterTextEditor.vue'
import SwapButtons from './widgets/SwapButtons.vue'
import { useQuasar } from 'quasar'
import { validateNumber } from './numberInput'
import { useRechargeTimes } from 'src/data/RECHARGE_TIME'

export default defineComponent({
  name: 'ReactionsEditor',
  components: { MonsterTextEditor, SwapButtons },
  setup() {
    const monster = useMonsterStore()
    const $q = useQuasar()
    const { t } = useI18n()
    const { rechargeTimeOptions } = useRechargeTimes()
    const templateStore = useTemplatesStore()

    const addTemplate = (target: MonsterReaction) => {
      $q.dialog({
        component: NewTemplateDialog,
        componentProps: {
          targetName: target.name,
        },
      }).onOk(({ name, icon }: { name: string; icon: string }) => {
        templateStore.addCustomReaction(target, name, icon)

        $q.notify({
          message: t('editor.template.added', [name]),
          type: 'positive',
        })
      })
    }

    return {
      monster,
      addTemplate,
      validateNumber,
      rechargeTimeOptions,
    }
  },
})
</script>
