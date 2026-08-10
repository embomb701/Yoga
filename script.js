/* Yoga with Dylan – script.js */

let audioContext = null;
let isMuted = false;
const sounds = {};
const soundFiles = {
  chime: 'assets/audio/chime.mp3',
  whoosh: 'assets/audio/whoosh.mp3',
  breath: 'assets/audio/breath.mp3',
  move: 'assets/audio/move.mp3',
  reset: 'assets/audio/reset.mp3',
  'be-you': 'assets/audio/be-you.mp3'
};

function ensureAudioContext() {
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioContext = new Ctx();
  }
  return audioContext;
}

async function loadSound(name, url) {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const decoded = await ctx.decodeAudioData(buf.slice(0));
    sounds[name] = decoded;
  } catch (err) {
    console.warn('Audio load skipped for', name, err?.message || err);
  }
}

function primeAudio() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  Object.entries(soundFiles).forEach(([name, url]) => {
    if (!sounds[name]) loadSound(name, url);
  });
}

function playSound(name) {
  const ctx = ensureAudioContext();
  if (!ctx || isMuted || !sounds[name]) return;
  try {
    const src = ctx.createBufferSource();
    src.buffer = sounds[name];
    src.connect(ctx.destination);
    src.start(0);
  } catch (err) {
    console.warn('Audio playback skipped', err?.message || err);
  }
}

function bindSoundTriggers() {
  document.querySelectorAll('[data-sound]').forEach((el) => {
    const sound = el.getAttribute('data-sound');
    if (!sound) return;
    el.addEventListener('pointerenter', () => playSound(sound));
    el.addEventListener('click', () => playSound(sound));
  });
}

function addMagnetic() {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 7;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

function setupScrollReveals() {
  const targets = document.querySelectorAll('.philo-card, .class-card, .testimonial, .about-content, .schedule-section');
  targets.forEach((el) => el.classList.add('revealed'));
}

function setupPhotoCarousel() {
  const track = document.querySelector('.about-carousel-track');
  const slides = Array.from(document.querySelectorAll('.about-slide'));
  const dotsWrap = document.querySelector('.about-carousel-dots');
  if (!track || slides.length === 0 || !dotsWrap) return;

  let current = 0;
  let timer = null;

  function renderDots() {
    dotsWrap.innerHTML = slides.map((_, i) =>
      `<button class="about-dot${i === current ? ' active' : ''}" aria-label="Show photo ${i + 1}"></button>`
    ).join('');

    Array.from(dotsWrap.querySelectorAll('.about-dot')).forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        restart();
      });
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    renderDots();
  }

  function restart() {
    if (timer) clearInterval(timer);
    if (slides.length > 1) {
      timer = setInterval(() => goTo(current + 1), 4500);
    }
  }

  goTo(0);
  restart();
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('pointerdown', primeAudio, { once: true });
  document.addEventListener('keydown', primeAudio, { once: true });

  const toggleBtn = document.getElementById('audio-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      toggleBtn.setAttribute('aria-pressed', String(isMuted));
    });
  }

  bindSoundTriggers();
  addMagnetic();
  setupScrollReveals();
  setupPhotoCarousel();
});