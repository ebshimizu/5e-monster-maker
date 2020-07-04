<template>
  <v-app class="app">
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>5e Monster Maker</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="8" class="full-height pa-1"
            ><data-entry></data-entry
          ></v-col>
          <v-col cols="4" class="full-height px-6 py-2"><render /></v-col>
        </v-row>
      </v-container>
    </v-main>
    <dnd-cr></dnd-cr>
  </v-app>
</template>

<script>
import DataEntry from './components/DataEntry';
import DndCr from './components/input/DndCr';
import Render from './components/Render';

export default {
  name: 'App',

  components: {
    DataEntry,
    DndCr,
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
  width: 12px;
  background-color: rgb(18, 18, 18);
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

.v-menu__content::-webkit-scrollbar {
  display: block;
}

.full-height {
  height: calc(100vh - 166px);
  overflow: auto;
}

.app {
  height: 100%;
  overflow: hidden;
}
</style>
