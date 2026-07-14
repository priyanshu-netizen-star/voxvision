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

  // Web3Forms Access Key (Get yours free at web3forms.com)
  const ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

  // Form submit — send to email via Web3Forms AJAX
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validate()) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

    const name     = form.querySelector('#field-name').value.trim();
    const biz      = form.querySelector('#field-biz').value.trim();
    const industry = form.querySelector('#field-industry').value;
    const phone    = form.querySelector('#field-phone').value.trim();
    const email    = form.querySelector('#field-email').value.trim();
    const message  = form.querySelector('#field-message').value.trim();

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: "New Free Consultation Request — VOXVISION",
        from_name: "VOXVISION Lead",
        Name: name,
        Business: biz,
        Industry: industry,
        Phone: phone,
        Email: email,
        Message: message
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to send email");
      }
    })
    .then(data => {
      // Show success
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
      if (errorMsg) errorMsg.innerHTML = '';

      form.reset();

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Request Free Consultation <span class="btn-arrow">→</span>`;

      // Hide success msg after 8s
      setTimeout(() => {
        if (successMsg) successMsg.innerHTML = '';
      }, 8000);
    })
    .catch(error => {
      console.error(error);
      if (errorMsg) {
        errorMsg.style.display = 'flex';
        errorMsg.style.cssText = `
          display: flex; align-items: center; gap: 12px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          border-radius: 12px; padding: 16px 20px;
          color: #F87171; font-size: 14px; margin-top: 16px;
        `;
        errorMsg.innerHTML = `<span style="font-size:20px;">❌</span> <span>Error sending request. Please check connection or contact us via WhatsApp.</span>`;
      }
      if (successMsg) successMsg.innerHTML = '';

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Request Free Consultation <span class="btn-arrow">→</span>`;
    });
  });

})();
