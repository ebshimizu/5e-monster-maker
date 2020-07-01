<template>
  <v-expansion-panels accordion hover multiple focusable>
    <CR />
    <basics />
    <speeds />
  </v-expansion-panels>
</template>

<script>
import Basics from './input/Basics'
import CR from './input/CR'
import Speeds from './input/Speeds'

export default {
  name: 'DataEntry',

  components: {
    Basics,
    CR,
    Speeds
  },
};
</script>
