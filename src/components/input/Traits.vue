<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Traits</v-expansion-panel-header>
    <v-expansion-panel-content class="pt-4">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels accordion hover multiple focusable>
            <v-expansion-panel
              v-for="(trait, index) in traits"
              :key="trait.id"
              cols="12"
            >
              <v-expansion-panel-header>{{
                trait.name
              }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row align="center">
                  <v-col
                    ><v-text-field
                      v-model="traits[index].name"
                      label="Name"
                      @input="update"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="2">
                    <v-text-field
                      type="number"
                      label="Uses"
                      hint="0 = unlimited"
                      v-model.number="traits[index].limitedUse.count"
                      @input="update"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-combobox
                      :items="rateTypes"
                      v-model="traits[index].limitedUse.rate"
                      label="Reset Type"
                      @input="update"
                    ></v-combobox>
                  </v-col>
                  <v-col cols="1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          fab
                          x-small
                          color="blue"
                          v-on="on"
                          @click.stop="showSaveTemplateDialog(index)"
                          ><v-icon>mdi-content-save</v-icon></v-btn
                        >
                      </template>
                      Save as Template
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      outlined
                      label="Description"
                      persistent-hint
                      hint="Dice rolls can be input if placed in {}s, like {1d6+3}. Other tokens: {DC:INT} for a save based on the indicated stat, {A:STR} for an attack bonus with the indicated stat. Proficiency is assumed."
                      v-model="traits[index].description"
                      @input="update"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined class="pa-0">
                      <v-card-title
                        class="indigo darken-4 overline pt-2 px-2 mb-0 pb-2"
                        >CR Annotations</v-card-title
                      >
                      <v-card-subtitle class="indigo darken-4 px-2 pb-2"
                        >Optional. If a trait does damage, that damage is
                        applied on top of actions taken each round (e.g., a Fire
                        Elemental's Fire Form trait).</v-card-subtitle
                      >
                      <v-card-text>
                        <v-row>
                          <v-col cols="3">
                            <v-switch
                              v-model="traits[index].crAnnotation.include"
                              label="Use for CR"
                              @change="update"
                            ></v-switch>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              type="number"
                              v-model.number="
                                traits[index].crAnnotation.maxDamage
                              "
                              hint="Damage per Use"
                              label="Expected Damage"
                              @input="update"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              type="number"
                              v-model.number="
                                traits[index].crAnnotation.maxSave
                              "
                              label="DC"
                              hint="Use highest if multiple"
                              @input="update"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              type="number"
                              v-model.number="
                                traits[index].crAnnotation.maxModifier
                              "
                              label="Attack Modifier"
                              hint="Use highest if multiple"
                              @input="update"
                            ></v-text-field
                          ></v-col>
                          <v-col cols="2">
                            <v-text-field
                              type="number"
                              v-model.number="
                                traits[index].crAnnotation.ehpModifier
                              "
                              label="EHP Modifier"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="2">
                            <v-text-field
                              type="number"
                              v-model.number="
                                traits[index].crAnnotation.ehpMultiplier
                              "
                              label="EHP Multiplier"
                              @input="update"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="2">
                            <v-text-field
                              type="number"
                              v-model.number="
                                traits[index].crAnnotation.acModifier
                              "
                              @input="update"
                              label="AC Modifier"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3"
                            ><v-switch
                              v-model="traits[index].crAnnotation.multitarget"
                              label="Multitarget"
                              @change="update"
                            ></v-switch
                          ></v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-btn small block color="red" @click="removeTrait(index)"
                      >Delete Trait</v-btn
                    >
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12"
          ><v-btn small color="green" block @click="addTrait"
            >Add Trait</v-btn
          ></v-col
        >
      </v-row>
    </v-expansion-panel-content>
    <v-dialog v-model="showTemplateDialog" max-width="300px" persistent>
      <v-card>
        <v-card-title class="headline">Save Trait as Template</v-card-title>
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
import { MUTATION } from '../../data/ACTIONS';
import { newTrait, traitTemplateSubtitle } from '../util';
import { AT_WILL_DEFAULT_RATES } from '../../data/SPELLS';
import { TEMPLATE_TYPE } from '../../data/TEMPLATES';
import _ from 'lodash';

export default {
  name: 'Traits',
  data() {
    return {
      rateTypes: Object.values(AT_WILL_DEFAULT_RATES),
      showTemplateDialog: false,
      templateSaveName: '',
      templateSaveError: '',
      showTemplateSaveError: false,
      templateSaveIndex: -1,
    };
  },
  computed: {
    traits() {
      return this.$store.state.monster.traits;
    },
  },
  created() {
    this.update = _.debounce(this.debouncedUpdate, 250);
  },
  methods: {
    debouncedUpdate() {
      this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
        key: 'traits',
        value: this.traits,
      });
    },
    addTrait() {
      this.traits.push(newTrait());
      this.update();
    },
    removeTrait(index) {
      this.traits.splice(index, 1);
      this.update();
    },
    showSaveTemplateDialog(index) {
      this.showTemplateDialog = true;
      this.templateSaveName = this.traits[index].name;
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
            ...this.traits[this.templateSaveIndex],
            templateName: this.templateSaveName,
            type: TEMPLATE_TYPE.TRAIT,
            subtitle: traitTemplateSubtitle(
              this.traits[this.templateSaveIndex]
            ),
            icon: "",
          },
        });

        this.showTemplateDialog = false;
      }
    },
  },
};
</script>
