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
      <v-btn text @click="exportCustomTemplates">Export</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
import { download } from '../util';

export default {
  name: 'FormTemplateEdit',
  data() {
    return {
      selectedCustomTemplate: null,
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
  },
};
</script>
