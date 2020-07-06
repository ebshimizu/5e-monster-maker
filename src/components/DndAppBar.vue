<template>
  <v-app-bar app color="primary" dark>
    <v-menu>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon class="mr-1">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="resetDialog = true">
          <v-list-item-title>Reset</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-toolbar-title>5e Monster Maker</v-toolbar-title>
    <v-autocomplete
      flat
      label="Search for an Attack, Action, Trait, or Other Template"
      hide-details
      solo-inverted
      clearable
      v-model="templateBar"
      prepend-inner-icon="mdi-magnify"
      :items="templates"
      item-text="templateName"
      item-value="order"
      class="mx-4"
      @input="applyTemplate"
    >
      <template v-slot:item="data">
        <v-list-item-avatar
          ><v-icon>{{ iconOrDefault(data.item) }}</v-icon></v-list-item-avatar
        >
        <v-list-item-content class="app-search-item"
          ><v-list-item-title>{{ data.item.templateName }}</v-list-item-title
          ><v-list-item-subtitle>{{
            data.item.subtitle
          }}</v-list-item-subtitle></v-list-item-content
        >
        <v-list-item-action>
          <v-chip>{{ data.item.type }}</v-chip>
        </v-list-item-action>
      </template>
    </v-autocomplete>
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
    <v-menu>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon class="mr-1">
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="saveToJson">
          <v-list-item-title>Export JSON (5emm format)</v-list-item-title>
        </v-list-item>
        <v-list-item @click="saveToLatex(false)">
          <v-list-item-title>Export LaTeX (rpgtex, 1 col)</v-list-item-title>
        </v-list-item>
        <v-list-item @click="saveToLatex(true)">
          <v-list-item-title>Export LaTeX (rpgtex, 2 col)</v-list-item-title>
        </v-list-item>
        <v-list-item @click="saveToPng">
          <v-list-item-title>Save as PNG</v-list-item-title>
        </v-list-item>
        <v-list-item @click="copyMarkdown">
          <v-list-item-title>Copy as Markdown (Homebrewery)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="resetDialog" max-width="300px">
      <v-card
        ><v-card-title class="headline">Confirm Reset</v-card-title>
        <v-card-text
          >Are you sure you want to reset all monster data?</v-card-text
        >
        <v-card-actions>
          <v-btn color="green darken-1" text @click="reset">Yes</v-btn>
          <v-btn color="blue darken-1" text @click="resetDialog = false"
            >No</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="messageBar"
      :color="messageBarColor"
      app
      timeout="6000"
      bottom
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
import { saveToLatex } from './latexExporter';
import { renderMarkdown } from './markdownExporter';
import { saveJSON, cloneFromTemplate, saveToPng } from './util';
import { MUTATION } from '../data/ACTIONS';
import { DEFAULT_TEMPLATE_ICON, TEMPLATE_TYPE } from '../data/TEMPLATES';
import { validate } from 'jsonschema';
import SCHEMA from '../data/SCHEMA';
import copy from 'copy-to-clipboard';

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
      templateBar: null,
      templateBarText: '',
      resetDialog: false,
    };
  },
  computed: {
    templates() {
      return this.$store.getters.allTemplates;
    },
  },
  methods: {
    applyTemplate(selected) {
      if (selected === undefined || selected === null) return;

      const template = this.templates[selected];
      console.log(`Adding ${template.templateName} to current monster...`);

      // depends on type
      if (template.type === TEMPLATE_TYPE.ATTACK) {
        // process attack
        const attacks = this.$store.state.monster.attacks;
        attacks.push(cloneFromTemplate(template));
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'attacks',
          value: attacks,
        });
      } else if (template.type === TEMPLATE_TYPE.ACTION) {
        // process action
        const actions = this.$store.state.monster.actions;
        actions.push(cloneFromTemplate(template));
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'actions',
          value: actions,
        });
      } else if (template.type === TEMPLATE_TYPE.TRAIT) {
        // process trait
        const traits = this.$store.state.monster.traits;
        traits.push(cloneFromTemplate(template));
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'traits',
          value: traits,
        });
      }

      this.message(`Added Template: ${template.templateName}`, 'green');
    },
    iconOrDefault(template) {
      if (template.icon && template.icon !== '') {
        return template.icon;
      }

      return DEFAULT_TEMPLATE_ICON[template.type];
    },
    reset() {
      this.$store.commit(MUTATION.RESET);
      this.resetDialog = false;
      this.message('Monster Reset', 'blue');
    },
    saveToJson() {
      saveJSON(
        this.$store.state.monster,
        `${this.$store.state.monster.name}.5emm.json`
      );
    },
    saveToLatex(twoCol) {
      saveToLatex(this.$store, `${this.$store.state.monster.name}.tex`, twoCol);
    },
    saveToPng() {
      saveToPng(`${this.$store.state.monster.name}.png`);
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

          // validate
          if (!monster.saveVersion) {
            this.message('Load Failed: No Version Detected', 'red');
          } else {
            const valid = validate(monster, SCHEMA[monster.saveVersion]);

            if (valid.valid) {
              this.$store.commit(MUTATION.LOAD_MONSTER, monster);
              this.message('Load Successful', 'green');
            } else {
              this.message(
                `Load Failed: version ${monster.saveVersion} did not validate.`,
                'red'
              );
            }
          }

          this.loadFromFileDialog = false;
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
    copyMarkdown() {
      try {
        copy(renderMarkdown(this.$store));
        this.message('Copied Markdown (Homebrewery Format) to Clipboard', 'green');
      } catch (e) {
        this.message('Markdown export failed, check console', 'red');
      }
    },
  },
};
</script>

<style scoped>
.app-search-item {
  width: 2px; /* this fixes the sizing issue with long subtitles an an action??????? */
}
</style>
