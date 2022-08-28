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
              <q-menu v-bind="menuAttr" :offset="[0, 2]">
                <q-card style="width: 350px" class="q-mx-auto" bordered>
                  <q-card-section
                    ><div class="text-h6">
                      {{
                        $t('editor.cr.avgDamage', [
                          Math.floor(crData.damagePerRound.value),
                        ])
                      }}
                    </div>
                    <div class="text-subtitle2 text-grey-5">
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
                          v-for="(action, ridx) in round.actions"
                          :key="`${action.name}-${action.type}-${ridx}`"
                          class="q-pb-md q-px-md"
                        >
                          <q-item-section avatar>
                            <q-avatar
                              :color="crData.actionTypeColor(action.type)"
                              font-size="14px"
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
        <menu-hover>
          <template #default="{ activatorAttr, menuAttr }">
            <q-chip
              v-bind="activatorAttr"
              :color="crData.attackChipColor.value"
              icon="mdi-bullseye-arrow"
              >{{ crData.maxAttackRender.value }} (
              {{ crData.attackCrDelta.value }} CR)
              <q-menu v-bind="menuAttr" :offset="[0, 2]">
                <q-card style="width: 350px" class="q-mx-auto" bordered>
                  <q-card-section
                    ><div class="text-h6">
                      {{
                        $t('editor.cr.maxAttack', [
                          crData.maxAttackRender.value,
                        ])
                      }}
                    </div>
                    <div class="text-subtitle2 text-grey-5">
                      {{ crData.attackCrExplain.value }}
                    </div>
                  </q-card-section>

                  <q-separator class="q-mb-sm" />
                  <q-list>
                    <q-item
                      v-for="(action, idx) in crData.filteredToHitActions.value"
                      :key="`${action.name}-${action.type}-${idx}`"
                      class="q-pb-md q-px-md"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="crData.actionTypeColor(action.type)"
                          font-size="14px"
                          >{{ action.toHitRender }}</q-avatar
                        >
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ action.name }}</q-item-label>
                        <q-item-label caption lines="1">{{
                          $t(`editor.cr.type.${action.type}`)
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>{{
                        $t('editor.cr.attackActionsBelowThreshold', {
                          n: crData.actionsBelowThreshold.value,
                        })
                      }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card></q-menu
              >
            </q-chip>
          </template>
        </menu-hover>
        <menu-hover>
          <template #default="{ activatorAttr, menuAttr }">
            <q-chip
              v-bind="activatorAttr"
              :color="crData.dcChipColor.value"
              icon="fa-solid fa-wand-sparkles"
              >{{ crData.maxDc.value }} ( {{ crData.attackCrDelta.value }} CR)

              <q-menu v-bind="menuAttr" :offset="[0, 2]">
                <q-card style="width: 350px" class="q-mx-auto" bordered>
                  <q-card-section
                    ><div class="text-h6">
                      {{ $t('editor.cr.maxDc', [crData.maxDc.value]) }}
                    </div>
                    <div class="text-subtitle2 text-grey-5">
                      {{ crData.dcCrExplain.value }}
                    </div>
                  </q-card-section>

                  <q-separator class="q-mb-sm" />
                  <q-list>
                    <q-item
                      v-for="(action, idx) in crData.filteredDcActions.value"
                      :key="`${action.name}-${action.type}-${idx}`"
                      class="q-pb-md q-px-md"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="crData.actionTypeColor(action.type)"
                          font-size="14px"
                          >{{ action.save }}</q-avatar
                        >
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ action.name }}</q-item-label>
                        <q-item-label caption lines="1">{{
                          $t(`editor.cr.type.${action.type}`)
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>{{
                        $t('editor.cr.dcActionsBelowThreshold', {
                          n: crData.dcsBelowThreshold.value,
                        })
                      }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card></q-menu
              >
            </q-chip>
          </template>
        </menu-hover>
      </div>
      <div class="bot">
        <menu-hover>
          <template #default="{ activatorAttr, menuAttr }">
            <q-chip v-bind="activatorAttr" color="green-8" icon="mdi-hospital"
              >{{ Math.floor(crData.ehp.value) }} (CR
              {{ crData.hpCr.value.cr }})
              <q-menu v-bind="menuAttr" :offset="[0, 2]">
                <q-card style="width: 350px" class="q-mx-auto" bordered>
                  <q-card-section
                    ><div class="text-h6">
                      {{ $t('editor.cr.ehp', [Math.floor(crData.ehp.value)]) }}
                    </div>
                    <div class="text-subtitle2 text-grey-5">
                      CR {{ crData.hpCr.value.cr }}:
                      {{ crData.hpCr.value.hpMin }} -
                      {{ crData.hpCr.value.hpMax }}
                    </div>
                  </q-card-section>

                  <q-separator class="q-mb-sm" />
                  <q-list>
                    <q-item class="q-pb-md q-px-md">
                      <q-item-section avatar>
                        <q-avatar
                          :color="crData.actionTypeColor('HP')"
                          font-size="14px"
                          >{{ avgHp }}</q-avatar
                        >
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{
                          $t('editor.cr.baseHp')
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-for="(mod, idx) in crData.ehpModifierList.value"
                      :key="`${mod.title}-${mod.type}-${idx}`"
                      class="q-pb-md q-px-md"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="crData.actionTypeColor(mod.type as any)"
                          font-size="14px"
                          >{{ mod.value }}</q-avatar
                        >
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ mod.title }}</q-item-label>
                        <q-item-label caption lines="1"
                          >{{ mod.subtitle }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card></q-menu
              >
            </q-chip>
          </template>
        </menu-hover>
        <menu-hover>
          <template #default="{ activatorAttr, menuAttr }">
            <q-chip v-bind="activatorAttr" color="green-8" icon="shield"
              >{{ Math.floor(crData.eac.value) }} (
              {{ crData.acCrDelta.value }} CR)
              <q-menu v-bind="menuAttr" :offset="[0, 2]">
                <q-card style="width: 350px" class="q-mx-auto" bordered>
                  <q-card-section
                    ><div class="text-h6">
                      {{ $t('editor.cr.eac', [Math.floor(crData.eac.value)]) }}
                    </div>
                    <div class="text-subtitle2 text-grey-5">
                      {{ crData.acCrExplain.value }}
                    </div>
                  </q-card-section>

                  <q-separator class="q-mb-sm" />
                  <q-list>
                    <q-item class="q-pb-md q-px-md">
                      <q-item-section avatar>
                        <q-avatar
                          :color="crData.actionTypeColor('HP')"
                          font-size="14px"
                          >{{ ac }}</q-avatar
                        >
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{
                          $t('editor.cr.baseAc')
                        }}</q-item-label>
                        <q-item-label v-if="ac < 12" caption lines="1">{{
                          $t('editor.cr.baseAcLow')
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-for="(mod, idx) in crData.eacModifierList.value"
                      :key="`${mod.title}-${mod.type}-${idx}`"
                      class="q-pb-md q-px-md"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="crData.actionTypeColor(mod.type as any)"
                          font-size="14px"
                          >{{ mod.value }}</q-avatar
                        >
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ mod.title }}</q-item-label>
                        <q-item-label caption lines="1"
                          >{{ mod.subtitle }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card></q-menu
              >
            </q-chip>
          </template>
        </menu-hover>
      </div>
    </div>
    <q-separator class="q-mx-sm" vertical />
    <div>
      <q-btn
        push
        icon="mdi-arrow-decision-auto"
        :color="monsterStore.autoEstimateDefenseCr ? 'positive' : 'dark'"
        @click="
          monsterStore.autoEstimateDefenseCr =
            !monsterStore.autoEstimateDefenseCr
        "
      >
        <q-tooltip class="text-body2"
          >Automatically Estimate Defensive CR</q-tooltip
        >
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useCr } from './useCr'
import MenuHover from '../MenuHover.vue'
import { useMonsterStore } from 'src/stores/monster-store'

export default defineComponent({
  name: 'CrFooter',
  components: { MenuHover },
  setup() {
    const monsterStore = useMonsterStore()
    const crData = useCr()
    const damageInfo = ref(false)
    const dprTab = ref(0)

    return {
      crData,
      damageInfo,
      dprTab,
      monsterStore,
      avgHp: computed(() => monsterStore.avgHp),
      ac: computed(() => monsterStore.AC),
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
