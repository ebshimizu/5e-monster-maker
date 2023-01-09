<template>
  <q-btn round flat icon="cloud_upload" @click="importDialog = true">
    <q-tooltip class="text-body2">{{ $t('import.tooltip') }}</q-tooltip>
  </q-btn>
  <q-dialog v-model="importDialog">
    <q-card class="q-dialog-plugin" style="width: 50vw">
      <q-card-section
        ><div class="text-h6">
          {{ $t('import.title') }}
        </div></q-card-section
      >
      <q-separator />
      <q-card-section class="q-pt-md">
        <div class="q-mb-md">
          <i18n-t keypath="import.help">
            <a href="https://open5e.com/" target="_blank">{{
              $t('import.open5eLink')
            }}</a>
          </i18n-t>
        </div>
        <q-select
          v-model="selectedName"
          filled
          use-input
          hide-selected
          fill-input
          emit-value
          :hint="status"
          :label="$t('import.label')"
          :options="options"
          style="width: 100%"
          @filter="apiSearch"
          @virtual-scroll="appendOptions"
        >
          <template #after>
            <q-btn
              color="positive"
              :disable="importInvalid"
              :loading="loadingData"
              @click="loadData"
              >{{ $t('import.import') }}</q-btn
            >
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-avatar color="primary">{{ scope.opt.cr }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption
                  >{{ scope.opt.description }}<br />{{
                    scope.opt.source
                  }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="q-pt-md text-caption">
          {{ $t('import.additional') }}
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          :label="$t('editor.cancel')"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QSelect, useQuasar } from 'quasar'
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOpen5eImport } from './importers/useOpen5eImport'
import { Open5eMonster, Open5eMonsterResponse } from './Open5eData'

const { t } = useI18n()

const API_ROOT = 'https://api.open5e.com/monsters/'
const monsterResults = ref<Open5eMonster[]>([])
const selectedName = ref('')
const next = ref<string | null>(null)
const prev = ref<string | null>(null)
const count = ref<number>(0)
const loading = ref(false)
const loadingData = ref(false)

// might include extra data for rendering too
const options = computed(() =>
  monsterResults.value.map((m) => ({
    value: m.name,
    label: m.name,
    source: m.document__title,
    cr: m.challenge_rating,
    description: `${m.size} ${m.type}${
      m.subtype === '' ? '' : ` ${m.subtype}`
    }, ${m.alignment}`,
  }))
)

const importDialog = ref(false)
const importInvalid = computed(
  () => options.value.findIndex((m) => m.value === selectedName.value) === -1
)
const status = computed(() => {
  if (monsterResults.value.length === 0) {
    return t('import.results', 0)
  } else {
    return t('import.description', [
      monsterResults.value.length,
      t('import.results', count.value),
    ])
  }
})

const apiSearch = async (
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
  abort: () => void
) => {
  loading.value = true
  try {
    // construct the api query
    const apiQuery = `${API_ROOT}?search=${val.toLowerCase()}`
    const apiResults = await fetch(apiQuery)
    const apiData = (await apiResults.json()) as Open5eMonsterResponse

    next.value = apiData.next
    prev.value = apiData.previous
    count.value = apiData.count

    update(() => {
      monsterResults.value = apiData.results
    })
  } catch (e) {
    console.error(e)
    abort()

    update(() => (monsterResults.value = []))
  }

  loading.value = false
}

const appendOptions = async ({ to, ref }: { to: number; ref: QSelect }) => {
  const lastIndex = monsterResults.value.length - 1

  if (loading.value !== true && to === lastIndex && next.value) {
    loading.value = true

    // load the next page
    const apiQuery = next.value
    const apiResults = await fetch(apiQuery)
    const apiData = (await apiResults.json()) as Open5eMonsterResponse

    next.value = apiData.next
    prev.value = apiData.previous
    count.value = apiData.count
    monsterResults.value.push(...apiData.results)

    nextTick(() => {
      ref.refresh()
      loading.value = false
    })
  }
}

const { importOpen5eMonster } = useOpen5eImport()
const $q = useQuasar()
const loadData = async () => {
  loadingData.value = true

  // find the monster first
  const selectedMonster = monsterResults.value.find(
    (m) => m.name === selectedName.value
  )

  if (selectedMonster) {
    const result = importOpen5eMonster(selectedMonster)

    if (result) {
      importDialog.value = false
    }
  } else {
    $q.notify({
      message: t('import.error.notFound'),
      type: 'negative',
    })
  }

  loadingData.value = false
}
</script>
