import { validate } from 'jsonschema'
import { useQuasar } from 'quasar'
import { SCHEMA } from 'src/data/SCHEMA'
import { useMonsterStore } from 'src/stores/monster-store'
import { useI18n } from 'vue-i18n'
import { Monster } from '../components/models'
import { popFileDialog } from './popFileDialog'

export function useFileLoader() {
  const $q = useQuasar()
  const { t } = useI18n()

  const loadFile = (file: File) => {
    // we'll want to validate the loaded json against a schema eventually
    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
      try {
        if (e.target != null && e.target.result != null) {
          const monster: any = JSON.parse(e.target.result.toString())

          // validate
          if (!monster.saveVersion) {
            $q.notify({
              color: 'negative',
              message: 'Load Failed: No Version Detected',
              position: 'top',
            })
          } else {
            const valid = validate(monster, SCHEMA[monster.saveVersion])

            if (valid.valid) {
              loadMonster(monster)
            } else {
              $q.notify({
                message: `Load Failed: version ${
                  monster.saveVersion
                } did not validate. Reasons: ${valid.errors
                  .map((e) => e.stack)
                  .join(', ')}`,
                color: 'negative',
                position: 'top',
              })
            }
          }
        }
      } catch (e) {
        console.log(e)

        $q.notify({
          message: 'Load Failed. Check dev console for error',
          color: 'negative',
          position: 'top',
        })
      }
    })

    reader.addEventListener('error', () => {
      console.log('Upload error')

      $q.notify({
        message: 'File failed to upload.',
        color: 'negative',
        position: 'top',
      })
    })

    reader.readAsText(file)
  }

  const updateMonster = (monster: any) => {
    // versioning
    if (monster.saveVersion < 2) {
      // expertise was added to skills
      for (const skill of monster.skills) {
        skill.expertise = false
      }

      // upgrade complete
      monster.saveVersion = 2
    }

    // lair actions were added in v3
    if (monster.saveVersion < 3) {
      monster.lairActions = []
      monster.regionalEffects = []
      monster.regionalEffectDescription = ''

      monster.saveVersion = 3
    }

    // mythic action update
    if (monster.saveVersion < 4) {
      const mythic: Monster['mythicActions'] = {
        triggerName: '',
        triggerRecharge: 'Recharges after a Long or Short Rest',
        triggerDescription: t('presets.mythicDescription'),
        preamble: t('presets.mythicPreamble'),
        actions: [],
      }

      monster.mythicActions = mythic
      monster.saveVersion = 4
    }

    // v5 is a big one, this was the app version 1 -> 2 upgrade
    if (monster.saveVersion < 5) {
      // add missing fields
      monster.useArticleInToken = false
      monster.proficiencyOverride = false
      monster.hpModifierOverride = false
      monster.hpDieTypeOverride = false

      // skill conversion
      const newSkills = []
      for (const skill of monster.skills) {
        newSkills.push({
          ...skill,
          skill: {
            stat: skill.skill.stat,
            label: skill.skill.key,
          },
          key: skill.skill.key.toUpperCase(),
        })
      }

      monster.skills = newSkills

      // traits
      for (const trait of monster.traits) {
        trait.customPreamble = false
        trait.limitedUse.rate = trait.limitedUse.rate.toUpperCase()
        trait.crAnnotation.automatic = false // 4 -> 5 conversion shouldn't assume this
      }

      // spellcasting
      monster.spellcasting.useCustomClassPreamble = false
      monster.spellcasting.customClassPreamble = ''
      monster.spellcasting.useCustomInnatePreamble = false
      monster.spellcasting.customInnatePreamble = ''

      // attacks
      for (const attack of monster.attacks) {
        attack.useCustomRenderer = false
        attack.customRenderer = ''
        attack.kind = attack.kind.toUpperCase()
        attack.distance = attack.distance.toUpperCase()
      }

      // actions
      for (const action of monster.actions) {
        action.customPreamble = false
        action.limitedUse.rate = action.limitedUse.rate.toUpperCase()
        action.crAnnotation.automatic = false
      }

      // multiattack options
      monster.multiattackOptions = {
        useCustomRenderer: false,
        customMultiattackRenderer: '',
        postscript: '',
      }

      // legendary actions
      monster.legendaryActions.useCustomPreamble = false
      monster.legendaryActions.customPreamble = ''

      // lair actions
      monster.useCustomLairActionPreamble = false
      monster.lairActionPreamble = ''
      for (const la of monster.lairActions) {
        la.crAnnotation.automatic = false
      }

      monster.autoEstimateDefenseCr = true
      monster.saveVersion = 5
    }

    // adjust saves in the attack field. null is ok but let's make it 0
    for (const attack of monster.attacks) {
      if (attack.save === null) attack.save = 0
    }

    // trait and action limited use, check for empty string
    for (const trait of monster.traits) {
      if (trait.limitedUse.count === '') trait.limitedUse.count = 0
    }

    for (const action of monster.actions) {
      if (action.limitedUse.count === '') action.limitedUse.count = 0
    }
  }

  const loadMonster = (data: any) => {
    updateMonster(data)

    // one more validation for the road, use the most recent version
    const monster = data as Monster
    const valid = validate(data, SCHEMA['5'])

    if (!valid.valid) {
      console.error(valid.errors.map((e) => e.toString()))

      $q.notify({
        message:
          'Monster failed to validate after update. Please submit a bug report and include the monster file.',
        color: 'negative',
      })

      $q.notify({
        message: `Errors: ${valid.errors.map((e) => e.toString()).join('\n')}`,
        color: 'negative',
      })
    } else {
      // update the store
      const monsterStore = useMonsterStore()
      monsterStore.$state = monster

      $q.notify({
        color: 'positive',
        message: 'Load Successful',
        position: 'top',
      })
    }
  }

  return {
    loadFile,
    loadMonster,
  }
}
