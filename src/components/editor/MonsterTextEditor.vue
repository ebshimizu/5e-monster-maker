<template>
  <q-editor
    ref="editorRef"
    :model-value="$props.field"
    :toolbar="toolbarOptions"
    :definitions="toolbarDefinitions"
    class="full-width q-ma-sm"
    @update:model-value="(value) => throttledUpdate(value)"
  >
    <template #title>
      <div
        class="text-subtitle2"
        style="display: flex; align-items: center; height: 100%"
      >
        {{ $t($props.i18nLabelKey) }}
      </div>
    </template>
    <template #saves>
      <q-btn-dropdown
        ref="saveTokenRef"
        dense
        no-caps
        no-wrap
        unelevated
        :label="$t('editor.statSave')"
        size="sm"
      >
        <q-list dense>
          <q-item
            v-for="token in saveTokens"
            :key="token.token"
            clickable
            @click="add(token.token)"
          >
            <q-item-section>{{ token.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
    <template #attacks>
      <q-btn-dropdown
        ref="attackTokenRef"
        dense
        no-caps
        no-wrap
        unelevated
        :label="$t('editor.attackMod')"
        size="sm"
      >
        <q-list dense>
          <q-item
            v-for="token in attackTokens"
            :key="token.token"
            clickable
            @click="add(token.token)"
          >
            <q-item-section>{{ token.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
    <template #monster-tokens>
      <q-btn-dropdown
        ref="monsterTokenRef"
        dense
        no-caps
        no-wrap
        unelevated
        :label="$t('editor.monsterToken')"
        size="sm"
      >
        <q-list dense>
          <q-item
            v-for="token in monsterTokens"
            :key="token.token"
            clickable
            @click="add(token.token)"
          >
            <q-item-section>{{ token.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
    <template #context-tokens>
      <q-btn-dropdown
        v-if="contextTokens != null"
        ref="contextTokenRef"
        dense
        no-caps
        no-wrap
        unelevated
        :label="$t(contextTokenLabel)"
        size="sm"
      >
        <q-list dense>
          <q-item
            v-for="token in contextTokens"
            :key="token.token"
            clickable
            @click="add(token.token)"
          >
            <q-item-section>{{ token.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
  </q-editor>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/runtime-core'
import { QBtnDropdown } from 'quasar'
import { ref } from 'vue'
import { MonsterContextType } from '../rendering/processTokens'
import { useTokens } from './useTokens'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'MonsterTextEditor',
  props: {
    field: {
      required: true,
      type: String,
    },
    tokenCategory: {
      required: true,
      type: String as PropType<MonsterContextType>,
    },
    i18nLabelKey: {
      required: true,
      type: String,
    },
    showReset: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'reset'],
  setup(props, ctx) {
    const { t } = useI18n()
    const editorRef = ref(null)
    const monsterTokenRef = ref<QBtnDropdown | null>(null)
    const attackTokenRef = ref<QBtnDropdown | null>(null)
    const saveTokenRef = ref<QBtnDropdown | null>(null)
    const contextTokenRef = ref<QBtnDropdown | null>(null)
    const tokens = useTokens()
    const toolbarOptions = ref([
      ['title'],
      ['bold', 'italic', 'underline'],
      ['undo', 'redo'],
      ['saves', 'attacks', 'monster-tokens', 'context-tokens'],
    ])

    if (props.showReset) {
      toolbarOptions.value.push(['reset'])
    }

    const toolbarDefinitions = ref({
      reset: {
        tip: t('editor.resetTip'),
        icon: 'restart_alt',
        handler: () => ctx.emit('reset'),
      },
    })

    const throttledUpdate = _.throttle((value: string) => {
      ctx.emit('update:modelValue', value)
    }, 500)

    const add = (token: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const edit = editorRef.value as any

      monsterTokenRef.value?.hide()
      saveTokenRef.value?.hide()
      attackTokenRef.value?.hide()
      contextTokenRef.value?.hide()

      edit.caret.restore()
      edit.runCmd('insertHTML', `${token}`)
      edit.focus()
    }

    const contextTokens = computed(() => {
      if (props.tokenCategory === 'trait') {
        return tokens.traitTokens.value
      } else if (props.tokenCategory === 'spell') {
        return tokens.spellTokens.value
      } else if (props.tokenCategory === 'attack') {
        return tokens.attackDamageTokens.value
      }

      return null
    })

    const contextTokenLabel = computed(() => {
      if (props.tokenCategory === 'trait') {
        return 'editor.trait'
      } else if (props.tokenCategory === 'spell') {
        return 'editor.spellcasting.label'
      } else if (props.tokenCategory === 'attack') {
        return 'editor.attack.customRenderer'
      }

      return ''
    })

    return {
      monsterTokenRef,
      attackTokenRef,
      saveTokenRef,
      contextTokenRef,
      editorRef,
      add,
      ...tokens,
      contextTokens,
      contextTokenLabel,
      throttledUpdate,
      toolbarOptions,
      toolbarDefinitions,
    }
  },
})
</script>
