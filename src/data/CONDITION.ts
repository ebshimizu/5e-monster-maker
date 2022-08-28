import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import enUsLocale from '../i18n/en-US/index'

export function useConditionDefaults() {
  const { t } = useI18n()
  const conditionDefaults = computed(() => {
    return Object.keys(enUsLocale.condition).map((k: string) =>
      t(`condition.${k}`)
    )
  })

  return {
    conditionDefaults,
  }
}
