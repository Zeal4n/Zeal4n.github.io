// Toggle Start Menu display
function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
  }
  
  // Open an app window
  function openApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.style.display = 'block'; // Show the app window
    document.getElementById('startMenu').style.display = 'none'; // Hide Start Menu
  }
  
  // Close an app window
  function closeApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.style.display = 'none'; // Hide the app window
  }
  
  // Click and Drag Functionality for the App Window
  let isDragging = false;
  let offsetX, offsetY;
  
  function startDrag(event, appId) {
    isDragging = true;
    activeAppId = appId;

    
    const appWindow = document.getElementById(appId);
  
    // Get current mouse position relative to app window
    offsetX = event.clientX - appWindow.offsetLeft;
    offsetY = event.clientY - appWindow.offsetTop;
  
    // Attach move and stop event listeners to the document
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
  }
  
  function onMouseMove(event, appId) {
    if (isDragging) {
      // Calculate new position
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;
  
      // Apply new position to the window
      const appWindow = document.getElementById(appId);
      appWindow.style.left = `${x}px`;
      appWindow.style.top = `${y}px`;
    }
  }
  
  function stopDrag() {
    // Stop dragging and remove event listeners
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDrag);
  }
  
  // Close the Start Menu if clicked outside of it
  window.onclick = function(event) {
    const startMenu = document.getElementById('startMenu');
    if (!event.target.closest('.start-button') && startMenu.style.display === 'block' && !event.target.closest('.start-menu')) {
      startMenu.style.display = 'none';
    }
  };
  
  // Function to update the taskbar time
  function updateTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeString = now.toLocaleTimeString([], options);
    document.getElementById('taskbarTime').textContent = timeString;
  }
  
  // Update the time every second
  setInterval(updateTime, 1000);
  updateTime(); // Initial call to set time immediately
  