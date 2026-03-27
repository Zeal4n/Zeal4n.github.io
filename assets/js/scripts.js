/* =============================================================
   Win95-style Desktop — scripts.js
   =============================================================
   To add a new blog post, add an object to the blogPosts array
   below. Each post has: title, date, and content.
   ============================================================= */

/* ---------------------------------------------------------------
   Mobile / Touch detection
--------------------------------------------------------------- */
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

const blogPosts = [
  {
    title: "Welcome to My Blog!",
    date: "March 27, 2026",
    content: "Hello and welcome to my blog! I'm Zealan LaCombe, an IT Operations Manager based in Sioux Falls, SD. This space is where I'll share thoughts on technology, IT operations, career reflections, and whatever else catches my interest. Glad you're here — check back for updates!"
  },
  {
    title: "Why I Built This Site with a Windows 95 Theme",
    date: "March 27, 2026",
    content: "When I started this personal site I wanted it to feel fun and personal, not just another generic portfolio. Win95 was the first OS I really fell in love with as a kid, so building a desktop-in-the-browser felt like the perfect tribute. The draggable windows, the taskbar, the teal desktop — it all brings me back. Hope you enjoy it as much as I enjoyed building it!"
  }
];

/* ---------------------------------------------------------------
   App metadata (title + emoji icon for taskbar / start menu)
--------------------------------------------------------------- */
const appMeta = {
  aboutApp:  { title: "About Me",  icon: "\uD83D\uDC64" },
  resumeApp: { title: "My Resume", icon: "\uD83D\uDCC4" },
  blogApp:   { title: "Blog",      icon: "\uD83D\uDCDD" }
};

/* ---------------------------------------------------------------
   State
--------------------------------------------------------------- */
let zCounter = 20;
const openApps   = new Set();   // apps that have been opened and not closed
const savedSizes = {};          // stores pre-maximize geometry
const iframeObservers = {};     // ResizeObserver instances per app

/* ---------------------------------------------------------------
   Window Management
--------------------------------------------------------------- */

function openApp(appId) {
  const win = document.getElementById(appId);
  if (!win) return;

  win.style.display = "block";
  win.classList.remove("win-minimizing");
  openApps.add(appId);
  bringToFront(appId);

  // On mobile, always maximize so windows fill the screen
  if (isMobile() && !win.classList.contains("win-maximized")) {
    win.classList.add("win-maximized");
  }

  // Blog: render posts when window opens
  if (appId === "blogApp") renderBlog();

  // Resume (or any window with an iframe): set up resize tracking
  const iframe = win.querySelector("iframe");
  if (iframe) initIframeResize(appId);

  updateTaskbar();
}

function closeApp(appId) {
  const win = document.getElementById(appId);
  if (!win) return;
  win.style.display = "none";
  win.classList.remove("win-maximized", "win-minimizing", "win-inactive");
  openApps.delete(appId);
  delete savedSizes[appId];
  if (iframeObservers[appId]) {
    iframeObservers[appId].disconnect();
    delete iframeObservers[appId];
  }
  updateTaskbar();
}

function minimizeApp(appId) {
  const win = document.getElementById(appId);
  if (!win) return;
  win.classList.add("win-minimizing");
  setTimeout(() => {
    win.style.display = "none";
    win.classList.remove("win-minimizing");
    updateTaskbar();
  }, 150);
}

function maximizeApp(appId) {
  const win = document.getElementById(appId);
  if (!win) return;

  if (win.classList.contains("win-maximized")) {
    // Restore
    const saved = savedSizes[appId];
    if (saved) {
      win.style.width  = saved.width;
      win.style.height = saved.height;
      win.style.left   = saved.left;
      win.style.top    = saved.top;
    }
    win.classList.remove("win-maximized");
  } else {
    // Save current geometry then maximize
    savedSizes[appId] = {
      width:  win.style.width  || win.offsetWidth  + "px",
      height: win.style.height || win.offsetHeight + "px",
      left:   win.style.left   || win.offsetLeft   + "px",
      top:    win.style.top    || win.offsetTop    + "px"
    };
    win.style.width  = "";
    win.style.height = "";
    win.style.left   = "";
    win.style.top    = "";
    win.classList.add("win-maximized");
  }

  const iframe = win.querySelector("iframe");
  if (iframe) initIframeResize(appId);
}

function bringToFront(appId) {
  zCounter++;
  // Mark all windows inactive
  document.querySelectorAll(".app-window").forEach(w => w.classList.add("win-inactive"));
  const win = document.getElementById(appId);
  if (win) {
    win.style.zIndex = zCounter;
    win.classList.remove("win-inactive");
  }
  updateTaskbar();
}

/* ---------------------------------------------------------------
   Taskbar
--------------------------------------------------------------- */

function updateTaskbar() {
  const container = document.getElementById("taskbarApps");
  if (!container) return;
  container.innerHTML = "";

  openApps.forEach(appId => {
    const meta = appMeta[appId] || { title: appId, icon: "\uD83D\uDCC4" };
    const win  = document.getElementById(appId);
    const isVisible = win && win.style.display !== "none";
    const isFocused = isVisible && !win.classList.contains("win-inactive");

    const btn = document.createElement("button");
    btn.className = "taskbar-app-btn" + (isFocused ? " focused" : "");
    btn.textContent = meta.icon + " " + meta.title;
    btn.title = meta.title;

    btn.addEventListener("click", () => {
      if (!win || win.style.display === "none") {
        // Restore minimized window
        win.style.display = "block";
        win.classList.remove("win-minimizing");
        bringToFront(appId);
      } else if (isFocused) {
        // Click focused window button → minimize
        minimizeApp(appId);
      } else {
        // Bring to front
        bringToFront(appId);
      }
    });

    container.appendChild(btn);
  });
}

/* ---------------------------------------------------------------
   Start Menu
--------------------------------------------------------------- */

function toggleStartMenu() {
  const menu = document.getElementById("startMenu");
  if (!menu) return;
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function closeStartMenu() {
  const menu = document.getElementById("startMenu");
  if (menu) menu.style.display = "none";
}

// Close start menu when clicking or tapping elsewhere on the desktop
function handleOutsideMenuInteraction(e) {
  const menu    = document.getElementById("startMenu");
  const startBtn = document.querySelector(".start-button");
  if (menu && menu.style.display === "block") {
    const target = e.target;
    if (!menu.contains(target) && !startBtn.contains(target)) {
      menu.style.display = "none";
    }
  }
}
document.addEventListener("mousedown", handleOutsideMenuInteraction);
// passive: true is correct here — this handler never calls preventDefault()
document.addEventListener("touchstart", handleOutsideMenuInteraction, { passive: true });

/* ---------------------------------------------------------------
   Touch support for desktop icons (single-tap = open on mobile)
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".desktop-icon[ondblclick]").forEach(icon => {
    // Extract the app ID from the ondblclick attribute value
    const match = icon.getAttribute("ondblclick").match(/openApp\('(\w+)'\)/);
    if (!match) return;
    const appId = match[1];

    icon.addEventListener("touchend", e => {
      if (!isMobile()) return; // let non-mobile touch devices keep normal dblclick flow
      e.preventDefault(); // prevent synthesized mouse click/dblclick after touch
      openApp(appId);
    });
  });
});

/* ---------------------------------------------------------------
   Dragging
--------------------------------------------------------------- */

let isDragging  = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragAppId   = null;

function startDrag(event, appId) {
  const win = document.getElementById(appId);
  // Don't drag a maximized window, or if clicking a button
  if (!win || win.classList.contains("win-maximized")) return;
  if (event.target.closest(".window-controls")) return;

  isDragging  = true;
  dragAppId   = appId;
  bringToFront(appId);

  const rect  = win.getBoundingClientRect();
  dragOffsetX = event.clientX - rect.left;
  dragOffsetY = event.clientY - rect.top;

  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup",   onDragEnd);
  event.preventDefault();
}

function onDragMove(event) {
  if (!isDragging) return;
  const win = document.getElementById(dragAppId);
  if (!win) return;

  const maxX = window.innerWidth  - win.offsetWidth;
  const maxY = window.innerHeight - 40 - win.offsetHeight;
  const x = Math.max(0, Math.min(event.clientX - dragOffsetX, maxX));
  const y = Math.max(0, Math.min(event.clientY - dragOffsetY, maxY));

  win.style.left = x + "px";
  win.style.top  = y + "px";
}

function onDragEnd() {
  isDragging = false;
  dragAppId  = null;
  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup",   onDragEnd);
}

/* ---------------------------------------------------------------
   iframe Resize Observer
   Keeps iframe height in sync when window is resized or maximized
--------------------------------------------------------------- */

function initIframeResize(appId) {
  const win    = document.getElementById(appId);
  const iframe = win && win.querySelector("iframe");
  if (!iframe) return;

  if (iframeObservers[appId]) iframeObservers[appId].disconnect();

  const observer = new ResizeObserver(() => {
    const titlebarHeight = (win.querySelector(".window-titlebar") || {}).offsetHeight || 26;
    iframe.style.height  = (win.clientHeight - titlebarHeight) + "px";
    iframe.style.width   = win.clientWidth + "px";
  });
  observer.observe(win);
  iframeObservers[appId] = observer;
}

/* ---------------------------------------------------------------
   Clock
--------------------------------------------------------------- */

function updateClock() {
  const el = document.getElementById("taskbarTime");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
setInterval(updateClock, 1000);
updateClock();

/* ---------------------------------------------------------------
   Blog Rendering
   Add new posts to the blogPosts array at the top of this file.
--------------------------------------------------------------- */

function renderBlog() {
  const container = document.getElementById("blogContent");
  if (!container) return;

  if (!blogPosts || blogPosts.length === 0) {
    container.innerHTML = '<p class="blog-empty">No posts yet — check back soon!</p>';
    return;
  }

  // Newest posts first
  const sorted = [...blogPosts].reverse();
  container.innerHTML = sorted.map(post => `
    <div class="blog-post">
      <div class="blog-post-title">${escapeHtml(post.title)}</div>
      <div class="blog-post-date">${escapeHtml(post.date)}</div>
      <div class="blog-post-content">${escapeHtml(post.content)}</div>
    </div>
  `).join("");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;");
}
