---
layout: home
title: 主页
description: 折腾记录 & 经验分享 - AI、NAS、技术宅
---

> 🚀 折腾是最好的学习方式

我是 Vinwjin，一个热爱技术的折腾党。这个博客记录了我的学习笔记、技术心得和踩坑经历。

## 🎯 关于这个博客

- 📝 分享技术教程和踩坑记录
- 🤖 探索 AI 和自动化
- 🖥️ 折腾 NAS 和服务器
- 💡 记录效率提升方法

## 📚 最新文章

{% for post in site.posts limit: 10 %}
  {% unless post.hidden %}
  <article class="post-preview">
    <a href="{{ post.url }}">{{ post.title }}</a>
    <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
  </article>
  {% endunless %}
{% endfor %}

[查看更多 →]({{ site.baseurl }}/archives.html)
