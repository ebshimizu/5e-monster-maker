<template>
  <slot :activator-attr="activatorAttr" :menu-attr="menuAttr" />
</template>

<script>
import { debounce } from 'quasar'

// big thanks to @Tofandel over here: https://github.com/quasarframework/quasar/issues/5787
export default {
  name: 'QMenuHover',
  props: {
    debounceTime: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      menu: false,
      activatorHover: false,
      menuHover: false,
      debounceMenu: null,
    }
  },
  computed: {
    activatorAttr() {
      return {
        onMouseenter: () => (this.activatorHover = true),
        onMouseleave: () => (this.activatorHover = false),
      }
    },
    menuAttr() {
      return {
        modelValue: this.menu,
        onMouseenter: () => (this.menuHover = true),
        onMouseleave: () => (this.menuHover = false),
      }
    },
  },
  watch: {
    menuHover() {
      this.debounceMenu()
    },
    activatorHover() {
      this.debounceMenu()
    },
  },
  created() {
    this.debounceMenu = debounce(this.checkMenu, this.debounceTime)
  },
  methods: {
    checkMenu() {
      this.menu = this.activatorHover || this.menuHover
    },
  },
}
</script>
