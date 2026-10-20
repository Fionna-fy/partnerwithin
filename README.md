# partnerwithin — Interactive Phone Simulator

开放式无闭环手机互动站。支持 WhatsApp 风格聊天、动态事件系统、可自定义角色与互动。

**在线预览**：https://fionna-fy.github.io/partnerwithin/

## 功能

- 锁屏 + 主屏幕（参考真实 iOS 布局）
- WhatsApp 聊天（可发送消息，对方会自动回复）
- 动态事件系统（随机新消息 / 来电 / 通知，永不停止）
- 配置中心：自定义主人名字、添加/删除联系人、开关事件频率
- 本地持久化 + 导出/导入 JSON
- 纯静态，适合 GitHub Pages

## 使用

1. 打开网站后点击屏幕解锁
2. 点击 WhatsApp 进入聊天
3. 右上角 ⚙️ 进入配置中心自定义角色

## 技术

纯前端 HTML + CSS + Vanilla JS，数据使用 localStorage。

## 许可证

MIT
