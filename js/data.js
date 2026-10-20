// ===== Default Data (可完全自定义) =====
const DEFAULT_DATA = {
  owner: {
    name: "Fionna",
    wallpaper: "purple" // purple | fabric
  },
  contacts: [
    {
      id: "c1",
      name: "Alex",
      avatar: "🧑‍💻",
      relation: "大学同学 / 项目搭档",
      personality: "理性、偶尔吐槽、靠谱",
      lastMessage: "明天记得带电脑",
      lastTime: "昨天",
      unread: 2,
      messages: [
        { from: "them", text: "作业写完了吗？", time: "14:20" },
        { from: "me", text: "还差一点", time: "14:22" },
        { from: "them", text: "明天记得带电脑", time: "14:25" },
        { from: "them", text: "实验室见", time: "14:26" }
      ]
    },
    {
      id: "c2",
      name: "Mia",
      avatar: "🌸",
      relation: "高中好友",
      personality: "活泼、爱分享日常",
      lastMessage: "周末去看展吗？",
      lastTime: "09:12",
      unread: 0,
      messages: [
        { from: "them", text: "周末去看展吗？", time: "09:12" },
        { from: "me", text: "哪一场？", time: "09:15" },
        { from: "them", text: "当代艺术那个，听说不错", time: "09:18" }
      ]
    },
    {
      id: "c3",
      name: "Mom",
      avatar: "👩",
      relation: "家人",
      personality: "关心、碎碎念",
      lastMessage: "记得按时吃饭",
      lastTime: "周一",
      unread: 1,
      messages: [
        { from: "them", text: "天气降温了，多穿点", time: "08:30" },
        { from: "them", text: "记得按时吃饭", time: "08:32" }
      ]
    }
  ],
  eventsEnabled: true,
  eventFreq: "medium", // low | medium | high
  // 动态事件模板（可扩展）
  eventTemplates: [
    { type: "message", contactId: null, text: "在干嘛呢？" },
    { type: "message", contactId: null, text: "今天天气不错诶" },
    { type: "message", contactId: null, text: "记得喝水哦" },
    { type: "call", contactId: null },
    { type: "notification", title: "系统", body: "你有一条新的提醒" },
    { type: "message", contactId: null, text: "晚上一起吃饭？" }
  ]
};

// 从 localStorage 加载或使用默认
function loadData() {
  try {
    const saved = localStorage.getItem("phoneSimData");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  localStorage.setItem("phoneSimData", JSON.stringify(data));
}

let appData = loadData();
