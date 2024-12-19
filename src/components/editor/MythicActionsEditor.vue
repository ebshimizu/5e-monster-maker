<template>
  <q-expansion-item
    expand-separator
    icon="fa-solid fa-building-columns"
    :label="$t('editor.mythic.label')"
    :caption="$t('editor.mythic.caption')"
  >
    <q-card>
      <q-card-section class="row">
        <q-input
          v-model="monster.mythicActions.triggerName"
          :label="$t('editor.mythic.traitName')"
          class="col-6 q-pa-sm"
        />
        <q-input
          v-model="monster.mythicActions.triggerRecharge"
          :label="$t('editor.mythic.recharge')"
          class="col-6 q-pa-sm"
        ></q-input>
        <div class="col-12 q-pa-sm">
          <monster-text-editor
            :field="monster.mythicActions.triggerDescription"
            i18n-label-key="editor.mythic.description"
            :show-reset="true"
            @update:model-value="(value: string) => monster.mythicActions.triggerDescription = value"
            @reset="
              monster.mythicActions.triggerDescription = $t(
                'presets.mythicDescription'
              )
            "
          />
        </div>
        <div class="col-12 q-pa-sm">
          <monster-text-editor
            :field="monster.mythicActions.preamble"
            i18n-label-key="editor.mythic.preamble"
            :show-reset="true"
            @update:model-value="(value: string) => monster.mythicActions.preamble = value"
            @reset="
              monster.mythicActions.preamble = $t('presets.mythicPreamble')
            "
          />
        </div>
      </q-card-section>
      <q-card-section class="row">
        <div class="col-12 q-pa-sm flex items-center">
          <q-btn-dropdown
            :color="filteredActions.length === 0 ? 'dark' : 'positive'"
            :label="
              filteredActions.length === 0
                ? $t('editor.legendary.none')
                : $t('editor.mythic.add')
            "
            :disable="filteredActions.length === 0"
            class="full-width"
          >
            <q-list>
              <q-item
                v-for="a in filteredActions"
                :key="a.id"
                v-close-popup
                clickable
                @click="monster.addMythicAction(a.id)"
              >
                <q-item-section
                  ><q-item-label>{{ a.name }}</q-item-label></q-item-section
                >
                <q-item-section side top>
                  <q-badge
                    :color="a.typeInternal === 'attack' ? 'red-10' : 'amber-10'"
                    :label="a.type"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <template
          v-for="la in monster.mythicActions.actions"
          :key="la.actionId"
        >
          <div class="col-8 text-h6 flex items-center">
            {{ monster.legendaryActionName(la.actionId) }}
          </div>
          <div class="col-4">
            <q-input
              :model-value="la.cost"
              type="number"
              min="1"
              :label="$t('editor.legendary.cost')"
              @update:model-value="
                (value: string | number | null) => (la.cost = validateNumber(value, 1))
              "
            >
              <template #after>
                <q-btn
                  push
                  color="negative"
                  icon="delete"
                  @click="() => monster.deleteMythicAction(la.actionId)"
                >
                  <q-tooltip class="text-body2">{{
                    $t('editor.delete')
                  }}</q-tooltip>
                </q-btn>
              </template>
            </q-input>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { computed, defineComponent } from 'vue'
import MonsterTextEditor from './MonsterTextEditor.vue'
import { validateNumber } from './numberInput'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'MythicActionsEditor',
  components: {
    MonsterTextEditor,
  },
  setup() {
    const monster = useMonsterStore()
    const { t } = useI18n()

    const filteredActions = computed(() => {
      const actions = monster.attacksAndActions(t)

      const filtered = actions.filter(
        (a) =>
          monster.mythicActions.actions.find((la) => la.actionId === a.id) ==
          null
      )

      return filtered
    })

    return {
      monster,
      filteredActions,
      validateNumber: validateNumber,
    }
  },
})
</script>
