# MxModal 命令式弹窗系统

类似 `@ebay/nice-modal-react` 的命令式弹窗方案，使用 Context Provider 全局管理 Modal 状态。

## 特性

- ✅ 命令式 API，无需在模板中声明组件
- ✅ 全局状态管理，通过 Provider 统一管理
- ✅ 支持 Promise，可以等待用户操作结果
- ✅ 自动注册，无需手动管理
- ✅ 类型安全，完整的 TypeScript 支持
- ✅ 封装了 `MxFormModal`，简化表单弹窗开发
- ✅ 自动区分业务数据和 `a-modal` 参数

## 快速开始

### 1. 在 App 中包裹 Provider

```vue
<!-- App.vue -->
<template>
  <a-config-provider :theme="themeConfig" :locale="locale">
    <MxModalProvider>
      <router-view />
    </MxModalProvider>
  </a-config-provider>
</template>

<script setup lang="ts">
import { MxModalProvider } from '@/components/MxModal'
</script>
```

### 2. 创建 Modal 组件

#### 方式1：使用 MxFormModal（推荐，适用于表单场景）

```vue
<!-- components/UserModal.vue -->
<template>
  <MxFormModal :modal="modal" :rules="rules" layout="vertical" @ok="handleSubmit">
    <template #default="{ formData }">
      <a-form-item label="姓名" name="name" required>
        <a-input v-model:value="formData.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="年龄" name="age" required>
        <a-input-number v-model:value="formData.age" :min="0" style="width: 100%" />
      </a-form-item>
    </template>
  </MxFormModal>
</template>

<script setup lang="ts">
import { MxFormModal, useModal } from '@/components/MxModal'
import type { UseModalReturn } from '@/components/MxModal'
import type { Rule } from 'ant-design-vue/es/form'

interface Props {
  modal?: UseModalReturn
}

const props = defineProps<Props>()
const modal = props.modal || useModal()

// 表单验证规则
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
}

// 处理提交（确认按钮事件入口）
const handleSubmit = async (values: Record<string, any>) => {
  try {
    // 在这里调用接口
    // const result = await api.addUser(values)

    // 接口成功后，关闭弹窗
    modal.resolve(values)
    modal.hide()
  } catch (error) {
    // 接口失败，不关闭弹窗（让用户看到错误信息）
    console.error('提交失败:', error)
  }
}
</script>
```

#### 方式2：使用 MxModal（适用于非表单场景）

```vue
<!-- components/ConfirmModal.vue -->
<template>
  <MxModal :modal="modal" @ok="handleOk" @cancel="handleCancel">
    <p>{{ message }}</p>
  </MxModal>
</template>

<script setup lang="ts">
import { MxModal, useModal } from '@/components/MxModal'
import type { UseModalReturn } from '@/components/MxModal'

interface Props {
  modal?: UseModalReturn
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: '确认执行此操作？'
})

const modal = props.modal || useModal()

const handleOk = () => {
  modal.resolve(true)
  modal.hide()
}

const handleCancel = () => {
  modal.hide()
}
</script>
```

#### 方式3：直接使用 a-modal（高级用法）

```vue
<!-- components/UserModal.vue -->
<template>
  <a-modal
    :open="modal.visible.value"
    v-bind="modalProps"
    @cancel="modal.hide()"
    @after-close="modal.remove()"
    @ok="handleOk"
  >
    <a-form :model="formData" layout="vertical">
      <a-form-item label="姓名" name="name" required>
        <a-input v-model:value="formData.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="年龄" name="age" required>
        <a-input-number v-model:value="formData.age" :min="0" style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useModal } from '@/components/MxModal'
import type { ModalProps } from 'ant-design-vue'

const modal = useModal()

// 使用 getFormData 获取业务数据（自动排除 a-modal 参数）
const formData = reactive({
  name: '',
  age: undefined,
  ...modal.getFormData<{ name: string; age: number }>()
})

// 使用 getModalProps 获取 a-modal 参数（自动提取）
const modalProps = computed<ModalProps>(() => ({
  title: '用户信息',
  width: 600,
  ...modal.getModalProps() // 自动提取所有 a-modal 的参数
}))

const handleOk = () => {
  // 提交数据并关闭
  modal.resolve({ ...formData })
  modal.hide()
}
</script>
```

### 3. 使用 Modal（无需注册）

```vue
<!-- views/UserList.vue -->
<template>
  <mx-button @click="handleAdd">新增用户</mx-button>
</template>

<script setup lang="ts">
import { useModalController } from '@/components/MxModal'
import UserModal from '@/components/UserModal.vue'

// 创建 Modal 控制器（自动注册）
const modal = useModalController(UserModal)

const handleAdd = async () => {
  // 可以传递业务数据和 a-modal 的参数
  const result = await modal.show({
    // 业务数据
    name: '',
    age: 0,
    // a-modal 的参数（可选）
    title: '新增用户',
    width: 800,
    okText: '保存',
    cancelText: '取消',
    maskClosable: false
  })

  if (result) {
    console.log('用户提交的数据:', result)
    // 调用 API 保存数据
  }
}
</script>
```

## API

### MxModalProvider

全局 Provider 组件，需要在 App 根组件中包裹。

### useModal()

在 Modal 组件内部使用的 Hook，返回：

- `visible: Ref<boolean>` - Modal 是否可见
- `args: Ref<Record<string, any>>` - Modal 参数（包含业务数据和 a-modal 参数）
- `show(args?)` - 显示 Modal
- `hide()` - 隐藏 Modal
- `remove()` - 移除 Modal
- `update(args)` - 更新参数
- `resolve(value)` - 解析 Promise（用于命令式调用，将数据返回给调用者）
- `reject(reason)` - 拒绝 Promise
- `getFormData<T>(keys?)` - 获取业务数据（自动排除 a-modal 参数）
  - `keys?: string[]` - 可选，指定要获取的字段，不传则返回所有业务数据
- `getModalProps()` - 获取 a-modal 的参数（自动提取）

### useModalController(component)

创建 Modal 控制器（推荐使用），自动注册组件，返回：

- `show(args?)` - 显示 Modal，返回 Promise
  - `args` 可以包含业务数据和 `a-modal` 的所有参数（如 `title`, `width`, `okText`, `cancelText`, `maskClosable` 等）
- `hide()` - 隐藏 Modal
- `remove()` - 移除 Modal

**类型安全（推荐）**：

```ts
import { useModalController } from '@/components/MxModal'
import UserModal from './UserModal.vue'

// 定义参数类型（包含业务数据和 a-modal 参数）
interface UserModalArgs {
  // 业务数据
  userId?: number
  name?: string
  age?: number
  // a-modal 参数（可选）
  title?: string
  width?: number
  okText?: string
  cancelText?: string
}

// 定义返回值类型
interface UserModalResult {
  type: 'add' | 'edit'
  id?: number
}

// 创建控制器（带类型）
const modal = useModalController<UserModalResult, UserModalArgs>(UserModal)

// 传递参数（IDE 会提供完整的类型提示和自动补全）
const result = await modal.show({
  userId: 123,
  name: 'John',
  title: '编辑用户',
  width: 800
})

if (result) {
  console.log('返回结果:', result) // result 的类型是 UserModalResult | null
}
```

**基础用法（无类型）**：

```ts
const modal = useModalController(UserModal)

// 传递业务数据和 a-modal 参数
const result = await modal.show({
  // 业务数据
  userId: 123,
  // a-modal 参数（可选）
  title: '编辑用户',
  width: 800,
  okText: '确定',
  cancelText: '取消'
})
```

**注意**：

- 如果使用 `MxFormModal` 或 `MxModal`，它们会自动处理 `a-modal` 参数的绑定
- 如果直接使用 `a-modal`，需要通过 `modal.args.value` 访问这些参数，并使用 `v-bind` 绑定到 `a-modal` 上
- **推荐使用类型安全的方式**，可以获得更好的 IDE 提示和类型检查

### useModalInstance(props)

简化 Modal 组件中获取 modal 实例的代码。

**使用前**：

```ts
interface Props {
  modal?: UseModalReturn
}
const props = defineProps<Props>()
const modal = props.modal || useModal()
```

**使用后**：

```ts
import { useModalInstance, type UseModalReturn } from '@/components/MxModal'

interface Props {
  modal?: UseModalReturn
}
const props = defineProps<Props>()
const modal = useModalInstance(props)
```

虽然代码量减少不多，但语义更清晰，且统一了获取 modal 实例的方式。

### useAsyncFormData(options)

简化异步表单数据加载的 Hook，减少手动 `watch` 和 `nextTick` 的样板代码。

**使用场景**：编辑模式下需要异步加载详情数据填充表单。

**使用前**：

```ts
watch(
  () => modal.visible.value,
  async visible => {
    if (visible) {
      const args = toRaw(modal.args.value)
      if (args.id) {
        const response = await getDetail({ id: args.id })
        nextTick(() => {
          modal.update({ data: response.data })
        })
      }
    }
  }
)
```

**使用后**：

```ts
import { useAsyncFormData } from '@/components/MxModal'
import { getFlowFeatureDetail } from '@/api/flow-features'

const { loading, data } = useAsyncFormData({
  modal,
  loadData: async args => {
    if (args.id) {
      const response = await getFlowFeatureDetail({ id: args.id })
      return response.data
    }
    return null
  },
  formatData: apiData => {
    // 将接口数据转换为表单数据
    return {
      ...apiData,
      tcp_flags: apiData.tcp_flags_list || []
    }
  }
})
```

**选项说明**：

- `modal: UseModalReturn` - Modal 实例
- `autoLoad?: boolean` - 是否在弹窗打开时自动加载（默认 true）
- `loadData?: (args) => Promise<T>` - 数据加载函数
- `formatData?: (data: T) => Record<string, any>` - 数据格式化函数
- `onDataUpdate?: (data) => void` - 数据更新回调（默认会更新到 `modal.args.data`）

**返回值**：

- `loading: Readonly<Ref<boolean>>` - 加载状态
- `data: Readonly<Ref<Record<string, any> | null>>` - 加载的数据
- `error: Readonly<Ref<Error | null>>` - 错误信息
- `load: () => Promise<void>` - 手动触发加载
- `clear: () => void` - 清除数据

### MxModal 的 autoHideOnOk 属性

控制确认按钮点击后是否自动关闭弹窗。

```vue
<template>
  <MxModal :modal="modal" :auto-hide-on-ok="false" @ok="handleOk">
    <!-- 内容 -->
  </MxModal>
</template>

<script setup lang="ts">
const handleOk = async () => {
  // 执行异步操作
  await submitData()
  // 操作成功后手动关闭
  modal.hide()
}
</script>
```

- 默认值：`true`（确认后自动关闭）
- 设为 `false` 时，需要手动调用 `modal.hide()` 关闭

### 自动标题生成

`MxModal` 会根据传入的 `title` 和 `mode` 自动生成最终标题。

**规则**：

- 传入 `title` 和 `mode: 'add'` → `新增${title}`
- 传入 `title` 和 `mode: 'edit'` → `编辑${title}`
- 传入 `title` 和 `mode: 'detail'` → `${title}详情`
- 只传入 `title`（无 mode）→ 直接使用 `title`

**示例**：

```ts
// 新增模式
await modal.show({
  title: '流级特征',
  mode: 'add'
})
// 自动生成标题：新增流级特征

// 编辑模式
await modal.show({
  title: '流级特征',
  mode: 'edit',
  id: 1
})
// 自动生成标题：编辑流级特征

// 详情模式
await modal.show({
  title: '流级特征',
  mode: 'detail',
  id: 1
})
// 自动生成标题：流级特征详情

// 无 mode，直接使用 title
await modal.show({
  title: '流级特征'
})
// 标题：流级特征
```

### removeAll()

移除所有 Modal。

## 完整示例

```vue
<!-- views/UserList.vue -->
<template>
  <mx-button @click="handleAdd">新增用户</mx-button>
</template>

<script setup lang="ts">
import { useModalController } from '@/components/MxModal'
import UserModal from '@/components/UserModal.vue'

// 创建 Modal 控制器
const modal = useModalController(UserModal)

const handleAdd = async () => {
  const result = await modal.show({ name: '', age: 0 })

  if (result) {
    console.log('用户提交的数据:', result)
    // 调用 API 保存数据
  } else {
    // 用户取消了操作
    console.log('用户取消了操作')
  }
}
</script>
```
