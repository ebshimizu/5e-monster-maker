<template>
  <v-expansion-panels accordion hover multiple focusable>
    <CR />
    <basics />
    <speeds />
    <saves />
    <skills />
    <damage-types />
    <senses />
    <attacks />
    <other-actions />
    <multiattack />
    <spellcasting />
    <traits />
    <legendary-actions />
  </v-expansion-panels>
</template>

<script>
import Attacks from './input/Attacks';
import Basics from './input/Basics';
import CR from './input/CR';
import DamageTypes from './input/DamageTypes';
import LegendaryActions from './input/LegendaryActions';
import Multiattack from './input/Multiattack';
import OtherActions from './input/OtherActions';
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
    CR,
    DamageTypes,
    LegendaryActions,
    Multiattack,
    OtherActions,
    Saves,
    Senses,
    Skills,
    Speeds,
    Spellcasting,
    Traits,
  },
};
</script>
