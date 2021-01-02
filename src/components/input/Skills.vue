<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Skills</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row>
        <skill-entry
          v-for="(item, index) in skills"
          :skill="item"
          :index="index"
          :key="item.skill.key"
        ></skill-entry> </v-row
      ><v-menu offset-y max-height="300px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn block small style="margin-top: 20px;" color="green" v-bind="attrs" v-on="on"
            >Add Skill</v-btn
          >
        </template>
        <v-list>
          <v-list-item
            v-for="item in availableSkills"
            :key="item.key"
            @click="add(item)"
          >
            <v-list-item-title>{{ item.key }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import SKILL from '../../data/SKILL';
import SkillEntry from './SkillEntry';
import { MUTATION } from '../../data/ACTIONS';

export default {
  name: 'Skills',
  components: {
    SkillEntry,
  },
  computed: {
    availableSkills() {
      const skillKeys = this.$store.state.monster.skills.map(
        (s) => s.skill.key
      );

      // filter out skills that are already in the monster skill list (no duplicates)
      return Object.keys(SKILL)
        .filter((s) => skillKeys.indexOf(SKILL[s].key) === -1)
        .map((k) => SKILL[k]);
    },
    skills() {
      return this.$store.state.monster.skills;
    },
  },
  methods: {
    add(skill) {
      this.$store.commit(MUTATION.ADD_SKILL, skill);
    },
  },
};
</script>
