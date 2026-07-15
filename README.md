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
