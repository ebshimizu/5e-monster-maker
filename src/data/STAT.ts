import { DndStat } from 'src/components/models'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useStats() {
  const { t } = useI18n()

  const statOptions = computed<Record<DndStat, string>>(() => {
    return {
      STR: t('statFull.STR'),
      DEX: t('statFull.DEX'),
      CON: t('statFull.CON'),
      INT: t('statFull.INT'),
      WIS: t('statFull.WIS'),
      CHA: t('statFull.CHA'),
    }
  })

  // TODO: come back and lift this out if a different component needs it
  const statOptionsShort = ['STR', 'CON', 'DEX', 'INT', 'WIS', 'CHA']

  return { statOptions, statOptionsShort }
}
