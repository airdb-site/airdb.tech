# airdb.tech

竺砥科技（AIRDB TECH）官方网站仓库。

> Frontier tech, from 0 to 1 — proven, then handed off.

## 品牌定位

关于竺砥科技是谁、做什么、边界在哪里，见 [POSITIONING.md](./POSITIONING.md)。

## 技术栈

- [Astro](https://astro.build/) 静态站点，部署至 GitHub Pages（自定义域名 `airdb.tech`）
- 自托管 IBM Plex Mono 字体（latin / latin-ext），CJK 使用系统字体
- 无运行时依赖：页面动效为原生 CSS/JS，尊重 `prefers-reduced-motion`

## 本地开发

```bash
make install   # pnpm install --frozen-lockfile
make run       # pnpm dev
make build     # pnpm build → dist/
```

## 联系

info@airdb.com

## 本地验证

```bash
pnpm check
pnpm build
pnpm preview --host 127.0.0.1 --port 4323
pnpm test:browser
```

浏览器回归默认使用本机 Google Chrome，覆盖六种视口、有无 JavaScript、导航、键盘焦点、减少动态效果、内容显现与 404。也可安装 Playwright Chromium 后运行：

```bash
pnpm exec playwright install chromium
BROWSER_CHANNEL=chromium pnpm test:browser
```

`BASE_URL` 可指定其他本地预览地址。无障碍扫描为自动检查，不能替代屏幕阅读器人工验证。
