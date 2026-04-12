// // ─── Admin Login page ─────────────────────────────────────────────────────────
// document.addEventListener('DOMContentLoaded', async () => {
//   // If already logged in, redirect straight to admin panel
//   try {
//     const check = await fetch('/api/auth/check');
//     const data  = await check.json();
//     if (data.authenticated) {
//       window.location.href = '/admin.html';
//       return;
//     }
//   } catch (_) {}

//   const form       = document.getElementById('loginForm');
//   const loginBtn   = document.getElementById('loginBtn');
//   const errorAlert = document.getElementById('errorAlert');
//   const loginBox   = document.querySelector('.login-box');

//   function showError(msg) {
//     errorAlert.textContent = msg;
//     errorAlert.classList.add('show');
//     loginBox.classList.remove('shake');
//     void loginBox.offsetWidth; // reflow to restart animation
//     loginBox.classList.add('shake');
//   }

//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     errorAlert.classList.remove('show');

//     const username = document.getElementById('username').value.trim();
//     const password = document.getElementById('password').value;

//     if (!username || !password) {
//       showError('Please enter both username and password.');
//       return;
//     }

//     loginBtn.disabled     = true;
//     loginBtn.textContent  = 'Signing in...';

//     try {
//       const res  = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//         credentials: 'same-origin',
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         window.location.href = '/admin.html';
//       } else {
//         showError(data.error || 'Invalid credentials. Please try again.');
//         loginBtn.disabled    = false;
//         loginBtn.textContent = 'Sign In to Admin Panel';
//       }
//     } catch (err) {
//       showError('Network error. Please check your connection.');
//       loginBtn.disabled    = false;
//       loginBtn.textContent = 'Sign In to Admin Panel';
//     }
//   });
// });

// ─── Admin Login page ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Check if already logged in
  try {
    const check = await fetch('/api/auth/check', {
      credentials: 'same-origin'
    });
    const data = await check.json();
    if (data.authenticated) {
      console.log('Already authenticated, redirecting...');
      window.location.href = '/admin.html';
      return;
    }
  } catch (err) {
    console.log('Session check failed:', err);
  }

  const form = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const errorAlert = document.getElementById('errorAlert');
  const loginBox = document.querySelector('.login-box');

  function showError(msg) {
    errorAlert.textContent = msg;
    errorAlert.classList.add('show');
    if (loginBox) {
      loginBox.classList.remove('shake');
      void loginBox.offsetWidth; // reflow to restart animation
      loginBox.classList.add('shake');
    }
    // Auto-hide after 3 seconds
    setTimeout(() => {
      errorAlert.classList.remove('show');
    }, 3000);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorAlert.classList.remove('show');

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (!username || !password) {
        showError('Please enter both username and password.');
        return;
      }

      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';
      }

      try {
        console.log('Sending login request...');
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'same-origin',
        });

        const data = await res.json();
        console.log('Login response:', data);

        if (res.ok && data.success) {
          console.log('Login successful, redirecting to admin panel...');
          // Small delay to ensure session is saved
          setTimeout(() => {
            window.location.href = '/admin.html';
          }, 100);
        } else {
          showError(data.error || 'Invalid credentials. Please try again.');
          if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In to Admin Panel';
          }
        }
      } catch (err) {
        console.error('Login error:', err);
        showError('Network error. Please check your connection.');
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = 'Sign In to Admin Panel';
        }
      }
    });
  }
});