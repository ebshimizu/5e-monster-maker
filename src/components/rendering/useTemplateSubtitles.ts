import { useI18n } from 'vue-i18n'
import { ActionTemplate, AttackTemplate, TraitTemplate } from '../models'

export function useTemplateSubtitles() {
  const { t } = useI18n()

  const attackTemplateSubtitle = (template: AttackTemplate) => {
    // displays a quick damage summary
    const altDamage = `${template.alternateDamage.count}d${template.alternateDamage.dice} + ${template.alternateDamage.modifier.stat} ${template.alternateDamage.type}`
    const plusDamage = template.additionalDamage
      .map((ad) => `${ad.count}d${ad.dice} ${ad.type}`)
      .join(', ')
    const distance = t('editor.attack.distance', [
      t(`range.${template.distance}`),
      t(`kind.${template.kind}`),
    ])

    return `${distance}. ${template.damage.count}d${template.damage.dice} + ${
      template.damage.modifier.stat
    } ${template.damage.type}${
      template.alternateDamage.active ? ` / ${altDamage}` : ''
    }${template.additionalDamage.length > 0 ? ` + ${plusDamage}` : ''}.`
  }

  const actionTemplateSubtitle = (template: ActionTemplate) => {
    // limited use
    const lu =
      template.recharge !== ''
        ? t('editor.template.recharge', [template.recharge])
        : `(${template.limitedUse.count}/${t(
            `recharge.${template.limitedUse.rate.toUpperCase()}`
          )})`
    const showLu = template.limitedUse.count > 0 || template.recharge !== ''

    const description =
      template.stat == null || template.stat === 'none'
        ? template.description
        : `${t(`statFull.${template.stat}`)} Saving Throw: ${template.range}`

    return `${template.legendaryOnly ? t('editor.template.legendary') : ''}${
      showLu ? `${lu}. ` : ''
    }${description}`
  }

  const traitTemplateSubtitle = (template: TraitTemplate) => {
    const lu = `(${template.limitedUse.count}/${t(
      `recharge.${template.limitedUse.rate.toUpperCase()}`
    )})`
    return `${template.limitedUse.count > 0 ? `${lu}. ` : ''}${
      template.description
    }`
  }

  return {
    attackTemplateSubtitle,
    actionTemplateSubtitle,
    traitTemplateSubtitle,
  }
}
