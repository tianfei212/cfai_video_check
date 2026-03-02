# Matchbox 演示集成（多语言 / 外部 type.json / 视频目录）

本项目通过 `cafai-matchbox`（本地依赖 `file:../matchbox/frontend`）集成 Matchbox 插件页面，路由为：

- `#/matchbox?projectId=1001`

## 1) 启动 Matchbox 服务端（推荐）

Matchbox 的外部数据（`type.json`）读取/写回，以及外部视频目录映射（多版本视频），都由 Matchbox 服务端提供。

在 `../matchbox/frontend` 目录启动（默认端口 `4500`）：

```bash
npm run dev -- --dataPath /ABS/PATH/TO/type.json --videoDir /ABS/PATH/TO/video_folder
```

需要的接口（由服务端提供）：

- `/api/shot`（根据 type.json 生成 shot/versions，并注入 videoUrl）
- `/api/version/:versionId`（写回 type.json）
- `/api/events`（SSE，外部命令热切换配置/语言）
- `/media/:filename`（视频文件输出）

## 2) cafai 前端代理配置

本项目已在开发服务器配置代理，将以下路径转发到 `http://localhost:4500`：

- `/api/*`
- `/media/*`

因此在 cafai 侧打开 `#/matchbox` 时，插件会以“同源”的方式访问上述接口，无需额外 CORS 配置。

## 3) 多语言联动

Matchbox 插件自身已内置 `en / zh-CN` 词典，并支持运行时配置（含 SSE 热更新）。

在 cafai 中：

- 系统语言切换（设置中心）会通过 `setMatchboxRuntimeConfig({ lang })` 同步到 Matchbox 页面
- 若你同时使用外部命令 `matchboxctl.ts` 切换语言，Matchbox 页面也可通过 SSE 热更新

## 4) 外部命令（可选）

外部命令默认连接 `http://localhost:4500`：

```bash
npm run ctl -- lang zh-CN
npm run ctl -- lang en

npm run ctl -- videodir /ABS/PATH/TO/video_folder
npm run ctl -- typejson /ABS/PATH/TO/type.json
```

