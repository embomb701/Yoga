/* Yoga with Dylan – script.js */

// ========== UI Audio ===========
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;
let sounds = {};

const soundFiles = {
  chime: 'assets/audio/chime.mp3',
  whoosh: 'assets/audio/whoosh.mp3',
  breath: 'assets/audio/breath.mp3',
  move: 'assets/audio/move.mp3',
  reset: 'assets/audio/reset.mp3',
  'be-you': 'assets/audio/be-you.mp3',
};

function loadSound(name, url) {
  fetch(url)
    .then(r => r.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
      sounds[name] = buffer;
    });
}

for (const k in soundFiles) loadSound(k, soundFiles[k]);

function playSound(name) {
  if (isMuted || !sounds[name]) return;
  const src = audioContext.createBufferSource();
  src.buffer = sounds[name];
  src.connect(audioContext.destination);
  src.start(0);
}

// UI event triggers
function bindSoundTriggers() {
  document.querySelectorAll('[data-sound]').forEach(el => {
    el.addEventListener('pointerenter', e => playSound(el.getAttribute('data-sound')));
    // Also support click for mobile/touch
    el.addEventListener('click', e => playSound(el.getAttribute('data-sound')));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Resume audio context on first interaction (required by browsers)
  const resumeAudio = () => {
    if (audioContext.state === 'suspended') audioContext.resume();
  };
  document.addEventListener('pointerdown', resumeAudio, { once: true });

  // Audio mute toggle
  const toggleBtn = document.getElementById('audio-toggle');
  toggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    toggleBtn.setAttribute('aria-pressed', isMuted);
  });
  bindSoundTriggers();

  // Animate hero BG (particles/light rays)
  animateHeroBG();

  // Magnetic CTAs
  addMagnetic();

  // Scroll reveals
  setupScrollReveals();
});

// ====== Hero Background Animation (canvas) ======
function animateHeroBG() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 1.1;
  const ctx = canvas.getContext('2d');
  let frame = 0;

  // Floating leaf shapes
  const leaves = Array.from({length: 9}).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 36 + Math.random() * 32,
    spd: Math.random() * 0.2 + 0.05,
    dx: Math.random() * 0.5 - 0.25,
    a: Math.random() * Math.PI * 2
  }));
  // Light rays
  const rays = Array.from({length: 7}).map((_,i) => ({
    x: canvas.width/2 + (i-3.5)*140,
    y: canvas.height * 0.15 + (i%2)*40,
    l: canvas.height*0.8,
    rot: (i-3)*0.16,
    alp: Math.random()*0.2+0.12
  }));

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Rays
    rays.forEach(ray => {
      ctx.save();
      ctx.translate(ray.x, ray.y);
      ctx.rotate(ray.rot + Math.sin(frame*0.008 + ray.x)*0.038);
      ctx.globalAlpha = ray.alp + 0.06 * Math.sin(frame*0.01+ray.x);
      var grad = ctx.createLinearGradient(0,0,0,ray.l);
      grad.addColorStop(0, '#fff6e8DD');
      grad.addColorStop(0.9, '#fff6e800');
      ctx.fillStyle = grad;
      ctx.fillRect(-21, 0, 42, ray.l);
      ctx.restore();
    });
    // Leaves (simple ovals)
    leaves.forEach(l => {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.a + Math.sin(frame*0.002+l.x)*0.3);
      ctx.globalAlpha = 0.13 + 0.11*Math.sin(frame*0.01+l.y);
      ctx.beginPath();
      ctx.ellipse(0, 0, l.r, l.r*0.38, 0, 0, Math.PI*2);
      ctx.fillStyle = '#C45C2644';
      ctx.shadowColor = '#C45C2633';
      ctx.shadowBlur = 7;
      ctx.fill();
      ctx.restore();
      // Animate
      l.x += l.dx + 0.05 * Math.sin(frame*0.007+l.a);
      l.y += l.spd;
      if (l.y > canvas.height+60) { l.y = -60; l.x = Math.random()*canvas.width; }
    });
    frame++;
    requestAnimationFrame(draw);
  }
  draw();
  // Responsive resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1.1;
  });
}

// Magnetic effect for buttons
function addMagnetic() {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// Scroll reveal for sections and cards
function setupScrollReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.philosophy-section, .class-card, .testimonial, .about-content, .schedule-section').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
