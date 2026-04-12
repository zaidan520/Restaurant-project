// ─── Admin page: order management with date filtering ─────────────────────

let currentDateFilter = null;

async function checkAuth() {
  try {
    const res = await fetch('/api/auth/check', { credentials: 'same-origin' });
    const data = await res.json();
    if (!data.authenticated) {
      window.location.href = '/admin-login.html';
      return false;
    }
    return true;
  } catch (err) {
    window.location.href = '/admin-login.html';
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const isAuth = await checkAuth();
  if (!isAuth) return;
  
  // Setup date filter
  const dateInput = document.getElementById('dateFilter');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  
  dateInput.addEventListener('change', () => {
    currentDateFilter = dateInput.value;
    loadOrders();
  });
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const days = btn.dataset.days;
      if (days === 'all') {
        currentDateFilter = null;
        dateInput.value = '';
      } else if (days === '0') {
        currentDateFilter = new Date().toISOString().split('T')[0];
        dateInput.value = currentDateFilter;
      } else {
        const date = new Date();
        date.setDate(date.getDate() - parseInt(days));
        currentDateFilter = date.toISOString().split('T')[0];
        dateInput.value = currentDateFilter;
      }
      loadOrders();
    });
  });
  
  await loadOrders();
  setInterval(loadOrders, 10000);
});

async function loadOrders() {
  const container = document.getElementById("ordersContainer");
  const lastUpdated = document.getElementById("lastUpdated");
  const countPending = document.getElementById("countPending");
  const countAccepted = document.getElementById("countAccepted");
  const countCompleted = document.getElementById("countCompleted");

  if (!container) return;

  try {
    let url = '/api/orders';
    if (currentDateFilter) {
      url += `?date=${currentDateFilter}`;
    }
    
    const res = await fetch(url, { credentials: "same-origin" });
    if (res.status === 401) {
      window.location.href = '/admin-login.html';
      return;
    }
    
    const orders = await res.json();

    if (lastUpdated) {
      const now = new Date();
      lastUpdated.textContent = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    // Count only pending/accepted for badge (excluding completed from counts)
    const pending = orders.filter((o) => o.status === "pending").length;
    const accepted = orders.filter((o) => o.status === "accepted").length;
    const completed = orders.filter((o) => o.status === "completed").length;
    
    if (countPending) countPending.textContent = pending;
    if (countAccepted) countAccepted.textContent = accepted;
    if (countCompleted) countCompleted.textContent = completed;

    if (!orders.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🍽️</div>
          <h3>No orders found</h3>
          <p>${currentDateFilter ? `No orders for ${currentDateFilter}` : 'No orders placed yet'}</p>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="orders-grid">
        ${orders.map((order) => renderOrderCard(order)).join("")}
      </div>`;

    container.querySelectorAll(".status-select").forEach((sel) => {
      sel.addEventListener("change", async (e) => {
        const id = e.target.dataset.id;
        const status = e.target.value;
        await updateStatus(id, status, e.target);
      });
    });
  } catch (err) {
    console.error('Load orders error:', err);
  }
}

function renderOrderCard(order) {
  const badgeClass = {
    pending: "badge-pending",
    accepted: "badge-accepted",
    completed: "badge-completed",
  }[order.status] || "badge-pending";

  const orderId = order._id;
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  
  // Calculate total items
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return `
    <div class="order-card" data-status="${order.status}" data-id="${orderId}">
      <div class="order-card-header">
        <div>
          <div class="order-id">#${String(orderId).slice(-6)}</div>
          <div class="order-time">${orderDate} at ${new Date(order.createdAt).toLocaleTimeString()}</div>
        </div>
        <span class="status-badge ${badgeClass}">${order.status}</span>
      </div>

      <div><strong>${order.customerName}</strong> • ${order.phone}</div>
      <div style="font-size:0.8rem; color:var(--text-muted); margin: 0.5rem 0">${order.address}</div>
      
      <div class="order-items-list">
        <strong>Items (${totalItems}):</strong>
        ${order.items.map(item => `
          <div class="order-item-line">
            <span>${item.quantity} × ${item.name}</span>
            <span>${formatPrice(item.price * item.quantity)}</span>
          </div>
        `).join('')}
        <div class="order-total">
          Total: ${formatPrice(order.totalAmount)}
        </div>
      </div>

      ${order.notes ? `<div style="margin-top:0.5rem; padding:0.5rem; background:rgba(245,166,35,0.1); border-radius:6px; font-size:0.8rem"><strong>Notes:</strong> ${escapeHtml(order.notes)}</div>` : ""}

      <select class="status-select" data-id="${orderId}" style="margin-top: 1rem; width: 100%;">
        <option value="pending"   ${order.status === "pending" ? "selected" : ""}>⏳ Pending</option>
        <option value="accepted"  ${order.status === "accepted" ? "selected" : ""}>✅ Accepted</option>
        <option value="completed" ${order.status === "completed" ? "selected" : ""}>📦 Completed</option>
      </select>
    </div>
  `;
}

async function updateStatus(id, status, selectEl) {
  selectEl.disabled = true;

  try {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      await loadOrders(); // Reload to refresh the view
    } else if (res.status === 401) {
      window.location.href = '/admin-login.html';
    } else {
      alert("Failed to update status. Please try again.");
    }
  } catch (err) {
    console.error('Update status error:', err);
    alert("Network error. Please try again.");
  } finally {
    selectEl.disabled = false;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}