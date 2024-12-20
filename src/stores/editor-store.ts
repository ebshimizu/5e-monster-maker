import { defineStore } from 'pinia'

export const useEditorStore = defineStore({
  id: 'editor',
  state: () => {
    return {
      statBlockColumns: 1,
      changelogShown: '',
      style: '2024',
    }
  },
  persist: {
    key: 'app.editor',
  },
})
