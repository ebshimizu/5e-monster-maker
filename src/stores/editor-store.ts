import { defineStore } from 'pinia'

export const useEditorStore = defineStore({
  id: 'editor',
  state: () => {
    return {
      statBlockColumns: 1,
      changelogShown: '',
    }
  },
  persist: {
    key: 'app.editor',
  },
})
