<template>
  <q-page class="row items-start">
    <q-splitter
      v-model="splitterModel"
      style="height: calc(100vh - 50px); width: 100%"
    >
      <template v-slot:before>
        <!-- todo: editing panels go here -->
        <div class="q-pa-md" style="width: 100%">
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="perm_identity"
              label="Basics"
              caption="Essential Monster Stats"
            >
              <q-card>
                <q-input v-model="monster.name" label="Name" />
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </template>

      <template v-slot:after>
        <!-- todo: stat block renderer goes here -->
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Renderer</div>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script lang="ts">
import { useMonsterStore } from 'src/stores/monster-store';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const splitterModel = ref(66);
    const monster = useMonsterStore();

    return {
      splitterModel,
      monster,
    };
  },
});
</script>
