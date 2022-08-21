<template>
  <q-select
    ref="templateRef"
    :model-value="search"
    :options="filteredTemplateOptions"
    class="template-search"
    dense
    standout
    option-value="templateName"
    option-label="templateName"
    emit-value
    clearable
    use-input
    hide-selected
    input-debounce="0"
    behavior="dialog"
    placeholder="Search for Actions, Traits, and Attacks"
    @filter="templateFilter"
    @update:model-value="addTemplate"
    @input-value="checkPopupStatus"
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-icon
            :name="
              scope.opt.icon === ''
                ? defaultIcon[scope.opt.type]
                : scope.opt.icon
            "
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.templateName }}</q-item-label>
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
import { QSelect, useQuasar } from 'quasar'
import { useTemplatesStore } from 'src/stores/templates-store'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ACTION_COLOR } from '../cr/useCr'
import { templateArrayFilter } from '../filters'
import _ from 'lodash'
import { DEFAULT_TEMPLATE_ICON } from 'src/data/TEMPLATES'

export default defineComponent({
  name: 'TemplateSearch',
  setup() {
    // TODO: link this to the template search
    const search = ref('')
    const { t } = useI18n()
    const $q = useQuasar()

    const templateRef = ref<QSelect>()
    const templateStore = useTemplatesStore()
    const templateOptions = computed(() => templateStore.allTemplateOptions)
    const filteredTemplateOptions = ref(templateOptions.value)
    const templateFilter = templateArrayFilter(
      templateOptions,
      filteredTemplateOptions
    )

    const addTemplate = (value: string | undefined) => {
      if (value != null) {
        const result = templateStore.applyTemplate(value)

        if (result) {
          $q.notify({
            message: t('editor.template.applied', [_.capitalize(value)]),
            type: 'positive',
          })
        } else {
          $q.notify({
            message: t('editor.template.failed', [_.capitalize(value)]),
            type: 'negative',
          })
        }
      }
    }

    const checkPopupStatus = () => {
      if (templateRef.value) {
        templateRef.value.showPopup()
      }
    }

    return {
      search,
      templateStore,
      addTemplate,
      filteredTemplateOptions,
      templateFilter,
      templateRef,
      actionColor: ACTION_COLOR,
      checkPopupStatus,
      defaultIcon: DEFAULT_TEMPLATE_ICON,
    }
  },
})
</script>

<style lang="scss" scoped>
.template-search {
}
</style>
