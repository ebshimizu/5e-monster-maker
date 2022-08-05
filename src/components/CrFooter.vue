<template>
  <div class="cr-footer full-width q-pa-sm">
    <span class="big text-overline">ESTIMATED CR</span>
    <span class="text-h3 q-ml-sm">##</span>
    <q-separator class="q-mx-sm" vertical />
    <div class="split">
      <div class="top">
        <span class="small text-overline">Offensive CR</span>
        <span class="text-h5 q-ml-2 cr">##</span>
      </div>
      <q-separator />
      <div class="bot">
        <span class="text-overline">Defensive CR</span>
        <span class="text-h5 q-ml-2 cr">##</span>
      </div>
    </div>
    <q-separator class="q-mx-sm" vertical />
    <div class="split chips text-weight-bold cursor-pointer">
      <div class="top">
        <q-chip color="red-10" icon="mdi-sword-cross">### (CR ##)</q-chip>
        <q-chip color="red-10" icon="mdi-bullseye-arrow">### (CR ##)</q-chip>
        <q-chip color="red-10" icon="fa-solid fa-wand-sparkles"
          >### (CR ##)</q-chip
        >
      </div>
      <div class="bot">
        <q-chip color="green-8" icon="mdi-hospital">### (CR ##)</q-chip>
        <q-chip color="green-8" icon="shield">### (CR ##)</q-chip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CrFooter',
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
