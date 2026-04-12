// // ─── Homepage: load featured menu items ──────────────────────────────────────
// document.addEventListener('DOMContentLoaded', async () => {
//   const grid = document.getElementById('featuredGrid');
//   if (!grid) return;

//   try {
//     const res  = await fetch('/api/menu');
//     const items = await res.json();

//     // Show up to 6 featured items
//     const featured = items.slice(0, 6);

//     grid.innerHTML = featured.map(item => `
//       <div class="menu-card fade-in">
//         <img
//           class="menu-card-img"
//           src="${getItemImage(item.name, item.imageUrl)}"
//           alt="${item.name}"
//           loading="lazy"
//           onerror="this.src='/images/chicken-shawarma.jfif'"
//         />
//         <div class="menu-card-body">
//           <h3>${item.name}</h3>
//           <p>${item.description || 'A classic Haqania favorite.'}</p>
//           <div class="menu-card-footer">
//             <span class="price">${formatPrice(item.price)}</span>
//             <a href="/order.html?item=${item.id}" class="btn-sm">Order This</a>
//           </div>
//         </div>
//       </div>
//     `).join('');

//     // Re-observe new fade-in elements
//     const observer = new IntersectionObserver(
//       entries => entries.forEach(e => {
//         if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
//       }),
//       { threshold: 0.1 }
//     );
//     grid.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

//   } catch (err) {
//     grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">Could not load menu items.</p>';
//   }
// });

// ─── home.js — Homepage: render 6 featured menu items from local data ─────────
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  // Show 6 featured items (first 6 from MENU)
  const featured = MENU.slice(0, 6);
   grid.innerHTML = featured.map(item => `
    <div class="menu-card fade-in">
      <img
        class="menu-card-img"
        src="${item.image}"
        alt="${item.name}"
        loading="lazy"
        onerror="this.src='/images/menu-kebabs.png'"
      />
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-card-footer">
          <span class="price">${formatPrice(item.price)}</span>
          <a href="/order.html?item=${item.id}" class="btn-sm">Order This</a>
        </div>
      </div>
       </div>
  `).join('');
   observeFadeIns(grid);
});
