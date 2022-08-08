<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import { useTextRenderer } from './components/rendering/useTextRenderer'
import { useMonsterStore } from './stores/monster-store'

export default defineComponent({
  name: 'App',
  setup() {
    const textRenderer = useTextRenderer()

    provide('textRenderer', textRenderer)

    // on load validation
    const monsterStore = useMonsterStore()
    monsterStore.validate()
  },
})
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 12px;
  background-color: rgb(18, 18, 18);
}

::-webkit-scrollbar-track {
  margin-left: 2px;
}

::-webkit-scrollbar-thumb {
  background: #505050;
  border: solid 2px #202020;
  border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b6b6b6;
}

.full-height::-webkit-scrollbar,
.v-dialog::-webkit-scrollbar {
  display: block;
}

.v-menu__content::-webkit-scrollbar {
  display: block;
}

@media print {
  #main-nav,
  #editor,
  #footer {
    display: none;
  }

  #splitter {
    overflow: visible;
    height: unset !important;

    .q-splitter__panel.q-splitter__before {
      width: 0px !important;
    }
  }

  #renderer {
    max-width: 100% !important;
    flex: 0 0 100% !important;
    height: 100%;
    overflow: visible;
  }

  .v-main {
    padding: 0 !important;
  }
}
</style>
