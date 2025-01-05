import { defineStore } from 'pinia'
import { useMonsterStore } from './monster-store';
import {
  Monster,
  MonsterArchive,
  MonsterEntry,
} from 'src/components/models'
const monsterStore = useMonsterStore();

export const useMonsterArchiveStore = defineStore('monster-archive', {
  state: (): MonsterArchive => ({
    monsters: {}
  }),
  getters: {
    /**
     * Returns the monsters in the state indexed by name.
     * 
     * @param state 
     *   The state of the archive
     * @returns
     *   The list of monsters.
     */
    allMonsters: (state): Record<string, MonsterEntry> => {
      return state.monsters;
    },
  },
  actions: {

    /**
     * Adds a copy of the given monster to the archive store.
     * 
     * @param monster
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
     * @param monster
     *   The monster to load into the builder.
     */
    loadMonster(monster: Monster) {
      monsterStore.$state = monster
    },

    /**
     * Delete a monster from the store.
     * 
     * @param monster
     *   The monster to remove.
     */
    deleteMonster(monster: Monster) {
      delete this.monsters[monster.name]
    },

    /**
     * Import a monster entry.
     * 
     * @param monsters 
     *   The monster to import.
     * @param overwrite 
     *   Wether to overwrite existing monsters with the same name.
     * @returns
     *   The result of the import.
     */
    import(entry: MonsterEntry, overwrite = false): boolean {
      if (overwrite || !this.isMonsterSaved(entry.monster)) {
        this.monsters[entry.monster.name] = entry
        return true
      }
      return false
    },

    /**
     * Checks whether the given monster is in the archive.
     * 
     * @param monster
     *   The monster to check.
     * @returns
     *   Whether the monster is already in the archive.
     */
    isMonsterSaved(monster: Monster): boolean {
      if (monster.name in this.allMonsters) {
        return true;
      }
      return false;
    }
  },
  persist: {
    key: 'app.monster-archive'
  },
})