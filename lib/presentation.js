export function noteSummary(post){
  if(post.slug.includes("browser-mcp"))return "让 Agent 接入正在使用的 Edge：Playwriter 负责日常操作，browser-harness 支撑复杂流程。";
  if(post.slug.includes("fnnas"))return "从照片存储到 Docker 服务，记录搭建个人私有云的初次体验。";
  if(post.slug.includes("openclaw"))return "从环境准备、容器部署到渠道接入，记录 NAS 上 AI 助手的安装过程。";
  return post.description;
}
export function readingMinutes(post){
  return Math.max(1,Math.ceil((post.content||post.description||"").length/450));
}
