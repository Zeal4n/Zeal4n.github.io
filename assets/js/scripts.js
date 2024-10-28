function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
  }
  
  // Close the start menu if clicked outside
  window.onclick = function(event) {
    const startMenu = document.getElementById('startMenu');
    if (!event.target.closest('.start-button') && startMenu.style.display === 'block') {
      startMenu.style.display = 'none';
    }
  };
  