(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.querySelectorAll('.nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  if (typeof IntersectionObserver === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
  reveals.forEach(function (el) { observer.observe(el); });
})();

/* Demo modal — click Demo → select role → navigate app */
(function () {
  var modal = document.getElementById('demo-modal');
  var triggers = document.querySelectorAll('.demo-trigger');
  var backdrop = modal && modal.querySelector('.demo-modal-backdrop');
  var roleStep = document.getElementById('demo-step-role');
  var appStep = document.getElementById('demo-step-app');
  var roleChoices = document.querySelectorAll('.demo-role-choice');
  var container = document.getElementById('demo-phone-container');
  var roleLabel = document.getElementById('demo-role-label');
  var backBtn = document.querySelector('.demo-back');
  var closeBtn = document.querySelector('.demo-close');

  var roleNames = { student: 'Student', teacher: 'Teacher', parent: 'Parent', admin: 'Admin' };
  var currentPhone = null;
  var currentPanelId = null;
  var dialog = modal && modal.querySelector('.demo-modal-dialog');

  function openModal() {
    if (!modal) return;
    var nav = document.querySelector('.nav');
    if (nav) nav.classList.remove('is-open');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    roleStep.hidden = false;
    appStep.hidden = true;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (dialog) dialog.classList.remove('demo-modal-dialog--app');
    document.body.style.overflow = '';
    returnPhone();
  }

  function returnPhone() {
    if (currentPhone && currentPanelId) {
      var panel = document.getElementById(currentPanelId);
      if (panel) panel.appendChild(currentPhone);
      currentPhone = null;
      currentPanelId = null;
    }
  }

  function showApp(role) {
    var panelId = 'demo-' + role;
    var panel = document.getElementById(panelId);
    var phoneDemo = panel && panel.querySelector('.phone-demo');
    if (!phoneDemo || !container) return;

    returnPhone();
    currentPhone = phoneDemo;
    currentPanelId = panelId;
    container.appendChild(phoneDemo);

    roleStep.hidden = true;
    appStep.hidden = false;
    if (roleLabel) roleLabel.textContent = roleNames[role] || role;
  }

  function showRoleStep() {
    returnPhone();
    roleStep.hidden = false;
    appStep.hidden = true;
    if (dialog) dialog.classList.remove('demo-modal-dialog--app');
  }

  triggers.forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (backBtn) backBtn.addEventListener('click', showRoleStep);

  roleChoices.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var role = btn.getAttribute('data-role');
      if (role) showApp(role);
    });
  });

  modal && modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!appStep.hidden) showRoleStep();
      else closeModal();
    }
  });
})();

/* Phone nav — tap to switch screens inside the demo phone */
(function () {
  document.querySelectorAll('.phone-frame').forEach(function (frame) {
    var viewport = frame.querySelector('.phone-viewport');
    var navItems = frame.querySelectorAll('.phone-nav-item');
    if (!viewport || !navItems.length) return;

    navItems.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var viewId = btn.getAttribute('data-view');
        if (!viewId) return;

        var views = viewport.querySelectorAll('.mockup-view');
        views.forEach(function (view) {
          view.classList.toggle('active', view.getAttribute('data-view') === viewId);
        });
        navItems.forEach(function (item) {
          item.classList.toggle('active', item.getAttribute('data-view') === viewId);
        });
      });
    });
  });
})();
