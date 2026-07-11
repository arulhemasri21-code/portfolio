/* =============================================
   TYPING EFFECT - CYCLES THROUGH ROLES
   ============================================= */

'use strict';

(function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const roles = [
    'Full Stack Developer',
    'Backend Developer',
    'Data Analyst',
    'AI Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentText = '';

  function type() {
    const fullText = roles[roleIndex];

    if (isDeleting) {
      currentText = fullText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      currentText = fullText.substring(0, charIndex + 1);
      charIndex++;
    }

    el.textContent = currentText;

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === fullText.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
})();
