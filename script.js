/* TOMA NOTA — interactions */
(function(){

  // ===== NAV scrolled =====
  const nav = document.getElementById('nav');
  const onScroll = ()=>{
    if(window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // ===== Burger =====
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  if(burger && links){
    burger.addEventListener('click', ()=>{
      const open = links.style.display === 'flex';
      if(open){ links.removeAttribute('style'); return; }
      Object.assign(links.style, {
        display:'flex',position:'absolute',top:'100%',left:'0',right:'0',
        background:'var(--pink)',flexDirection:'column',padding:'18px 20px',gap:'4px',
        boxShadow:'0 12px 24px -10px rgba(0,0,0,.25)'
      });
    });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>links.removeAttribute('style')));
  }

  // ===== Scroll reveal =====
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.section-head, .m-card, .m-center, .salon, .grupo, .t-card, .nm-main, .nm-small, .nosotros-copy, .values .v, .contact-list li, .form, .quote-inner, .suc-item, .map-wrap').forEach(el=>{
    el.classList.add('reveal');
    io.observe(el);
  });

  // ===== Hero stats counters =====
  const counters = document.querySelectorAll('.hs strong');
  const cio = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const txt = el.textContent.trim();
      const m = txt.match(/([+]?)(\d[\d,]*)/);
      if(!m) return;
      const prefix = m[1] || '';
      const target = parseInt(m[2].replace(/,/g,''), 10);
      const dur = 1500;
      const start = performance.now();
      const tick = now=>{
        const p = Math.min(1, (now-start)/dur);
        const eased = 1 - Math.pow(1-p, 3);
        const v = Math.round(target*eased);
        el.textContent = prefix + v.toLocaleString('es-MX');
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  },{threshold:.5});
  counters.forEach(c=>cio.observe(c));

  // ===== Sucursales =====
  const sucursales = [
    { city:'Guadalajara', name:'Providencia',   x:240, y:200, color:'#F39424', active:true },
    { city:'Guadalajara', name:'Andares',       x:240, y:218, color:'#F39424', active:true },
    { city:'CDMX',        name:'Polanco',       x:350, y:240, color:'#E5388F', active:true },
    { city:'CDMX',        name:'Lomas',         x:350, y:258, color:'#E5388F', active:true },
    { city:'Monterrey',   name:'Valle',         x:320, y:120, color:'#2FB475', active:true },
    { city:'Querétaro',   name:'Centro',        x:320, y:210, color:'#8B3FBF', active:true },
    { city:'León',        name:'Centro',        x:285, y:202, color:'#2BA8D4', active:true },
    { city:'Puebla',      name:'Angelópolis',   x:380, y:258, color:'#E63946', active:true },
    { city:'Mérida',      name:'Norte',         x:515, y:250, color:'#2FB475', active:true },
    { city:'Cancún',      name:'Centro',        x:545, y:230, color:'#F39424', active:true },
    { city:'Veracruz',    name:'Centro',        x:420, y:248, color:'#E5388F', active:true },
    { city:'Aguascalientes', name:'Centro',     x:275, y:180, color:'#8B3FBF', active:true },
    { city:'San Luis Potosí', name:'Centro',    x:300, y:170, color:'#FFC83A', active:true },
    { city:'Tijuana',     name:'Río',           x:80,  y:90,  color:'#FFFFFF', active:false },
  ];

  const pinsG = document.getElementById('pins');
  const xmlns = 'http://www.w3.org/2000/svg';
  if(pinsG){
    sucursales.forEach((s, i)=>{
      const g = document.createElementNS(xmlns,'g');
      g.setAttribute('class','pin-dot');
      g.setAttribute('data-i', i);
      g.setAttribute('transform', `translate(${s.x} ${s.y})`);
      g.innerHTML = `
        <circle r="11" fill="${s.color}" opacity=".35" class="pin-pulse"/>
        <circle r="6" fill="${s.color}" stroke="#fff" stroke-width="2.5"/>
        <text class="pin-label" y="-13" text-anchor="middle">${s.city}</text>
      `;
      pinsG.appendChild(g);
      g.addEventListener('click', ()=>highlight(i));
    });
  }

  const listEl = document.getElementById('sucItems');
  function renderList(filter=''){
    if(!listEl) return;
    const q = filter.trim().toLowerCase();
    listEl.innerHTML = '';
    let any = false;
    sucursales.forEach((s, i)=>{
      const text = (s.city + ' ' + s.name).toLowerCase();
      if(q && !text.includes(q)) return;
      any = true;
      const li = document.createElement('li');
      li.className = 'suc-item';
      li.dataset.i = i;
      li.innerHTML = `
        <div class="suc-pin" style="background:${s.color}">${s.city[0]}</div>
        <div class="suc-info">
          <strong>${s.city}${s.name ? ' · ' + s.name : ''}</strong>
          <span>${s.active ? 'Sucursal activa · Lun–Vie 8:00–14:00' : 'Próxima apertura'}</span>
        </div>
        <span class="suc-arrow">→</span>
      `;
      li.addEventListener('click', ()=>highlight(i));
      listEl.appendChild(li);
    });
    if(!any){
      const li = document.createElement('li');
      li.style.cssText = 'padding:18px;color:rgba(255,255,255,.7);text-align:center;font-size:14px';
      li.textContent = 'No se encontraron sucursales.';
      listEl.appendChild(li);
    }
  }
  renderList();
  const sucSearch = document.getElementById('sucSearch');
  if(sucSearch) sucSearch.addEventListener('input', e=>renderList(e.target.value));

  function highlight(i){
    document.querySelectorAll('.suc-item').forEach(el=>el.classList.toggle('active', +el.dataset.i===i));
    document.querySelectorAll('.pin-dot').forEach(el=>{
      const idx = +el.getAttribute('data-i');
      const s = sucursales[idx];
      el.setAttribute('transform', `translate(${s.x} ${s.y}) scale(${idx===i?1.5:1})`);
    });
    const active = document.querySelector('.suc-item.active');
    if(active){
      const parent = active.parentElement;
      parent.scrollTo({top: active.offsetTop - 100, behavior:'smooth'});
    }
  }

  // ===== Nav links: random color cycle on hover =====
  // The hover bg color is set via --hc inline, but rotate through palette every hover
  const palette = ['#FFC83A','#2FB475','#F39424','#8B3FBF','#2BA8D4','#E63946','#FFFFFF'];
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.addEventListener('mouseenter', ()=>{
      const c = palette[Math.floor(Math.random()*palette.length)];
      a.style.setProperty('--hc', c);
    });
  });

  // ===== PIANO =====
  const piano = document.getElementById('piano');
  if(piano){
    const whiteLabels = ['A','S','D','F','G','H','J','K'];
    const whiteNotes  = ['C4','D4','E4','F4','G4','A4','B4','C5'];
    const whiteFreqs  = [261.63,293.66,329.63,349.23,392,440,493.88,523.25];
    const blackInfo = [
      {after:0, key:'W', freq:277.18},
      {after:1, key:'E', freq:311.13},
      {after:3, key:'T', freq:369.99},
      {after:4, key:'Y', freq:415.30},
      {after:5, key:'U', freq:466.16},
    ];

    whiteLabels.forEach((label, i)=>{
      const k = document.createElement('div');
      k.className = 'key-white';
      k.dataset.freq = whiteFreqs[i];
      k.dataset.key = label;
      k.innerHTML = `<span>${label}</span>`;
      piano.appendChild(k);
    });
    const widthPct = 100/whiteLabels.length;
    blackInfo.forEach(bk=>{
      const b = document.createElement('div');
      b.className = 'key-black';
      b.dataset.freq = bk.freq;
      b.dataset.key = bk.key;
      b.style.left = `calc(14px + ${widthPct*(bk.after+1) - 2.75}%)`;
      piano.appendChild(b);
    });

    let audioCtx;
    function play(freq){
      try{
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const o = audioCtx.createOscillator();
        const o2 = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'triangle';
        o2.type = 'sine';
        o.frequency.value = freq;
        o2.frequency.value = freq * 2;
        g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.22, audioCtx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.1);
        o.connect(g); o2.connect(g); g.connect(audioCtx.destination);
        o.start(); o2.start();
        o.stop(audioCtx.currentTime + 1.1);
        o2.stop(audioCtx.currentTime + 1.1);
      }catch(e){}
    }
    function flash(el){
      el.classList.add('active');
      setTimeout(()=>el.classList.remove('active'), 220);
    }
    piano.querySelectorAll('.key-white, .key-black').forEach(k=>{
      const trigger = e=>{
        e.preventDefault();
        play(parseFloat(k.dataset.freq));
        flash(k);
      };
      k.addEventListener('mousedown', trigger);
      k.addEventListener('touchstart', trigger, {passive:false});
    });

    const keyMap = {};
    piano.querySelectorAll('.key-white, .key-black').forEach(k=>{
      keyMap[k.dataset.key.toUpperCase()] = k;
    });
    const pressed = new Set();
    document.addEventListener('keydown', e=>{
      const k = e.key.toUpperCase();
      if(pressed.has(k)) return;
      const el = keyMap[k];
      if(el){
        pressed.add(k);
        play(parseFloat(el.dataset.freq));
        flash(el);
      }
    });
    document.addEventListener('keyup', e=>{
      pressed.delete(e.key.toUpperCase());
    });

    // Demo melody — Twinkle Twinkle (public domain)
    const demo = [
      ['C4',0],['C4',350],['G4',700],['G4',1050],
      ['A4',1400],['A4',1750],['G4',2100],
      ['F4',2700],['F4',3050],['E4',3400],['E4',3750],
      ['D4',4100],['D4',4450],['C4',4800],
    ];
    const noteToFreq = {C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25};
    const noteToEl = {};
    piano.querySelectorAll('.key-white').forEach((k,i)=>noteToEl[whiteNotes[i]] = k);

    const demoBtn = document.getElementById('pianoDemo');
    if(demoBtn){
      demoBtn.addEventListener('click', ()=>{
        demoBtn.disabled = true;
        const txt = demoBtn.textContent;
        demoBtn.textContent = '♪ Tocando…';
        demo.forEach(([n,t])=>{
          setTimeout(()=>{
            play(noteToFreq[n]);
            const el = noteToEl[n];
            if(el) flash(el);
          }, t);
        });
        setTimeout(()=>{
          demoBtn.disabled = false;
          demoBtn.textContent = txt;
        }, 5500);
      });
    }

    const clearBtn = document.getElementById('pianoClear');
    if(clearBtn){
      clearBtn.addEventListener('click', ()=>{
        piano.querySelectorAll('.active').forEach(k=>k.classList.remove('active'));
      });
    }
  }

})();
