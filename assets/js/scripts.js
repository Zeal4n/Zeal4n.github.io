let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let activeAppId = null;

// Function to toggle the Start Menu
function toggleStartMenu() {
  const startMenu = document.getElementById('startMenu');
  startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
}

// Function to open apps
function openApp(appId) {
  const appWindow = document.getElementById(appId);
  appWindow.style.display = 'block';
}

function closeApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.style.display = 'none';
    delete minimizedApps[appId]; // Remove from minimized tracking
  }

// Function to start dragging
function startDrag(event, appId) {
  isDragging = true;
  activeAppId = appId;

  // Get the app window position
  const appWindow = document.getElementById(appId);
  offsetX = event.clientX - appWindow.getBoundingClientRect().left;
  offsetY = event.clientY - appWindow.getBoundingClientRect().top;

  // Add mousemove and mouseup event listeners
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', stopDrag);
}

// Function to move the window while dragging
function onMouseMove(event) {
  if (isDragging) {
    // Calculate new position
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    // Apply new position to the active window
    const appWindow = document.getElementById(activeAppId);
    appWindow.style.left = `${x}px`;
    appWindow.style.top = `${y}px`;
  }
}

// Function to stop dragging
function stopDrag() {
  isDragging = false;
  activeAppId = null;

  // Remove mousemove and mouseup event listeners
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', stopDrag);
}

// Update the taskbar time every second
function updateTaskbarTime() {
  const taskbarTime = document.getElementById('taskbarTime');
  const now = new Date();
  taskbarTime.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Call the function every second
setInterval(updateTaskbarTime, 1000);

// Initialize the taskbar time
updateTaskbarTime();

// Keep track of minimized apps
const minimizedApps = {};

// Function to minimize an app
function minimizeApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.classList.add('hidden'); // Apply animation
    setTimeout(() => {
      appWindow.style.display = 'none';
      createTaskbarIcon(appId); // Add icon to taskbar
    }, 300);
}
  
// Function to maximize an app
function maximizeApp(appId) {
    const appWindow = document.getElementById(appId);
    const iframe = appWindow.querySelector('iframe');
  
    if (appWindow.classList.contains('maximized')) {
      appWindow.style.width = minimizedApps[appId].width;
      appWindow.style.height = minimizedApps[appId].height;
      appWindow.style.left = minimizedApps[appId].left;
      appWindow.style.top = minimizedApps[appId].top;
      appWindow.classList.remove('maximized');
      iframe.style.height = '400px'; // Original iframe height
    } else {
      minimizedApps[appId] = { width: appWindow.style.width, height: appWindow.style.height, left: appWindow.style.left, top: appWindow.style.top };
      appWindow.style.width = '100vw';
      appWindow.style.height = '100vh';
      appWindow.style.left = '0';
      appWindow.style.top = '0';
      appWindow.classList.add('maximized');
      iframe.style.height = 'calc(100vh - 20px)'; // Expand iframe to full height
    }
}

// Create icon in taskbar for minimized app
function createTaskbarIcon(appId) {
    const taskbarIcons = document.getElementById('taskbarIcons');
  
    // Check if an icon already exists for this app
    if (document.querySelector(`.minimized-icon[data-app-id="${appId}"]`)) return;
  
    const icon = document.createElement('div');
    icon.classList.add('minimized-icon');
    icon.dataset.appId = appId;  // Set app ID as data attribute for easy reference
    icon.innerText = appId; // Display the app ID or name on the icon
    icon.onclick = () => restoreApp(appId);
    taskbarIcons.appendChild(icon);
}
  
  // Restore app from minimized state
function restoreApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.style.display = 'block';
    appWindow.classList.remove('hidden'); // Remove hidden class for animation
  
    // Remove the minimized icon from the taskbar
    const icon = document.querySelector(`.minimized-icon[data-app-id="${appId}"]`);
    if (icon) icon.remove();
}