import { validate } from 'jsonschema'
import { useQuasar } from 'quasar'
import { SCHEMA } from 'src/data/SCHEMA'
import { useMonsterStore } from 'src/stores/monster-store'
import { useSpellsStore } from 'src/stores/spells-store'
import { useI18n } from 'vue-i18n'
import { Monster, MonsterAction, MonsterReaction } from '../models'

export function useFileLoader() {
  const $q = useQuasar()
  const spellStore = useSpellsStore()
  const { t } = useI18n()

  const loadFile = (file: File) => {
    // we'll want to validate the loaded json against a schema eventually
    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
      try {
        if (e.target != null && e.target.result != null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const monster: any = JSON.parse(e.target.result.toString())

          // validate
          if (!monster.saveVersion) {
            $q.notify({
              type: 'negative',
              message: t('io.error.version'),
            })
          } else {
            const valid = validate(monster, SCHEMA[monster.saveVersion])

            if (valid.valid) {
              loadMonster(monster)
            } else {
              $q.notify({
                message: t('io.error.validation', [
                  monster.saveVersion,
                  valid.errors.map((e) => e.stack).join(', '),
                ]),
                type: 'negative',
              })
            }
          }
        }
      } catch (e) {
        console.log(e)

        $q.notify({
          message: t('io.error.unknown'),
          type: 'negative',
        })
      }
    })

    reader.addEventListener('error', () => {
      console.log('Upload error')

      $q.notify({
        message: t('io.error.upload'),
        color: 'negative',
        position: 'top',
      })
    })

    reader.readAsText(file)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        if (trait.limitedUse.rate === 'long or short rest') {
          trait.limitedUse.rate = 'LONG_OR_SHORT'
        } else {
          trait.limitedUse.rate = trait.limitedUse.rate
            .toUpperCase()
            .replace(' ', '_')
        }
        trait.crAnnotation.automatic = false // 4 -> 5 conversion shouldn't assume this
      }

      // spellcasting
      for (const spells of monster.spellcasting.atWill) {
        if (spells.rate === 'long or short rest') {
          spells.rate = 'LONG_OR_SHORT'
        } else {
          spells.rate = spells.rate.toUpperCase().replace(' ', '_')
        }
      }

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

        if (action.limitedUse.rate === 'long or short rest') {
          action.limitedUse.rate = 'LONG_OR_SHORT'
        } else {
          action.limitedUse.rate = action.limitedUse.rate
            .toUpperCase()
            .replace(' ', '_')
        }
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

    // v6 adds a bonus action toggle to actions
    // and adds a field for a visual CR override
    if (monster.saveVersion < 6) {
      monster.actions.forEach((a: MonsterAction) => {
        a.bonusAction = false
      })

      // trait sorting
      monster.alphaTrait = false

      // cr visual override
      monster.useCrDisplayOverride = false
      monster.crOverride = ''

      monster.saveVersion = 6
    }

    // version 7 adds a notes field for the senses
    if (monster.saveVersion < 7) {
      monster.sensesNotes = ''
      monster.saveVersion = 7
    }

    // version 8 adds a notes field for the monster's inventory
    if (monster.saveVersion < 8) {
      monster.inventory = ''
      monster.saveVersion = 8
    }

    // version 9 is the big 2024 monster file format update
    if (monster.saveVersion < 9) {
      // update actions
      monster.actions = monster.actions.map((a: MonsterAction) => {
        return {
          ...a,
          stat: 'none',
          save: {
            override: false,
            overrideValue: 0,
          },
          effects: [],
          range: '',
        }
      })

      // update reactions
      monster.reactions = monster.reactions.map((r: MonsterReaction) => {
        return {
          ...r,
          limitedUse: {
            count: 1,
            rate: 'DAY',
          },
          trigger: '',
        }
      })

      // update format
      monster.format = '2014'

      // increment file version
      monster.saveVersion = 9
    }

    if (monster.saveVersion < 10) {
      // update a couple basic fields
      monster.lairCr = -1
      monster.lairCrNote = 'in lair'
      monster.nickname = ''

      monster.saveVersion = 10
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

  const validateSpells = (monster: Monster) => {
    // checks that the given keys exist in the spell list
    const invalid = monster.spellcasting.standard.filter(
      (id) => !(id in spellStore.allSpells)
    )

    monster.spellcasting.standard = monster.spellcasting.standard.filter(
      (id) => id in spellStore.allSpells
    )

    for (const atWill of monster.spellcasting.atWill) {
      const inv = atWill.spells.filter((id) => !(id in spellStore.allSpells))
      invalid.push(...inv)

      atWill.spells = atWill.spells.filter((id) => id in spellStore.allSpells)
    }

    if (invalid.length > 0) {
      $q.notify({
        message: t('io.warn.spell', [invalid.join(', ')]),
        timeout: 0,
        type: 'warning',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        actions: [{ label: t('editor.ok'), color: 'white' }],
      })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadMonster = (data: any) => {
    updateMonster(data)

    // one more validation for the road, use the most recent version
    const monster = data as Monster
    const valid = validate(data, SCHEMA['9'])

    if (!valid.valid) {
      console.error(valid.errors.map((e) => e.toString()))

      $q.notify({
        message: t('io.error.update'),
        type: 'negative',
      })

      $q.notify({
        message: t('io.error.validationList', [
          valid.errors.map((e) => e.toString()).join('\n'),
        ]),
        type: 'negative',
        timeout: 0,
        actions: [{ label: t('editor.ok'), color: 'white' }],
      })
    } else {
      // VALIDATE SPELLS FIRST
      validateSpells(monster)

      // update the store
      const monsterStore = useMonsterStore()
      monsterStore.$state = monster

      $q.notify({
        type: 'positive',
        message: t('io.success'),
      })
    }
  }

  return {
    loadFile,
    loadMonster,
    updateMonster,
  }
}
