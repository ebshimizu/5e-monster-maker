<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>5e Monster Maker</v-toolbar-title>
    <v-autocomplete
      flat
      label="Search for an Attack, Action, Trait, or Other Template"
      hide-details
      solo-inverted
      class="mx-4"
    ></v-autocomplete>
    <v-dialog v-model="loadFromFileDialog" persistent max-width="300px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on"
          ><v-icon>mdi-folder-open</v-icon></v-btn
        >
      </template>
      <v-card>
        <v-card-title
          ><span class="headline">Load From File</span></v-card-title
        >
        <v-card-text>
          <v-row>
            <v-col>
              <v-file-input
                v-model="file"
                :loading="fileLoading"
                accept=".5emm.json"
                label="Load File"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="loadFromFileDialog = false"
            >Close</v-btn
          >
          <v-btn color="green darken-1" text @click="loadFile">Load</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn icon @click="saveToJson" class="mr-1"
      ><v-icon>mdi-download</v-icon></v-btn
    >
    <v-snackbar
      v-model="messageBar"
      :color="messageBarColor"
      app
      timeout="6000"
      top
      >{{ messageText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="messageBar = false">
          Close
        </v-btn></template
      ></v-snackbar
    >
  </v-app-bar>
</template>

<script>
import { saveJSON } from './util';
import { MUTATION } from '../data/ACTIONS';
export default {
  name: 'DndAppBar',
  data() {
    return {
      loadFromFileDialog: false,
      file: null,
      fileLoading: false,
      messageBar: false,
      messageBarColor: 'green',
      messageText: '',
    };
  },
  methods: {
    saveToJson() {
      saveJSON(
        this.$store.state.monster,
        `${this.$store.state.monster.name}.5emm.json`
      );
    },
    loadCleanup() {
      this.fileLoading = false;
      this.file = null;
    },
    loadFile() {
      this.fileLoading = true;

      // we'll want to validate the loaded json against a schema eventually
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        try {
          const monster = JSON.parse(e.target.result);
          this.$store.commit(MUTATION.LOAD_MONSTER, monster);
          this.loadFromFileDialog = false;

          this.message('Load Successful', 'green');
          this.loadCleanup();
        } catch (e) {
          console.log(e);
          this.loadFromFileDialog = false;

          this.message('Load Failed', 'red');
          this.loadCleanup();
        }
      });

      reader.addEventListener('error', () => {
        console.log('Upload error');
        this.loadFromFileDialog = false;

        this.message('Load Failed', 'red');
        this.loadCleanup();
      });

      reader.readAsText(this.file);
    },
    message(message, color) {
      this.messageBarColor = color;
      this.messageText = message;
      this.messageBar = true;
    },
  },
};
</script>
