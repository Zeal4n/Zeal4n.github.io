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

// Function to close apps
function closeApp(appId) {
  const appWindow = document.getElementById(appId);
  appWindow.style.display = 'none';
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

// Event listener for clicks outside the start menu
document.addEventListener('click', (event) => {
  const startMenu = document.getElementById('startMenu');
  const startButton = document.querySelector('.start-button');

  // Check if the clicked target is not the start button or the start menu
  if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
    startMenu.style.display = 'none'; // Close the start menu
  }
});
