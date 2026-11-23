/**
 * Vaishali Singh - Personal Developer Portfolio JavaScript
 * Modern micro-interactions, canvas ambient constellations, form validation & navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavigation();
  initSkillFilters();
  initProjectModal();
  initContactForm();
  initEmailCopy();
  initImageFallback();
  initFooterYear();
});

/* ===================================================================
   1. CANVAS AMBIENT PARTICLES & CONSTELLATION MESH
   =================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse tracking for subtle interactive reaction
  const mouse = { x: null, y: null, radius: 120 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle configuration
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.6;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.4 ? 'rgba(168, 85, 247, ' : 'rgba(139, 92, 246, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce at edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse proximity interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const forceX = (dx / dist) * force * 1.5;
          const forceY = (dy / dist) * force * 1.5;
          this.x -= forceX;
          this.y -= forceY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const lineAlpha = (1 - dist / 110) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   2. NAVIGATION, STICKY HEADER & SCROLL SPY
   =================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateScrollSpy();
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll spy implementation
  function updateScrollSpy() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ===================================================================
   3. SKILLS CATEGORY FILTER
   =================================================================== */
function initSkillFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      // Update active tab
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter cards
      skillCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ===================================================================
   4. PROJECT PLACEHOLDER MODAL
   =================================================================== */
function initProjectModal() {
  const modal = document.getElementById('placeholderModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const placeholderBtns = document.querySelectorAll('.placeholder-btn');

  function openModal(projectName, type) {
    if (!modal) return;
    const typeLabel = type === 'demo' ? 'Live Demo' : 'GitHub Repository';
    modalTitle.textContent = `${projectName} – ${typeLabel} Placeholder`;
    modalDesc.innerHTML = `This project's <strong>${typeLabel}</strong> link is currently set as an editable placeholder.<br><br>
    To connect your actual URL, open <code>index.html</code>, search for <code>${projectName}</code>, and replace the placeholder button with your link tag.`;
    
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  placeholderBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const project = btn.getAttribute('data-project');
      const type = btn.getAttribute('data-type');
      openModal(project, type);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ===================================================================
   5. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const charCounter = document.getElementById('charCounter');
  const submitBtn = document.getElementById('submitBtn');
  const successBox = document.getElementById('formSuccessBox');
  const resetBtn = document.getElementById('resetFormBtn');

  // Character counter for textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      charCounter.textContent = `${length} / 1000`;
      if (length > 1000) {
        charCounter.style.color = '#f87171';
      } else {
        charCounter.style.color = 'var(--text-dim)';
      }
    });
  }

  // Clear errors on input
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        clearFieldError(input);
      });
    }
  });

  function clearFieldError(input) {
    input.classList.remove('input-error');
    const errEl = document.getElementById(`${input.id}Error`);
    if (errEl) errEl.textContent = '';
  }

  function setFieldError(input, msg) {
    input.classList.add('input-error');
    const errEl = document.getElementById(`${input.id}Error`);
    if (errEl) errEl.textContent = msg;
  }

  function validate() {
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, 'Please enter your name.');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, 'Name must be at least 2 characters.');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      setFieldError(emailInput, 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'Please provide a valid email format (e.g. name@domain.com).');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setFieldError(subjectInput, 'Please provide a subject line.');
      isValid = false;
    } else if (subjectInput.value.trim().length < 4) {
      setFieldError(subjectInput, 'Subject should be at least 4 characters long.');
      isValid = false;
    } else {
      clearFieldError(subjectInput);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setFieldError(messageInput, 'Please enter your message.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      setFieldError(messageInput, 'Message should be at least 10 characters.');
      isValid = false;
    } else if (messageInput.value.trim().length > 1000) {
      setFieldError(messageInput, 'Message cannot exceed 1000 characters.');
      isValid = false;
    } else {
      clearFieldError(messageInput);
    }

    return isValid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Simulate sending state
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'Sending message...';

    setTimeout(() => {
      form.style.display = 'none';
      if (successBox) successBox.style.display = 'flex';
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = originalText;
      showToast('Message sent successfully! Vaishali will respond soon.');
    }, 900);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (charCounter) charCounter.textContent = '0 / 1000';
      if (successBox) successBox.style.display = 'none';
      form.style.display = 'flex';
    });
  }
}

/* ===================================================================
   6. COPY EMAIL HELPER & TOAST NOTIFICATION
   =================================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailVal = document.getElementById('emailVal');
  const tooltip = document.getElementById('copyTooltip');

  if (!copyBtn || !emailVal) return;

  copyBtn.addEventListener('click', async () => {
    const textToCopy = emailVal.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older contexts
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (tooltip) {
        tooltip.textContent = 'Copied!';
        tooltip.classList.add('show');
        setTimeout(() => {
          tooltip.classList.remove('show');
          tooltip.textContent = 'Copy';
        }, 2000);
      }

      showToast('Email copied to clipboard!');
    } catch (err) {
      showToast('Could not copy email automatically.');
    }
  });
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 20);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (container.contains(toast)) container.removeChild(toast);
    }, 300);
  }, 3500);
}

/* ===================================================================
   7. PROFILE PHOTO ERROR FALLBACK
   =================================================================== */
function initImageFallback() {
  const profilePhoto = document.getElementById('profilePhoto');
  const profilePlaceholder = document.getElementById('profilePlaceholder');

  if (!profilePhoto || !profilePlaceholder) return;

  // Handle case where image fails to load
  profilePhoto.addEventListener('error', () => {
    profilePhoto.style.display = 'none';
    profilePlaceholder.style.display = 'flex';
  });

  // Verify if already completed or broken
  if (profilePhoto.complete && profilePhoto.naturalWidth === 0) {
    profilePhoto.style.display = 'none';
    profilePlaceholder.style.display = 'flex';
  }
}

/* ===================================================================
   8. FOOTER DYNAMIC YEAR
   =================================================================== */
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
