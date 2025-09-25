# 融媒体项目 GitHub Pages 部署指南

本指南将帮助您将融媒体项目部署到 GitHub Pages。

## 前置准备

1. 确保您有 GitHub 账户
2. 项目已经初始化为 Git 仓库（已完成）
3. 已配置 GitHub Actions 工作流（已完成）

## 部署步骤

### 1. 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: 例如 `rongtongmeiti-platform`
   - Description: `融媒体工作台 - 现代化的融媒体内容管理平台`
   - 选择 Public（GitHub Pages 免费版需要公开仓库）
   - 不要勾选 "Add a README file"（因为本地已有文件）
4. 点击 "Create repository"

### 2. 更新配置文件

在推送代码之前，需要更新以下配置：

#### 更新 package.json
```json
"homepage": "https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME"
```
将 `YOUR_USERNAME` 替换为您的 GitHub 用户名，`YOUR_REPOSITORY_NAME` 替换为您创建的仓库名。

#### 更新 vite.config.ts
```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPOSITORY_NAME/' : '/'
```
同样替换 `YOUR_REPOSITORY_NAME` 为您的仓库名。

### 3. 推送代码到 GitHub

在项目根目录执行以下命令：

```bash
# 添加所有文件到 Git
git add .

# 提交代码
git commit -m "Initial commit: 融媒体工作台项目"

# 添加远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 重命名主分支为 main（如果需要）
git branch -M main

# 推送代码到 GitHub
git push -u origin main
```

### 4. 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分，选择 "GitHub Actions"
4. 保存设置

### 5. 等待部署完成

1. 推送代码后，GitHub Actions 会自动开始构建和部署
2. 在仓库的 "Actions" 选项卡中可以查看部署进度
3. 部署成功后，您的网站将在以下地址可用：
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME
   ```

## 后续更新

每次您推送代码到 `main` 分支时，GitHub Actions 会自动重新构建和部署您的网站。

```bash
# 添加更改
git add .

# 提交更改
git commit -m "更新描述"

# 推送到 GitHub
git push
```

## 故障排除

### 常见问题

1. **部署失败**：检查 Actions 选项卡中的错误日志
2. **页面显示 404**：确认 GitHub Pages 设置正确，并且 base 路径配置正确
3. **样式丢失**：检查 vite.config.ts 中的 base 配置是否正确

### 检查部署状态

- 在仓库的 "Actions" 选项卡查看工作流状态
- 在 "Settings" > "Pages" 查看部署状态和网站地址

## 自定义域名（可选）

如果您有自己的域名，可以在 "Settings" > "Pages" > "Custom domain" 中配置。

## 注意事项

1. 首次部署可能需要几分钟时间
2. 确保仓库是公开的（Private 仓库需要 GitHub Pro）
3. 如果遇到权限问题，检查仓库的 Actions 权限设置

---

部署完成后，您的融媒体工作台将在 GitHub Pages 上运行！