# 楼宇资产管理平台文档

欢迎查阅楼宇资产管理平台文档。本文档按照不同受众的需求进行组织，帮助您快速找到所需信息。

## 📚 文档结构

### [架构设计](./architecture/)
技术架构和设计决策
- [系统概览](./architecture/overview.md) - 高层系统架构
- [数据模型](./architecture/data-model.md) - 数据库架构和关系
- [安全架构](./architecture/security.md) - 认证和授权设计
- [技术栈](./architecture/tech-stack.md) - 技术选型和理由

### [API 参考](./api/)
完整的 API 文档
- [REST API 参考](./api/reference.md) - 所有 API 端点及示例
- [认证机制](./api/authentication.md) - JWT 令牌使用说明
- [错误处理](./api/errors.md) - API 错误代码和响应
- [分页](./api/pagination.md) - 如何处理分页响应

### [指南](./guides/)
面向不同受众的分步指南

#### [开发者指南](./guides/developer/)
- [快速开始](./guides/developer/getting-started.md) - 搭建开发环境
- [后端开发](./guides/developer/backend.md) - Go 后端开发指南
- [前端开发](./guides/developer/frontend.md) - React 前端开发指南
- [测试](./guides/developer/testing.md) - 如何编写和运行测试
- [代码规范](./guides/developer/code-style.md) - 编码标准和约定

#### [用户指南](./guides/user/)
- [快速入门](./guides/user/quick-start.md) - 开始使用平台
- [资产管理](./guides/user/asset-management.md) - 管理楼宇和资产
- [地图功能](./guides/user/map-features.md) - 使用地图可视化
- [报表](./guides/user/reports.md) - 生成和理解报表

#### [部署指南](./guides/deployment/)
- [Docker 部署](./guides/deployment/docker.md) - 使用 Docker 部署
- [手动部署](./guides/deployment/manual.md) - 不使用 Docker 部署
- [配置管理](./guides/deployment/configuration.md) - 环境变量和设置
- [监控](./guides/deployment/monitoring.md) - 健康检查和日志

### [参考资料](./references/)
其他参考材料
- [术语表](./references/glossary.md) - 术语和定义
- [常见问题](./references/faq.md) - 常见问题解答
- [故障排除](./references/troubleshooting.md) - 常见问题和解决方案
- [更新日志](./references/changelog.md) - 版本历史和变更

## 🔍 快速链接

- **初次使用？** 从[快速开始](./guides/developer/getting-started.md)开始
- **查找 API 文档？** 查看 [API 参考](./api/reference.md)
- **需要部署？** 参见[部署指南](./guides/deployment/)
- **想要贡献？** 阅读我们的[贡献指南](../CONTRIBUTING.md)

## 📖 文档标准

本文档遵循以下原则：
- **清晰简洁**：使用简单语言，避免行话
- **示例驱动**：包含代码示例和截图
- **保持更新**：文档与代码保持同步
- **便于搜索**：使用描述性标题和关键词

## 🤝 贡献文档

我们始终欢迎文档改进！请：
1. 遵循现有的结构和风格
2. 在适当的地方包含示例
3. 如果添加新页面，请更新目录
4. 提交包含您更改的拉取请求

更多详情，请参见我们的[贡献指南](../CONTRIBUTING.md)。