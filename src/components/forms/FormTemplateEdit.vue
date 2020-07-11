<template>
  <v-card>
    <v-card-title>
      <span class="headline">Manage Custom Templates</span></v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select
            :items="customTemplates"
            v-model="selectedCustomTemplate"
            label="Select a Template"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-btn
            block
            color="red"
            @click="deleteSelectedTemplate"
            :disabled="!selectedCustomTemplate"
            >Delete</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="blue" @click="$emit('close')">Done</v-btn>
      <v-btn text @click.stop="importTemplates">Import</v-btn>
      <v-btn text @click="exportCustomTemplates">Export</v-btn>
    </v-card-actions>
    <v-dialog persistent max-width="400px" v-model="showImportDialog">
      <v-card>
        <v-card-title
          ><span class="headline">Import Custom Templates</span></v-card-title
        >
        <v-card-text>
          Select a .5emmt.json file.
          <v-row>
            <v-col>
              <v-file-input
                v-model="file"
                accept=".5emmt.json"
                label="Load File"
                :error="showFileError"
                :error-messages="fileError"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="showImportDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="green darken-1" text @click="loadFile">Load</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { MUTATION, ACTION } from '../../data/ACTIONS';
import { download } from '../util';

export default {
  name: 'FormTemplateEdit',
  data() {
    return {
      selectedCustomTemplate: null,
      showImportDialog: false,
      file: undefined,
      fileError: '',
      showFileError: false,
    };
  },
  computed: {
    customTemplates() {
      return Object.keys(this.$store.state.customTemplates);
    },
  },
  methods: {
    deleteSelectedTemplate() {
      // do the thing
      this.$store.commit(
        MUTATION.DELETE_CUSTOM_TEMPLATE,
        this.selectedCustomTemplate
      );
      this.selectedCustomTemplate = null;
    },
    exportCustomTemplates() {
      try {
        download(
          JSON.stringify(this.$store.state.customTemplates, null, 2),
          'custom-templates.5emmt.json',
          'application/json'
        );
      } catch (e) {
        console.log(e);
      }
    },
    importTemplates() {
      // this import will overwrite duplicates
      this.file = undefined;
      this.showFileError = false;
      this.fileError = '';

      this.showImportDialog = true;
    },
    loadFile() {
      if (this.file) {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
          try {
            const templates = JSON.parse(e.target.result);

            // I'm going to skip template validation for now
            this.$store.dispatch(ACTION.LOAD_CUSTOM_TEMPLATES, templates);
            this.showImportDialog = false;
          } catch (e) {
            this.fileError = 'Error reading template file';
            this.showFileError = true;
          }
        });

        reader.addEventListener('error', () => {
          this.fileError = 'File upload error';
          this.showFileError = true;
        });

        reader.readAsText(this.file);
      } else {
        this.fileError = 'Select a file to upload';
        this.showFileError = true;
      }
    },
  },
};
</script>
