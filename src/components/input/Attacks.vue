<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Attacks</v-expansion-panel-header>
    <v-expansion-panel-content class="pt-4">
      <v-row
        ><v-col cols="12">
          <v-expansion-panels accordion hover multiple focusable>
            <attack-panel
              v-for="(item, index) in attacks"
              :key="item.id"
              :attack="item"
              :index="index"
              v-on:save-template="showSaveTemplateDialog"
            ></attack-panel> </v-expansion-panels></v-col
        ><v-col cols="12">
          <v-btn block small color="green" @click="addAttack" class="mb-2"
            >Add Attack</v-btn
          ></v-col
        ></v-row
      >
    </v-expansion-panel-content>
    <v-dialog v-model="showTemplateDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="headline">Save Attack as Template</v-card-title>
        <v-card-subtitle>Template names must be unique</v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="templateSaveName"
            :error="showTemplateSaveError"
            :error-messages="templateSaveError"
            label="Template Name"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="green" @click="saveTemplate">Save</v-btn>
          <v-btn text color="blue" @click="showTemplateDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-expansion-panel>
</template>

<script>
import AttackPanel from './AttackPanel';
import { MUTATION } from '../../data/ACTIONS';
import { attackTemplateSubtitle } from '../util';
import { TEMPLATE_TYPE } from '../../data/TEMPLATES';

export default {
  name: 'Attacks',
  components: {
    AttackPanel,
  },
  data() {
    return {
      showTemplateDialog: false,
      templateSaveName: '',
      templateSaveError: '',
      showTemplateSaveError: false,
      templateSaveIndex: -1,
    };
  },
  computed: {
    attacks() {
      return this.$store.state.monster.attacks;
    },
  },
  methods: {
    addAttack() {
      this.$store.commit(MUTATION.ADD_ATTACK);
    },
    showSaveTemplateDialog(index) {
      this.showTemplateDialog = true;
      this.templateSaveName = this.attacks[index].name;
      this.templateSaveIndex = index;
    },
    saveTemplate() {
      // check names
      if (this.templateSaveName in this.$store.state.customTemplates) {
        this.templateSaveError =
          'A custom template with this name already exists.';
        this.showTemplateSaveError = true;
      } else {
        this.$store.commit(MUTATION.ADD_CUSTOM_TEMPLATE, {
          id: this.templateSaveName,
          template: {
            ...this.attacks[this.templateSaveIndex],
            templateName: this.templateSaveName,
            type: TEMPLATE_TYPE.ATTACK,
            subtitle: attackTemplateSubtitle(
              this.attacks[this.templateSaveIndex]
            ),
            icon: '',
          },
        });

        this.showTemplateDialog = false;
      }
    },
  },
};
</script>
