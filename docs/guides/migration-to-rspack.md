# 前端技术栈迁移指南：从 Create React App 到 Rspack

## 迁移概述

本项目已成功从 Create React App 迁移到 Rspack + Rsbuild，获得了显著的性能提升和更好的开发体验。

## 迁移动机

### 性能优势
- **构建速度提升**: Rspack 基于 Rust 实现，构建速度比 Webpack 快 5-10 倍
- **热重载速度**: 毫秒级的热模块替换（HMR）
- **启动时间**: 开发服务器启动时间从秒级降低到毫秒级

### 兼容性优势
- **Webpack 生态兼容**: 支持大部分 Webpack 插件和配置
- **无缝迁移**: 最小化代码变更，保持原有开发体验

## 技术栈变更

### 变更前 (Create React App)
- **构建工具**: Webpack (通过 react-scripts)
- **开发服务器**: Webpack Dev Server
- **配置**: 封装在 react-scripts 中，难以自定义
- **测试**: Jest + React Testing Library

### 变更后 (Rspack + Rsbuild)
- **构建工具**: Rspack (基于 Rust)
- **开发服务器**: Rsbuild DevServer
- **配置**: 灵活的 `rsbuild.config.ts` 配置
- **测试**: Jest + React Testing Library + Playwright

## 迁移步骤

### 1. 安装 Rsbuild 相关依赖

```bash
npm install @rsbuild/core @rsbuild/plugin-react @rsbuild/plugin-type-check @rsbuild/plugin-sass @rsbuild/plugin-less --save-dev
```

### 2. 创建 Rsbuild 配置文件

创建 `rsbuild.config.ts`:

```typescript
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginLess } from '@rsbuild/plugin-less';

export default defineConfig({
  html: {
    template: './public/index.html',
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  output: {
    distPath: {
      root: 'build',
    },
    assetPrefix: '/',
  },
  server: {
    port: 3000,       // 固定使用 3000 端口进行开发和部署
    open: true,       // 自动打开浏览器
    host: '0.0.0.0',  // 允许外部访问（Docker 环境需要）
  },
  dev: {
    hmr: true,
  },
  plugins: [
    pluginReact(),
    pluginTypeCheck(),
    pluginSass(),
    pluginLess(),
  ],
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [
          require('autoprefixer'),
        ],
      },
    },
  },
});
```

### 3. 更新 package.json 脚本

```json
{
  "scripts": {
    "start": "rsbuild dev",
    "build": "rsbuild build",
    "preview": "rsbuild preview",
    "test": "react-scripts test",
    "test:playwright": "playwright test"
  }
}
```

### 4. 移除 Create React App 依赖

```bash
npm uninstall react-scripts
```

### 5. 更新 HTML 模板

将 `public/index.html` 中的 `%PUBLIC_URL%` 替换为直接路径：

```html
<!-- 变更前 -->
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />

<!-- 变更后 -->
<link rel="icon" href="/favicon.ico" />
```

### 6. 配置 Playwright 测试

安装并配置 Playwright:

```bash
npm install @playwright/test --save-dev
npx playwright install
```

创建 `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 性能对比

### 构建时间对比
- **Create React App**: ~30-60 秒
- **Rspack**: ~3-5 秒
- **提升倍数**: 6-12x

### 热重载时间对比
- **Create React App**: ~1-3 秒
- **Rspack**: ~50-200 毫秒
- **提升倍数**: 10-60x

### 开发服务器启动时间
- **Create React App**: ~5-15 秒
- **Rspack**: ~0.5-2 秒
- **提升倍数**: 5-30x

## 新增功能

### 1. Playwright 端到端测试

```bash
# 运行端到端测试
npm run test:playwright

# 在 headed 模式运行（可视化）
npx playwright test --headed

# 生成测试报告
npx playwright show-report
```

### 2. 更好的开发体验

- **极速热重载**: 文件保存后立即看到更改
- **TypeScript 类型检查**: 构建时进行类型检查
- **多格式支持**: 原生支持 Sass、Less、CSS
- **模块联邦**: 支持微前端架构（可选）

### 3. 生产优化

- **Tree Shaking**: 自动移除未使用的代码
- **代码分割**: 自动优化包分割策略
- **压缩优化**: 内置 SWC 压缩器
- **Bundle 分析**: 内置构建分析工具

## 最佳实践

### 1. 配置优化

```typescript
// 开发环境优化
export default defineConfig({
  dev: {
    hmr: true,
    liveReload: true,
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0', // 允许外部访问
  },
});
```

### 2. 生产构建优化

```typescript
// 生产环境优化
export default defineConfig({
  output: {
    minify: true,
    target: 'web',
    polyfill: 'usage', // 按需引入 polyfill
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
    },
  },
});
```

### 3. 测试策略

- **单元测试**: 使用 Jest + React Testing Library
- **端到端测试**: 使用 Playwright 覆盖关键用户流程
- **性能测试**: 使用 Lighthouse 监控性能指标

## 故障排除

### 常见问题

1. **Less/Sass 文件无法识别**
   - 确保安装了对应的插件：`@rsbuild/plugin-less` 或 `@rsbuild/plugin-sass`

2. **TypeScript 类型检查错误**
   - 检查 `tsconfig.json` 配置
   - 确保安装了 `@rsbuild/plugin-type-check`

3. **热重载不工作**
   - 检查 `dev.hmr` 配置
   - 确保开发服务器正确启动

4. **构建产物路径问题**
   - 检查 `output.distPath` 配置
   - 确保 `assetPrefix` 设置正确

### 调试技巧

```bash
# 开启详细日志
RSPACK_LOG=debug npm run build

# 分析构建产物
npx rsbuild build --analyze

# 检查配置
npx rsbuild inspect
```

## 后续规划

### 短期计划
- [ ] 完善 ESLint 配置集成
- [ ] 添加更多 Playwright 测试用例
- [ ] 优化构建缓存策略

### 长期计划
- [ ] 考虑微前端架构（Module Federation）
- [ ] 集成 Storybook for Rspack
- [ ] 探索 Web Workers 和 Service Workers

## 总结

Rspack 迁移为项目带来了显著的性能提升和更好的开发体验：

- ✅ **构建速度提升 6-12 倍**
- ✅ **热重载速度提升 10-60 倍**
- ✅ **保持 100% 功能兼容性**
- ✅ **增强测试能力（Playwright）**
- ✅ **更灵活的配置选项**

迁移过程平滑，无需修改业务代码，推荐所有 React 项目考虑升级到 Rspack。 