<template>
  <q-page style="min-height: calc(100vh - 120px)">
    <q-table
      v-model:selected="selected"
      :title="$t('editor.template.title')"
      :rows="templates"
      :columns="columns"
      :pagination="{
        rowsPerPage: 15,
      }"
      row-key="name"
      class="q-mx-auto q-my-md"
      selection="multiple"
      style="width: 98vw"
    >
      <template #top>
        <div class="text-h6">{{ $t('editor.template.title') }}</div>
        <q-space />
        <q-btn
          v-show="selected.length !== 0"
          color="negative"
          class="q-mr-md"
          @click="deleteTemplates"
        >
          {{ $t('editor.template.delete', selected.length) }}</q-btn
        >
        <q-btn color="primary" class="q-mr-md" @click="importTemplates">{{
          $t('editor.template.import')
        }}</q-btn>
        <q-btn color="primary" class="q-mr-md" @click="downloadTemplates">{{
          $t('editor.template.export')
        }}</q-btn>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="templateName" :props="props">{{
            props.row.templateName
          }}</q-td>
          <q-td key="type" :props="props"
            ><q-badge
              :color="actionColor[props.row.type as keyof typeof actionColor]"
              >{{ $t(`editor.template.type.${props.row.type}`) }}</q-badge
            ></q-td
          >
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <q-td key="icon" :props="props" class="editable"
            >{{ props.row.icon }}
            <q-icon :name="props.row.icon" size="2em" class="q-ml-sm" />
            <q-popup-edit
              v-slot="scope"
              v-model="props.row.icon"
              auto-save
              :title="$t('editor.template.icon')"
            >
              <q-input
                v-model="scope.value"
                :label="$t('editor.template.icon')"
                bottom-slots
                class="q-mb-xl"
              >
                <template #hint>
                  <i18n-t keypath="editor.template.availableIcons">
                    <a
                      href="https://quasar.dev/vue-components/icon#webfont-usage"
                      target="_blank"
                      >{{ $t('editor.template.link0') }}</a
                    >
                    <a
                      href="https://fonts.google.com/icons?selected=Material+Icons&icon.style=Filled"
                      target="_blank"
                      >{{ $t('editor.template.link1') }}</a
                    >
                    <a
                      href="https://materialdesignicons.com/"
                      target="_blank"
                      >{{ $t('editor.template.link2') }}</a
                    >
                    <a
                      href="https://fontawesome.com/search?m=free"
                      target="_blank"
                      >{{ $t('editor.template.link3') }}</a
                    >
                  </i18n-t>
                </template>
                <template #after>
                  <q-icon :name="scope.value" class="overflow-hidden" />
                </template>
              </q-input>
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { QTableProps, useQuasar } from 'quasar'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { DndTemplate } from 'src/components/models'
import { download } from 'src/components/file/download'
import { useTemplatesStore } from 'src/stores/templates-store'
import { ACTION_COLOR } from 'src/components/cr/useCr'
import LoadTemplatesDialog from 'src/components/editor/widgets/LoadTemplatesDialog.vue'

export default defineComponent({
  name: 'SpellsEditor',
  setup() {
    const { t } = useI18n()
    const $q = useQuasar()
    const templateStore = useTemplatesStore()
    const templates = computed(() =>
      Object.values(templateStore.customTemplates)
    )

    const selected = ref([])

    const columns: QTableProps['columns'] = [
      {
        name: 'templateName',
        field: 'templateName',
        required: true,
        label: t('editor.template.name'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'type',
        field: 'type',
        label: t('editor.template.type.type'),
        sortable: true,
      },
      {
        name: 'name',
        field: 'name',
        required: true,
        label: t('editor.template.instanceName'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'icon',
        label: t('editor.template.icon'),
        sortable: true,
        field: 'icon',
        align: 'left',
      },
    ]

    const deleteTemplates = () => {
      selected.value.forEach((s: DndTemplate) =>
        templateStore.deleteCustomTemplate(s.templateName)
      )
      selected.value = []
    }

    const downloadTemplates = () => {
      download(
        JSON.stringify(templateStore.customTemplates),
        'custom-templates.5emmt.json',
        'application/json'
      )
    }

    const importTemplates = () => {
      $q.dialog({
        component: LoadTemplatesDialog,
      })
    }

    return {
      columns,
      selected,
      templates,
      downloadTemplates,
      deleteTemplates,
      subtitles: computed(() => templateStore.allTemplateSubtitles),
      actionColor: ACTION_COLOR,
      importTemplates,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable {
  cursor: pointer;
  transition-property: background-color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;
}

.editable:hover {
  // blue-grey-7
  background-color: #546e7a;
}
</style>
