/* TAINOG — comportamento da página: menu, carrossel, lightbox e nav ativa. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------- menu mobile */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -------------------------------------------------------------- carrossel */
  var carousel = document.getElementById('carousel');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
    var dotsBox = document.getElementById('carousel-dots');
    var current = 0;
    var timer = null;
    var INTERVAL = 4500;

    var dots = slides.map(function (_, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ir para a foto ' + (index + 1));
      dot.addEventListener('click', function () {
        go(index);
        restart();
      });
      dotsBox.appendChild(dot);
      return dot;
    });

    function go(index) {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      dots[current].removeAttribute('aria-current');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('is-active');
      slides[current].removeAttribute('aria-hidden');
      dots[current].setAttribute('aria-current', 'true');
    }

    function restart() {
      if (timer) clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(function () { go(current + 1); }, INTERVAL);
    }

    go(0);
    restart();

    carousel.querySelector('.carousel-prev').addEventListener('click', function () {
      go(current - 1);
      restart();
    });
    carousel.querySelector('.carousel-next').addEventListener('click', function () {
      go(current + 1);
      restart();
    });

    carousel.addEventListener('mouseenter', function () {
      if (timer) clearInterval(timer);
    });
    carousel.addEventListener('mouseleave', restart);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (timer) clearInterval(timer);
      } else {
        restart();
      }
    });
  }

  /* --------------------------------------------------------------- lightbox */
  var gallery = document.getElementById('gallery');
  var lightbox = document.getElementById('lightbox');

  if (gallery && lightbox && typeof lightbox.showModal === 'function') {
    var buttons = Array.prototype.slice.call(gallery.querySelectorAll('button'));
    var figure = lightbox.querySelector('img');
    var counter = lightbox.querySelector('.lightbox-counter');
    var index = 0;
    var lastFocus = null;

    function show(next) {
      index = (next + buttons.length) % buttons.length;
      var thumb = buttons[index].querySelector('img');
      figure.src = thumb.getAttribute('data-full') || thumb.src;
      figure.alt = thumb.alt;
      counter.textContent = (index + 1) + ' / ' + buttons.length;
    }

    buttons.forEach(function (button, position) {
      button.addEventListener('click', function () {
        lastFocus = button;
        show(position);
        lightbox.showModal();
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', function () {
      lightbox.close();
    });
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () {
      show(index - 1);
    });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () {
      show(index + 1);
    });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
      if (event.key === 'ArrowLeft')  { event.preventDefault(); show(index - 1); }
    });

    lightbox.addEventListener('close', function () {
      if (lastFocus) lastFocus.focus();
    });
  }

  /* -------------------------------------------------- item de menu ativo */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var links = {};

  document.querySelectorAll('.site-nav a[href^="#"]').forEach(function (link) {
    links[link.getAttribute('href').slice(1)] = link;
  });

  if (sections.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (id) { links[id].removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------------------------------------------------- voltar ao topo */
  var toTop = document.getElementById('to-top');

  if (toTop) {
    var showAfter = window.innerHeight * 0.8;

    function updateToTop() {
      toTop.classList.toggle('is-visible', window.scrollY > showAfter);
    }

    updateToTop();
    window.addEventListener('scroll', updateToTop, { passive: true });

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------- ano no rodapé */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
