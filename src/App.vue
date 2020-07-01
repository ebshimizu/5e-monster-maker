<template>
  <v-app class="app">
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>5e Monster Maker</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="8" class="full-height pa-1"><data-entry /></v-col>
          <v-col cols="4" class="full-height px-6 py-2"><render /></v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DataEntry from './components/DataEntry';
import Render from './components/Render';

export default {
  name: 'App',

  components: {
    DataEntry,
    Render,
  },

  data: () => ({
    //
  }),
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  margin-left: 2px;
}

::-webkit-scrollbar-thumb {
  background: #505050;
  border: solid 2px #202020;
  border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b6b6b6;
}

.full-height::-webkit-scrollbar {
  display: block;
}

.full-height {
  height: calc(100vh - 90px);
  overflow: auto;
}

.app {
  height: 100%;
  overflow: hidden;
}
</style>
