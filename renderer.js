const wedge = document.getElementById('wedge');
const jaco = document.getElementById('jaco');

function createLaserLine(delaySec, topPercent, durationSec, heightPx) {
  const line = document.createElement('div');
  line.className = 'laser-line';
  line.style.top = `${topPercent}vh`;
  line.style.height = `${heightPx}px`;
  line.style.animationDuration = `${durationSec}s, 0.075s`;
  line.style.animationDelay = `${delaySec}s, 0s`;
  wedge.appendChild(line);
}

function spawnLaserLines() {
  document.querySelectorAll('.laser-line').forEach(el => el.remove());

  for (let i = 0; i < 30; i++) {
    const delay = Math.random() * 1.5;
    const top = 10 + Math.random() * 80;
    const height = Math.random() < 0.6 ? (1 + Math.random() * 2) : (5 + Math.random() * 5);
    const duration = 0.5 + Math.random() * 0.5;
    createLaserLine(delay, top, duration, height);
  }
}

function showCutIn() {
  spawnLaserLines();

  // Reset everything
  wedge.classList.remove('animate-in', 'slam');
  jaco.classList.remove('show', 'creep', 'hide');
  jaco.style.opacity = '0';
  wedge.style.opacity = '1';

  // Step 1: Wedge slides in
  wedge.classList.add('animate-in');

  wedge.addEventListener('animationend', function onSlideIn(e) {
    if (e.animationName !== 'wedgeSlideIn') return;
    wedge.removeEventListener('animationend', onSlideIn);

    // Step 2: Wedge slams + Jaco enters
    wedge.classList.add('slam');
    jaco.classList.add('show');

    setTimeout(() => {
      jaco.classList.add('creep');
    }, 250);

    // Step 3: After 5s, exit
    setTimeout(() => {
      // DO NOT remove 'creep' — keep final position
      jaco.classList.add('hide');
      wedge.style.opacity = '0';
      document.querySelectorAll('.laser-line').forEach(el => el.remove());
    }, 5000);
  });
}

window.onload = () => {
  jaco.style.opacity = '0';
  wedge.style.opacity = '0';

  if (window.electronAPI) {
    window.electronAPI.onCutInTrigger(() => showCutIn());
  } else {
    console.warn('No electronAPI found. Triggering manually in 1s...');
    setTimeout(showCutIn, 1000); // For testing outside Electron
  }
};