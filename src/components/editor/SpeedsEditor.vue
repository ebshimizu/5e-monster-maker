<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="speed"
    :label="$t('editor.speeds.label')"
    :caption="$t('editor.speeds.caption')"
  >
    <q-card>
      <q-card-section class="row">
        <q-card
          v-for="speed in speeds"
          :key="speed.id"
          flat
          style="width: 100%"
        >
          <q-card-section horizontal>
            <div class="row" style="width: 100%">
              <q-select
                v-model="speed.type"
                :options="filteredMovementOptions"
                use-input
                input-debounce="0"
                :label="$t('monster.movement.type.label')"
                class="col-3 q-pa-sm"
                new-value-mode="add-unique"
                @filter="movementFilter"
              />
              <q-input
                v-model.number="speed.speed"
                type="number"
                :label="$t('monster.movement.speed')"
                suffix="ft"
                min="0"
                step="5"
                class="col-2 q-pa-sm"
              />
              <q-input
                v-model="speed.note"
                :label="$t('monster.movement.note')"
                class="col q-pa-sm"
              />
            </div>
            <q-card-actions vertical class="justify-around q-px-md">
              <q-btn
                icon="delete"
                round
                color="negative"
                @click="() => deleteSpeed(speed.id)"
              />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          class="full-width"
          color="positive"
          label="Add Speed"
          @click="addSpeed"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { computed, defineComponent, ref } from 'vue'
import { STANDARD_MOVEMENTS } from 'src/data/MOVEMENT'
import { useI18n } from 'vue-i18n'
import { basicArrayFilter } from '../filters'

export default defineComponent({
  name: 'SpeedsEditor',
  setup() {
    const { t } = useI18n()

    const monster = useMonsterStore()
    const defaultSpeedOptions = computed(() => {
      return STANDARD_MOVEMENTS.map((m) => t(`monster.movement.type.${m}`))
    })
    const filteredMovementOptions = ref(Array.from(defaultSpeedOptions.value))

    const movementFilter = basicArrayFilter(
      defaultSpeedOptions,
      filteredMovementOptions
    )

    return {
      speeds: monster.speeds,
      addSpeed: monster.addSpeed,
      deleteSpeed: monster.deleteSpeed,
      movementFilter,
      filteredMovementOptions,
    }
  },
})
</script>
