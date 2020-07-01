<template>
  <v-expansion-panels accordion hover multiple focusable>
    <CR />
    <basics />
    <speeds />
    <saves />
    <skills />
    <damage-types />
  </v-expansion-panels>
</template>

<script>
import Basics from './input/Basics';
import CR from './input/CR';
import DamageTypes from './input/DamageTypes';
import Saves from './input/Saves';
import Skills from './input/Skills';
import Speeds from './input/Speeds';

export default {
  name: 'DataEntry',

  components: {
    Basics,
    CR,
    DamageTypes,
    Saves,
    Skills,
    Speeds,
  },
};
</script>
