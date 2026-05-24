<template>
  <q-drawer ref="drawerRef" :model-value="leftDrawerOpen" overlay elevated>
    <q-list>
      <q-item clickable to="/">
        <q-item-section avatar><q-icon name="home" /></q-item-section>
        <q-item-section>{{ $t('editor.home') }}</q-item-section></q-item
      >
      <q-item clickable to="/monsterarchive">
        <q-item-section avatar><q-icon name="library_books" /></q-item-section>
        <q-item-section>{{ $t('editor.monsterarchive.menu') }}</q-item-section>
      </q-item>
      <q-item clickable to="/spells">
        <q-item-section avatar><q-icon name="library_books" /></q-item-section>
        <q-item-section>{{ $t('editor.customSpells') }}</q-item-section>
      </q-item>
      <q-item clickable to="/templates">
        <q-item-section avatar><q-icon name="library_books" /></q-item-section>
        <q-item-section>{{ $t('editor.template.title') }}</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="createSpell()">
        <q-item-section avatar><q-icon name="auto_fix_high" /></q-item-section>
        <q-item-section>{{
          $t('editor.spellcasting.custom.create')
        }}</q-item-section>
      </q-item>
      <q-item clickable @click="crTable = true">
        <q-item-section avatar><q-icon name="table_chart" /></q-item-section>
        <q-item-section>{{ $t('editor.crTable') }}</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="reset">
        <q-item-section avatar
          ><q-icon name="restart_alt" color="negative"
        /></q-item-section>
        <q-item-section>{{ $t('editor.resetMonster') }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
  <q-dialog v-model="crTable" full-height>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">{{ $t('editor.cr.table') }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="scroll">
        <q-markup-table>
          <thead>
            <tr>
              <th>{{ $t('monster.cr') }}</th>
              <th>{{ $t('editor.cr.prof') }}</th>
              <th>{{ $t('editor.cr.ac') }}</th>
              <th>{{ $t('editor.cr.hp') }}</th>
              <th>{{ $t('editor.cr.attack') }}</th>
              <th>{{ $t('editor.cr.damage') }}</th>
              <th>{{ $t('editor.cr.save') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cr, idx) in crData" :key="cr.numeric">
              <td>{{ cr.cr }}</td>
              <td>{{ idx === 0 ? '<= +3' : cr.profBonus }}</td>
              <td>{{ idx === 0 ? '<= 13' : cr.ac }}</td>
              <td>{{ cr.hpMin }} - {{ cr.hpMax }}</td>
              <td>{{ cr.attack }}</td>
              <td>{{ cr.damage }}</td>
              <td>{{ idx === 0 ? '<= 13' : cr.saveDc }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Done" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { QDrawer, useQuasar } from 'quasar'
import { CR } from 'src/data/CR'
import { useMonsterStore } from 'src/stores/monster-store'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { renderBonus } from './rendering/mathRendering'
import NewSpellDialog from './spell/NewSpellDialog.vue'

export default defineComponent({
  name: 'AppDrawer',
  props: {
    leftDrawerOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const drawerRef = ref<QDrawer | null>(null)
    const monster = useMonsterStore()
    const $q = useQuasar()
    const { t } = useI18n()
    const crTable = ref(false)

    const reset = () => {
      drawerRef.value?.hide()

      monster.$reset()

      $q.notify({
        message: t('editor.monsterReset'),
        type: 'positive',
      })
    }

    const createSpell = () => {
      // the dialog actually handles basically everything
      drawerRef.value?.hide()

      $q.dialog({
        component: NewSpellDialog,
      })
    }

    const crData = computed(() => {
      const formatted = CR.map((cr) => {
        return {
          ...cr,
          hp: `${cr.hpMin} - ${cr.hpMax}`,
          damage: `${cr.dprMin} - ${cr.dprMax}`,
          profBonus: renderBonus(cr.proficiency),
          bonus: renderBonus(cr.attack),
        }
      })

      return formatted
    })

    return {
      reset,
      createSpell,
      drawerRef,
      crTable,
      crData,
    }
  },
})
</script>
