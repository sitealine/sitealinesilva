/**
 * JAVASCRIPT: ALINE SILVA - PSICÓLOGA CLÍNICA
 * Interatividade, animações suaves, FAQ acordeão, menu responsivo e qualificador WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. HEADER SCROLL EFFECT
  // ------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ------------------------------------------------------------------------
  // 2. MOBILE MENU
  // ------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 3. FAQ ACCORDION
  // ------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fecha todos os outros itens para um efeito sanfona limpo
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Alterna o item atual
        item.classList.toggle('active', !isActive);
        questionBtn.setAttribute('aria-expanded', String(!isActive));
      });
    }
  });

  // ------------------------------------------------------------------------
  // 4. INTERSECTION OBSERVER PARA FADE-IN ANIMAÇÕES
  // ------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-in-up');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback se o navegador for antigo
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // ------------------------------------------------------------------------
  // 5. QUALIFIER MODAL (QUALIFICAÇÃO INTELIGENTE DE LEAD)
  // ------------------------------------------------------------------------
  const qualifierModal = document.getElementById('qualifierModal');
  const closeQualifierBtn = document.getElementById('closeQualifierModal');
  const qualifierTriggers = document.querySelectorAll('[data-open-qualifier]');

  let leadData = {
    patientType: '',
    modality: '',
    period: ''
  };

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (qualifierModal) {
      qualifierModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      resetQualifier();
    }
  };

  const closeModal = () => {
    if (qualifierModal) {
      qualifierModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (qualifierTriggers.length > 0) {
    qualifierTriggers.forEach(btn => btn.addEventListener('click', openModal));
  }

  if (closeQualifierBtn) {
    closeQualifierBtn.addEventListener('click', closeModal);
  }

  if (qualifierModal) {
    qualifierModal.addEventListener('click', (e) => {
      if (e.target === qualifierModal) {
        closeModal();
      }
    });
  }

  const resetQualifier = () => {
    leadData = { patientType: '', modality: '', period: '' };
    document.querySelectorAll('.qualifier-step').forEach((step, idx) => {
      step.classList.toggle('active', idx === 0);
    });
    document.querySelectorAll('.qualifier-opt-btn').forEach(b => b.classList.remove('selected'));
  };

  // Botões de escolha do qualificador
  const optButtons = document.querySelectorAll('[data-qualifier-field]');
  optButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const field = this.getAttribute('data-qualifier-field');
      const val = this.getAttribute('data-qualifier-value');
      const nextStepId = this.getAttribute('data-next-step');

      leadData[field] = val;

      if (nextStepId === 'finish') {
        // Redireciona para o WhatsApp com mensagem qualificada
        const baseNumber = '5511987220409';
        let customMsg = `Olá, Aline! Tudo bem? Gostaria de informações sobre atendimento psicológico.%0A%0A*Minhas preferências:*%0A• *Para:* ${leadData.patientType}%0A• *Modalidade:* ${leadData.modality}%0A• *Preferência de horário:* ${leadData.period}%0A%0APoderia me passar os próximos horários disponíveis? 🧠✨`;
        
        const finalUrl = `https://api.whatsapp.com/send?phone=${baseNumber}&text=${customMsg}`;
        window.open(finalUrl, '_blank');
        closeModal();
      } else {
        // Vai para a próxima etapa
        document.querySelectorAll('.qualifier-step').forEach(step => {
          step.classList.remove('active');
        });
        const nextStepEl = document.getElementById(nextStepId);
        if (nextStepEl) {
          nextStepEl.classList.add('active');
        }
      }
    });
  });

});
