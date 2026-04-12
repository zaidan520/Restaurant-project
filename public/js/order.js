// ─── order.js — Multi-item cart system with URL parameter support ─────────────────────

let currentCart = []; // { id, name, price, quantity }

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orderForm');
  const select = document.getElementById('menuItemId');
  const quantityInput = document.getElementById('quantity');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const cartContainer = document.getElementById('cartContainer');
  const cartSummary = document.getElementById('cartSummary');
  const submitBtn = document.getElementById('submitBtn');
  const successAlert = document.getElementById('successAlert');
  const errorAlert = document.getElementById('errorAlert');

  // Load menu into dropdown
  async function loadMenuDropdown() {
    try {
      const items = MENU; // From menu-data.js
      const grouped = {};
      items.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });

      let options = '<option value="">Choose a dish...</option>';
      Object.entries(grouped).forEach(([category, catItems]) => {
        options += `<optgroup label="${category}">`;
        catItems.forEach(item => {
          options += `<option value="${item.id}" data-price="${item.price}">${item.name} — ${formatPrice(item.price)}</option>`;
        });
        options += `</optgroup>`;
      });
      select.innerHTML = options;
      
      // ✅ FIX: Check for URL parameter AFTER menu is loaded
      const urlParams = new URLSearchParams(window.location.search);
      const preSelectedItemId = urlParams.get('item');
      
      if (preSelectedItemId) {
        // Find the item in MENU
        const selectedItem = MENU.find(item => item.id === parseInt(preSelectedItemId));
        if (selectedItem) {
          // Add to cart automatically
          const existingItem = currentCart.find(item => item.id === selectedItem.id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            currentCart.push({
              id: selectedItem.id,
              name: selectedItem.name,
              price: selectedItem.price,
              quantity: 1
            });
          }
          renderCart();
          
          // Show success message
          errorAlert.style.background = 'rgba(34, 197, 94, 0.1)';
          errorAlert.style.border = '1px solid var(--success)';
          errorAlert.style.color = 'var(--success)';
          errorAlert.textContent = `${selectedItem.name} added to cart from menu!`;
          errorAlert.classList.add('show');
          setTimeout(() => {
            errorAlert.classList.remove('show');
            errorAlert.style.background = '';
            errorAlert.style.border = '';
            errorAlert.style.color = '';
          }, 2000);
        }
      }
      
    } catch (err) {
      select.innerHTML = '<option value="">Failed to load menu</option>';
    }
  }

  loadMenuDropdown();

  // Add to cart
  addToCartBtn.addEventListener('click', () => {
    const selectedOption = select.options[select.selectedIndex];
    const itemId = parseInt(select.value);
    const quantity = parseInt(quantityInput.value);

    if (!itemId || quantity < 1) {
      errorAlert.textContent = 'Please select an item and quantity';
      errorAlert.classList.add('show');
      setTimeout(() => errorAlert.classList.remove('show'), 2000);
      return;
    }

    const itemName = selectedOption.text.split(' — ')[0];
    const itemPrice = parseFloat(selectedOption.dataset.price);

    // Check if item already in cart
    const existingItem = currentCart.find(item => item.id === itemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({
        id: itemId,
        name: itemName,
        price: itemPrice,
        quantity: quantity
      });
    }

    renderCart();
    quantityInput.value = 1;
    select.value = '';
    
    // Show success feedback
    errorAlert.style.background = 'rgba(34, 197, 94, 0.1)';
    errorAlert.style.border = '1px solid var(--success)';
    errorAlert.style.color = 'var(--success)';
    errorAlert.textContent = `Added ${quantity} × ${itemName} to cart!`;
    errorAlert.classList.add('show');
    setTimeout(() => {
      errorAlert.classList.remove('show');
      errorAlert.style.background = '';
      errorAlert.style.border = '';
      errorAlert.style.color = '';
    }, 1500);
  });

  // Render cart
  function renderCart() {
    if (currentCart.length === 0) {
      cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty. Add some delicious items!</div>';
      cartSummary.style.display = 'none';
      submitBtn.textContent = 'Place Order (0 items)';
      submitBtn.disabled = true;
      return;
    }

    submitBtn.disabled = false;
    let subtotal = 0;
    
    const cartHtml = currentCart.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)} each</div>
          </div>
          <div class="cart-item-controls">
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="cart-item-quantity">${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    cartContainer.innerHTML = cartHtml;
    cartSummary.style.display = 'block';
    document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('cartTotal').textContent = formatPrice(subtotal);
    
    const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);
    submitBtn.textContent = `Place Order (${totalItems} items)`;
  }

  // Global functions for cart controls
  window.updateQuantity = (id, delta) => {
    const item = currentCart.find(i => i.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        removeFromCart(id);
      } else {
        renderCart();
      }
    }
  };

  window.removeFromCart = (id) => {
    currentCart = currentCart.filter(i => i.id !== id);
    renderCart();
  };

  // Form validation helpers
  function showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(errorId);
    if (field) field.style.borderColor = '#cc2200';
    if (err) {
      err.textContent = message;
      err.style.display = 'block';
    }
  }

  function clearErrors() {
    ['customerName', 'phone', 'address'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.borderColor = '';
    });
    ['nameError', 'phoneError', 'addressError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    successAlert.classList.remove('show');
    errorAlert.classList.remove('show');
  }

  // Submit order
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      if (currentCart.length === 0) {
        errorAlert.textContent = 'Please add items to your cart before placing order';
        errorAlert.classList.add('show');
        return;
      }

      const customerName = document.getElementById('customerName')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const address = document.getElementById('address')?.value.trim();
      const notes = document.getElementById('notes')?.value.trim();

      let valid = true;
      if (!customerName) {
        showFieldError('customerName', 'nameError', 'Full name is required.');
        valid = false;
      }
      if (!phone) {
        showFieldError('phone', 'phoneError', 'Phone number is required.');
        valid = false;
      }
      if (!address) {
        showFieldError('address', 'addressError', 'Delivery address is required.');
        valid = false;
      }
      if (!valid) return;

      const totalAmount = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      submitBtn.disabled = true;
      submitBtn.textContent = 'Placing Order...';

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName,
            phone,
            address,
            items: currentCart,
            totalAmount,
            notes
          }),
        });

        if (res.ok) {
          successAlert.classList.add('show');
          currentCart = [];
          renderCart();
          form.reset();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => successAlert.classList.remove('show'), 3000);
        } else {
          throw new Error('API failed');
        }
      } catch (err) {
        // Save locally if server fails
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push({
          id: Date.now(),
          customerName,
          phone,
          address,
          items: currentCart,
          totalAmount,
          notes,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        successAlert.textContent = 'Order saved offline! We will process it when online.';
        successAlert.classList.add('show');
        currentCart = [];
        renderCart();
        form.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Order';
      }
    });
  }
});