// Create Falling Leaves
document.addEventListener('DOMContentLoaded', () => {
  const leavesContainer = document.getElementById('leaves');

  for (let i = 0; i < 15; i++) {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    leaf.style.left = Math.random() * 100 + 'vw';
    leaf.style.animationDuration = 4 + Math.random() * 5 + 's';
    leaf.style.animationDelay = Math.random() * 5 + 's';
    leavesContainer.appendChild(leaf);
  }
});
