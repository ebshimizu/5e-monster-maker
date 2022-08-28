import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import enUsLocale from '../i18n/en-US/index'

export function useRechargeTimes() {
  const { t } = useI18n()
  const rechargeTimeOptions = computed(() => {
    return Object.keys(enUsLocale.recharge).map((k: string) => {
      return { label: t(`recharge.${k}`), value: k }
    })
  })

  return {
    rechargeTimeOptions,
    rechargeTimeKeys: Object.keys(enUsLocale.recharge),
  }
}
