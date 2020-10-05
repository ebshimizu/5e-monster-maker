<template>
  <v-app-bar app color="primary" dark>
    <v-menu>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon class="mr-1">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click.stop="newSpellDialog = true">
          <v-list-item-title>Add Custom Spell</v-list-item-title>
        </v-list-item>
        <v-list-item @click.stop="editSpellDialog = true">
          <v-list-item-title>Manage Custom Spells</v-list-item-title>
        </v-list-item>
        <v-list-item @click.stop="manageTemplateDialog = true">
          <v-list-item-title>Manage Custom Templates</v-list-item-title>
        </v-list-item>
        <v-list-item @click.stop="resetDialog = true">
          <v-list-item-title>Reset Monster</v-list-item-title>
        </v-list-item>
        <v-list-item @click.stop="crTableDialog = true">
          <v-list-item-title>Show CR Table</v-list-item-title>
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
          Select a .5emm.json file.
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
            >Cancel</v-btn
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
        <v-list-item @click="downloadMarkdown">
          <v-list-item-title>Export Markdown (Homebrewery)</v-list-item-title>
        </v-list-item>
        <v-list-item @click="saveToLatex(false)">
          <v-list-item-title>Export LaTeX (rpgtex, 1 col)</v-list-item-title>
        </v-list-item>
        <v-list-item @click="saveToLatex(true)">
          <v-list-item-title>Export LaTeX (rpgtex, 2 col)</v-list-item-title>
        </v-list-item>
        <v-list-item @click="copyMarkdown">
          <v-list-item-title
            >Copy Markdown to Clipboard (Homebrewery)</v-list-item-title
          >
        </v-list-item>
        <v-list-item @click="saveToPng">
          <v-list-item-title>Save as PNG</v-list-item-title>
        </v-list-item>
        <v-list-item @click="copyLink">
          <v-list-item-title>Copy 5emm Link</v-list-item-title>
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
    <v-dialog v-model="loadFromParamDialog" max-width="400px">
      <v-card
        ><v-card-title class="headline">Load From URL</v-card-title>
        <v-card-text
          >You are about to load the
          <strong>{{ paramMonsterName }}</strong> monster. This will overwrite
          your current monster. Proceed?</v-card-text
        >
        <v-card-actions>
          <v-btn color="green darken-1" text @click="loadFromDataParam"
            >Yes</v-btn
          >
          <v-btn color="blue darken-1" text @click="cancelParamLoad">No</v-btn>
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
    <v-dialog max-width="800px" v-model="crTableDialog">
      <v-card>
        <v-card-title>
          <span class="headline">CR Table</span>
        </v-card-title>
        <v-card-text>
          <v-data-table
            dense
            hide-default-footer
            disable-pagination
            fixed-header
            :headers="crHeaders"
            :items="crData"
            item-key="cr"
          ></v-data-table>
          <v-card-actions>
            <v-btn color="blue" text @click="crTableDialog = false"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent max-width="600px" v-model="newSpellDialog">
      <form-spell-new @close="newSpellDialog = false" />
    </v-dialog>
    <v-dialog persistent max-width="600px" v-model="editSpellDialog">
      <form-spell-edit @close="editSpellDialog = false" />
    </v-dialog>
    <v-dialog persistent max-width="600px" v-model="manageTemplateDialog">
      <form-template-edit @close="manageTemplateDialog = false" />
    </v-dialog>
  </v-app-bar>
</template>

<script>
import { saveToLatex } from './latexExporter';
import { renderMarkdown } from './markdownExporter';
import {
  saveJSON,
  cloneFromTemplate,
  saveToPng,
  download,
  renderBonus,
} from './util';
import { MUTATION } from '../data/ACTIONS';
import { DEFAULT_TEMPLATE_ICON, TEMPLATE_TYPE } from '../data/TEMPLATES';
import { validate } from 'jsonschema';
import SCHEMA from '../data/SCHEMA';
import copy from 'copy-to-clipboard';
import { CR } from '../data/CR';
import jsonurl from 'json-url';

const codec = jsonurl('lzma');

import FormSpellNew from './forms/FormSpellNew';
import FormSpellEdit from './forms/FormSpellEdit';
import FormTemplateEdit from './forms/FormTemplateEdit';

export default {
  name: 'DndAppBar',
  components: {
    FormSpellNew,
    FormSpellEdit,
    FormTemplateEdit,
  },
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
      crTableDialog: false,
      newSpellDialog: false,
      editSpellDialog: false,
      manageTemplateDialog: false,
    };
  },
  computed: {
    templates() {
      return this.$store.getters.allTemplates;
    },
    crData() {
      const formatted = CR.map((cr) => {
        return {
          ...cr,
          hp: `${cr.hpMin} - ${cr.hpMax}`,
          damage: `${cr.dprMin} - ${cr.dprMax}`,
          profBonus: renderBonus(cr.proficiency),
          bonus: renderBonus(cr.attack),
        };
      });

      formatted[0].ac = '<= 13';
      formatted[0].saveDc = '<= 13';
      formatted[0].bonus = '<= +3';

      return formatted;
    },
    crHeaders() {
      return [
        { text: 'CR', value: 'cr', sortable: false },
        { text: 'Prof. Bonus', value: 'profBonus', sortable: false },
        { text: 'Armor Class', value: 'ac', sortable: false },
        { text: 'Hit Points', value: 'hp', sortable: false },
        { text: 'Attack Bonus', value: 'bonus', sortable: false },
        { text: 'Damage/Round', value: 'damage', sortable: false },
        { text: 'Save DC', value: 'saveDc', sortable: false },
      ];
    },
    loadFromParamDialog() {
      return this.$store.state.dataParam !== null;
    },
    paramMonsterName() {
      return this.$store.state.dataParam
        ? this.$store.state.dataParam.name
        : '[No Name Found]';
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
    async copyLink() {
      // encode json string as base64
      try {
        const b64 = await codec.compress(
          JSON.stringify(this.$store.state.monster)
        );
        copy(
          `${window.location.origin}${window.location.pathname}?data=${b64}`
        );
        this.message('Copied Sharable Link to Clipboard', 'green');
      } catch (e) {
        this.message('Error encoding url. Check console for details.', 'red');
        console.log(e);
      }
    },
    loadCleanup() {
      this.fileLoading = false;
      this.file = null;
    },
    loadFromDataParam() {
      // we have a valid json object here, but need to check against our schema
      const monster = this.$store.state.dataParam;

      try {
        // validate
        if (!monster.saveVersion) {
          this.message('Load Failed: No Version Detected', 'red');
        } else {
          const valid = validate(monster, SCHEMA[monster.saveVersion]);

          if (valid.valid) {
            this.$store.commit(MUTATION.LOAD_MONSTER, monster);
            this.message('Load Successful', 'green');
            this.$store.commit(MUTATION.SET_DATA_PARAM, null);
          } else {
            this.message(
              `Load Failed: version ${monster.saveVersion} did not validate.`,
              'red'
            );
          }
        }
      } catch (e) {
        console.log(e);
        this.$store.commit(MUTATION.SET_DATA_PARAM, null);

        this.message('Load Failed. See console for details.', 'red');
      }

      window.location.href = `${window.location.origin}${window.location.pathname}`;
    },
    cancelParamLoad() {
      // delete data param
      this.$store.commit(MUTATION.SET_DATA_PARAM, null);
      window.location.href = `${window.location.origin}${window.location.pathname}`;
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
    downloadMarkdown() {
      try {
        download(
          renderMarkdown(this.$store),
          `${this.$store.state.monster.name}.md`,
          'text/markdown'
        );
      } catch (e) {
        console.log(e);
        this.message('Markdown export failed, check console', 'red');
      }
    },
    copyMarkdown() {
      try {
        copy(renderMarkdown(this.$store));
        this.message(
          'Copied Markdown (Homebrewery Format) to Clipboard',
          'green'
        );
      } catch (e) {
        console.log(e);
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
