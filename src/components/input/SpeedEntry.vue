<template>
  <v-row align="center">
    <v-col cols="3" class="pr-2"
      ><v-combobox
        label="Movement Type"
        :items="movementTypes"
        v-model="type"
      ></v-combobox
    ></v-col>
    <v-col cols="2" class="pr-2"
      ><v-text-field
        label="Speed"
        type="number"
        v-model="spd"
        :rules="[rules.number]"
      ></v-text-field
    ></v-col>
    <v-col cols="6" class="pr-2"
      ><v-text-field label="Note" v-model="note"></v-text-field
    ></v-col>
    <v-col cols="1"
      ><v-btn fab small color="red" @click="remove"><v-icon>mdi-close</v-icon></v-btn></v-col
    >
  </v-row>
</template>

<script>
import { MOVEMENT } from '../../data/MOVEMENT';
import { MUTATION } from '../../data/ACTIONS';
import { isNumber } from '../util';

export default {
  name: 'SpeedEntry',
  data() {
    return {
      movementTypes: Object.values(MOVEMENT),
      rules: {
        number: isNumber,
      },
    };
  },
  computed: {
    spd: {
      get() {
        return this.speed.speed;
      },
      set(value) {
        this.speed.speed = parseInt(value);
        this.update();
      },
    },
    type: {
      get() {
        return this.speed.type;
      },
      set(value) {
        this.speed.type = value;
        this.update();
      },
    },
    note: {
      get() {
        return this.speed.note;
      },
      set(value) {
        this.speed.note = value;
        this.update();
      },
    },
  },
  methods: {
    update() {
      this.$store.commit(MUTATION.EDIT_SPEED, {
        index: this.index,
        newSpeed: this.speed,
      });
    },
    remove() {
      this.$store.commit(MUTATION.DELETE_SPEED, this.index);
    }
  },
  props: ['speed', 'index'],
};
</script>
