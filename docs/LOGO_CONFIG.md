# Logo 配置说明

## 概述

本系统支持从后端动态获取 Logo 配置，包括页面 Logo 和浏览器 Favicon。

## 功能特性

- ✅ 支持从后端 API 获取 Logo 配置
- ✅ 自动设置浏览器 Favicon
- ✅ 自动设置页面标题
- ✅ 支持相对路径和绝对路径
- ✅ 失败时自动回退到默认配置
- ✅ 可在应用启动时或运行时更新配置

## 使用方法

### 1. 后端 API 接口

后端需要提供一个配置接口，返回应用配置信息：

**接口地址：** `GET /api/config/app`

**响应格式：**

```json
{
  "logo": "/static/images/logo.png", // Logo 图片路径
  "favicon": "/static/images/favicon.png", // Favicon 路径
  "title": "应用名称" // 应用标题
}
```

### 2. 启用后端配置

在环境变量文件中设置：

```env
# .env.development 或 .env.production
VITE_USE_BACKEND_CONFIG=true
```

### 3. 代码中使用

#### 在组件中使用 Logo

```vue
<template>
  <img :src="logoUrl" alt="Logo" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import { getImageUrl } from '@/utils/logo'

const appStore = useAppStore()
const logoUrl = computed(() => getImageUrl(appStore.getLogoUrl()))
</script>
```

#### 手动更新配置

```typescript
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

// 更新配置
appStore.updateConfig({
  logo: '/new-logo.png',
  title: '新标题'
})

// 重新获取配置
await appStore.fetchConfig()
```

#### 动态设置 Favicon

```typescript
import { setFavicon, getImageUrl } from '@/utils/logo'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const faviconUrl = appStore.getFaviconUrl()
setFavicon(getImageUrl(faviconUrl))
```

## 文件结构

```
src/
├── store/
│   └── app.ts              # 应用配置 Store
├── utils/
│   └── logo.ts             # Logo 工具函数
└── main.ts                 # 应用入口（已集成配置初始化）
```

## API 说明

### AppStore (`useAppStore`)

#### 属性

- `config: AppConfig` - 配置对象
- `loaded: boolean` - 是否已加载配置

#### 方法

- `fetchConfig(): Promise<void>` - 从后端获取配置
- `updateConfig(newConfig: Partial<AppConfig>): void` - 更新配置
- `getLogoUrl(): string` - 获取 Logo URL
- `getFaviconUrl(): string` - 获取 Favicon URL
- `init(): Promise<void>` - 初始化配置

### Logo 工具函数

#### `setFavicon(url: string): void`

动态设置浏览器 Favicon。

#### `setPageTitle(title: string): void`

动态设置页面标题。

#### `getImageUrl(url: string): string`

获取完整的图片 URL，自动处理相对路径和绝对路径。

## 配置优先级

1. **后端配置** - 如果 `VITE_USE_BACKEND_CONFIG=true` 且后端返回了配置
2. **环境变量** - `VITE_APP_TITLE` 等环境变量
3. **默认值** - 代码中定义的默认值

## 注意事项

1. 后端返回的图片路径可以是：
   - 相对路径：`/static/images/logo.png`（会自动拼接 API base URL）
   - 绝对路径：`https://example.com/logo.png`（直接使用）

2. 如果后端 API 调用失败，系统会自动使用默认配置，不会影响应用启动。

3. Favicon 会在应用启动时自动设置，也可以在运行时动态更新。

## 示例：后端接口实现

### Python (Django)

```python
from django.http import JsonResponse

def get_app_config(request):
    return JsonResponse({
        'logo': '/static/images/logo.png',
        'favicon': '/static/images/favicon.png',
        'title': '我的应用'
    })
```

### Node.js (Express)

```javascript
app.get('/api/config/app', (req, res) => {
  res.json({
    logo: '/static/images/logo.png',
    favicon: '/static/images/favicon.png',
    title: '我的应用'
  })
})
```

## 故障排查

### Logo 不显示

1. 检查后端 API 是否正常返回
2. 检查图片路径是否正确
3. 检查网络请求是否成功（查看浏览器控制台）
4. 确认 `VITE_USE_BACKEND_CONFIG` 环境变量已设置

### Favicon 不更新

1. 清除浏览器缓存
2. 检查 `setFavicon` 函数是否被调用
3. 检查图片 URL 是否可访问
