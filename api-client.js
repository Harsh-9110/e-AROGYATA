// e-AROGYATA Universal Frontend API Client & State Manager

const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://localhost:5000/api'
  : '/api';

// Toast Alert System
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 380px;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
  toast.style.cssText = `
    background: ${bgColor};
    color: white;
    padding: 14px 20px;
    border-radius: 10px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    transition: all 0.3s ease;
    transform: translateY(20px);
    opacity: 0;
  `;
  toast.innerText = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// API Helper
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('earogyata_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  } catch (err) {
    console.error(`API Error (${endpoint}):`, err);
    throw err;
  }
}

// Global Auth UI Sync
function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem('earogyata_user') || 'null');
  const loginLinks = document.querySelectorAll('a[href*="loginpage.html"], .link-login, .login-btn');

  loginLinks.forEach(link => {
    if (user) {
      link.innerHTML = `<span style="background: rgba(16, 185, 129, 0.15); color: #047857; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 13px;">👤 ${user.name.split(' ')[0]}</span>`;
      link.href = 'patientprofile.html';
    } else {
      link.innerHTML = 'Login';
      link.href = 'loginpage.html';
    }
  });
}

// Live Bed Counter Sync
async function syncBedCounts() {
  try {
    const data = await apiRequest('/beds');
    if (data && data.summary) {
      const avail = data.summary.available;
      const bedElements = document.querySelectorAll('.available-beds, .bed-count, #bed-count-badge');
      bedElements.forEach(el => {
        el.textContent = avail;
      });
    }
  } catch (err) {
    // Quiet fail if offline
  }
}

// Initialize Page Interactions on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  syncBedCounts();

  // 1. Bed Booking Button Handler
  document.body.addEventListener('click', async (e) => {
    const bookBtn = e.target.closest('.book-btn, .btn-book-bed, #btn-book-bed');
    if (bookBtn) {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem('earogyata_user') || 'null');
      const patientName = user ? user.name : prompt('Enter Patient Name for Bed Reservation:', 'Guest Patient');
      if (!patientName) return;

      try {
        bookBtn.disabled = true;
        bookBtn.innerText = 'Booking...';
        const res = await apiRequest('/beds/book', 'POST', {
          patientName,
          ward: 'General Ward'
        });
        showToast(`✅ Bed (${res.bed.id}) booked successfully for ${patientName}!`, 'success');
        syncBedCounts();
      } catch (err) {
        showToast(`❌ Booking Failed: ${err.message}`, 'error');
      } finally {
        bookBtn.disabled = false;
        bookBtn.innerText = 'Book Bed';
      }
    }
  });

  // 2. Appointment Form Handler
  const apptForm = document.querySelector('form[action*="appointment"], #appointment-form, .appointment-form');
  if (apptForm) {
    apptForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(apptForm);
      const payload = {
        patientName: formData.get('name') || formData.get('patientName') || 'Patient',
        patientEmail: formData.get('email') || '',
        patientPhone: formData.get('phone') || '',
        doctorId: formData.get('doctorId') || 101,
        date: formData.get('date') || new Date().toISOString().split('T')[0],
        timeSlot: formData.get('timeSlot') || '10:30 AM',
        symptoms: formData.get('symptoms') || 'Consultation'
      };

      try {
        const res = await apiRequest('/appointments/book', 'POST', payload);
        showToast(`🎉 Appointment ${res.appointment.id} booked! Queue Token: #${res.appointment.queueNumber}`, 'success');
        apptForm.reset();
      } catch (err) {
        showToast(`❌ ${err.message}`, 'error');
      }
    });
  }

  // 3. Login / Signup Handler
  const loginForm = document.querySelector('#login-form, .login-form, form[action*="login"]');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = loginForm.querySelector('input[type="email"], input[name="email"]');
      const passInput = loginForm.querySelector('input[type="password"], input[name="password"]');

      if (!emailInput || !passInput) return;

      try {
        const res = await apiRequest('/auth/login', 'POST', {
          email: emailInput.value,
          password: passInput.value
        });
        localStorage.setItem('earogyata_token', res.token);
        localStorage.setItem('earogyata_user', JSON.stringify(res.user));
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        setTimeout(() => window.location.href = 'patientprofile.html', 1000);
      } catch (err) {
        showToast(`Login failed: ${err.message}`, 'error');
      }
    });
  }
});

// Export globally
window.eArogyataAPI = {
  apiRequest,
  showToast,
  syncBedCounts
};
