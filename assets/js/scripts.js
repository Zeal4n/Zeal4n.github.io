function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
  }
  
  function openAbout() {
    const aboutApp = document.getElementById('aboutApp');
    aboutApp.style.display = 'block';
    document.getElementById('startMenu').style.display = 'none'; // Hide Start Menu
  }
  
  function closeApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.style.display = 'none';
  }
  
  // Close the Start Menu if clicked outside of it
  window.onclick = function(event) {
    const startMenu = document.getElementById('startMenu');
    if (!event.target.closest('.start-button') && startMenu.style.display === 'block' && !event.target.closest('.start-menu')) {
      startMenu.style.display = 'none';
    }
  };
  