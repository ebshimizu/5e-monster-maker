import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useAttackData() {
  const { t } = useI18n()

  const range = computed(() => {
    return {
      MELEE: t('range.MELEE'),
      RANGED: t('range.RANGED'),
      BOTH: t('range.BOTH'),
    }
  })

  const kind = computed(() => {
    return {
      WEAPON: t('kind.WEAPON'),
      SPELL: t('kind.SPELL'),
    }
  })

  const rangeOptions = computed(() => {
    return Object.entries(range.value).map(([value, label]) => {
      return {
        value,
        label,
      }
    })
  })

  const kindOptions = computed(() => {
    return Object.entries(kind.value).map(([value, label]) => {
      return {
        value,
        label,
      }
    })
  })

  return {
    range,
    kind,
    rangeOptions,
    kindOptions,
  }
}
