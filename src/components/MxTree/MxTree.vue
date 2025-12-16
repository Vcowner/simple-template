<!--
 * @Author: liaokt
 * @Description: 树组件 - 支持节点操作菜单
 * @Date: 2025-12-15
-->
<template>
  <a-spin :spinning="loading">
    <a-tree
      :tree-data="treeData"
      :selected-keys="selectedKeys"
      :expanded-keys="expandedKeys"
      block-node
      @select="handleSelect"
      @expand="handleExpand"
    >
      <template #title="{ title, dataRef }">
        <div class="mx-tree__node">
          <span class="mx-tree__node-title">{{ title }}</span>
          <a-dropdown
            v-if="menuItems && menuItems.length > 0"
            :trigger="['hover']"
            placement="bottomRight"
            @click.stop
          >
            <a-button type="text" size="small" class="mx-tree__node-action" @click.stop>
              <template #icon>
                <MoreOutlined />
              </template>
            </a-button>
            <template #overlay>
              <a-menu>
                <template
                  v-for="(item, index) in getMenuItems(dataRef)"
                  :key="item.type === 'divider' ? `divider-${index}` : item.key"
                >
                  <a-menu-divider v-if="item.type === 'divider'" />
                  <a-menu-item
                    v-else-if="item.visible === undefined || item.visible(dataRef)"
                    :key="item.key"
                    :danger="item.danger"
                    @click="() => item.onClick?.(dataRef)"
                  >
                    <template v-if="item.icon" #icon>
                      <component :is="item.icon" />
                    </template>
                    {{ item.label }}
                  </a-menu-item>
                </template>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </a-tree>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import { MoreOutlined } from '@ant-design/icons-vue'
import type { TreeNode, TreeNodeMenuItem } from './treeTypes'

defineOptions({
  name: 'MxTree'
})

interface Props {
  /** 树形数据 */
  treeData?: TreeNode[]
  /** 选中的节点 */
  selectedKeys?: Key[]
  /** 菜单项配置 */
  menuItems?: TreeNodeMenuItem[]
  /** 加载状态 */
  loading?: boolean
  /** 默认展开所有节点 */
  defaultExpandAll?: boolean
}

interface Emits {
  /** 节点选择事件 */
  (e: 'select', selectedKeys: Key[]): void
}

const props = withDefaults(defineProps<Props>(), {
  treeData: () => [],
  selectedKeys: () => [],
  menuItems: () => [],
  loading: false,
  defaultExpandAll: true
})

const emit = defineEmits<Emits>()

/**
 * 展开的节点 keys
 */
const expandedKeys = ref<Key[]>([])

/**
 * 递归获取所有节点的 key
 */
const getAllNodeKeys = (nodes: TreeNode[]): Key[] => {
  const keys: Key[] = []
  const traverse = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      keys.push(node.key)
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    })
  }
  traverse(nodes)
  return keys
}

/**
 * 处理节点展开/折叠
 */
const handleExpand = (keys: Key[]) => {
  expandedKeys.value = keys
}

/**
 * 监听 treeData 变化，当 defaultExpandAll 为 true 时自动展开所有节点
 */
watch(
  () => props.treeData,
  newTreeData => {
    if (props.defaultExpandAll && newTreeData && newTreeData.length > 0) {
      expandedKeys.value = getAllNodeKeys(newTreeData)
    }
  },
  { immediate: true, deep: true }
)

/**
 * 处理节点选择
 */
const handleSelect = (selectedKeysValue: Key[]) => {
  emit('select', selectedKeysValue)
}

/**
 * 获取菜单项列表（过滤掉不可见的项）
 */
const getMenuItems = (nodeData: TreeNode): TreeNodeMenuItem[] => {
  if (!props.menuItems || props.menuItems.length === 0) {
    return []
  }
  return props.menuItems.filter(item => {
    if (item.type === 'divider') return true
    return item.visible === undefined || item.visible(nodeData)
  })
}
</script>

<style lang="scss" scoped>
.mx-tree {
  &__node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 0;
    padding-right: 8px;

    &:hover {
      .mx-tree__node-action {
        opacity: 1;
      }
    }
  }

  &__node-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__node-action {
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
}
</style>
