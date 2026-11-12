document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. LIVE UTC TELEMETRY CLOCK
     ======================================================================== */
  const liveClockEl = document.getElementById('liveClock');

  function updateClock() {
    if (!liveClockEl) return;
    const now = new Date();
    liveClockEl.textContent = now.toISOString().substring(11, 19) + ' UTC';
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ========================================================================
     2. MOBILE NAVIGATION DRAWER & ACCESSIBILITY
     ======================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileNav && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
      closeCaseStudyModal();
    }
  });

  /* ========================================================================
     3. SCROLL REVEAL CHOREOGRAPHY WITH INTERSECTION OBSERVER
     ======================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ========================================================================
     4. INTERACTIVE CASE STUDY MODALS
     ======================================================================== */
  const modalOverlay = document.getElementById('caseStudyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const caseStudyTriggers = document.querySelectorAll('.case-study-trigger');

  const caseStudies = {
    vortex: {
      title: 'VORTEX PROTOCOL',
      eyebrow: 'ARCHIVE // 01 — FINTECH INFRASTRUCTURE',
      subtitle: 'Institutional liquidity dashboard engineered for sub-millisecond execution and real-time WebSocket orderbook visualization at 60 FPS.',
      metrics: [
        { val: '-74%', lbl: 'Bundle Size Reduction' },
        { val: '60 FPS', lbl: 'Orderbook Render Rate' },
        { val: '<15ms', lbl: 'Average WebSocket Latency' }
      ],
      details: 'Built completely without component library bloat. Utilizes direct HTML5 Canvas rendering for high-frequency depth charts, custom memory pooling for WebSocket state management, and edge worker token authentication.'
    },
    aether: {
      title: 'AETHER NEURAL',
      eyebrow: 'ARCHIVE // 02 — AI DEVELOPER PLATFORM',
      subtitle: 'Enterprise documentation and sandbox portal for a low-latency neural inference engine. Increased enterprise qualified demo conversions by 3.1x.',
      metrics: [
        { val: '3.1x', lbl: 'Demo Booking Lift' },
        { val: '100/100', lbl: 'Lighthouse Score Across All Vitals' },
        { val: '0.28s', lbl: 'First Contentful Paint' }
      ],
      details: 'Engineered with zero-dependency vanilla JS syntax highlighting, instant client-side search indexing, and a modular CSS grid system designed for effortless maintenance and lightning-fast developer onboarding.'
    },
    monolith: {
      title: 'MONOLITH ACOUSTICS',
      eyebrow: 'ARCHIVE // 03 — HARDWARE & AUDIO STOREFRONT',
      subtitle: 'Direct-to-consumer flagship ecommerce experience featuring interactive frequency response previews and seamless page transitions.',
      metrics: [
        { val: '+52%', lbl: 'Checkout Completion Rate' },
        { val: '<90ms', lbl: 'Page Transition Speed' },
        { val: '4.8s', lbl: 'Avg. User Session Duration' }
      ],
      details: 'Leverages the Web Audio API for custom interactive sound profile previews directly in the browser without third-party audio player plugins, backed by a lightning-fast headless Shopify GraphQL integration.'
    }
  };

  function openCaseStudyModal(projectId) {
    const data = caseStudies[projectId];
    if (!data || !modalOverlay || !modalBody) return;

    modalBody.innerHTML = `
      <span class="mono" style="font-size: 0.72rem; color: var(--accent-purple);">${data.eyebrow}</span>
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-subtitle">${data.subtitle}</p>
      
      <div class="modal-metrics-grid">
        ${data.metrics.map(m => `
          <div class="modal-metric-box">
            <div class="mono mm-val">${m.val}</div>
            <div class="mono mm-lbl">${m.lbl}</div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 1rem;">
        <h4 class="mono modal-section-title">ARCHITECTURAL OVERVIEW</h4>
        <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">${data.details}</p>
      </div>

      <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
        <a href="#inquire" class="btn btn-primary btn-sm modal-action-btn">Commission Similar Architecture</a>
        <button type="button" class="btn btn-secondary btn-sm" id="modalDismissBtn">Close Archive</button>
      </div>
    `;

    document.getElementById('modalDismissBtn').addEventListener('click', closeCaseStudyModal);
    modalOverlay.classList.add('is-active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudyModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  caseStudyTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      openCaseStudyModal(proj);
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', closeCaseStudyModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeCaseStudyModal();
    });
  }

  /* ========================================================================
     5. INTERACTIVE CLI TERMINAL
     ======================================================================== */
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const clearTerminalBtn = document.getElementById('clearTerminalBtn');
  const cmdChips = document.querySelectorAll('.cmd-chip');
  const cliContainer = document.getElementById('cliContainer');

  let commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: [
      'Available commands:',
      '  <span class="cmd-highlight">stack</span>        - Inspect core engineering languages &amp; infrastructure',
      '  <span class="cmd-highlight">audit</span>        - Run live runtime &amp; DOM performance diagnostic',
      '  <span class="cmd-highlight">availability</span> - View Q4/Q1 sprint allocation &amp; lead times',
      '  <span class="cmd-highlight">pricing</span>      - Display starting engagement investment tiers',
      '  <span class="cmd-highlight">clear</span>        - Flush terminal buffer'
    ],
    stack: [
      '[ARCHITECTURE STACK]',
      '  Core:      Semantic HTML5, Modern CSS Grid/Custom Props, Vanilla ES2025+',
      '  Graphics:  WebGL / GLSL Shaders, Canvas 2D, SVG Choreography',
      '  Backend:   Edge Workers, Node.js, Headless CMS, GraphQL/REST',
      '  Hosting:   Global CDN Edge (Sub-30ms TTFB)'
    ],
    availability: [
      '[CAPACITY SCHEDULE]',
      '  Current Sprint Status: <span class="cmd-highlight">OPEN (2 Slots Remaining)</span>',
      '  Next Onboarding Window: Within 5 business days',
      '  Typical Launch Timeline: 2–5 days depending on scope'
    ],
    pricing: [
      '[ENGAGEMENT TIERS]',
      '  01. High-Impact Landing   -> $100 (48 hours)',
      '  02. Full-Stack Platform   -> $150 (1 week)',
      '  03. Custom Web App &amp; Extras -> $200+ (Custom scope)'
    ]
  };

  function appendLine(htmlContent, isUser = false) {
    if (!terminalOutput) return;
    const div = document.createElement('div');
    div.className = isUser ? 'term-line term-user' : 'term-line';
    div.innerHTML = htmlContent;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function executeCommand(rawCmd) {
    const cleanCmd = rawCmd.trim().toLowerCase();
    if (!cleanCmd) return;

    commandHistory.push(cleanCmd);
    historyIndex = commandHistory.length;

    appendLine(`<span class="text-accent">visitor@kinetic:~$</span> ${escapeHTML(rawCmd)}`, true);

    if (cleanCmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    if (cleanCmd === 'audit') {
      const domNodes = document.getElementsByTagName('*').length;
      const loadTime = Math.round(performance.now());
      appendLine('[RUNNING RUNTIME AUDIT...]');
      setTimeout(() => {
        appendLine(`  DOM Node Count:   <span class="cmd-highlight">${domNodes} nodes</span> (Ultra-lean)`);
        appendLine(`  Session Uptime:   ${loadTime}ms`);
        appendLine('  Framework Bloat:  <span class="cmd-highlight">0 KB</span>');
        appendLine('  Status:           OPTIMAL');
      }, 220);
      return;
    }

    if (commands[cleanCmd]) {
      commands[cleanCmd].forEach((line) => appendLine(line));
    } else {
      appendLine(`Command not recognized: "${escapeHTML(cleanCmd)}". Type <span class="cmd-highlight">help</span> for available commands.`);
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (char) => {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return map[char];
    });
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executeCommand(terminalInput.value);
      terminalInput.value = '';
    });

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const currentVal = terminalInput.value.trim().toLowerCase();
        const availableCmds = Object.keys(commands).concat(['audit', 'clear']);
        const match = availableCmds.find((c) => c.startsWith(currentVal));
        if (match) {
          terminalInput.value = match;
        }
      }
    });
  }

  if (cliContainer && terminalInput) {
    cliContainer.addEventListener('click', () => {
      if (window.getSelection().toString() === '') {
        terminalInput.focus();
      }
    });
  }

  if (clearTerminalBtn && terminalOutput) {
    clearTerminalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      terminalOutput.innerHTML = '';
    });
  }

  cmdChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) executeCommand(cmd);
    });
  });

  /* ========================================================================
     6. PRICING TIER AUTO-SELECTION INTO INQUIRY FORM
     ======================================================================== */
  const tierButtons = document.querySelectorAll('.select-tier-btn');
  const projectScopeSelect = document.getElementById('projectScope');

  tierButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedTier = btn.getAttribute('data-tier');
      if (projectScopeSelect && selectedTier) {
        projectScopeSelect.value = selectedTier;
      }
    });
  });

  /* ========================================================================
     7. AJAX INQUIRY FORM SUBMISSION (PREVENTS REDIRECT & UPDATES BUTTON)
     ======================================================================== */
  const inquiryForm = document.getElementById('inquiryForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  const submitIcon = document.getElementById('submitIcon');

  if (inquiryForm && formFeedback && submitBtn) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Stop standard form redirect

      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const brief = document.getElementById('projectBrief').value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      formFeedback.className = 'form-feedback mono';

      if (!name || !emailValid || !brief) {
        formFeedback.textContent = '[ERROR] Please complete all required fields with a valid work email.';
        formFeedback.classList.add('is-error');
        return;
      }

      // Lock button and show transmitting state
      submitBtn.disabled = true;
      if (submitIcon) submitIcon.style.display = 'none';
      submitBtn.querySelector('span').textContent = 'Transmitting...';

      try {
        const formData = new FormData(inquiryForm);
        const response = await fetch(inquiryForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formFeedback.textContent = `[CONFIRMED] Brief logged for ${name}. Expect a technical response within 24 hours.`;
          formFeedback.classList.add('is-success');
          
          // Update button to "Submitted" and keep disabled
          submitBtn.querySelector('span').textContent = 'Submitted';
          inquiryForm.reset();
        } else {
          const data = await response.json();
          if (data && data.errors) {
            formFeedback.textContent = `[ERROR] ${data.errors.map(err => err.message).join(', ')}`;
          } else {
            formFeedback.textContent = '[ERROR] Submission failed. Please try emailing directly.';
          }
          formFeedback.classList.add('is-error');
          
          // Re-enable button on error
          submitBtn.disabled = false;
          if (submitIcon) submitIcon.style.display = '';
          submitBtn.querySelector('span').textContent = 'Transmit Project Brief';
        }
      } catch (error) {
        formFeedback.textContent = '[NETWORK ERROR] Unable to transmit. Check your connection.';
        formFeedback.classList.add('is-error');
        
        submitBtn.disabled = false;
        if (submitIcon) submitIcon.style.display = '';
        submitBtn.querySelector('span').textContent = 'Transmit Project Brief';
      }
    });
  }
});
