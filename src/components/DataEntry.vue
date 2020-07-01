<template>
  <v-expansion-panels accordion hover multiple focusable>
    <CR />
    <basics />
    <saves />
    <speeds />
  </v-expansion-panels>
</template>

<script>
import Basics from './input/Basics';
import CR from './input/CR';
import Saves from './input/Saves';
import Speeds from './input/Speeds';

export default {
  name: 'DataEntry',

  components: {
    Basics,
    CR,
    Saves,
    Speeds,
  },
};
</script>
