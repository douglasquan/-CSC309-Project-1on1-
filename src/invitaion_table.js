document.addEventListener('DOMContentLoaded', function() {
  const logStateButton = document.getElementById('logStateButton');

  logStateButton.addEventListener('click', function() {
    console.log('Accessing cellColorStates from another file:', window.cellColorStates);
  });
});