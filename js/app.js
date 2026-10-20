// ===== Core App Logic =====
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let currentView = "lock"; // lock | home | app
let currentApp = null;
let currentChatId = null;

// ===== Time Update =====
function updateClock() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const time12 = ((h % 12) || 12) + ":" + m;
  const time24 = h.toString().padStart(2, "0") + ":" + m;

  $("#lockTime").textContent = time12;
  $("#homeTime").textContent = time24;

  // 简单农历/日期（演示用固定+真实日期）
  const week = ["日","一","二","三","四","五","六"][now.getDay()];
  $("#lockDate").textContent = `${now.getMonth()+1}月${now.getDate()}日周${week} · 丙午年九月十一`;
}
setInterval(updateClock, 10000);
updateClock();

// ===== Unlock =====
$("#lockScreen").addEventListener("click", unlock);
$("#lockScreen").addEventListener("touchend", unlock);

function unlock() {
  if (currentView !== "lock") return;
  $("#lockScreen").classList.remove("active");
  $("#homeScreen").classList.add("active");
  currentView = "home";
  renderHome();
  startEventLoop();
}

// ===== Home Screen Render =====
function renderHome() {
  const grid = $("#appGrid");
  grid.innerHTML = "";

  // Folders (模拟图片中的文件夹)
  const folders = [
    { name: "Safari", icons: ["🧭","🔍","⭐","📑"] },
    { name: "Editing", icons: ["✂️","🎬","🖼️","🎨"] },
    { name: "Shopping", icons: ["🛒","📦","💳","🏷️"] },
    { name: "QQ", icons: ["🐧"] },
    { name: "Game", icons: ["🎮","🕹️","🏆","👾"] },
    { name: "Medium", icons: ["📝","📰","💡","📚"] },
    { name: "Internet", icons: ["🌐","🐦","📘","📷"] },
    { name: "Trip", icons: ["✈️","🚇","🗺️","🏨"] },
    { name: "Study", icons: ["📖","✏️","🧮","🎓"] },
    { name: "Economic", icons: ["💰","📊","🏦","📈"] }
  ];

  folders.forEach(f => {
    const div = document.createElement("div");
    div.className = "folder";
    div.innerHTML = `
      <div class="folder-inner">
        ${f.icons.map(i => `<span>${i}</span>`).join("")}
      </div>
      <div class="folder-name">${f.name}</div>
    `;
    div.onclick = () => openApp("folder", f.name);
    grid.appendChild(div);
  });

  // WhatsApp (核心聊天)
  const wa = document.createElement("div");
  wa.className = "app-icon";
  const totalUnread = appData.contacts.reduce((s, c) => s + (c.unread || 0), 0);
  wa.innerHTML = `
    <div class="app-icon-inner" style="background:linear-gradient(135deg,#25d366,#128c7e)">
      💬
      ${totalUnread > 0 ? `<span class="badge">${totalUnread}</span>` : ""}
    </div>
    <div class="app-name">WhatsApp</div>
  `;
  wa.onclick = () => openApp("whatsapp");
  grid.appendChild(wa);

  // Days Matter Widget
  const widget = document.createElement("div");
  widget.className = "widget-large";
  widget.innerHTML = `
    <div style="font-size:13px;color:#666">我的生日还有</div>
    <div style="font-size:48px;font-weight:300;line-height:1">11</div>
    <div style="font-size:12px;color:#888">2026-10-31 星期六</div>
  `;
  grid.appendChild(widget);

  // 微信 (保留一个，但主要用WhatsApp)
  const wx = document.createElement("div");
  wx.className = "app-icon";
  wx.innerHTML = `
    <div class="app-icon-inner" style="background:linear-gradient(135deg,#07c160,#06ad56)">
      💚
      <span class="badge">4</span>
    </div>
    <div class="app-name">微信</div>
  `;
  wx.onclick = () => openApp("wechat");
  grid.appendChild(wx);

  updateBadges();
}

function updateBadges() {
  const total = appData.contacts.reduce((s, c) => s + (c.unread || 0), 0);
  const badge = $("#msgBadge");
  if (badge) {
    badge.textContent = total > 0 ? total : "";
    badge.style.display = total > 0 ? "flex" : "none";
  }
}

// ===== Open App =====
function openApp(type, extra) {
  currentApp = type;
  $("#homeScreen").classList.remove("active");
  $("#appScreen").classList.add("active");
  currentView = "app";

  const title = $("#appTitle");
  const content = $("#appContent");

  if (type === "whatsapp") {
    title.textContent = "WhatsApp";
    renderWhatsAppList(content);
  } else if (type === "wechat") {
    title.textContent = "微信（演示）";
    content.innerHTML = `<div style="padding:40px;text-align:center;color:#666">微信界面可自行扩展<br>当前主要使用 WhatsApp</div>`;
  } else if (type === "folder") {
    title.textContent = extra;
    content.innerHTML = `<div style="padding:40px;text-align:center;color:#666">文件夹「${extra}」内容可自定义扩展</div>`;
  } else if (type === "phone") {
    title.textContent = "电话";
    content.innerHTML = `<div style="padding:40px;text-align:center">最近通话 / 拨号盘（可扩展）</div>`;
  } else {
    title.textContent = type;
    content.innerHTML = `<div style="padding:40px;text-align:center;color:#666">功能开发中</div>`;
  }
}

function renderWhatsAppList(container) {
  let html = `
    <div class="wa-header">
      <span style="font-size:20px">WhatsApp</span>
      <span style="margin-left:auto;font-size:14px">⋯</span>
    </div>
    <div class="wa-list">
  `;
  appData.contacts.forEach(c => {
    html += `
      <div class="wa-chat-item" data-id="${c.id}">
        <div class="wa-avatar">${c.avatar || "👤"}</div>
        <div class="wa-info">
          <div class="wa-name">${c.name}</div>
          <div class="wa-last">${c.lastMessage || ""}</div>
        </div>
        <div class="wa-meta">
          <div>${c.lastTime || ""}</div>
          ${c.unread > 0 ? `<div class="wa-unread">${c.unread}</div>` : ""}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;

  $$(".wa-chat-item").forEach(el => {
    el.onclick = () => openChat(el.dataset.id);
  });
}

function openChat(id) {
  currentChatId = id;
  const contact = appData.contacts.find(c => c.id === id);
  if (!contact) return;

  // 清除未读
  contact.unread = 0;
  saveData(appData);
  updateBadges();

  const content = $("#appContent");
  let html = `
    <div class="chat-view">
      <div class="wa-header" style="background:#075e54">
        <button onclick="renderWhatsAppList(document.getElementById('appContent'))" style="background:none;border:none;color:#fff;font-size:18px">‹</button>
        <span>${contact.avatar} ${contact.name}</span>
      </div>
      <div class="chat-messages" id="chatMessages">
  `;
  (contact.messages || []).forEach(m => {
    html += `
      <div class="bubble ${m.from}">
        ${m.text}
        <div class="time">${m.time || ""}</div>
      </div>
    `;
  });
  html += `
      </div>
      <div class="chat-input-bar">
        <input type="text" id="chatInput" placeholder="输入消息..." />
        <button id="sendBtn">➤</button>
      </div>
    </div>
  `;
  content.innerHTML = html;

  // 滚动到底
  const msgs = $("#chatMessages");
  msgs.scrollTop = msgs.scrollHeight;

  $("#sendBtn").onclick = sendMessage;
  $("#chatInput").onkeydown = e => { if (e.key === "Enter") sendMessage(); };
}

function sendMessage() {
  const input = $("#chatInput");
  const text = input.value.trim();
  if (!text || !currentChatId) return;

  const contact = appData.contacts.find(c => c.id === currentChatId);
  if (!contact) return;

  contact.messages.push({
    from: "me",
    text: text,
    time: getCurrentTimeStr()
  });
  contact.lastMessage = text;
  contact.lastTime = "刚刚";
  saveData(appData);

  // 重新渲染当前聊天
  openChat(currentChatId);

  // 模拟对方回复（简单可持续互动）
  setTimeout(() => {
    if (Math.random() < 0.7) {
      const replies = [
        "好的～", "收到", "嗯嗯", "稍等一下", "哈哈", "真的吗？", "我看看", "等我一下哦"
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      contact.messages.push({
        from: "them",
        text: reply,
        time: getCurrentTimeStr()
      });
      contact.lastMessage = reply;
      contact.lastTime = "刚刚";
      saveData(appData);
      if (currentChatId === contact.id) openChat(currentChatId);
      else {
        contact.unread = (contact.unread || 0) + 1;
        updateBadges();
        showToast(`${contact.name}: ${reply}`);
      }
    }
  }, 1500 + Math.random() * 2500);
}

// ===== Back =====
$("#backBtn").onclick = () => {
  if (currentChatId) {
    currentChatId = null;
    renderWhatsAppList($("#appContent"));
    return;
  }
  $("#appScreen").classList.remove("active");
  $("#homeScreen").classList.add("active");
  currentView = "home";
  currentApp = null;
  renderHome();
};

// ===== Config System =====
$("#configBtn").onclick = openConfig;
$("#closeConfig").onclick = closeConfig;

function openConfig() {
  $("#configOverlay").classList.remove("hidden");
  $("#cfgOwnerName").value = appData.owner.name;
  $("#cfgWallpaper").value = appData.owner.wallpaper;
  $("#cfgEvents").checked = appData.eventsEnabled;
  $("#cfgEventFreq").value = appData.eventFreq;

  const list = $("#contactList");
  list.innerHTML = "";
  appData.contacts.forEach(c => {
    const row = document.createElement("div");
    row.className = "contact-row";
    row.innerHTML = `
      <span>${c.avatar} ${c.name} <small style="color:#888">(${c.relation || ""})</small></span>
      <button data-id="${c.id}" class="del-contact">删除</button>
    `;
    list.appendChild(row);
  });
  $$(".del-contact").forEach(btn => {
    btn.onclick = () => {
      appData.contacts = appData.contacts.filter(c => c.id !== btn.dataset.id);
      saveData(appData);
      openConfig(); // 刷新
    };
  });
}

function closeConfig() {
  appData.owner.name = $("#cfgOwnerName").value || "Fionna";
  appData.owner.wallpaper = $("#cfgWallpaper").value;
  appData.eventsEnabled = $("#cfgEvents").checked;
  appData.eventFreq = $("#cfgEventFreq").value;
  saveData(appData);

  // 应用壁纸（简单切换背景）
  applyWallpaper();
  startEventLoop(); // 重启事件循环
  $("#configOverlay").classList.add("hidden");
  if (currentView === "home") renderHome();
}

function applyWallpaper() {
  const home = $("#homeScreen");
  if (appData.owner.wallpaper === "purple") {
    home.style.background = "linear-gradient(160deg, #c9a0dc 0%, #7b6bb8 40%, #3d2a6b 100%)";
  } else {
    home.style.background = "#e8e4e0";
  }
}

// 添加联系人
$("#addContactBtn").onclick = () => {
  const name = prompt("联系人名字：");
  if (!name) return;
  const id = "c" + Date.now();
  appData.contacts.push({
    id,
    name,
    avatar: "👤",
    relation: "自定义",
    personality: "",
    lastMessage: "新对话",
    lastTime: "刚刚",
    unread: 0,
    messages: [{ from: "them", text: "你好！", time: getCurrentTimeStr() }]
  });
  saveData(appData);
  openConfig();
};

// 导出 / 导入
$("#exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify(appData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "phone-sim-config.json";
  a.click();
  URL.revokeObjectURL(url);
};

$("#importBtn").onclick = () => $("#importFile").click();
$("#importFile").onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      appData = JSON.parse(ev.target.result);
      saveData(appData);
      alert("导入成功！");
      openConfig();
    } catch (err) {
      alert("导入失败，文件格式错误");
    }
  };
  reader.readAsText(file);
};

$("#resetBtn").onclick = () => {
  if (confirm("确定重置所有数据？")) {
    localStorage.removeItem("phoneSimData");
    appData = loadData();
    alert("已重置");
    openConfig();
  }
};

// Dock 点击
$$(".dock-app").forEach(el => {
  el.onclick = () => {
    const app = el.dataset.app;
    if (app === "messages") openApp("whatsapp");
    else openApp(app);
  };
});

// 初始化
applyWallpaper();
console.log("Phone Sim 已加载。支持自定义角色、动态事件、可持续聊天。");
