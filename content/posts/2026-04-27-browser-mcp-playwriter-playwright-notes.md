---
title: "浏览器 Agent 最终方案：Playwriter + browser-harness"
date: 2026-04-27 00:00:00
updated: 2026-04-29 00:00:00
categories: [AI, 教程, 浏览器自动化]
tags: [MCP, Playwriter, browser-harness, Edge, Codex]
toc: true
---

这篇文章记录我在 Windows + Edge 环境下，给 AI Agent 接入真实浏览器后的最终整理版。

现在方案已经收敛为两层：

1. **Playwriter**：作为默认的真实浏览器 MCP 通道。
2. **browser-harness**：作为 Codex 可直接调用、可持续沉淀 helper 的浏览器执行工具。

前面试过的零散桥接、隔离浏览器和稳定性一般的备选路线，这里不再保留。最终目标很明确：让 Agent 能使用我正在用的 Edge、复用登录态，并且在复杂任务里有一条可编程、可扩展、可调试的浏览器手臂。

## 1. 最终架构

```text
Codex / AI Agent
  ├─ MCP 默认通道：Playwriter
  │    └─ Playwriter Relay -> Playwriter Edge 扩展 -> 当前 Edge Profile
  │
  └─ CLI 增强通道：browser-harness
       └─ CDP -> 当前 Edge Profile -> agent-workspace helpers / domain skills
```

两条通道的分工不同：

| 通道 | 主要用途 | 特点 |
|------|------|------|
| Playwriter | 默认 MCP 浏览器工具 | 适合日常导航、点击、表单、截图、读取页面、复用 Edge 登录态 |
| browser-harness | Codex 侧高级执行工具 | 适合复杂网页任务、调试 CDP、沉淀站点 helper、直接写 Python 自动化 |

这不是二选一，而是组合拳：

- 简单交互走 Playwriter。
- 复杂流程、需要补 helper、需要长期沉淀站点经验时走 browser-harness。

## 2. 适用场景

这个组合适合这些任务：

- 复用当前 Edge 登录态操作网页。
- 让 Codex 读页面、点按钮、填表单、上传文件。
- 需要在真实浏览器里避开隔离环境造成的登录、风控和扩展问题。
- 需要把复杂网站的选择器、接口、页面结构沉淀成可复用技能。
- 需要在一次任务里边探索、边补 helper、边执行。

本文实测环境：

- Windows
- Microsoft Edge
- Codex Desktop
- Playwriter CLI + Playwriter Edge/Chrome 扩展
- browser-harness

## 3. Playwriter 通道

### 3.1 安装 Playwriter CLI

```bash
npm install -g playwriter
playwriter --version
```

确认 CLI 可用后，可以查看当前扩展连接的浏览器：

```bash
playwriter browser list
```

在我的环境里，最终识别到的是 Edge profile：

```text
profile:b87e8782196ef80c  extension  Edge  vinwjin@hotmail.com
```

这个 `profile:...` 是稳定 profile key，后续排障时很有用。

### 3.2 安装并启用 Playwriter 扩展

安装 Playwriter 浏览器扩展后，在目标 Edge profile 里启用它。

如果要让 Agent 控制当前页面，目标 tab 上的扩展需要处于可连接状态。实际使用时，先用下面命令确认扩展是否已经连上：

```bash
playwriter browser list
```

看到 `extension Edge` 这一行，说明 Edge 侧已经接通。

### 3.3 启动 Relay

Playwriter 默认使用本地 relay。手动启动方式：

```bash
playwriter serve --host 127.0.0.1 --replace
```

如果由 MCP server 拉起，也可以让它自动启动。我的配置里使用 `PLAYWRITER_AUTO_ENABLE=1`，让 Playwriter 在没有页面时自动创建或接入页面。

### 3.4 Codex MCP 配置

当前 Codex 配置使用 `playwriter` 作为 MCP server 名称，不再使用容易误导的旧名字。

`~/.codex/config.toml`：

```toml
[mcp_servers.playwriter]
type = "stdio"
command = "playwriter"

[mcp_servers.playwriter.env]
PLAYWRITER_AUTO_ENABLE = "1"
```

配置完成后，重启 Codex 会话，让 MCP server 重新加载。

### 3.5 Playwriter 自检

常用检查命令：

```bash
playwriter --version
playwriter browser list
playwriter session list
```

如果 relay 没有启动，可以手动启动：

```bash
playwriter serve --host 127.0.0.1 --replace
```

如果能看到 Edge profile，就说明默认 MCP 通道基本可用。

## 4. browser-harness 通道

browser-harness 是另一层能力：它不是为了替代 Playwriter MCP，而是给 Codex 一个更自由的浏览器执行环境。

它的价值在于：

- 通过 CDP 直接控制真实浏览器。
- 用 Python 代码完成复杂任务。
- 可以改 `agent-workspace/agent_helpers.py` 补工具函数。
- 可以在 `agent-workspace/domain-skills/` 里沉淀站点经验。
- 适合长期给 Agent 积累浏览器自动化能力。

### 4.1 安装

推荐放在一个稳定目录，然后用 editable tool 安装：

```bash
git clone https://github.com/browser-use/browser-harness C:\Users\vinwj\browser-harness
cd C:\Users\vinwj\browser-harness
uv tool install -e .
browser-harness --version
```

安装完成后，`browser-harness` 会成为全局命令。

### 4.2 注册为 Codex skill

为了让后续 Codex 会话自动知道怎么使用它，把 repo 注册到 Codex skills：

```powershell
New-Item -ItemType Directory -Force -Path C:\Users\vinwj\.codex\skills | Out-Null
New-Item -ItemType Junction `
  -Path C:\Users\vinwj\.codex\skills\browser-harness `
  -Target C:\Users\vinwj\browser-harness
```

注册后，新会话会加载：

```text
C:\Users\vinwj\.codex\skills\browser-harness\SKILL.md
```

### 4.3 Edge 调试授权

browser-harness 需要通过 CDP 连接真实浏览器。Windows + Edge 下，第一次通常需要在 Edge 里开启调试授权。

在 Edge 打开：

```text
chrome://inspect/#remote-debugging
```

或：

```text
edge://inspect/#remote-debugging
```

然后勾选页面里的远程调试相关选项，并点击 `Allow`。授权成功后，Edge profile 目录下会出现：

```text
C:\Users\vinwj\AppData\Local\Microsoft\Edge\User Data\DevToolsActivePort
```

这个文件出现后，browser-harness 就能发现本地 CDP 端口。

### 4.4 验证 browser-harness

最小验证：

```bash
browser-harness -c "print(page_info())"
```

打开新标签并读取页面信息：

```bash
browser-harness -c "new_tab('https://example.com'); wait_for_load(); print(page_info())"
```

实测成功返回：

```text
{'url': 'https://example.com/', 'title': 'Example Domain', ...}
```

这说明 browser-harness 已经能控制当前 Edge。

## 5. 两条通道怎么配合

我的实际使用习惯是：

1. **默认先走 Playwriter MCP**
   - 读页面
   - 点击
   - 输入
   - 切 tab
   - 截图
   - 简单表单和导航

2. **遇到复杂任务切到 browser-harness**
   - 页面结构复杂
   - 需要稳定 selector
   - 需要监听 CDP / 网络请求
   - 需要写循环、解析、批处理
   - 需要沉淀站点经验

3. **把学到的东西沉淀回 browser-harness**
   - 通用 helper 放进 `agent-workspace/agent_helpers.py`
   - 站点经验放进 `agent-workspace/domain-skills/<site>/`

这样做的好处是：Playwriter 保持轻快，browser-harness 负责成长。

## 6. 当前最终状态

当前机器上的最终状态：

- Playwriter CLI 已安装。
- Codex MCP server 已改名为 `playwriter`。
- 旧的 `browser-mcp` MCP server 配置已删除。
- Playwriter 能识别 Edge profile。
- browser-harness 已安装到 `C:\Users\vinwj\browser-harness`。
- browser-harness 已注册为 Codex skill。
- Edge 已完成 CDP 调试授权。
- browser-harness 已实测能打开 `https://example.com/` 并读取页面信息。

## 7. 常见问题

### 7.1 Playwriter 能看到 Edge，但 Codex 里工具还是旧名字

Codex 当前会话不会热重载 MCP server。改完 `~/.codex/config.toml` 后，需要重启 Codex 会话。

### 7.2 browser-harness --doctor 报 Access denied

在 Windows 上，`--doctor` 的进程检查可能会因为权限读不到部分进程信息而报 `Access denied`。

判断是否真正可用，优先看实际命令：

```bash
browser-harness -c "print(page_info())"
```

如果这个命令能返回页面信息，就说明浏览器控制链路是通的。

### 7.3 browser-harness 找不到 DevToolsActivePort

说明 Edge 当前 profile 还没有开启 CDP 调试授权。

处理方式：

1. 确认 Edge 正在运行。
2. 在 Edge 里打开 `chrome://inspect/#remote-debugging`。
3. 勾选远程调试相关选项。
4. 点击 `Allow`。
5. 重新运行：

```bash
browser-harness -c "print(page_info())"
```

## 8. 一句话总结

最终方案就是：**Playwriter 作为默认 MCP 浏览器通道，browser-harness 作为 Codex 的高级浏览器执行与技能沉淀通道。**

这套组合在 Windows + Edge 下能复用真实登录态，也能让 Agent 在复杂任务中逐步沉淀自己的浏览器自动化能力。
