<template>
  <v-app class="app">
    <dnd-app-bar id="main-nav"></dnd-app-bar>

    <v-main>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="8" class="full-height pa-1" id="editor"
            ><data-entry></data-entry
          ></v-col>
          <v-col cols="4" class="full-height px-6 py-2" id="renderer"
            ><render
          /></v-col>
        </v-row>
      </v-container>
    </v-main>
    <dnd-cr id="footer"></dnd-cr>
  </v-app>
</template>

<script>
import DataEntry from './components/DataEntry';
import DndAppBar from './components/DndAppBar';
import DndCr from './components/input/DndCr';
import Render from './components/Render';

export default {
  name: 'App',
  components: {
    DataEntry,
    DndAppBar,
    DndCr,
    Render,
  },
};
</script>

<style lang="scss">
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
  height: calc(100vh - 215px);
  overflow: auto;
}

.app {
  height: 100%;
  overflow: hidden;
}

@media print {
  #main-nav,
  #editor,
  #footer {
    display: none;
  }

  #renderer {
    max-width: 100% !important;
    flex: 0 0 100% !important;
    height: 100%;
    overflow: visible;
  }

  .v-main {
    padding: 0 !important;
  }
}
</style>
