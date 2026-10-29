/**
 * MANISHA NEGI - PORTFOLIO INTERACTION ENGINE
 * Responsive, Interactive Features, Canvas Animation, Terminal, Theme & Modals
 */

// Guard against duplicate execution if both script.js and js/script.js load
if (!window.__MANISHA_PORTFOLIO_INITIALIZED__) {
  window.__MANISHA_PORTFOLIO_INITIALIZED__ = true;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllPortfolioFeatures);
  } else {
    initAllPortfolioFeatures();
  }
}

function initAllPortfolioFeatures() {
  initBackgroundCanvas();
  initCustomCursor();
  initThemeToggle();
  initNavbarScrollSpy();
  initMobileDrawer();
  initTypingEffect();
  initHeroTilt();
  initCounters();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModals();
  initTerminal();
  initResumeModal();
  initContactForm();
  initClipboardButtons();
  initCurrentYear();
}

/* ===================================================================
   1. BACKGROUND PARTICLES CANVAS
   =================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark
        ? `rgba(168, 85, 247, ${this.alpha * 0.8})`
        : `rgba(99, 102, 241, ${this.alpha * 0.6})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    const maxDist = 120;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * (isDark ? 0.12 : 0.08);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark
            ? `rgba(139, 92, 246, ${lineAlpha})`
            : `rgba(99, 102, 241, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. CUSTOM GLOWING CURSOR
   =================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (!cursor || !follower || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  renderFollower();

  // Hover states for links & buttons
  const interactives = document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .term-chip');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      follower.style.width = '55px';
      follower.style.height = '55px';
      follower.style.backgroundColor = 'rgba(139, 92, 246, 0.15)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width = '38px';
      follower.style.height = '38px';
      follower.style.backgroundColor = 'transparent';
    });
  });
}

/* ===================================================================
   3. THEME SWITCHER (DARK / LIGHT)
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('manisha-portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  function toggle() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('manisha-portfolio-theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggle);
  }

  // Keyboard shortcut 'T' to toggle theme
  window.addEventListener('keydown', (e) => {
    if ((e.key === 't' || e.key === 'T') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      toggle();
    }
  });
}

/* ===================================================================
   4. NAVBAR SCROLL EFFECT & SCROLLSPY
   =================================================================== */
function initNavbarScrollSpy() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add scrolled styling
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentId = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   5. MOBILE DRAWER NAVIGATION
   =================================================================== */
function initMobileDrawer() {
  const hamburger = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');
  const resumeModal = document.getElementById('resume-modal');

  function openMenu() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  if (mobileResumeBtn && resumeModal) {
    mobileResumeBtn.addEventListener('click', () => {
      closeMenu();
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
}

/* ===================================================================
   6. DYNAMIC TYPING EFFECT
   =================================================================== */
function initTypingEffect() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const words = [
    'BCA Student @ SRHU',
    'Passionate Web Developer',
    'Frontend Enthusiast',
    'Creative Problem Solver',
    'School of Science & Tech Scholar'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typedTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      delay = 55;
    } else {
      typedTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      delay = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ===================================================================
   7. HERO 3D CARD TILT
   =================================================================== */
function initHeroTilt() {
  const tiltCard = document.getElementById('hero-tilt-card');
  if (!tiltCard || window.matchMedia('(hover: none)').matches) return;

  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ===================================================================
   8. NUMERIC COUNTERS ANIMATION
   =================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter-number');
  if (!counterElements.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counterElements.forEach((el) => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const duration = 1600;
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.ceil(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.4 });

  const counterParent = document.querySelector('.counters-row');
  if (counterParent) observer.observe(counterParent);
}

/* ===================================================================
   9. SKILLS FILTERING
   =================================================================== */
function initSkillsFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const categories = card.getAttribute('data-category');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   10. PROJECTS FILTERING
   =================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   11. PROJECT DETAILS MODAL & DEMO HANDLER
   =================================================================== */
const projectData = {
  1: {
    title: 'CampusConnect - SRHU BCA Student Portal',
    category: 'Web Application & Academic Resource',
    overview: 'A dedicated resource platform designed specifically for Bachelor of Computer Applications students at Swami Rama Himalayan University. It provides unified access to syllabus copies, faculty notes, previous exam question banks, and an assignment due-date calendar.',
    features: [
      'Interactive semester-wise syllabus guide with milestone checklists',
      'Class notes repository with search and file categorization',
      'Personal assignment schedule with localStorage persistence',
      'Quick academic notices and exam countdown timers',
      'Mobile-first responsive interface optimized for college smartphones'
    ],
    tech: ['HTML5', 'CSS3 (Flexbox & CSS Grid)', 'Vanilla JavaScript', 'LocalStorage API']
  },
  2: {
    title: 'WeatherPulse - Dynamic Meteorological Forecast',
    category: 'API Web Application',
    overview: 'An aesthetic, responsive weather application pulling real-time meteorological metrics across global and Indian cities. Includes temperature, humidity, UV index, wind velocity, and predictive 5-day forecasts.',
    features: [
      'Real-time OpenWeatherMap API integration using fetch & async/await',
      'City search with autocompletion and geolocation detection',
      'Dynamic backdrop gradients that adjust depending on weather condition and time of day',
      'Detailed hourly forecast and precipitation chance indicators'
    ],
    tech: ['JavaScript (ES6+)', 'REST APIs', 'CSS Custom Properties', 'Responsive UI']
  },
  3: {
    title: 'EduTrack - GPA & Attendance Planner',
    category: 'Academic Utility Software',
    overview: 'An academic companion created to help students calculate their semester SGPA/CGPA with credit weightage and forecast required attendance to meet mandatory college criteria.',
    features: [
      'Configurable credit point system matching university grading scheme',
      'Smart attendance predictor: alerts students how many lectures can be missed safely or how many need to be attended',
      'Downloadable visual academic summary report',
      'Clean interactive form controls with immediate recalculation'
    ],
    tech: ['JavaScript', 'HTML5 Form Controls', 'CSS3 Glassmorphism', 'Data Calculation Logic']
  },
  4: {
    title: 'TaskMaster - Kanban Productivity Board',
    category: 'Productivity Application',
    overview: 'A sleek, visual task management solution inspired by modern agile workflows. Allows students to structure their study goals, project sprints, and daily assignments effortlessly.',
    features: [
      'HTML5 Native Drag-and-Drop between "To Do", "In Progress", and "Completed"',
      'Priority tags (Urgent, Medium, Low) and due-date badges',
      'Search and filter tasks on the fly',
      'State persisted locally across browser sessions'
    ],
    tech: ['HTML5 Drag & Drop API', 'JavaScript ES6', 'LocalStorage', 'CSS Grid']
  },
  5: {
    title: 'BCA TechQuiz - Computer Science Arena',
    category: 'Gamified Educational App',
    overview: 'An interactive quiz game tailored for BCA undergraduates to practice core subject questions in C, C++, Data Structures, Computer Networks, and DBMS.',
    features: [
      'Timed quiz rounds with live countdown bar',
      'Immediate explanation of correct answers after each choice',
      'High-score leaderboard and streak bonuses',
      'Comprehensive performance breakdown at the end of every round'
    ],
    tech: ['Vanilla JavaScript', 'JSON Question Bank', 'CSS Animations', 'Audio FX (Web Audio API)']
  },
  6: {
    title: 'Manisha Negi - Modern Developer Portfolio',
    category: 'Portfolio Website (This Site)',
    overview: 'An ultra-modern, fully responsive personal portfolio designed and engineered from the ground up to showcase skills, university coursework, and interactive projects.',
    features: [
      'Dual theme system (Dark & Light) with persistent preference',
      'Interactive developer terminal emulator with custom commands',
      'Dynamic particle background canvas with connecting nodes',
      'Printable resume modal formatted for A4 PDF export',
      'Fluid responsiveness across ultra-wide monitors to mobile screens'
    ],
    tech: ['HTML5 Semantic Structure', 'Modern CSS & Glassmorphism', 'Modular JavaScript', 'FontAwesome CDN']
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-project-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalCategory = document.getElementById('modal-project-category');
  const modalBody = document.getElementById('modal-project-body');

  function openProjectModal(id) {
    const data = projectData[id];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;

    modalBody.innerHTML = `
      <div style="margin-bottom: 1.2rem;">
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--text-heading);">Project Overview</h4>
        <p style="font-size: 0.92rem; line-height: 1.6; color: var(--text-secondary);">${data.overview}</p>
      </div>

      <div style="margin-bottom: 1.2rem;">
        <h4 style="font-size: 1.05rem; margin-bottom: 0.6rem; color: var(--text-heading);">Key Features &amp; Highlights</h4>
        <ul style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
          ${data.features.map(f => `<li style="display: flex; align-items: flex-start; gap: 0.6rem;"><i class="fa-solid fa-circle-check" style="color: var(--accent-primary); margin-top: 3px;"></i> <span>${f}</span></li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 1.4rem;">
        <h4 style="font-size: 1.05rem; margin-bottom: 0.6rem; color: var(--text-heading);">Technologies Used</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 0.8rem; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.2rem;">
        <button class="btn btn-primary" onclick="showToast('Demo preview triggered for ${data.title}', 'success');">
          <i class="fa-solid fa-play"></i> Launch Demo
        </button>
        <button class="btn btn-secondary" onclick="showToast('Source repository link opened', 'info');">
          <i class="fa-brands fa-github"></i> View GitHub Repo
        </button>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-project-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project');
      openProjectModal(id);
    });
  });

  document.querySelectorAll('.project-demo-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const demo = btn.getAttribute('data-demo');
      showToast(`Launching interactive demo for ${demo.toUpperCase()}...`, 'success');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* ===================================================================
   12. INTERACTIVE TERMINAL EMULATOR
   =================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');
  const clearBtn = document.getElementById('clear-term-btn');
  const chips = document.querySelectorAll('.term-chip');

  if (!terminalInput || !terminalOutput) return;

  const commands = {
    help: () => `
      <div style="color: #38bdf8; font-weight: 600; margin-bottom: 4px;">Available Commands:</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
        <tr><td style="color: #a855f7; width: 110px;">help</td><td>Display this help index</td></tr>
        <tr><td style="color: #a855f7;">about</td><td>Learn about Manisha Negi</td></tr>
        <tr><td style="color: #a855f7;">srhu</td><td>Details on Swami Rama Himalayan University & School</td></tr>
        <tr><td style="color: #a855f7;">skills</td><td>List key technical competencies & languages</td></tr>
        <tr><td style="color: #a855f7;">projects</td><td>Browse featured academic & web projects</td></tr>
        <tr><td style="color: #a855f7;">contact</td><td>View contact channels & email</td></tr>
        <tr><td style="color: #a855f7;">resume</td><td>Open printable resume preview</td></tr>
        <tr><td style="color: #a855f7;">theme</td><td>Toggle between Dark & Light mode</td></tr>
        <tr><td style="color: #a855f7;">clear</td><td>Clear the terminal screen</td></tr>
        <tr><td style="color: #a855f7;">date</td><td>Show current system date & time</td></tr>
      </table>`,
    about: () => `
      <p><strong>Manisha Negi</strong> is an undergraduate student pursuing a <strong>Bachelor of Computer Applications (BCA)</strong>.</p>
      <p style="margin-top: 4px; color: #94a3b8;">Focus areas: Responsive Web Engineering, Data Structures, OOP, and Modern UI/UX Design.</p>`,
    srhu: () => `
      <div style="border-left: 3px solid #8b5cf6; padding-left: 10px;">
        <p><strong style="color: #38bdf8;">Institution:</strong> Swami Rama Himalayan University (SRHU)</p>
        <p><strong style="color: #38bdf8;">School:</strong> School of Science &amp; Technology</p>
        <p><strong style="color: #38bdf8;">Program:</strong> Bachelor of Computer Applications (BCA)</p>
        <p><strong style="color: #38bdf8;">Location:</strong> Jolly Grant, Dehradun, Uttarakhand, India</p>
      </div>`,
    skills: () => `
      <p><span style="color: #10b981;">Frontend:</span> HTML5, CSS3, JavaScript (ES6+), Responsive Layouts, Flexbox, CSS Grid</p>
      <p><span style="color: #38bdf8;">Programming:</span> C, C++, Core Java, Object-Oriented Programming (OOP)</p>
      <p><span style="color: #fbbf24;">Databases & Tools:</span> SQL/MySQL, Git, GitHub, VS Code, REST APIs</p>`,
    projects: () => `
      <p>1. <strong>CampusConnect:</strong> Student notes, syllabus & assignment hub</p>
      <p>2. <strong>WeatherPulse:</strong> Live meteorological forecasting web app</p>
      <p>3. <strong>EduTrack:</strong> Collegiate SGPA/CGPA & attendance calculator</p>
      <p>4. <strong>TaskMaster:</strong> Kanban board with drag-and-drop workflow</p>
      <p>5. <strong>BCA TechQuiz:</strong> CS challenge app with timed questions</p>`,
    contact: () => `
      <p><i class="fa-solid fa-envelope" style="color: #a855f7;"></i> Email: <a href="mailto:manishanegi.dev@gmail.com" style="color: #38bdf8; text-decoration: underline;">manishanegi.dev@gmail.com</a></p>
      <p><i class="fa-solid fa-location-dot" style="color: #a855f7;"></i> Location: Dehradun, Uttarakhand, India</p>
      <p><i class="fa-brands fa-linkedin" style="color: #a855f7;"></i> LinkedIn: linkedin.com/in/manishanegi</p>`,
    resume: () => {
      const resumeModal = document.getElementById('resume-modal');
      if (resumeModal) {
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      return 'Opening resume preview modal...';
    },
    theme: () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('manisha-portfolio-theme', next);
      return `Theme switched to <strong>${next.toUpperCase()}</strong> mode.`;
    },
    date: () => new Date().toLocaleString(),
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    },
    sudo: () => '<span style="color: #ef4444;">guest is not in the sudoers file. This incident will be reported. 🔒</span>'
  };

  function executeCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();

    const historyItem = document.createElement('div');
    historyItem.className = 'terminal-history-item';

    const cmdEcho = document.createElement('div');
    cmdEcho.className = 'term-cmd-echo';
    cmdEcho.innerHTML = `<span class="term-prompt"><span class="term-user">guest@manisha-pc</span>:<span class="term-path">~</span>$</span> ${escapeHTML(trimmed)}`;
    historyItem.appendChild(cmdEcho);

    const cmdRes = document.createElement('div');
    cmdRes.className = 'term-cmd-res';

    if (commands[cmd]) {
      const output = commands[cmd]();
      if (cmd === 'clear') return;
      cmdRes.innerHTML = output;
    } else {
      cmdRes.innerHTML = `<span style="color: #ef4444;">Command not found: '${escapeHTML(cmd)}'. Type <span style="color: #38bdf8;">'help'</span> for a list of valid commands.</span>`;
    }

    historyItem.appendChild(cmdRes);
    terminalOutput.appendChild(historyItem);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const value = terminalInput.value;
      executeCommand(value);
      terminalInput.value = '';
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalOutput.innerHTML = '';
      terminalInput.focus();
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      terminalInput.value = cmd;
      executeCommand(cmd);
      terminalInput.value = '';
      terminalInput.focus();
    });
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* ===================================================================
   13. RESUME MODAL & PRINT
   =================================================================== */
function initResumeModal() {
  const openBtn = document.getElementById('open-resume-btn');
  const closeBtn = document.getElementById('close-resume-modal');
  const modal = document.getElementById('resume-modal');
  const printBtn = document.getElementById('print-resume-btn');

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      const projModal = document.getElementById('project-modal');
      if (projModal) projModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ===================================================================
   14. CONTACT FORM VALIDATION & SUBMISSION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    nameError.textContent = '';
    emailError.textContent = '';
    subjectError.textContent = '';
    messageError.textContent = '';

    // Validate Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email.';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please provide a valid email address.';
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      subjectError.textContent = 'Please enter a subject.';
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please enter your message.';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = 'Message should be at least 10 characters long.';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    submitBtn.disabled = true;

    setTimeout(() => {
      btnText.style.display = 'inline-flex';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
      form.reset();

      showToast('Thank you! Your message has been sent successfully.', 'success');
    }, 1200);
  });
}

/* ===================================================================
   15. COPY TO CLIPBOARD HANDLERS
   =================================================================== */
function initClipboardButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`, 'info');
        }).catch(() => {
          showToast('Failed to copy', 'error');
        });
      }
    });
  });
}

/* ===================================================================
   16. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/* ===================================================================
   17. CURRENT YEAR UTILITY
   =================================================================== */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

