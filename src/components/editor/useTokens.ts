import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useTokens() {
  const { t } = useI18n()

  // token definitions
  const saveTokens = computed(() => [
    {
      label: t('monster.stat.STR'),
      token: '{DC:STR}',
    },
    {
      label: t('monster.stat.DEX'),
      token: '{DC:DEX}',
    },
    {
      label: t('monster.stat.CON'),
      token: '{DC:CON}',
    },
    {
      label: t('monster.stat.INT'),
      token: '{DC:INT}',
    },
    {
      label: t('monster.stat.WIS'),
      token: '{DC:WIS}',
    },
    {
      label: t('monster.stat.CHA'),
      token: '{DC:CHA}',
    },
  ])

  const attackTokens = computed(() => [
    {
      label: t('monster.stat.STR'),
      token: '{A:STR}',
    },
    {
      label: t('monster.stat.DEX'),
      token: '{A:DEX}',
    },
    {
      label: t('monster.stat.CON'),
      token: '{A:CON}',
    },
    {
      label: t('monster.stat.INT'),
      token: '{A:INT}',
    },
    {
      label: t('monster.stat.WIS'),
      token: '{A:WIS}',
    },
    {
      label: t('monster.stat.CHA'),
      token: '{A:CHA}',
    },
  ])

  const monsterTokens = computed(() => [
    {
      label: t('monster.proficiencyBonus'),
      token: '{monster.proficiency}',
    },
    {
      label: t('monster.ac'),
      token: '{monster.AC}',
    },
  ])

  const traitTokens = computed(() => [
    {
      label: t('monster.trait.name'),
      token: '{trait.name}',
    },
    {
      label: t('monster.trait.limitedUse.label'),
      token: '{trait.limitedUse}',
    },
    {
      label: t('monster.trait.limitedUse.count'),
      token: '{trait.limitedUse.count}',
    },
    {
      label: t('monster.trait.limitedUse.rate'),
      token: '{trait.limitedUse.rate}',
    },
  ])

  return {
    attackTokens,
    saveTokens,
    monsterTokens,
    traitTokens,
  }
}
