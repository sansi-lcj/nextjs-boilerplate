# 贡献指南

我们非常欢迎您的贡献！我们希望让向这个项目贡献变得尽可能简单和透明，无论是：

- 报告错误
- 讨论当前代码状态
- 提交修复
- 提出新功能
- 成为维护者

## 开发流程

我们使用 GitHub 托管代码，跟踪问题和功能请求，以及接受拉取请求。

1. Fork 仓库并从 `main` 创建您的分支
2. 如果您添加了需要测试的代码，请添加测试
3. 如果您更改了 API，请更新文档
4. 确保测试套件通过
5. 确保您的代码符合规范
6. 发起拉取请求！

## 代码风格

### Go 代码风格
- 遵循官方的 [Go 代码审查建议](https://github.com/golang/go/wiki/CodeReviewComments)
- 使用 `gofmt` 格式化代码
- 使用有意义的变量和函数名
- 为导出的函数和类型添加注释

### TypeScript/React 代码风格
- 遵循 [Airbnb JavaScript 风格指南](https://github.com/airbnb/javascript)
- 所有新文件使用 TypeScript
- 使用函数组件和 Hooks
- 保持组件小而专注

## 提交消息

我们遵循[约定式提交](https://www.conventionalcommits.org/)规范：

```
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

类型：
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 仅文档更改
- `style`: 不影响代码含义的更改（空白、格式化、缺少分号等）
- `refactor`: 既不修复错误也不添加功能的代码更改
- `perf`: 提高性能的代码更改
- `test`: 添加缺失的测试或更正现有测试
- `chore`: 对构建过程或辅助工具的更改

示例：
```
feat(auth): 添加 JWT 刷新令牌支持

实现刷新令牌功能以提高安全性和用户体验。

Closes #123
```

## 拉取请求流程

1. 如果适用，更新 README.md 中的接口更改详情
2. 使用任何新文档更新 docs/ 目录
3. PR 标题应遵循与提交消息相同的约定
4. 将 PR 链接到任何相关问题
5. 请求维护者审查

## 测试

### 后端测试
```bash
cd backend
go test ./...
```

### 前端测试
```bash
cd frontend
npm test
```

## 设置开发环境

1. 安装所需工具：
   - Go 1.18+
   - Node.js 14+
   - Git

2. 克隆仓库：
   ```bash
   git clone https://github.com/your-org/building-asset-management.git
   cd building-asset-management
   ```

3. 安装依赖：
   ```bash
   make install
   ```

4. 设置预提交钩子（可选）：
   ```bash
   # 安装 pre-commit
   pip install pre-commit
   pre-commit install
   ```

## 项目结构

请维护现有的项目结构：

```
.
├── backend/          # Go 后端服务
├── frontend/         # React 前端
├── docs/            # 文档
├── scripts/         # 实用脚本
└── docker-compose.yml
```

## 报告错误

我们使用 GitHub Issues 跟踪公共错误。通过[创建新 Issue](https://github.com/your-org/building-asset-management/issues/new) 来报告错误。

**优秀的错误报告**通常包含：

- 快速摘要和/或背景
- 重现步骤
  - 要具体！
  - 如果可能，提供示例代码
- 您期望会发生什么
- 实际发生了什么
- 备注（可能包括您认为可能发生这种情况的原因，或您尝试过但没有奏效的内容）

## 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们作为贡献者和维护者承诺，参与我们的项目和社区的每个人都不会受到骚扰，无论年龄、体型、残疾、种族、性别特征、性别认同和表达、经验水平、教育、社会经济地位、国籍、个人外表、种族、宗教或性身份和取向如何。

### 我们的标准

有助于创造积极环境的行为示例包括：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 专注于对社区最有利的事情
- 对其他社区成员表示同情

不可接受的行为示例包括：

- 使用性语言或图像以及不受欢迎的性关注或骚扰
- 挑衅、侮辱/贬损性评论以及个人或政治攻击
- 公开或私下骚扰
- 未经明确许可，发布他人的私人信息
- 在专业环境中可能被合理认为不适当的其他行为

## 许可证

通过贡献，您同意您的贡献将根据 MIT 许可证进行许可。

## 参考资料

本文档改编自 [Facebook 的 Draft](https://github.com/facebook/draft-js/blob/master/CONTRIBUTING.md) 的开源贡献指南。