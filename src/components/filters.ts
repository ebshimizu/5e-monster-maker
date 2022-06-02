import { QSelect } from 'quasar'
import { Ref } from 'vue'

export function basicArrayFilter(
  baseOptions: string[],
  options: Ref<string[]>
) {
  return function (
    val: string,
    update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
  ) {
    update(() => {
      if (val === '') {
        options.value = baseOptions
      } else {
        const needle = val.toLowerCase()
        options.value = baseOptions.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        )
      }
    })
  }
}
