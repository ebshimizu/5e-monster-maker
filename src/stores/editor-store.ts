import { defineStore } from 'pinia'

export const useEditorStore = defineStore({
  id: 'editor',
  state: () => {
    return {
      statBlockColumns: 1,
    }
  },
  persist: {
    key: 'app.editor',
  },
})
