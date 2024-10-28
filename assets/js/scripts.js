document.addEventListener('DOMContentLoaded', function() {
    const projects = document.querySelectorAll('.project');
    const codePreview = document.getElementById('codePreview');
    const codeSnippet = document.getElementById('codeSnippet');
  
    projects.forEach(project => {
      project.addEventListener('mouseenter', function() {
        const code = project.getAttribute('data-code');
        codeSnippet.textContent = code;
        codePreview.style.display = 'block';
      });
  
      project.addEventListener('mouseleave', function() {
        codeSnippet.textContent = 'Hover over a project to see the code.';
        codePreview.style.display = 'none';
      });
    });
  });
  