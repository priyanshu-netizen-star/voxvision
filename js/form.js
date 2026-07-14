/* ============================================================
   VOXVISION â€” Contact Form Handling
   ============================================================ */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('#form-submit-btn');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');

  // Validation helpers
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPhone(phone) {
    return /^[\+\d\s\-\(\)]{7,15}$/.test(phone);
  }

  function showError(input, message) {
    const group = input.closest('.form-group');
    let err = group.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'font-size:12px;color:#EF4444;margin-top:4px;display:block;';
      group.appendChild(err);
    }
    err.textContent = message;
    input.style.borderColor = '#EF4444';
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    const err = group.querySelector('.field-error');
    if (err) err.remove();
    input.style.borderColor = '';
  }

  function validate() {
    let valid = true;
    const fields = form.querySelectorAll('[data-required]');
    fields.forEach(f => { clearError(f); });

    fields.forEach(field => {
      const val = field.value.trim();
      const type = field.getAttribute('data-validate') || 'text';

      if (!val) {
        showError(field, 'This field is required.');
        valid = false;
      } else if (type === 'email' && !isValidEmail(val)) {
        showError(field, 'Please enter a valid email address.');
        valid = false;
      } else if (type === 'phone' && !isValidPhone(val)) {
        showError(field, 'Please enter a valid phone number.');
        valid = false;
      }
    });

    return valid;
  }

  // Real-time validation
  form.querySelectorAll('[data-required]').forEach(field => {
    field.addEventListener('blur', () => {
      clearError(field);
      const val = field.value.trim();
      const type = field.getAttribute('data-validate') || 'text';
      if (!val) {
        showError(field, 'This field is required.');
      } else if (type === 'email' && !isValidEmail(val)) {
        showError(field, 'Please enter a valid email address.');
      } else if (type === 'phone' && !isValidPhone(val)) {
        showError(field, 'Please enter a valid phone number.');
      }
    });
  });

  // Check on page load if redirected back with success query parameter
  window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      if (successMsg) {
        successMsg.style.display = 'flex';
        successMsg.style.cssText = `
          display: flex; align-items: center; gap: 12px;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
          border-radius: 12px; padding: 16px 20px;
          color: #4ADE80; font-size: 14px; margin-top: 16px;
        `;
        successMsg.innerHTML = `<span style="font-size:20px;">✅</span> <span>Thank you! We've received your request and will contact you within 24 hours.</span>`;
      }

      // Scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        setTimeout(() => {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }

      // Clear the query parameter so refreshing doesn't show it again
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);

      // Hide success message after 10 seconds
      setTimeout(() => {
        if (successMsg) successMsg.innerHTML = '';
      }, 10000);
    }
  });

  // Form submit — validate only, let standard POST handle the server transmission
  form.addEventListener('submit', function (e) {
    if (!validate()) {
      e.preventDefault();
      return;
    }

    // Since it's submitting normally, show a temporary loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Redirecting...';
  });

})();
