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
    <multiattack />
    <traits />
    <spellcasting />
    <actions />
  </v-expansion-panels>
</template>

<script>
import Actions from './input/Actions';
import Attacks from './input/Attacks';
import Basics from './input/Basics';
import CR from './input/CR';
import DamageTypes from './input/DamageTypes';
import Multiattack from './input/Multiattack';
import Saves from './input/Saves';
import Senses from './input/Senses';
import Skills from './input/Skills';
import Speeds from './input/Speeds';
import Spellcasting from './input/Spellcasting';
import Traits from './input/Traits';

export default {
  name: 'DataEntry',

  components: {
    Actions,
    Attacks,
    Basics,
    CR,
    DamageTypes,
    Multiattack,
    Saves,
    Senses,
    Skills,
    Speeds,
    Spellcasting,
    Traits,
  },
};
</script>
