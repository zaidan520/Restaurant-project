// // ─── Shared utilities across all pages ───────────────────────────────────────

// // Hamburger / mobile nav toggle
// document.addEventListener('DOMContentLoaded', () => {
//   const hamburger = document.getElementById('hamburger');
//   const navLinks  = document.getElementById('navLinks');
//   if (hamburger && navLinks) {
//     hamburger.addEventListener('click', () => {
//       navLinks.classList.toggle('open');
//     });
//     // Close nav on link click
//     navLinks.querySelectorAll('a').forEach(a => {
//       a.addEventListener('click', () => navLinks.classList.remove('open'));
//     });
//   }

//   // Intersection observer for fade-in elements
//   const observer = new IntersectionObserver(
//     entries => entries.forEach(e => {
//       if (e.isIntersecting) {
//         e.target.classList.add('visible');
//         observer.unobserve(e.target);
//       }
//     }),
//     { threshold: 0.12 }
//   );
//   document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
// });

// // Format currency
// function formatPrice(price) {
//   return '$' + Number(price).toFixed(2);
// }

// // Format date/time
// function formatTime(isoString) {
//   if (!isoString) return '—';
//   const d = new Date(isoString);
//   return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//     + ' at '
//     + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
// }

// // Image URL with local fallback mapping
// const IMAGE_MAP = {
//   'Chicken Shawarma':   '/images/chicken-shawarma.jfif',
//   'Steak Shawarma':      '/images/menu-biryani.png',
//   'Zinger Shawarma':       '/images/menu-karahi.png',
//   'Malai Boti Shawarma':    '/images/menu-karahi.png',
//   'Green chill Shawarma':       '/images/menu-kebabs.png',
//   'chicken B.B.Q Sauce Shawarma':     '/images/menu-kebabs.png',
//   'Crunchy Shawarma':       '/images/menu-nihari.png',
//   'Garlic Naan':       '/images/menu-naan.png',
//   'Peshwari Naan':     '/images/menu-naan.png',
//   'Mango Lassi':       '/images/menu-lassi.png',
//   'Samosa':            '/images/menu-samosa.png',
//   'Kheer':             '/images/menu-kheer.png',
// };

// function getItemImage(name, imageUrl) {
//   if (imageUrl && imageUrl.trim() && !imageUrl.includes('placeholder')) return imageUrl;
//   return IMAGE_MAP[name] || '/images/menu-kebabs.png';
// }

// ─── main.js — Shared utilities loaded on every page ─────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  } 
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
       if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});
// Format price as $XX.XX
function formatPrice(price) {
  return '$' + Number(price).toFixed(2);
}
// Format ISO date string to readable format
function formatTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
// Re-run fade-in observer on dynamically added elements
function observeFadeIns(root) {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.08 }
  );
  (root || document).querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}