<template>
  <v-expansion-panel>
    <v-expansion-panel-header>CR</v-expansion-panel-header>
    <v-expansion-panel-content>

    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
// CR's kinda complicated. The app will be able to work in multiple modes:
// - manual CR input
// - automatic CR estimation (manual proficiency modifier)
// - automatic CR estimation (alternate computation)
// the estimated CR will be output in this panel as well
export default {
  name: 'CR',
}
</script>