import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import enUsLocale from '../i18n/en-US/index'

export function useDamageTypeDefaults() {
  const { t } = useI18n()
  const damageTypeDefaults = computed(() => {
    return Object.keys(enUsLocale.damageType).map((k: string) =>
      t(`damageType.${k}`)
    )
  })

  return {
    damageTypeDefaults,
  }
}

export function useAttackTypeDefaults() {
  const { t } = useI18n()
  const attackTypeDefaults = computed(() => {
    return Object.keys(enUsLocale.attackType).map((k: string) =>
      t(`attackType.${k}`)
    )
  })

  return {
    attackTypeDefaults,
  }
}
