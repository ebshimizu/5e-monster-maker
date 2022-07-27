<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="fa-solid fa-dragon"
    :label="$t('editor.legendary.label')"
    :caption="$t('editor.legendary.caption')"
  >
    <q-card>
      <q-card-section class="row">
        <q-input
          v-model.number="monster.legendaryActions.count"
          type="number"
          min="0"
          :label="$t('editor.legendary.count')"
          class="col-2 q-pa-sm"
        />
        <div class="col-10 q-pa-sm flex items-end">
          <q-btn-dropdown
            :color="
              monster.attacksAndActions.length === 0 ? 'dark' : 'positive'
            "
            :label="
              monster.attacksAndActions.length === 0
                ? $t('editor.legendary.none')
                : $t('editor.legendary.add')
            "
            :disable="monster.attacksAndActions.length === 0"
            class="full-width"
          >
            <q-list>
              <q-item
                v-for="a in filteredActions"
                :key="a.id"
                v-close-popup
                clickable
                @click="addLegendary(a.id)"
              >
                <q-item-section
                  ><q-item-label>{{ a.name }}</q-item-label></q-item-section
                >
                <q-item-section side top>
                  <q-badge
                    :color="a.typeInternal === 'attack' ? 'red-10' : 'blue-10'"
                    :label="a.type"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-card-section>
      <q-card-section class="row">
        <template
          v-for="la in monster.legendaryActions.actions"
          :key="la.actionId"
        >
          <div class="col-8 text-h6 flex items-center">
            {{ monster.legendaryActionName(la.actionId) }}
          </div>
          <div class="col-4">
            <q-input
              v-model.number="la.cost"
              type="number"
              min="0"
              :label="$t('editor.legendary.cost')"
            >
              <template #after>
                <q-btn
                  push
                  color="negative"
                  icon="delete"
                  @click="() => monster.deleteLegendaryAction(la.actionId)"
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
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'LegendaryActionsEditor',
  // components: { MonsterTextEditor },
  setup() {
    const monster = useMonsterStore()

    const addLegendary = (id: string) => {
      monster.addLegendaryAction(id)
    }

    const filteredActions = computed(() => {
      const actions = monster.attacksAndActions

      const filtered = actions.filter(
        (a) =>
          monster.legendaryActions.actions.find((la) => la.actionId === a.id) ==
          null
      )

      return filtered
    })

    return {
      monster,
      filteredActions,
      addLegendary,
    }
  },
})
</script>
