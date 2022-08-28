import { defineStore } from 'pinia'
import {
  ActionTemplate,
  AttackTemplate,
  DndAttack,
  DndTemplate,
  MonsterAction,
  MonsterTrait,
  Templates,
  TraitTemplate,
} from 'src/components/models'
import { DEFAULT_TEMPLATE_ICON, useTemplates } from 'src/data/TEMPLATES'
import { v4 } from 'uuid'
import { useMonsterStore } from './monster-store'
import _ from 'lodash'
import { useTemplateSubtitles } from 'src/components/rendering/useTemplateSubtitles'

// Updates the v1 templates in place
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateV1Templates(old: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(old).forEach((o: any) => {
    if (o.type === 'Action') {
      const action = o as ActionTemplate
      action.customPreamble = false
      action.crAnnotation.automatic = false

      if (action.limitedUse.rate === 'long or short rest')
        action.limitedUse.rate = 'LONG_OR_SHORT'
      else
        action.limitedUse.rate = action.limitedUse.rate
          .toUpperCase()
          .replace(' ', '_')
    } else if (o.type === 'Attack') {
      const attack = o as AttackTemplate
      attack.customRenderer = ''
      attack.useCustomRenderer = false
      attack.additionalDamage.forEach((d) => {
        d.id = v4()
      })
      attack.kind = attack.kind.toUpperCase() as AttackTemplate['kind']
      attack.distance =
        attack.distance.toUpperCase() as AttackTemplate['distance']
    } else if (o.type === 'Trait') {
      const trait = o as TraitTemplate
      trait.customPreamble = false
      trait.crAnnotation.automatic = false

      if (trait.limitedUse.rate === 'long or short rest')
        trait.limitedUse.rate = 'LONG_OR_SHORT'
      else
        trait.limitedUse.rate = trait.limitedUse.rate
          .toUpperCase()
          .replace(' ', '_')
    }
  })
}

export const useTemplatesStore = defineStore('templates', {
  state: (): Templates => ({
    customTemplates: {},
  }),
  getters: {
    srdTemplates: (): Record<string, DndTemplate> => {
      // this function should only really run once at startup so here goes nothing
      const templates = useTemplates()

      return {
        ...templates.srd_actions,
        ...templates.srd_attacks,
        ...templates.srd_traits,
      }
    },
    allTemplates(): Record<string, DndTemplate> {
      return {
        ...this.srdTemplates,
        ...this.customTemplates,
      }
    },
    allTemplateOptions(): DndTemplate[] {
      // use the option value and text keys
      return _.sortBy(Object.values(this.allTemplates), (t) => t.templateName)
    },
    allTemplateSubtitles(): Record<string, string> {
      const subtitles: Record<string, string> = {}
      const formatters = useTemplateSubtitles()

      this.allTemplateOptions.forEach((t) => {
        if (t.type === 'Action') {
          subtitles[t.templateName] = formatters.actionTemplateSubtitle(t)
        } else if (t.type === 'Attack') {
          subtitles[t.templateName] = formatters.attackTemplateSubtitle(t)
        } else if (t.type === 'Trait') {
          subtitles[t.templateName] = formatters.traitTemplateSubtitle(t)
        }
      })

      return subtitles
    },
  },
  actions: {
    applyTemplate(name: string) {
      if (name in this.allTemplates) {
        // get the monster
        const monsterStore = useMonsterStore()

        // get the template and strip out the extra data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const templateInstance: any = _.cloneDeep(this.allTemplates[name])

        // delete the extras
        const type = templateInstance.type
        delete templateInstance.icon
        delete templateInstance.templateName
        delete templateInstance.type

        // add an id
        templateInstance.id = v4()

        // reassert type based on type
        if (type === 'Attack') {
          const attackInstance = templateInstance as DndAttack
          monsterStore.attacks.push(attackInstance)
        } else if (type === 'Action') {
          const actionInstance = templateInstance as MonsterAction
          monsterStore.actions.push(actionInstance)

          if (actionInstance.legendaryOnly) {
            monsterStore.addLegendaryAction(actionInstance.id)
          }
        } else if (type === 'Trait') {
          const traitInstance = templateInstance as MonsterTrait
          monsterStore.traits.push(traitInstance)
        }
        // add additional template types here
        return true
      }

      return false
    },
    addCustomAction(action: MonsterAction, templateName: string, icon: string) {
      // uh here we go
      const template = _.cloneDeep(action) as unknown as ActionTemplate

      // now we have to make it comply
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (template as any).id // remove the id
      template.type = 'Action'
      template.icon = icon === '' ? DEFAULT_TEMPLATE_ICON.Action : icon
      template.templateName = templateName

      this.addCustomTemplate(template)
    },
    addCustomAttack(attack: DndAttack, templateName: string, icon: string) {
      // uh here we go
      const template = _.cloneDeep(attack) as unknown as AttackTemplate

      // now we have to make it comply
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (template as any).id // remove the id
      template.type = 'Attack'
      template.icon = icon === '' ? DEFAULT_TEMPLATE_ICON.Attack : icon
      template.templateName = templateName

      this.addCustomTemplate(template)
    },
    addCustomTrait(trait: MonsterTrait, templateName: string, icon: string) {
      // uh here we go
      const template = _.cloneDeep(trait) as unknown as TraitTemplate

      // now we have to make it comply
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (template as any).id // remove the id
      template.type = 'Trait'
      template.icon = icon === '' ? DEFAULT_TEMPLATE_ICON.Trait : icon
      template.templateName = templateName

      this.addCustomTemplate(template)
    },
    addCustomTemplate(template: DndTemplate) {
      // this overwrites by default
      this.customTemplates[template.templateName] = template
    },
    deleteCustomTemplate(name: string) {
      if (name in this.customTemplates) {
        delete this.customTemplates[name]
      }
    },
    import(templates: DndTemplate[], overwrite = false) {
      let imported = 0
      let skipped = 0

      templates.forEach((template) => {
        if (!overwrite && template.templateName in this.customTemplates) {
          skipped += 1
          return
        } else {
          this.customTemplates[template.templateName] = template
          imported += 1
        }
      })

      return {
        imported,
        skipped,
      }
    },
    updateFromV1() {
      const oldCustom = localStorage.getItem('app.customTemplates')

      if (oldCustom != null) {
        const old = Object.values(JSON.parse(oldCustom)) as DndTemplate[]

        updateV1Templates(old)
        old.forEach((o: DndTemplate) => {
          this.customTemplates[o.templateName] = o
        })

        // delete the old key
        localStorage.removeItem('app.customTemplates')
      }
    },
  },
  persist: {
    key: 'app.templates',
  },
})
