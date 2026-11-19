# 余光 · 深空观测站

一个中文太阳系探索网站，可切换查看火星、土星和海王星的观测档案。行星插图为艺术演绎，档案附有 NASA 资料链接。

## 本地运行

需要 Node.js 20 或更新版本。项目无需安装第三方依赖。

```sh
npm start
npm test
```

服务默认监听 3000 端口，可以通过 `PORT` 和 `HOST` 调整。

## 发布

GitHub Actions 在推送到 `main` 后运行测试，将 `index.html`、`style.css`、`app.js` 和 `saturn.webp` 发布到 GitHub Pages。首次发布时，在仓库的 Settings → Pages 中选择 GitHub Actions 作为构建来源。

发布成功后访问 https://swxfll.github.io/chatgpt/
