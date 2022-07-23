<template>
  <q-expansion-item
    expand-separator
    default-opened
    icon="mdi-sword-cross"
    :label="$t('editor.multiattack.label')"
  >
    <q-card>
      <q-card-section>
        <q-card
          v-for="(ma, idx) in multiattacks"
          :key="ma.id"
          bordered
          class="q-mb-sm"
        >
          <q-card-section class="bg-blue-10">
            <div class="text-overline text-uppercase">
              {{ $t('editor.multiattack.group', [idx + 1]) }}
            </div>
            <div class="text-caption">[estimated damage]</div>
          </q-card-section>
          <q-card-section>
            <div class="flex items-center" style="flex-wrap: nowrap; gap: 10px">
              <div class="flex justify-start items-center">
                <q-btn-dropdown color="positive" rounded icon="add">
                  <q-list>
                    <template v-if="monster.attacks.length > 0">
                      <q-item class="bg-blue-10">
                        <q-item-section class="text-overline text-uppercase">{{
                          $t('editor.multiattack.attackHeader')
                        }}</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item
                        v-for="attack in monster.attacks"
                        :key="attack.id"
                        v-close-popup
                        clickable
                        @click="monster.addMultiattackAttack(ma.id, attack.id)"
                      >
                        <q-item-section
                          ><q-item-label>{{
                            attack.name
                          }}</q-item-label></q-item-section
                        >
                      </q-item>
                    </template>
                    <template v-if="monster.actions.length > 0">
                      <q-separator />
                      <q-item class="bg-blue-10">
                        <q-item-section class="text-overline text-uppercase">{{
                          $t('editor.multiattack.actionHeader')
                        }}</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item
                        v-for="action in monster.actions"
                        :key="action.id"
                        v-close-popup
                        clickable
                        @click="monster.addMultiattackAction(ma.id, action.id)"
                      >
                        <q-item-section
                          ><q-item-label>{{
                            action.name
                          }}</q-item-label></q-item-section
                        >
                      </q-item>
                    </template>
                  </q-list>
                </q-btn-dropdown>
              </div>
              <div class="full-width" style="flex-shrink: 1">
                <q-chip
                  v-for="(attackId, aidx) in ma.attacks"
                  :key="aidx"
                  color="primary"
                  removable
                  @remove="monster.removeMultiattackAttack(ma.id, attackId)"
                >
                  {{ monster.attackName(attackId) }}
                </q-chip>
                <q-chip
                  v-for="(actionId, aidx) in ma.actions"
                  :key="aidx"
                  color="primary"
                  removable
                  @remove="monster.removeMultiattackAction(ma.id, actionId)"
                >
                  {{ monster.actionName(actionId) }}
                </q-chip>
              </div>
              <div class="flex justify-end items-center">
                <q-btn
                  round
                  color="negative"
                  icon="delete"
                  @click="monster.deleteMultiattack(ma.id)"
                  ><q-tooltip class="text-body2">{{
                    $t('editor.delete')
                  }}</q-tooltip></q-btn
                >
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-actions>
        <q-btn
          color="positive"
          class="full-width"
          :label="$t('editor.multiattack.add')"
          @click="monster.addMultiattack"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MultiattackEditor',
  setup() {
    const monster = useMonsterStore()

    return {
      monster,
      multiattacks: monster.multiattacks,
    }
  },
})
</script>
