<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import { useTextRenderer } from './components/rendering/useTextRenderer'

export default defineComponent({
  name: 'App',
  setup() {
    const textRenderer = useTextRenderer()

    provide('textRenderer', textRenderer)
  },
})
</script>
