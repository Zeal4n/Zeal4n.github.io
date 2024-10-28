function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
  }
  
  function loadApp(appName) {
    const appWindow = document.getElementById(appName + 'App');
    appWindow.style.display = 'block';
    document.getElementById('startMenu').style.display = 'none';
  }
  
  function closeApp(appName) {
    const appWindow = document.getElementById(appName + 'App');
    appWindow.style.display = 'none';
  }
  
  // Close start menu if clicked outside
  window.onclick = function(event) {
    const startMenu = document.getElementById('startMenu');
    if (!event.target.closest('.start-button') && startMenu.style.display === 'block' && !event.target.closest('.start-menu')) {
      startMenu.style.display = 'none';
    }
  };
  