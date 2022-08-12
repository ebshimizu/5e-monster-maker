import { useQuasar } from 'quasar'
import { useSpellsStore } from 'src/stores/spells-store'
import { useI18n } from 'vue-i18n'
import { download } from './download'

export function useV1Updater() {
  const { t } = useI18n()
  const $q = useQuasar()
  const spellStore = useSpellsStore()

  // spell check
  if (localStorage.getItem('app.customSpells') != null) {
    $q.notify({
      message: t('io.update.v1Spells'),
      multiLine: true,
      group: false,
      icon: 'update',
      color: 'dark',
      timeout: 0,
      actions: [
        {
          label: t('io.update.v1SpellsDownload'),
          color: 'white',
          noDismiss: true,
          handler: () => {
            download(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              localStorage.getItem('app.customSpells')!,
              'v1-spells.5emm.json',
              'application/json'
            )
          },
        },
        {
          label: 'Update',
          color: 'green',
          handler: () => {
            try {
              spellStore.updateFromV1()
              $q.notify({
                message: t('io.update.v1SpellsOk'),
                type: 'positive',
              })
            } catch (e) {
              $q.notify({
                message: t('io.update.v1SpellsError', [e]),
                type: 'negative',
                timeout: 0,
                multiLine: true,
                actions: [{ label: t('editor.ok'), color: 'white' }],
              })
            }
          },
        },
      ],
    })
  }
}
