<template>
  <q-btn-group push>
    <q-btn
      :disabled="idx === 0"
      push
      :ripple="false"
      icon="move_up"
      color="primary"
      @click="(e: Event) => {
                      e.stopPropagation()
                      monster.moveItemUp(field, idx)
                    }"
    ></q-btn>
    <q-btn
      :disabled="idx === itemCount - 1"
      push
      :ripple="false"
      icon="move_down"
      color="primary"
      @click="(e: Event) => {
                      e.stopPropagation()
                      monster.moveItemDown(field, idx)
                    }"
    ></q-btn>
  </q-btn-group>
</template>

<script lang="ts">
import { SwappableField } from 'src/components/models'
import { useMonsterStore } from 'src/stores/monster-store'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'SwapButtons',
  props: {
    idx: {
      type: Number,
      required: true,
    },
    field: {
      type: String as PropType<SwappableField>,
      required: true,
    },
  },
  setup(props) {
    const monster = useMonsterStore()

    const itemCount = computed(() => {
      return monster[props.field].length
    })

    return {
      monster,
      itemCount,
    }
  },
})
</script>
