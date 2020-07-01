<template>
  <v-expansion-panels accordion hover multiple>
    <basics />
  </v-expansion-panels>
</template>

<script>
import Basics from './input/Basics'

export default {
  name: 'DataEntry',

  components: {
    Basics
  },
};
</script>
