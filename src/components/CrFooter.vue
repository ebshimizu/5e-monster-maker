<template>
  <div class="cr-footer full-width q-pa-sm">
    <span class="big text-overline text-uppercase">{{
      $t('editor.cr.estimated')
    }}</span>
    <span class="text-h3 q-ml-sm">{{ crData.estimatedCr.value.cr }}</span>
    <q-separator class="q-mx-sm" vertical />
    <div class="split">
      <div class="top">
        <span class="small text-overline">{{ $t('editor.cr.offensive') }}</span>
        <span class="text-h5 q-ml-2 cr">{{ crData.offensiveCr.value.cr }}</span>
      </div>
      <q-separator />
      <div class="bot">
        <span class="text-overline">{{ $t('editor.cr.defensive') }}</span>
        <span class="text-h5 q-ml-2 cr"
          >{{ crData.defensiveCr.value.cr }}
        </span>
      </div>
    </div>
    <q-separator class="q-mx-sm" vertical />
    <div class="split chips text-weight-bold cursor-pointer">
      <div class="top">
        <menu-hover>
          <template #default="{ activatorAttr, menuAttr }">
            <q-chip v-bind="activatorAttr" color="red-10" icon="mdi-sword-cross"
              >{{ Math.floor(crData.damagePerRound.value) }} (
              {{ crData.damageCr.value.cr }} CR)
              <q-menu v-bind="menuAttr" :offset="[0, 10]">
                <q-card style="width: 350px" class="q-mx-auto" bordered>
                  <q-card-section
                    ><div class="text-h6">
                      {{ Math.floor(crData.damagePerRound.value) }} Average
                      Damage (3 Rounds)
                    </div>
                    <div class="text-subtitle1">
                      CR {{ crData.damageCr.value.cr }}:
                      {{ crData.damageCr.value.dprMin }} -
                      {{ crData.damageCr.value.dprMax }}
                    </div>
                  </q-card-section>

                  <q-tabs v-model="dprTab" class="bg-red-10" align="justify">
                    <q-tab
                      v-for="(round, idx) in crData.actionSequence.value"
                      :key="idx"
                      :name="idx"
                      :label="$t('editor.cr.round', [idx + 1])"
                    />
                  </q-tabs>

                  <q-separator />

                  <q-tab-panels v-model="dprTab" animated>
                    <q-tab-panel
                      v-for="(round, idx) in crData.actionSequence.value"
                      :key="idx"
                      :name="idx"
                      style="padding: 0px"
                    >
                      <q-list>
                        <q-item-label header
                          ><div class="text-overline text-uppercase text-white">
                            {{
                              $t('editor.cr.totalDamage', [
                                Math.floor(round.totalDamage),
                              ])
                            }}
                          </div></q-item-label
                        >
                        <q-separator class="q-mb-sm" />
                        <q-item
                          v-for="(action, idx) in round.actions"
                          :key="`${action.name}-${action.type}-${idx}`"
                          class="q-pb-md q-px-md"
                        >
                          <q-item-section avatar>
                            <q-avatar
                              :color="crData.actionTypeColor(action.type)"
                              >{{ Math.floor(action.damage) }}</q-avatar
                            >
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ action.name }}</q-item-label>
                            <q-item-label caption lines="1">{{
                              $t(`editor.cr.type.${action.type}`)
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-card></q-menu
              >
            </q-chip>
          </template>
        </menu-hover>
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
import { defineComponent, ref } from 'vue'
import { useCr } from './useCr'
import MenuHover from './MenuHover.vue'

export default defineComponent({
  name: 'CrFooter',
  components: { MenuHover },
  setup() {
    const crData = useCr()
    const damageInfo = ref(false)
    const dprTab = ref(0)
    return {
      crData,
      damageInfo,
      dprTab,
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
