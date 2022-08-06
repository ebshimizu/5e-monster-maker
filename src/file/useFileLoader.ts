import { validate } from 'jsonschema'
import { useQuasar } from 'quasar'
import { SCHEMA } from 'src/data/SCHEMA'
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

              $q.notify({
                color: 'positive',
                message: 'Load Successful',
                position: 'top',
              })
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

  const loadFromDialog = async () => {
    const file = await popFileDialog()

    if (file != null) {
      loadFile(file)
    }
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
      // oof
    }

    // adjust saves in the attack field. null is ok but let's make it 0
    for (const attack of monster.attacks) {
      if (attack.save === null) attack.save = 0
    }
  }

  const loadMonster = (data: any) => {
    updateMonster(data)

    // update the store
  }

  return {
    loadFromDialog,
    loadFile,
    loadMonster,
  }
}
