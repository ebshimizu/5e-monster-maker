import { defineStore } from 'pinia'
import {
  ActionTemplate,
  AttackTemplate,
  DndTemplate,
  Templates,
  TraitTemplate,
} from 'src/components/models'
import { useTemplates } from 'src/data/TEMPLATES'
import { v4 } from 'uuid'

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
      return Object.values(this.allTemplates)
    },
  },
  actions: {
    updateFromV1() {
      const oldCustom = localStorage.getItem('app.customTemplates')

      if (oldCustom != null) {
        const old = JSON.parse(oldCustom)

        Object.values(old).forEach((o: any) => {
          if (o.type === 'Action') {
            const action = o as ActionTemplate
            action.customPreamble = false
            action.crAnnotation.automatic = false
            action.templateName = action.templateName.toLowerCase()

            // direct overwrite
            this.customTemplates[action.templateName] = action
          } else if (o.type === 'Attack') {
            const attack = o as AttackTemplate
            attack.customRenderer = ''
            attack.useCustomRenderer = false
            attack.additionalDamage.forEach((d) => {
              d.id = v4()
            })
            attack.templateName = attack.templateName.toLowerCase()

            this.customTemplates[attack.templateName] = attack
          } else if (o.type === 'Trait') {
            const trait = o as TraitTemplate
            trait.customPreamble = false
            trait.crAnnotation.automatic = false
            trait.templateName = trait.templateName.toLowerCase()

            this.customTemplates[trait.templateName] = trait
          }
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
