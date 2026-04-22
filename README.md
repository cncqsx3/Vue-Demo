# ProxyHub

一站式网络代理解决方案，支持 Docker Hub、GitHub、Hugging Face、Poe、LM Arena 等热门网站。

## 部署

### 环境变量

创建 `.env` 文件并设置密码：

```bash
PAGE_PASSWORD=your_password_here
```

或参考 `.env.example`。

### 静态页面部署

支持 Cloudflare Pages 和 GitHub Pages 静态导出。

#### Cloudflare Pages

1. 推送代码到 GitHub 仓库
2. 在 Cloudflare Dashboard 添加项目，连接到 GitHub
3. 构建设置：
   - Build command: `npm run build`
   - Build output directory: `out`
4. 添加环境变量：`PAGE_PASSWORD`
5. 部署

#### GitHub Pages

1. 在仓库设置中启用 GitHub Pages
2. 添加环境变量 `PAGE_PASSWORD` 作为 secret
3. 创建工作流文件（参考下方）

### 认证

访问部署的网站时需要输入密码认证。

- 密码通过 `PAGE_PASSWORD` 环境变量设置
- 认证状态保存在浏览器 session 中
- 关闭浏览器后需要重新输入密码

## 开发

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 技术栈

- Next.js 16
- React 19
- Tailwind CSS 4
- Radix UI