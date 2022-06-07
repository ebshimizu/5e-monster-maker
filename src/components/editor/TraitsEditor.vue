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
                  :label="$t('editor.trait.name')"
                  class="col-7 q-pa-sm"
                />
                <q-input
                  v-model.number="trait.limitedUse.count"
                  type="number"
                  min="0"
                  class="col-2 q-pa-sm"
                  :label="$t('editor.trait.limitedUse.count')"
                />
                <q-select
                  v-model="trait.limitedUse.rate"
                  :display-value="$t(`recharge.${trait.limitedUse.rate}`)"
                  :options="rechargeTimeOptions"
                  emit-value
                  :label="$t('editor.trait.limitedUse.rate')"
                  class="col-3 q-pa-sm"
                >
                  <template #after>
                    <q-btn round icon="save" color="primary">
                      <q-tooltip class="text-body2">{{
                        $t('editor.trait.save')
                      }}</q-tooltip></q-btn
                    >
                  </template>
                </q-select>
                <q-editor
                  v-model="trait.description"
                  :label="$t('editor.trait.description')"
                  :toolbar="[['title'], ['bold', 'italic', 'underline']]"
                  class="full-width q-ma-sm"
                >
                  <template #title>
                    <div
                      class="text-subtitle2"
                      style="display: flex; align-items: center; height: 100%"
                    >
                      {{ $t('editor.trait.description') }}
                    </div>
                  </template>
                </q-editor>
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

export default defineComponent({
  name: 'TraitsEditor',
  setup() {
    const monster = useMonsterStore()
    const { rechargeTimeOptions } = useRechargeTimes()

    return {
      monster,
      traits: monster.traits,
      rechargeTimeOptions,
    }
  },
})
</script>
