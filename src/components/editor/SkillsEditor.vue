<template>
  <q-expansion-item
    expand-separator
    icon="fa-solid fa-dice-d20"
    :label="$t('editor.skills.label')"
    :caption="$t('editor.skills.caption')"
  >
    <q-card>
      <q-card-section class="row">
        <div
          v-for="skill in skills"
          :key="skill.key"
          class="row"
          style="width: 100%"
        >
          <q-input
            :label="$t(`skill.${skill.key}`)"
            class="col-8 q-pa-sm"
            type="number"
            :model-value="bonusForSkill(monster, skill)"
            :disable="!skill.override"
            @update:model-value="
            (value: string | number | null) => (skill.overrideValue = parseInt(`${value}`))
          "
          >
            <template #after>
              <q-btn-group push>
                <q-btn
                  push
                  :color="skill.proficient ? 'positive' : 'dark'"
                  icon="keyboard_arrow_up"
                  @click="skill.proficient = !skill.proficient"
                >
                  <q-tooltip class="text-body2">{{
                    $t('editor.proficient')
                  }}</q-tooltip>
                </q-btn>
                <q-btn
                  push
                  :color="skill.expertise ? 'positive' : 'dark'"
                  icon="keyboard_double_arrow_up"
                  @click="skill.expertise = !skill.expertise"
                >
                  <q-tooltip class="text-body2">{{
                    $t('editor.expertise')
                  }}</q-tooltip>
                </q-btn>
                <q-btn
                  push
                  :color="skill.override ? 'warning' : 'dark'"
                  icon="handyman"
                  @click="skill.override = !skill.override"
                >
                  <q-tooltip class="text-body2">{{
                    $t('editor.override')
                  }}</q-tooltip>
                </q-btn>
              </q-btn-group>
              <q-btn
                round
                color="negative"
                icon="delete"
                class="q-mx-sm"
                @click="() => deleteSkill(skill.key)"
              >
                <q-tooltip class="text-body2">{{
                  $t('editor.delete')
                }}</q-tooltip>
              </q-btn>
            </template>
          </q-input>
          <q-input
            v-model="skill.conditional"
            class="col-4 q-pa-sm"
            :label="$t('editor.skills.conditional')"
          ></q-input>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn-dropdown
          color="positive"
          class="full-width"
          auto-close
          :label="$t('editor.addSkill')"
        >
          <q-list>
            <q-item
              v-for="skill in availableSkills"
              :key="skill.value"
              v-close-popup
              clickable
              @click="() => addSkill(skill.value)"
            >
              <q-item-section
                ><q-item-label>{{ skill.label }}</q-item-label></q-item-section
              >
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { SKILL } from 'src/data/SKILL'
import { useMonsterStore } from 'src/stores/monster-store'
import { computed, defineComponent } from 'vue'
import { bonusForSkill } from '../rendering/mathRendering'

export default defineComponent({
  name: 'SkillsEditor',
  setup() {
    const monster = useMonsterStore()

    const availableSkills = computed(() => {
      return Object.keys(SKILL)
        .map((key) => {
          return {
            value: key,
            label: SKILL[key].label,
          }
        })
        .filter(
          (skill) => monster.skills.find((s) => s.key === skill.value) == null
        )
    })

    return {
      monster,
      skills: computed(() => monster.skills),
      addSkill: monster.addSkill,
      deleteSkill: monster.deleteSkill,
      availableSkills,
      bonusForSkill,
    }
  },
})
</script>
