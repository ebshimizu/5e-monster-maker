<template>
  <a
    :href="`https://github.com/ebshimizu/5e-monster-maker/issues/${issue}`"
    target="_blank"
    >#{{ issue }}</a
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GithubIssueLink',
  props: {
    issue: {
      type: Number,
      required: true,
    },
  },
})
</script>
