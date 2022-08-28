import N2W from 'number-to-words'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useSpellLevels() {
  const { t } = useI18n()

  const spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  const ordinalSpellLevels = spellLevels.map((l) => N2W.toOrdinal(l))

  const spellOptions = computed(() =>
    spellLevels.map((l) => {
      return {
        label:
          l === 0
            ? t('editor.spellcasting.slot.cantrip')
            : t('editor.spellcasting.slot.level', {
                ordinal: ordinalSpellLevels[l],
              }),
        value: l,
      }
    })
  )

  return {
    spellLevels,
    ordinalSpellLevels,
    spellOptions,
  }
}
