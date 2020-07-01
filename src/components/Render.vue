<template>
  <v-sheet width="100%" elevation="6" color="gray darken-2" class="pa-2">
    <h2>{{ name }}</h2>
  </v-sheet>
</template>

<script>
export default {
  name: 'Render',
  computed: {
    name: {
      get() {
        return this.$store.state.monster.name;
      }
    }
  }
};
</script>
