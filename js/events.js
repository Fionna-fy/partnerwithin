// ===== Dynamic Event System (无闭环、可持续) =====
let eventTimer = null;
let timeOffset = 0; // 模拟时间偏移（秒）

function getEventInterval() {
  const map = { low: 45000, medium: 22000, high: 10000 };
  return map[appData.eventFreq] || 22000;
}

function startEventLoop() {
  if (eventTimer) clearInterval(eventTimer);
  if (!appData.eventsEnabled) return;

  eventTimer = setInterval(() => {
    if (Math.random() < 0.6) { // 60% 概率触发
      triggerRandomEvent();
    }
  }, getEventInterval());
}

function triggerRandomEvent() {
  const templates = appData.eventTemplates;
  if (!templates || templates.length === 0) return;

  const tpl = templates[Math.floor(Math.random() * templates.length)];
  const contacts = appData.contacts;
  if (contacts.length === 0) return;

  // 随机选一个联系人（如果模板没指定）
  const contact = contacts[Math.floor(Math.random() * contacts.length)];

  if (tpl.type === "message") {
    const text = tpl.text;
    contact.messages.push({
      from: "them",
      text: text,
      time: getCurrentTimeStr()
    });
    contact.lastMessage = text;
    contact.lastTime = "刚刚";
    contact.unread = (contact.unread || 0) + 1;
    saveData(appData);
    updateBadges();
    showToast(`${contact.name}: ${text}`);
  } else if (tpl.type === "call") {
    showIncomingCall(contact);
  } else if (tpl.type === "notification") {
    showToast(`${tpl.title}: ${tpl.body}`);
  }
}

function getCurrentTimeStr() {
  const d = new Date(Date.now() + timeOffset * 1000);
  return d.getHours().toString().padStart(2, "0") + ":" +
         d.getMinutes().toString().padStart(2, "0");
}

function showToast(msg) {
  // 简单顶部提示
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position:absolute; top:60px; left:16px; right:16px;
      background:rgba(0,0,0,0.8); color:#fff; padding:12px 16px;
      border-radius:12px; font-size:14px; z-index:200;
      transition: opacity 0.3s; opacity:0; pointer-events:none;
    `;
    document.getElementById("screen").appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  setTimeout(() => { toast.style.opacity = "0"; }, 2800);
}

function showIncomingCall(contact) {
  const overlay = document.getElementById("callOverlay");
  document.getElementById("callName").textContent = contact.name;
  overlay.classList.remove("hidden");

  // 自动挂断超时
  const timeout = setTimeout(() => {
    if (!overlay.classList.contains("hidden")) {
      declineCall();
    }
  }, 15000);

  document.getElementById("declineCall").onclick = () => {
    clearTimeout(timeout);
    declineCall();
  };
  document.getElementById("acceptCall").onclick = () => {
    clearTimeout(timeout);
    acceptCall(contact);
  };
}

function declineCall() {
  document.getElementById("callOverlay").classList.add("hidden");
  showToast("已拒绝来电");
}

function acceptCall(contact) {
  document.getElementById("callOverlay").classList.add("hidden");
  showToast(`与 ${contact.name} 通话中...（演示）`);
  // 可扩展真实通话模拟
}

// 导出
window.startEventLoop = startEventLoop;
window.triggerRandomEvent = triggerRandomEvent;
window.showIncomingCall = showIncomingCall;
