<template>
  <q-expansion-item :label="attack.name" expand-separator>
    <q-card>
      <q-card-section class="row">
        <q-input
          v-model="attack.name"
          :label="$t('monster.attack.name')"
          class="col q-pa-sm"
        />
        <q-input
          v-model.number="attack.targets"
          :label="$t('monster.attack.targets')"
          class="col-1 q-pa-sm"
          type="number"
        />
        <q-input
          :model-value="attackModifier"
          :label="$t('monster.attack.bonus')"
          type="number"
          class="col-3 q-pa-sm"
          :disable="!attack.modifier.override"
          @update:model-value="
            (v) => (attack.modifier.overrideValue = parseInt(`${v}`))
          "
        >
          <template #after>
            <q-btn-group push>
              <q-btn
                push
                :color="attack.modifier.proficient ? 'positive' : 'dark'"
                icon="keyboard_arrow_up"
                @click="
                  attack.modifier.proficient = !attack.modifier.proficient
                "
              >
                <q-tooltip class="text-body2">{{
                  $t('editor.proficient')
                }}</q-tooltip>
              </q-btn>
              <q-btn
                push
                :color="attack.modifier.override ? 'warning' : 'dark'"
                icon="handyman"
                @click="attack.modifier.override = !attack.modifier.override"
              >
                <q-tooltip class="text-body2">{{
                  $t('editor.override')
                }}</q-tooltip>
              </q-btn>
            </q-btn-group>
          </template>
        </q-input>
        <q-select
          v-model="attack.modifier.stat"
          :options="statOptions"
          :label="$t('monster.attack.stat')"
          class="col-2 q-pa-sm"
        />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useMonsterStore } from 'src/stores/monster-store'
import { useStats } from 'src/data/STAT'

export default defineComponent({
  name: 'AttackPanel',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const monster = useMonsterStore()
    const attack = computed(
      () =>
        // if this ever fires an undefined then it's not being used in the right place
        // the parent creating this element should be iterating over attack ids in the monster
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        monster.attacks.find((a) => a.id === props.id)!
    )
    const { statOptionsShort } = useStats()

    const attackModifier = computed(() => monster.attackModifier(props.id))

    return {
      attack,
      attackModifier,
      statOptions: statOptionsShort,
    }
  },
})
</script>
