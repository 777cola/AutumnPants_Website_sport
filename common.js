/* =====================================================
   COMMON JS — 戚俊皓 | Personal Website v3
   共享的语言切换、主题、导航功能
   ===================================================== */

;(function() {
  'use strict';

  var THEME_KEY = 'theme';
  var LANG_KEY = 'lang';

  // ─── Shared I18N translations ──────────────────────
  // Subdomain pages extend this via their own I18N object
  window.SHARED_I18N = {
    zh: {
      'nav.home':'首页','nav.music':'音乐','nav.travel':'旅行',
      'nav.photo':'摄影','nav.sport':'运动','nav.sports':'运动',
      'nav.resume':'简历','nav.contact':'联系','nav.about':'关于',
      'footer.text':'© 2026 戚俊皓 · 华东理工大学金融专业',
      'footer.tagline':'用音乐表达，用镜头记录，用脚步丈量世界',
      'footer.music':'音乐','footer.travel':'旅行','footer.photo':'摄影',
      'footer.sport':'运动','footer.resume':'简历',
      'footer.contact':'联系','footer.home':'首页','footer.about':'关于',
      'backtop':'回到顶部',
      'theme.aria':'切换主题',
      'nav.aria':'菜单',
      'aria.close':'关闭',
    },
    en: {
      'nav.home':'Home','nav.music':'Music','nav.travel':'Travel',
      'nav.photo':'Photography','nav.sport':'Sport','nav.sports':'Sports',
      'nav.resume':'Resume','nav.contact':'Contact','nav.about':'About',
      'footer.text':'© 2026 Qi JunHao · Finance @ ECUST',
      'footer.tagline':'Express through music, capture with lens, measure the world with steps',
      'footer.music':'Music','footer.travel':'Travel','footer.photo':'Photography',
      'footer.sport':'Sport','footer.resume':'Resume',
      'footer.contact':'Contact','footer.home':'Home','footer.about':'About',
      'backtop':'Back to top',
      'theme.aria':'Toggle theme',
      'nav.aria':'Menu',
      'aria.close':'Close',
    },
    hant: {
      'nav.home':'首頁','nav.music':'音樂','nav.travel':'旅行',
      'nav.photo':'攝影','nav.sport':'運動','nav.sports':'運動',
      'nav.resume':'簡歷','nav.contact':'聯繫','nav.about':'關於',
      'footer.text':'© 2026 戚俊皓 · 華東理工大學金融專業',
      'footer.tagline':'用音樂表達，用鏡頭記錄，用腳步丈量世界',
      'footer.music':'音樂','footer.travel':'旅行','footer.photo':'攝影',
      'footer.sport':'運動','footer.resume':'簡歷',
      'footer.contact':'聯繫','footer.home':'首頁','footer.about':'關於',
      'backtop':'回到頂部',
      'theme.aria':'切換主題',
      'nav.aria':'選單',
      'aria.close':'關閉',
    }
  };

  // ─── DOM Ready ────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {

    // ─── Language Toggle ─────────────────────────────
    var langToggle = document.getElementById('langToggle');
    var currentLang = localStorage.getItem(LANG_KEY) || 'zh';

    function t(key, lang) {
      // Try page-specific I18N first, then shared
      var pageDict = window.PAGE_I18N && window.PAGE_I18N[lang];
      var sharedDict = window.SHARED_I18N[lang];
      if (pageDict && pageDict[key] !== undefined) return pageDict[key];
      if (sharedDict && sharedDict[key] !== undefined) return sharedDict[key];
      // Fallback to zh
      var zhPage = window.PAGE_I18N && window.PAGE_I18N['zh'];
      var zhShared = window.SHARED_I18N['zh'];
      if (zhPage && zhPage[key] !== undefined) return zhPage[key];
      if (zhShared && zhShared[key] !== undefined) return zhShared[key];
      return key;
    }

    function applyLang(lang) {
      currentLang = lang;
      localStorage.setItem(LANG_KEY, lang);

      // Update lang toggle UI
      document.querySelectorAll('.lang-item').forEach(function(el) {
        el.classList.toggle('active', el.dataset.lang === lang);
      });

      // Translate static data-i18n elements
      document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        var txt = t(key, lang);
        if (txt) el.innerHTML = txt;
      });

      // Update data-i18n-aria (aria-label without HTML)
      document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-aria');
        var txt = t(key, lang);
        if (txt) el.setAttribute('aria-label', txt.replace(/<[^>]*>/g, ''));
      });

      // Update meta tags with data-i18n-meta
      document.querySelectorAll('[data-i18n-meta]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-meta');
        var txt = t(key, lang);
        if (txt) el.setAttribute('content', txt);
      });

      // Update document title
      var titleKey = document.documentElement.getAttribute('data-i18n-title');
      if (titleKey) {
        var titleTxt = t(titleKey, lang);
        if (titleTxt) document.title = titleTxt;
      }

      // Dispatch for page-specific code
      document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang, t: t } }));
    }

    // Initial language state
    applyLang(currentLang);

    if (langToggle) {
      langToggle.addEventListener('click', function(e) {
        var item = e.target.closest('.lang-item');
        if (item) {
          applyLang(item.dataset.lang);
        }
      });
    }

    // ─── Theme Toggle ────────────────────────────────
    var themeToggle = document.getElementById('themeToggle');
    var savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) updateThemeIcon(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.add('theme-transitioning');
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(THEME_KEY, next);
        updateThemeIcon(next);
        setTimeout(function() {
          document.documentElement.classList.remove('theme-transitioning');
        }, 350);
      });
    }

    function updateThemeIcon(theme) {
      if (!themeToggle) return;
      themeToggle.innerHTML = theme === 'dark'
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    }

    // ─── Mobile Nav Toggle ───────────────────────────
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
      navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          navToggle.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });
    }

    // ─── Navbar Scroll Effect ────────────────────────
    var navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    // ─── Back to Top ─────────────────────────────────
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
      window.addEventListener('scroll', function() {
        backToTop.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });
      backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ─── Scroll Reveal Animations ────────────────────
    var revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
      var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '40px' });
      revealElements.forEach(function(el) { revealObserver.observe(el); });
    }
  });
})();
