<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>5e Monster Maker</v-toolbar-title> 
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="8"><data-entry /></v-col>
          <v-col cols="4" class="px-6 py-2"><render /></v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DataEntry from './components/DataEntry'
import Render from './components/Render'

export default {
  name: 'App',

  components: {
    DataEntry,
    Render
  },

  data: () => ({
    //
  }),
};
</script>
