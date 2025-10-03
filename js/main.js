// === UTILITIES ===
    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));

    // Header mobile toggle
    (function headerToggle(){
      const toggle = document.querySelector('.menu-toggle');
      const nav = document.getElementById('primary-nav');
      toggle?.addEventListener('click', ()=>{
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('show');
      });

      // close nav on link click for small screens
      $$('.nav-link').forEach(a => a.addEventListener('click', ()=>{
        nav.classList.remove('show');
        toggle.setAttribute('aria-expanded','false');
      }));
    })();

    // Smooth scroll & active link via IntersectionObserver
    (function scrollSpy(){
      const links = $$('.nav-link');
      const sections = links.map(l => document.querySelector(l.getAttribute('href')));

      const io = new IntersectionObserver((entries)=>{
        entries.forEach(e => {
          if(e.isIntersecting){
            $$('.nav-link').forEach(n=>n.classList.remove('active'));
            const id = e.target.id;
            const link = document.querySelector('.nav-link[href="#'+id+'"]');
            link?.classList.add('active');
          }
        });
      },{threshold:0.5});

      sections.forEach(s=> s && io.observe(s));
    })();

    // Typewriter
    (function typeWriter(){
      const el = document.getElementById('typeText');
      const phrases = ['I make interfaces simple & beautiful.','React, JavaScript, CSS — I love them.','I build responsive, accessible sites.'];
      let i=0, j=0, current='', forward=true;
      function tick(){
        const word = phrases[i];
        if(forward){
          current = word.slice(0, ++j);
          el.textContent = current;
          if(j === word.length){forward=false;setTimeout(tick,1200);return}
        } else {
          current = word.slice(0, --j);
          el.textContent = current;
          if(j === 0){forward=true;i=(i+1)%phrases.length}
        }
        setTimeout(tick, forward?80:30);
      }
      tick();
    })();

    // Skills animation on scroll
    (function animateSkills(){
      const skills = $$('.skill');
      const io = new IntersectionObserver((entries, o) =>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            const el = e.target;
            const pct = el.dataset.percent || 0;
            const bar = el.querySelector('.bar > i');
            bar.style.width = pct + '%';
            const progress = el.querySelector('.bar');
            progress.setAttribute('aria-valuenow', pct);
            o.unobserve(el);
          }
        })
      },{threshold:0.3});

      skills.forEach(s=> io.observe(s));
    })();

    // Modal video logic with focus handling
    (function videoModal(){
      const modal = $('#videoModal');
      const fullVideo = $('#fullVideo');
      const close = $('#closeModal');

      function open(src){
        fullVideo.src = src; modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false');
        close.focus();
        fullVideo.play().catch(()=>{});
      }
      function closeModal(){
        modal.style.display = 'none'; modal.setAttribute('aria-hidden','true');
        fullVideo.pause(); fullVideo.removeAttribute('src');
      }

      $$('.project .btn[data-video]').forEach(b=> b.addEventListener('click', ()=> open(b.dataset.video)));
      close.addEventListener('click', closeModal);
      modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
      window.addEventListener('keydown', e => { if(e.key==='Escape' && modal.style.display==='flex') closeModal(); });
    })();

    // Theme toggle (dark/light)
    (function themeToggle(){
      const btn = $('#themeToggle');
      const root = document.documentElement;
      const stored = localStorage.getItem('theme');
      if(stored==='light') root.style.setProperty('--bg','#f7f7f7'), root.style.setProperty('--text','#0b0f0d');

      btn.addEventListener('click', ()=>{
        const isLight = root.style.getPropertyValue('--bg') === '#f7f7f7';
        if(isLight){
          root.style.removeProperty('--bg');root.style.removeProperty('--text');
          btn.setAttribute('aria-pressed','false');localStorage.setItem('theme','dark');
        } else {
          root.style.setProperty('--bg','#f7f7f7');root.style.setProperty('--text','#0b0f0d');
          btn.setAttribute('aria-pressed','true');localStorage.setItem('theme','light');
        }
      });
    })();

    // Background canvas: lightweight particles + respect reduced motion
    (function backgroundCanvas(){
  const canvas = document.getElementById('background');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth,
      h = canvas.height = window.innerHeight;

  let particles = [];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = Math.max(30, Math.floor((w*h)/50000));

  function rand(n){ return Math.random()*n; }

  function init(){
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(w), y: rand(h),
        r: Math.random()*1.6+0.6,
        vx: (Math.random()-0.5)*0.6,
        vy: (Math.random()-0.5)*0.6
      });
    }
  }

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    init();
  }
  window.addEventListener('resize', resize);
  init();

  function draw(){
    ctx.clearRect(0, 0, w, h);

    // subtle gradient backdrop
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(0,0,0,0.0)');
    g.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (const p of particles){
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,255,153,0.12)';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x<0 || p.x>w) p.vx *= -1;
      if (p.y<0 || p.y>h) p.vy *= -1;
    }

    if (!reduce) requestAnimationFrame(draw);
  }

  if (!reduce) draw();
})();

    // small extras
    document.getElementById('year').textContent = new Date().getFullYear();
