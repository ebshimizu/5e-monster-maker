<template>
  <div class="cr-footer full-width q-pa-sm">
    <span class="big text-overline">ESTIMATED CR</span>
    <span class="text-h3 q-ml-sm">{{ crData.estimatedCr.value.cr }}</span>
    <q-separator class="q-mx-sm" vertical />
    <div class="split">
      <div class="top">
        <span class="small text-overline">Offensive CR</span>
        <span class="text-h5 q-ml-2 cr">{{ crData.offensiveCr.value.cr }}</span>
      </div>
      <q-separator />
      <div class="bot">
        <span class="text-overline">Defensive CR</span>
        <span class="text-h5 q-ml-2 cr"
          >{{ crData.defensiveCr.value.cr }}
        </span>
      </div>
    </div>
    <q-separator class="q-mx-sm" vertical />
    <div class="split chips text-weight-bold cursor-pointer">
      <div class="top">
        <q-chip color="red-10" icon="mdi-sword-cross"
          >{{ Math.floor(crData.damagePerRound.value) }} (
          {{ crData.damageCr.value.cr }} CR)</q-chip
        >
        <q-chip :color="crData.attackChipColor.value" icon="mdi-bullseye-arrow"
          >{{ crData.maxAttackRender.value }} (
          {{ crData.attackCrDelta.value }} CR)</q-chip
        >
        <q-chip
          :color="crData.dcChipColor.value"
          icon="fa-solid fa-wand-sparkles"
          >{{ crData.maxDc.value }} (
          {{ crData.attackCrDelta.value }} CR)</q-chip
        >
      </div>
      <div class="bot">
        <q-chip color="green-8" icon="mdi-hospital"
          >{{ Math.floor(crData.ehp.value) }} (CR
          {{ crData.hpCr.value.cr }})</q-chip
        >
        <q-chip color="green-8" icon="shield"
          >{{ Math.floor(crData.eac.value) }} (
          {{ crData.acCrDelta.value }} CR)</q-chip
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCr } from './useCr'

export default defineComponent({
  name: 'CrFooter',
  setup() {
    const crData = useCr()

    return {
      crData,
    }
  },
})
</script>

<style scoped lang="scss">
.cr-footer {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 2rem;
  word-break: break-all;
  text-transform: uppercase;
}

.big.text-overline {
  font-size: 1rem !important;
}

.small.text-overline {
  line-height: 25px;
}

.split {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.split.chips {
  align-items: flex-start;
}

.cr {
  width: 40px;
  text-align: right;
}

.split .top,
.split .bot {
  display: flex;
  align-items: center;
  height: 28px;
}

.ehp-mod {
  font-size: 14px;
}
</style>
