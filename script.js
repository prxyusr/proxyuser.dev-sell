document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. DYNAMIC FOOTER YEAR
     ======================================================================== */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  /* ========================================================================
     2. MOBILE SLIDE-OUT NAVIGATION DRAWER
     ======================================================================== */
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const closeBtn = document.getElementById('drawer-close-btn');
  const navMenu = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const drawerLinks = navMenu ? navMenu.querySelectorAll('a') : [];

  function openDrawer() {
    if (!navMenu || !navBackdrop || !toggleBtn) return;
    navMenu.classList.add('open');
    navBackdrop.classList.add('active');
    document.body.classList.add('drawer-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!navMenu || !navBackdrop || !toggleBtn) return;
    navMenu.classList.remove('open');
    navBackdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      closeDrawer();
      if (toggleBtn) toggleBtn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && navMenu && navMenu.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* ========================================================================
     3. PRICING TIER AUTO-SELECTION INTO CONTACT FORM
     ======================================================================== */
  const tierSelect = document.getElementById('tier');
  const tierButtons = document.querySelectorAll('.tier-select-btn');

  tierButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const chosenTier = btn.getAttribute('data-tier');
      if (tierSelect && chosenTier) {
        tierSelect.value = chosenTier;
        tierSelect.classList.remove('is-invalid');
        const tierError = document.getElementById('tier-error');
        if (tierError) tierError.textContent = '';
      }
    });
  });

  /* ========================================================================
     4. FORM VALIDATION & FORMSPREE SUBMISSION
     ======================================================================== */
  const form = document.getElementById('commission-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedbackEl = document.getElementById('form-feedback');

  const validators = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      check: (val) => val.trim().length >= 2 || 'Please enter your name or handle.'
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      check: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) || 'Please enter a valid email address.'
    },
    tier: {
      input: document.getElementById('tier'),
      error: document.getElementById('tier-error'),
      check: (val) => val.trim() !== '' || 'Please select a commission tier.'
    },
    details: {
      input: document.getElementById('details'),
      error: document.getElementById('details-error'),
      check: (val) => val.trim().length >= 15 || 'Please provide at least 15 characters describing your project.'
    }
  };

  Object.values(validators).forEach(({ input, error, check }) => {
    if (!input) return;
    const evt = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(evt, () => {
      if (input.classList.contains('is-invalid')) {
        const result = check(input.value);
        if (result === true) {
          input.classList.remove('is-invalid');
          if (error) error.textContent = '';
        }
      }
    });
  });

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (feedbackEl) {
        feedbackEl.className = 'form-feedback';
        feedbackEl.textContent = '';
      }

      let formIsValid = true;

      Object.values(validators).forEach(({ input, error, check }) => {
        if (!input) return;
        const result = check(input.value);
        if (result !== true) {
          formIsValid = false;
          input.classList.add('is-invalid');
          if (error) error.textContent = result;
        } else {
          input.classList.remove('is-invalid');
          if (error) error.textContent = '';
        }
      });

      if (!formIsValid) {
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const defaultBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Request...</span>';

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          feedbackEl.className = 'form-feedback success';
          feedbackEl.textContent = 'Brief received. I will review your project and reply within 24 hours.';
          form.reset();
        } else {
          throw new Error('Form submission error');
        }
      } catch (err) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = 'Unable to send right now. Please try again or reach out via email.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = defaultBtnContent;
      }
    });
  }
});
