# 云原生手册

面向中文学习者的云原生入门网站：六个核心主题、可点击的请求链路图、学习路线和官方资料。

## 本地运行

需要 Node.js 20 或以上，无第三方运行依赖。

```sh
npm start
```

默认端口为 3000，可通过 `PORT` 和 `HOST` 环境变量调整。默认监听 `0.0.0.0`。浏览器访问服务地址即可学习。

```sh
npm test
```

测试验证页面与静态资源访问、请求方法、404 和内部文件访问隔离。浏览器支持主题筛选、关键词搜索、原生可展开笔记、架构层切换和进度记录。进度仅保存在当前浏览器的 localStorage；没有账户、后端数据库或跨设备同步。

## 部署

`index.html`、`style.css` 和 `app.js` 可直接部署到静态托管平台，路径使用相对地址，适用于 GitHub Pages 的项目子路径。也可以运行自带 Node.js 服务。

本仓库不自动配置 GitHub Pages。推送代码和发布可公开访问的网站是两个独立操作。

## 内容边界

架构图与练习为学习示例，并非生产部署模板。微服务、Kubernetes 和服务网格都应根据业务与团队能力选择。页面不执行 Kubernetes 命令，也不连接云账户。

参考资料：

- [CNCF](https://www.cncf.io/about/who-we-are/)
- [Kubernetes 中文文档](https://kubernetes.io/zh-cn/docs/home/)
- [Docker 入门](https://docs.docker.com/get-started/)
- [OpenTelemetry](https://opentelemetry.io/docs/)
