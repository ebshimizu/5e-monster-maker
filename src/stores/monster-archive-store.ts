import { defineStore } from 'pinia'
import { validate } from 'jsonschema'
import { useMonsterStore } from './monster-store';
// import { useFileLoader } from 'src/components/file/useFileLoader'
import { SCHEMA } from 'src/data/SCHEMA'
import {
  Monster,
  MonsterArchive,
  MonsterEntry,
} from 'src/components/models'
const monsterStore = useMonsterStore();
// const fileLoader = useFileLoader();

export const useMonsterArchiveStore = defineStore('monster-archive', {
  state: (): MonsterArchive => ({
    monsters: {}
  }),
  getters: {
    allMonsters: (state): Record<string, MonsterEntry> => {
      return state.monsters;
    },
    savedMonsters: (state): Record<string, Monster> | object => {
      return state.monsters;
    }
  },
  actions: {

    /**
     * Adds a copy of the monster to the archive store.
     * 
     * @param monster Monster
     *   The monster to save.
     * @param overwrite 
     *   Whether to overwrite the existing entry.
     */
    addMonster(monster: Monster, overwrite = true) {
      const existingMonster = this.isMonsterSaved(monster);
      const result = {
        error: false,
        message: 'editor.monsterarchive.saved'
      }
      try {
        if (existingMonster) {
          overwrite = confirm('There is an existing monster with the same name in archive. Do you want to overwrite?')
          //t('editor.monsterarchive.overwrite_save'));
        }

        let created_at = new Date()

        // Cloning monster to dereference. 
        monster = JSON.parse(JSON.stringify(monster))

        if (this.isMonsterSaved(monster)) {
          created_at = this.monsters[monster.name].created_at
        }
        if (overwrite) {
          this.monsters[monster.name] = { created_at: created_at, updated_at: new Date(), monster: monster }
        }


        if (this.isMonsterSaved(monster) && overwrite) {
          if (existingMonster) {
            result.message = 'editor.monsterarchive.overwrite_saved'
          }
        }
      } catch (e) {
        result.error = true
        result.message = 'io.error.json'
      }
      return result
    },

    /**
     * Load the given monster into the builder.
     * 
     * @param monster Monster
     *   The monster to load into the builder.
     */
    loadMonster(monster: Monster) {
      monsterStore.$state = monster
    },

    deleteMonster(monster: Monster) {
      console.log('delete monster' + monster.name)
    },

    /**
     * 
     * @param monsters 
     * @param overwrite 
     * @returns 
     */
    import(monsters: MonsterEntry[], overwrite = false) {
      let imported = 0
      let skipped = 0
      let invalid = 0

      monsters.forEach((entry) => {
        const valid = validate(entry.monster, SCHEMA[entry.monster.saveVersion])
        if (valid.valid) {
          if (!overwrite && this.isMonsterSaved(entry.monster)) {
            skipped += 1
            return
          } else {
            this.monsters[entry.monster.name] = entry
            imported += 1
          }
        } else {
          invalid += 1
        }
      })

      return {
        imported,
        skipped,
        invalid,
      }
    },

    /**
     * Checks whether the given monster is in the archive.
     * 
     * @param monster Monster
     *   The monster to check.
     * @returns bool
     *   Whether the monster is already in the archive.
     */
    isMonsterSaved(monster: Monster): boolean {
      if (monster.name in this.savedMonsters) {
        return true;
      }
      return false;
    }
  },
  persist: {
    key: 'app.monster-archive',
    debug: true
  },
})