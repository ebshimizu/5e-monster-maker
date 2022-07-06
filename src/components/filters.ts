import { QSelect } from 'quasar'
import { Ref, unref } from 'vue'
import { MaybeRef } from '@vueuse/core'

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