<template>
  <q-select
    :model-value="search"
    :options="templateStore.allTemplateOptions"
    class="template-search"
    dense
    standout
    option-value="templateName"
    option-label="name"
    emit-value
    clearable
    use-input
    hide-selected
    input-debounce="0"
    placeholder="Search for Actions, Traits, and Attacks"
    @update:model-value="addTemplate"
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-icon :name="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.name }}</q-item-label>
          <q-item-label lines="1" caption>{{
            templateStore.allTemplateSubtitles[scope.opt.templateName]
          }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-badge
            :color="actionColor[scope.opt.type as keyof typeof actionColor]"
          >
            {{ $t(`editor.template.type.${scope.opt.type}`) }}
          </q-badge>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useTemplatesStore } from 'src/stores/templates-store'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ACTION_COLOR } from '../cr/useCr'

export default defineComponent({
  name: 'TemplateSearch',
  setup() {
    // TODO: link this to the template search
    const search = ref('')
    const { t } = useI18n()
    const $q = useQuasar()

    const templateStore = useTemplatesStore()

    const addTemplate = (value: string | undefined) => {
      if (value != null) {
        const result = templateStore.applyTemplate(value)

        if (result) {
          $q.notify({
            message: t('editor.template.applied', [value]),
            type: 'positive',
          })
        } else {
          $q.notify({
            message: t('editor.template.failed', [value]),
            type: 'negative',
          })
        }
      }
    }

    return {
      search,
      templateStore,
      addTemplate,
      actionColor: ACTION_COLOR,
    }
  },
})
</script>

<style lang="scss" scoped>
.template-search {
}
</style>
