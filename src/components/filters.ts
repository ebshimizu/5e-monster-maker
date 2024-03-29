import { QSelect } from 'quasar'
import { Ref, unref } from 'vue'
import { MaybeRef } from '@vueuse/core'
import { SpellOption } from 'src/stores/spells-store'
import { DndTemplate } from './models'

export function basicArrayFilter(
  baseOptions: MaybeRef<string[]>,
  options: Ref<string[]>
) {
  return function (
    val: string,
    update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
  ) {
    update(() => {
      if (val === '') {
        options.value = unref(baseOptions)
      } else {
        const needle = val.toLowerCase()
        options.value = unref(baseOptions).filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        )
      }
    })
  }
}

export function spellArrayFilter(
  baseOptions: MaybeRef<SpellOption[]>,
  options: Ref<SpellOption[]>
) {
  return function (
    val: string,
    update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
  ) {
    update(() => {
      if (val === '') {
        options.value = unref(baseOptions)
      } else {
        const needle = val.toLowerCase()
        options.value = unref(baseOptions).filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        )
      }
    })
  }
}

export function templateArrayFilter(
  baseOptions: MaybeRef<DndTemplate[]>,
  options: Ref<DndTemplate[]>
) {
  return function (
    val: string,
    update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
  ) {
    update(() => {
      if (val === '') {
        options.value = unref(baseOptions)
      } else {
        const needle = val.toLowerCase()
        options.value = unref(baseOptions).filter(
          (v) =>
            v.name.toLowerCase().indexOf(needle) > -1 ||
            v.templateName.toLowerCase().indexOf(needle) > -1
        )
      }
    })
  }
}
