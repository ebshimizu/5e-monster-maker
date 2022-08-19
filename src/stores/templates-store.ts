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
import { useTemplates } from 'src/data/TEMPLATES'
import { v4 } from 'uuid'
import { useMonsterStore } from './monster-store'
import _ from 'lodash'
import { useTemplateSubtitles } from 'src/components/rendering/useTemplateSubtitles'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

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
