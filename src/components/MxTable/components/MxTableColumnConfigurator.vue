<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { MenuOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { vDraggable } from 'vue-draggable-plus'
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface'

type ColumnKey = string | number
type ColumnSection = 'left' | 'center' | 'right'

interface ColumnMeta {
  key: ColumnKey
  title: string
  fixed?: 'left' | 'right'
}

interface ColumnConfigState {
  order: ColumnKey[]
  fixedMap: Record<ColumnKey, 'left' | 'right' | undefined>
  visible: ColumnKey[]
}

const props = withDefaults(
  defineProps<{
    columns?: ColumnMeta[]
    modelValue?: ColumnConfigState
  }>(),
  {
    columns: () => [],
    modelValue: () => ({
      order: [],
      fixedMap: {},
      visible: []
    })
  }
)

const emit = defineEmits<{
  'update:modelValue': [ColumnConfigState]
}>()

const columnFilterVisible = ref(false)
const draggable = vDraggable
defineExpose({ draggable })

const localState = reactive<ColumnConfigState>({
  order: [],
  fixedMap: {},
  visible: []
})
const initialState = ref<ColumnConfigState | null>(null)

const sectionLists = reactive<Record<ColumnSection, ColumnMeta[]>>({
  left: [],
  center: [],
  right: []
})

const sectionDefs: { key: ColumnSection; title: string }[] = [
  { key: 'left', title: '固定在左侧' },
  { key: 'center', title: '不固定' },
  { key: 'right', title: '固定在右侧' }
]

const allColumnKeys = computed(() => props.columns.map(meta => meta.key))

const resolveSectionByFixed = (fixed?: 'left' | 'right'): ColumnSection => {
  if (fixed === 'left') return 'left'
  if (fixed === 'right') return 'right'
  return 'center'
}

const cloneState = (state?: ColumnConfigState | null): ColumnConfigState => {
  if (!state) {
    return {
      order: [],
      fixedMap: {},
      visible: []
    }
  }
  return {
    order: [...state.order],
    fixedMap: { ...state.fixedMap },
    visible: [...state.visible]
  }
}

const syncLocalState = (state?: ColumnConfigState | null) => {
  const next = cloneState(state)
  localState.order = next.order
  localState.fixedMap = next.fixedMap
  localState.visible = next.visible
}

const emitState = () => {
  emit('update:modelValue', {
    order: [...localState.order],
    fixedMap: { ...localState.fixedMap },
    visible: [...localState.visible]
  })
}

const ensureConsistency = () => {
  const validKeys = allColumnKeys.value
  const validSet = new Set(validKeys)
  const existingOrder = new Set(localState.order)

  localState.order = localState.order.filter(key => validSet.has(key))
  localState.visible = localState.visible.filter(key => validSet.has(key))

  validKeys.forEach(key => {
    const isNewKey = !existingOrder.has(key)
    if (isNewKey) localState.order.push(key)
    if (isNewKey && !localState.visible.includes(key)) {
      localState.visible.push(key)
    }
    if (!(key in localState.fixedMap)) {
      const meta = props.columns.find(column => column.key === key)
      localState.fixedMap[key] = meta?.fixed
    }
  })

  Object.keys(localState.fixedMap).forEach(key => {
    if (!validSet.has(key as ColumnKey)) delete localState.fixedMap[key as ColumnKey]
  })
}

const rebuildSectionLists = () => {
  ensureConsistency()

  const orderIndex = new Map(localState.order.map((key, index) => [key, index]))

  const groups = {
    left: [] as ColumnMeta[],
    center: [] as ColumnMeta[],
    right: [] as ColumnMeta[]
  }

  props.columns.forEach(meta => {
    // 如果 fixedMap 中有这个 key（包括 undefined），就使用它；否则使用 meta.fixed
    const fixed = meta.key in localState.fixedMap ? localState.fixedMap[meta.key] : meta.fixed
    groups[resolveSectionByFixed(fixed)].push(meta)
  })
  ;(['left', 'center', 'right'] as ColumnSection[]).forEach(section => {
    const sorted = groups[section].sort((a, b) => {
      const orderA = orderIndex.get(a.key) ?? 0
      const orderB = orderIndex.get(b.key) ?? 0
      return orderA - orderB
    })
    sectionLists[section].splice(0, sectionLists[section].length, ...sorted)
  })
}

watch(
  () => props.modelValue,
  value => {
    if (!initialState.value && value) {
      initialState.value = cloneState(value)
    }
    syncLocalState(value)
    rebuildSectionLists()
  },
  { immediate: true, deep: true }
)

watch(
  () => props.columns,
  () => {
    rebuildSectionLists()
    emitState()
  },
  { deep: true }
)

const checkAll = computed(() => {
  return allColumnKeys.value.length > 0 && localState.visible.length === allColumnKeys.value.length
})

const indeterminate = computed(() => {
  return localState.visible.length > 0 && localState.visible.length < allColumnKeys.value.length
})

const handleCheckAllChange = (e: CheckboxChangeEvent) => {
  if (e.target.checked) {
    localState.visible = [...allColumnKeys.value]
  } else {
    localState.visible = []
  }
  emitState()
}

const handleColumnVisibilityChange = (key: ColumnKey, e: CheckboxChangeEvent) => {
  if (e.target.checked) {
    if (!localState.visible.includes(key)) {
      localState.visible.push(key)
    }
  } else {
    localState.visible = localState.visible.filter(item => item !== key)
  }
  emitState()
}

const handleResetColumns = () => {
  const target = initialState.value ?? cloneState()
  emit('update:modelValue', cloneState(target))
}

const handleDragUpdate = () => {
  const newOrder: ColumnKey[] = []
  const newFixedMap: Record<ColumnKey, 'left' | 'right' | undefined> = {}

  sectionLists.left.forEach(item => {
    newOrder.push(item.key)
    newFixedMap[item.key] = 'left'
  })
  sectionLists.center.forEach(item => {
    newOrder.push(item.key)
    newFixedMap[item.key] = undefined
  })
  sectionLists.right.forEach(item => {
    newOrder.push(item.key)
    newFixedMap[item.key] = 'right'
  })

  localState.order = newOrder
  localState.fixedMap = newFixedMap
  emitState()
}
</script>

<template>
  <a-popover
    v-model:open="columnFilterVisible"
    trigger="click"
    placement="bottomRight"
    overlay-class-name="mx-table-column-popover"
  >
    <template #content>
      <div class="column-config">
        <div class="column-config__header">
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="handleCheckAllChange"
          >
            列展示
          </a-checkbox>
          <a-button type="link" size="small" @click="handleResetColumns">重置</a-button>
        </div>
        <div class="column-config__body">
          <div v-for="section in sectionDefs" :key="section.key" class="column-config__section">
            <div class="column-config__section-title">{{ section.title }}</div>
            <div
              v-draggable="[
                sectionLists[section.key],
                {
                  group: 'mx-table-columns',
                  animation: 150,
                  handle: '.column-config__drag-icon',
                  onEnd: handleDragUpdate
                }
              ]"
              class="column-config__droppable"
            >
              <div
                v-for="element in sectionLists[section.key]"
                :key="element.key"
                class="column-config__item"
              >
                <MenuOutlined class="column-config__drag-icon" />
                <a-checkbox
                  :checked="localState.visible.includes(element.key)"
                  @change="handleColumnVisibilityChange(element.key, $event)"
                >
                  {{ element.title }}
                </a-checkbox>
              </div>
              <div v-if="!sectionLists[section.key].length" class="column-config__empty">
                拖动列到此
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <span class="mx-table-action-btn">
      <SettingOutlined />
    </span>
  </a-popover>
</template>

<style scoped>
.mx-table-action-btn {
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s;
  color: var(--ant-text-color-secondary, #595959);
  cursor: pointer;
}

.mx-table-action-btn:hover {
  color: #1677ff;
  background-color: rgba(22, 119, 255, 0.08);
}

.mx-table-action-btn :deep(svg) {
  font-size: 16px;
  transition: color 0.3s;
}

:global(.mx-table-column-popover .ant-popover-inner) {
  width: 300px;
  max-width: 300px;
  padding: 16px;
  border-radius: 10px;
}

.column-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.column-config__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-config__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
}

.column-config__section-title {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 6px;
}

.column-config__section {
  display: flex;
  flex-direction: column;
}

.column-config__droppable {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 6px;
  background: #fafafa;
  min-height: 48px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.column-config__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 4px;
  background: #fff;
  cursor: grab;
  border: 1px solid transparent;
}

.column-config__item:active {
  cursor: grabbing;
}

.column-config__item :deep(.ant-checkbox-wrapper) {
  flex: 1;
}

.column-config__drag-icon {
  color: #bfbfbf;
  font-size: 14px;
}

.column-config__empty {
  text-align: center;
  font-size: 12px;
  color: #bfbfbf;
  padding: 10px 0;
}
</style>
