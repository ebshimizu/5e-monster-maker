<template>
  <v-expansion-panels accordion hover multiple focusable>
    <basics />
    <speeds />
    <saves />
    <skills />
    <damage-types />
    <senses />
    <traits />
    <spellcasting />
    <attacks />
    <other-actions />
    <multiattack />
    <legendary-actions />
    <dnd-reactions />
    <lair-actions />
    <regional-effects />
  </v-expansion-panels>
</template>

<script>
import Attacks from './input/Attacks';
import Basics from './input/Basics';
import DamageTypes from './input/DamageTypes';
// import DndCr from './input/DndCr';
import DndReactions from './input/DndReactions';
import LairActions from './input/LairActions.vue';
import LegendaryActions from './input/LegendaryActions';
import Multiattack from './input/Multiattack';
import OtherActions from './input/OtherActions';
import RegionalEffects from './input/RegionalEffects.vue';
import Saves from './input/Saves';
import Senses from './input/Senses';
import Skills from './input/Skills';
import Speeds from './input/Speeds';
import Spellcasting from './input/Spellcasting';
import Traits from './input/Traits';

export default {
  name: 'DataEntry',

  components: {
    Attacks,
    Basics,
    // DndCr,
    DamageTypes,
    DndReactions,
    LegendaryActions,
    Multiattack,
    OtherActions,
    Saves,
    Senses,
    Skills,
    Speeds,
    Spellcasting,
    Traits,
    LairActions,
    RegionalEffects,
  },
};
</script>

RegionalEffects
