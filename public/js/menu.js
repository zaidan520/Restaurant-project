// // ─── Menu page: group items by category and render ───────────────────────────
// document.addEventListener('DOMContentLoaded', async () => {
//   const container = document.getElementById('menuContent');
//   if (!container) return;

//   try {
//     const res   = await fetch('/api/menu');
//     const items = await res.json();

//     // Group by category
//     const grouped = {};
//     items.forEach(item => {
//       if (!grouped[item.category]) grouped[item.category] = [];
//       grouped[item.category].push(item);
//     });

//     const html = Object.entries(grouped).map(([category, catItems]) => `
//       <div class="category-block fade-in">
//         <h2 class="category-title">${category}</h2>
//         <div class="menu-grid">
//           ${catItems.map(item => `
//             <div class="menu-card">
//               <img
//                 class="menu-card-img"
//                 src="${getItemImage(item.name, item.imageUrl)}"
//                 alt="${item.name}"
//                 loading="lazy"
//                 onerror="this.src='/images/chicken-shawarma.jfif'"
//               />
//               <div class="menu-card-body">
//                 <h3>${item.name}</h3>
//                 <p>${item.description || 'A classic Haqania favorite.'}</p>
//                 <div class="menu-card-footer">
//                   <span class="price">${formatPrice(item.price)}</span>
//                   <a href="/order.html?item=${item.id}" class="btn-sm">Order This</a>
//                 </div>
//               </div>
//             </div>
//           `).join('')}
//         </div>
//       </div>
//     `).join('');

//     container.innerHTML = html;

//     // Animate category blocks
//     const observer = new IntersectionObserver(
//       entries => entries.forEach(e => {
//         if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
//       }),
//       { threshold: 0.08 }
//     );
//     container.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

//   } catch (err) {
//     container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:3rem">Could not load menu. Please refresh the page.</p>';
//   }
// });

// ─── menu.js — Menu page: render all 15 items grouped by category ─────────────
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('menuContent');
  if (!container) return;
  // Group items by category
  const grouped = {};
  MENU.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  // Build HTML for each category section
  container.innerHTML = Object.entries(grouped).map(([category, items]) => `
    <div class="category-block fade-in">
      <h2 class="category-title">${category}</h2>
      <div class="menu-grid">
        ${items.map(item => `
          <div class="menu-card">
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
        `).join('')}
          </div>
  `).join('');
  observeFadeIns(container);
});