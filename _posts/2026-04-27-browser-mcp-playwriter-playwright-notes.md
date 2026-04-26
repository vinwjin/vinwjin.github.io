---
layout: post
title: "浏览器 MCP 方案踩坑全记录：Playwriter 主力，Playwright Bridge 备用"
date: 2026-04-27
updated: 2026-04-27
categories: [AI, 教程, 浏览器自动化]
tags: [MCP, Playwriter, Playwright, Edge, Claude Code, Codex]
toc: true
---

这篇文章记录我在 Windows + Edge 环境下，把浏览器接入 MCP 给 AI Agent 控制时踩过的坑，以及最后跑通后的可用方案。

结论先说：

- **方案一：`browser-mcp`（Playwriter）**
  - 当前最稳
  - 可以复用当前已打开标签页和登录态
  - 适合做主力方案
- **方案二：官方 `Playwright MCP Bridge`**
  - 现在已经能用
  - 但长会话稳定性一般
  - 更适合作为备用方案

## 1. 适用对象

本文不是只针对某一个客户端写的，而是面向所有支持 MCP 的 Agent 客户端，例如：

- Codex
- Claude Desktop / Claude Code
- WorkBuddy
- Hermes
- 其他支持 STDIO MCP 或 HTTP MCP 的客户端

只要你的客户端支持以下任一种接法，就可以套用本文：

- **STDIO MCP**
  - 填写启动命令、参数、环境变量
- **HTTP MCP**
  - 填写 `http://127.0.0.1:PORT/mcp`

## 2. 方案概览

| 方案 | 能否复用当前标签页 | 能否复用登录态 | 当前结论 |
|------|:---:|:---:|------|
| `browser-mcp`（Playwriter） | ✅ | ✅ | 主力方案 |
| `@playwright/mcp --isolated` | ❌ | ❌ | 不适合现有登录态场景 |
| `@playwright/mcp --browser msedge --extension` | ✅ | ✅ | 已打通，但稳定性一般 |

## 3. 方案一：Playwriter + browser-mcp

### 3.1 架构

```text
AI Agent -> browser-mcp -> Playwriter Relay -> Playwriter 扩展 -> 现有 Edge 标签页
```

核心思路是：

- 不新开浏览器
- 直接复用你已经打开的 Edge
- 由扩展把当前标签页暴露给 MCP

### 3.2 参考链接

- Playwriter 官网：[playwriter.dev](https://playwriter.dev/)
- Playwriter GitHub：[remorses/playwriter](https://github.com/remorses/playwriter)
- Playwriter 扩展页：[Chrome Web Store - Playwriter](https://chromewebstore.google.com/detail/playwriter/amkbmndfnliijdhojkpoglbnaaahippg)
- browser-mcp 仓库：[nicepkg/playwriter-browser-mcp](https://github.com/nicepkg/playwriter-browser-mcp)
- 官方 Playwright MCP：[microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)

### 3.3 必要环境

至少需要这些前置条件：

1. 浏览器
   - Edge / Chrome / Chromium 之一
   - 本文实测环境是 **Windows + Edge**

2. Node.js
   - 建议 `Node.js 18+`

3. Playwriter 扩展
   - 必装
   - 目标标签页需要手动点成绿色激活

4. Playwriter CLI
   - 建议安装
   - 用来启动 relay 和排查环境

5. `playwriter-browser-mcp`
   - 必装
   - 它才是给 MCP 客户端接入的这一层

### 3.4 安装步骤

#### 3.4.1 安装 Playwriter 扩展

安装扩展后，目标标签页上要手动点一次扩展图标，**图标变绿才算当前页已接管**。

#### 3.4.2 安装 Playwriter CLI

```bash
npm install -g playwriter
playwriter --version
```

#### 3.4.3 安装 browser-mcp

这个项目不是直接一条 `npx` 就完事，最稳的方式是拉源码：

```bash
git clone https://github.com/nicepkg/playwriter-browser-mcp.git
cd playwriter-browser-mcp
npm install
npm run build
```

构建后要用到：

```text
dist/stdio.js
dist/index.js
```

### 3.5 先启动 Relay

先起 Playwriter relay：

```bash
playwriter serve --host localhost --replace
```

确认 `19988` 端口在监听后，再连 MCP。

### 3.6 MCP 配置写法

#### 3.6.1 STDIO 版 JSON

```json
{
  "mcpServers": {
    "browser-mcp": {
      "command": "node",
      "args": ["C:\\Users\\vinwj\\playwriter-browser-mcp\\dist\\stdio.js"],
      "env": {
        "PLAYWRITER_RELAY_HOST": "127.0.0.1",
        "PLAYWRITER_RELAY_PORT": "19988",
        "PLAYWRITER_EXTENSION_ID": "profile:b87e8782196ef80c"
      }
    }
  }
}
```

#### 3.6.2 表单版直接照抄

- 名称：`browser-mcp`
- 类型：`STDIO`
- 启动命令：`node`
- 参数：`C:\Users\vinwj\playwriter-browser-mcp\dist\stdio.js`
- 环境变量：
  - `PLAYWRITER_RELAY_HOST=127.0.0.1`
  - `PLAYWRITER_RELAY_PORT=19988`
  - `PLAYWRITER_EXTENSION_ID=profile:b87e8782196ef80c`
- 工作目录：
  - 推荐填 `C:\Users\vinwj\playwriter-browser-mcp`

#### 3.6.3 HTTP 版

先本地起 HTTP MCP：

```bash
cd C:\Users\vinwj\playwriter-browser-mcp
set MCP_PORT=3280
set PLAYWRITER_RELAY_HOST=127.0.0.1
set PLAYWRITER_RELAY_PORT=19988
set PLAYWRITER_EXTENSION_ID=profile:b87e8782196ef80c
node dist/index.js
```

然后在客户端中填：

- 类型：`HTTP MCP` / `流式 HTTP`
- 地址：`http://127.0.0.1:3280/mcp`

### 3.7 `PLAYWRITER_EXTENSION_ID` 最重要的坑

这里一定要写对。

推荐写法：

```text
PLAYWRITER_EXTENSION_ID=profile:b87e8782196ef80c
```

这是一种 **stable profile key**。

也可以在只有一个活跃扩展时，临时不写 `PLAYWRITER_EXTENSION_ID`，让 relay 自动回退。

但是不要把 relay `/extensions/status` 返回的瞬时 `extensionId` 直接抄进配置，例如：

```text
mog5rahs_8it4bv
```

这种写法会直接报：

```text
Unknown extensionId: mog5rahs_8it4bv
```

### 3.8 使用前自检

建议按这个顺序检查：

1. `playwriter --version`
2. relay 是否在监听 `19988`
3. 目标标签页的 Playwriter 图标是否已变绿
4. MCP 客户端里是否写了：
   - `PLAYWRITER_RELAY_HOST`
   - `PLAYWRITER_RELAY_PORT`
   - `PLAYWRITER_EXTENSION_ID`
5. 如果还不通，先试把 `PLAYWRITER_EXTENSION_ID` 改成稳定的 `profile:...`

### 3.9 实测结果

这次我专门做了：

- 连通性验证
- 现有标签页复用验证
- 稳定性循环验证
- 全功能矩阵验证

#### 3.9.1 连通性

结果：**通过**

- 能枚举现有标签页
- 能接管当前已打开的 Edge 标签页
- 能读取 URL / Title / 正文内容

#### 3.9.2 一个容易忽略的新坑：Playwriter 的 ref 用 DOM id

在 Playwriter 这套实现里，很多交互工具的 `ref`，实测可以直接写 DOM `id`：

- `text-input`
- `select-input`
- `hover-target`
- `drag-source`
- `drop-target`

例如：

```json
{ "ref": "text-input" }
```

它不是官方 Bridge 常见的 `e1 / e2 / e3` 那种风格。

#### 3.9.3 功能矩阵

以下能力已经实测通过：

- `browser_tabs list`
- `browser_tabs new`
- `browser_tabs select`
- `browser_tabs close`
- `browser_navigate`
- `browser_navigate_back`
- `browser_snapshot`
- `browser_take_screenshot`
- `browser_resize`
- `browser_wait_for`
- `browser_evaluate`
- `browser_run_code`
- `browser_console_messages`
- `browser_network_requests`
- `browser_type`
- `browser_press_key`
- `browser_hover`
- `browser_select_option`
- `browser_fill_form`
- `browser_file_upload`
- `browser_drag`
- `browser_close`

说明：

- `browser_run_code` 的代码要写成：

```js
async (page) => ({ title: await page.title(), href: page.url() })
```

- `browser_console_messages` 必须显式传 `level`，例如：

```json
{ "level": "info" }
```

#### 3.9.4 稳定性

在同一会话里连续跑 10 步：

- `tabs`
- `snapshot`
- `evaluate`
- `run_code`
- `console_messages`
- `network_requests`
- 再重复一轮

结果是：

- 固定 `PLAYWRITER_EXTENSION_ID=profile:b87e8782196ef80c`：**10/10 成功**
- 不写 `PLAYWRITER_EXTENSION_ID`，自动回退：**10/10 成功**

这点明显好于官方 Playwright Bridge。

#### 3.9.5 目前仍不建议当成“绝对稳定能力”的点

- `click + prompt` 这条链路还不够稳
- `network_requests` 可能混入之前页面遗留请求

但整体上，它已经足够做：

- 点击卡片
- 点视频
- 表单填写
- 上传文件
- 切 tab
- 读取页面内容
- 返回 / 刷新 / 导航

## 4. 方案二：官方 Playwright MCP Bridge

如果你坚持走官方方案，需要：

- 安装官方 Bridge 扩展
- 使用：

```bash
npx @playwright/mcp@latest --browser msedge --extension
```

注意这里 **必须显式带 `--browser msedge`**。  
只写 `--extension` 时，很多环境下会默认去找 Chrome。

### 4.1 参考链接

- 官方仓库：[microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- 官方扩展说明：[Playwright MCP extension package](https://github.com/microsoft/playwright-mcp/tree/main/packages/extension)

### 4.2 当前结论

官方 Bridge 现在已经不是“不能用”，而是：

- 已经打通
- 可以接管当前打开标签页
- 但长会话稳定性一般

如果你的目标是“尽快稳定上手”，还是建议优先方案一。

## 5. 最终建议

如果你想让 AI Agent 稳定接管当前浏览器标签页，我现在的推荐顺序是：

1. **优先用 Playwriter + browser-mcp**
2. **官方 Bridge 作为备用**
3. 不建议再把 `--isolated` 当成主力方案

一句话总结：

> 当前 Windows + Edge 场景下，想复用现有标签页和登录态，`browser-mcp（Playwriter）` 是更稳的主力解法。
