<template>
  <q-editor
    ref="editorRef"
    :model-value="$props.field"
    :toolbar="[
      ['title'],
      ['bold', 'italic', 'underline'],
      ['undo', 'redo'],
      ['saves', 'attacks', 'monster-tokens', 'context-tokens'],
    ]"
    class="full-width q-ma-sm"
    @update:model-value="(value) => $emit('update:modelValue', value)"
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
import { ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { MonsterContextType } from '../rendering/processTokens'
import { useTokens } from './useTokens'

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
  },
  emits: ['update:modelValue'],
  setup(props) {
    const editorRef = ref(null)
    const monsterTokenRef = ref<QBtnDropdown | null>(null)
    const attackTokenRef = ref<QBtnDropdown | null>(null)
    const saveTokenRef = ref<QBtnDropdown | null>(null)
    const contextTokenRef = ref<QBtnDropdown | null>(null)
    const tokens = useTokens()

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
      }

      return null
    })

    const contextTokenLabel = computed(() => {
      if (props.tokenCategory === 'trait') {
        return 'editor.trait'
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
    }
  },
})
</script>
