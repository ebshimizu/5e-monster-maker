<template>
  <v-expansion-panels accordion hover multiple focusable>
    <dnd-cr />
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
    <dnd-reactions />
  </v-expansion-panels>
</template>

<script>
import Attacks from './input/Attacks';
import Basics from './input/Basics';
import DamageTypes from './input/DamageTypes';
import DndCr from './input/DndCr';
import DndReactions from './input/DndReactions';
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
    DndCr,
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
  },
};
</script>
