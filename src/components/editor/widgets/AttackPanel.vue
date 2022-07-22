<template>
  <q-expansion-item :label="attack.name" expand-separator>
    <q-card>
      <q-card-section class="row">
        <q-input
          v-model="attack.name"
          :label="$t('monster.attack.name')"
          class="col-6 q-pa-sm"
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
        <q-select
          v-model="attack.distance"
          :label="$t('monster.attack.range')"
          :display-value="$t(`range.${attack.distance}`)"
          :options="rangeOptions"
          emit-value
          class="col-4 q-pa-sm"
        />
        <q-select
          v-model="attack.kind"
          :label="$t('monster.attack.kind')"
          :display-value="$t(`kind.${attack.kind}`)"
          :options="kindOptions"
          emit-value
          class="col-2 q-pa-sm"
        />
        <q-input
          v-show="attack.distance === 'MELEE' || attack.distance === 'BOTH'"
          v-model.number="attack.range.reach"
          :label="$t('monster.attack.reach')"
          type="number"
          min="0"
          step="5"
          suffix="ft"
          class="col-1 q-pa-sm"
        />
        <q-input
          v-show="attack.distance === 'RANGED' || attack.distance === 'BOTH'"
          v-model.number="attack.range.standard"
          :label="$t('monster.attack.close')"
          type="number"
          min="0"
          step="5"
          suffix="ft"
          class="col-1 q-pa-sm"
        />
        <q-input
          v-show="attack.distance === 'RANGED' || attack.distance === 'BOTH'"
          v-model.number="attack.range.long"
          :label="$t('monster.attack.long')"
          type="number"
          min="0"
          step="5"
          suffix="ft"
          class="col-1 q-pa-sm"
        />
        <q-input
          v-model.number="attack.save"
          :label="$t('monster.attack.effectDc')"
          type="number"
          class="col-1 q-pa-sm"
        />
      </q-card-section>
      <q-card-section>
        <q-list
          bordered
          separator
          class="rounded-borders bg-pink-10 full-width"
        >
          <q-expansion-item
            expand-separator
            default-opened
            :label="$t('editor.attack.primary')"
          >
            <q-card>
              <q-card-section>
                <div class="row">
                  <q-input
                    v-model.number="attack.damage.count"
                    :label="$t('monster.attack.count')"
                    type="number"
                    min="0"
                    class="col-2 q-pa-sm"
                  />
                  <q-select
                    v-model.number="attack.damage.dice"
                    :options="diceOptions"
                    emit-value
                    :display-value="diceLookup[attack.damage.dice]"
                    :label="$t('monster.attack.dieType')"
                    class="col-2 q-pa-sm"
                  />
                  <q-select
                    v-model="attack.damage.type"
                    :label="$t('monster.attack.damageType')"
                    :options="attackTypeDefaults"
                    use-input
                    new-value-mode="add-unique"
                    class="col-4 q-pa-sm"
                  />
                  <q-input
                    :model-value="attackDamageModifier"
                    type="number"
                    :label="$t('monster.attack.damageBonus')"
                    :disable="!attack.damage.modifier.override"
                    class="col-2 q-pa-sm"
                    @change="
                      (v) =>
                        (attack.damage.modifier.overrideValue = parseInt(
                          `${v}`
                        ))
                    "
                  >
                    <template #after>
                      <lock-toggle-button
                        :locked="!attack.damage.modifier.override"
                        :lock-tooltip="$t('editor.attack.lockedToStats')"
                        :unlock-tooltip="$t('editor.attack.unlockedFromStats')"
                        @click="
                          attack.damage.modifier.override =
                            !attack.damage.modifier.override
                        "
                      />
                    </template>
                  </q-input>
                  <q-select
                    v-model="attack.damage.modifier.stat"
                    :label="$t('monster.attack.stat')"
                    class="col-2 q-pa-sm"
                    :options="statOptions"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            :label="$t('editor.attack.additional')"
            :caption="$t('editor.attack.additionalCaption')"
          >
            <q-card>
              <q-card-section>
                <div
                  v-for="additional in attack.additionalDamage"
                  :key="additional.id"
                  class="row"
                >
                  <q-input
                    v-model.number="additional.count"
                    :label="$t('monster.attack.count')"
                    type="number"
                    class="col-2 q-pa-sm"
                  />
                  <q-select
                    v-model.number="additional.dice"
                    :options="diceOptions"
                    emit-value
                    :display-value="diceLookup[attack.damage.dice]"
                    :label="$t('monster.attack.dieType')"
                    class="col-2 q-pa-sm"
                  />
                  <q-select
                    v-model="additional.type"
                    :label="$t('monster.attack.damageType')"
                    :options="attackTypeDefaults"
                    use-input
                    new-value-mode="add-unique"
                    class="col-4 q-pa-sm"
                  />
                  <q-input
                    v-model="additional.note"
                    :label="$t('editor.attack.additionalNote')"
                    class="col-4 q-pa-sm"
                  >
                    <template #after>
                      <q-btn
                        round
                        color="negative"
                        icon="delete"
                        @click="() => deleteAdditionalDamage(additional.id)"
                      >
                        <q-tooltip class="text-body2">{{
                          $t('editor.delete')
                        }}</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </div>
              </q-card-section>
              <q-card-actions>
                <q-btn color="positive" @click="addAdditionalDamage">{{
                  $t('editor.attack.addAdditional')
                }}</q-btn>
              </q-card-actions>
            </q-card></q-expansion-item
          >
          <q-expansion-item
            expand-separator
            :label="$t('editor.attack.conditional')"
            :caption="$t('editor.attack.conditionalCaption')"
          >
            <q-card>
              <q-card-section>
                <div class="row">
                  <q-input
                    v-model="attack.alternateDamage.condition"
                    :disable="!attack.alternateDamage.active"
                    :label="$t('editor.attack.condition')"
                    class="col-12"
                  >
                    <template #before>
                      <q-btn
                        push
                        :color="
                          attack.alternateDamage.active ? 'primary' : 'dark'
                        "
                        @click="
                          attack.alternateDamage.active =
                            !attack.alternateDamage.active
                        "
                      >
                        {{
                          attack.alternateDamage.active
                            ? $t('editor.attack.enableConditional')
                            : $t('editor.attack.disableConditional')
                        }}
                      </q-btn>
                    </template>
                  </q-input>
                  <q-input
                    v-model.number="attack.alternateDamage.count"
                    :disable="!attack.alternateDamage.active"
                    :label="$t('monster.attack.count')"
                    type="number"
                    class="col-2 q-pa-sm"
                  />
                  <q-select
                    v-model.number="attack.alternateDamage.dice"
                    :disable="!attack.alternateDamage.active"
                    :options="diceOptions"
                    emit-value
                    :display-value="diceLookup[attack.damage.dice]"
                    :label="$t('monster.attack.dieType')"
                    class="col-2 q-pa-sm"
                  />
                  <q-select
                    v-model="attack.alternateDamage.type"
                    :disable="!attack.alternateDamage.active"
                    :label="$t('monster.attack.damageType')"
                    :options="attackTypeDefaults"
                    use-input
                    new-value-mode="add-unique"
                    class="col-4 q-pa-sm"
                  />
                  <q-input
                    :model-value="conditionalDamageModifier"
                    type="number"
                    :label="$t('monster.attack.damageBonus')"
                    :disable="conditionalModifierLocked"
                    class="col-2 q-pa-sm"
                    @change="
                      (v) =>
                        (attack.alternateDamage.modifier.overrideValue =
                          parseInt(`${v}`))
                    "
                  >
                    <template #after>
                      <lock-toggle-button
                        :locked="!attack.alternateDamage.modifier.override"
                        :lock-tooltip="$t('editor.attack.lockedToStats')"
                        :unlock-tooltip="$t('editor.attack.unlockedFromStats')"
                        @click="
                          attack.alternateDamage.modifier.override =
                            !attack.alternateDamage.modifier.override
                        "
                      />
                    </template>
                  </q-input>
                  <q-select
                    v-model="attack.alternateDamage.modifier.stat"
                    :disable="!attack.alternateDamage.active"
                    :label="$t('monster.attack.stat')"
                    class="col-2 q-pa-sm"
                    :options="statOptions"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
      <q-card-section class="row">
        <q-input
          v-model="attack.description"
          :label="$t('editor.attack.description')"
          class="col-12"
        >
          <template #after>
            <q-btn
              push
              :icon="attack.useCustomRenderer ? 'edit' : 'edit_off'"
              :color="attack.useCustomRenderer ? 'warning' : 'dark'"
              size="md"
              @click="attack.useCustomRenderer = !attack.useCustomRenderer"
            >
              <q-tooltip class="text-body2">{{
                attack.useCustomRenderer
                  ? $t('editor.attack.useCustomRenderer')
                  : $t('editor.attack.useDefaultRenderer')
              }}</q-tooltip></q-btn
            >
          </template>
        </q-input>
        <q-slide-transition>
          <div v-show="attack.useCustomRenderer" class="col-12 q-mt-md">
            <monster-text-editor
              :field="attack.customRenderer"
              i18n-label-key="editor.attack.customRenderer"
              token-category="attack"
              :show-reset="true"
              @update:model-value="
                          (value: string) =>
                            (attack.customRenderer =
                              value)
                        "
              @reset="attack.customRenderer = $t('presets.attack')"
            />
          </div>
        </q-slide-transition>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="full-width"
          color="negative"
          :label="$t('editor.attack.delete')"
          @click="deleteAttack"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useMonsterStore } from 'src/stores/monster-store'
import { useStats } from 'src/data/STAT'
import { useAttackData } from 'src/data/ATTACK'
import { DICE_SELECT, DIE_LOOKUP } from 'src/data/DICE'
import { useAttackTypeDefaults } from 'src/data/DAMAGE_TYPE'
import LockToggleButton from 'src/components/LockToggleButton.vue'
import MonsterTextEditor from '../MonsterTextEditor.vue'

export default defineComponent({
  name: 'AttackPanel',
  components: { LockToggleButton, MonsterTextEditor },
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
    const { rangeOptions, kindOptions } = useAttackData()
    const { attackTypeDefaults } = useAttackTypeDefaults()
    const diceOptions = DICE_SELECT
    const diceLookup = DIE_LOOKUP

    const attackModifier = computed(() => monster.attackModifier(props.id))
    const attackDamageModifier = computed(() =>
      monster.attackDamageModifier(props.id)
    )
    const conditionalDamageModifier = computed(() =>
      monster.conditionalDamageModifier(props.id)
    )

    const addAdditionalDamage = () => monster.addAdditionalDamage(props.id)
    const deleteAdditionalDamage = (addId: string) =>
      monster.deleteAdditionalDamage(props.id, addId)

    const deleteAttack = () => {
      monster.deleteAttack(props.id)
    }

    return {
      attack,
      attackModifier,
      deleteAttack,
      statOptions: statOptionsShort,
      rangeOptions,
      kindOptions,
      diceOptions,
      diceLookup,
      attackTypeDefaults,
      attackDamageModifier,
      addAdditionalDamage,
      deleteAdditionalDamage,
      conditionalDamageModifier,
      conditionalModifierLocked: computed(
        () =>
          !attack.value.alternateDamage.active ||
          !attack.value.alternateDamage.modifier.override
      ),
    }
  },
})
</script>
