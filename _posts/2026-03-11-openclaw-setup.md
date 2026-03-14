---
layout: article
title: "OpenClaw 安装配置指南"
date: 2026-03-11
updated: 2026-03-11
categories: [AI, 教程]
tags: [OpenClaw, AI, NAS, Docker]
image:
  feature: /assets/img/placeholder.png
toc: true
---

## 简介

OpenClaw 是一个运行在 NAS 上的 AI 助手框架，支持多种渠道接入（飞书、Telegram 等）。

## 环境准备

- NAS 一台（飞牛NAS）
- Docker
- API Key（MiniMax、OpenAI 等）

## 安装步骤

### 1. 安装 Docker

在飞牛NAS 的应用中心安装 Docker 套件。

### 2. 拉取镜像

```bash
docker pull openclaw/openclaw
```

### 3. 运行容器

```bash
docker run -d \
  --name openclaw \
  -p 8080:8080 \
  -v ~/.openclaw:/data \
  openclaw/openclaw
```

### 4. 配置

编辑 `~/.openclaw/config.yaml`，配置你的 AI API 和渠道。

## 接入飞书

1. 创建飞书应用
2. 获取 App ID 和 App Secret
3. 在配置文件中填写
4. 添加机器人到群聊

---

有问题欢迎留言~
