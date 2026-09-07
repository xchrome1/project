// Alvin Guambor Portfolio — interactions
(function(){
  const reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preloader — dev boot scene, auto-enter on complete
  const fill = document.getElementById('loadFill');
  const pct = document.getElementById('loadPct');
  const pre = document.getElementById('preloader');
  const loadMsg=document.getElementById('loadMsg');
  const bootMsgs=['boot --wake-servers','check lis-queue --live','load modules --all','verify backups --nightly','deploy portfolio --prod'];
  try{ history.scrollRestoration='manual'; }catch{}
  document.body.style.overflow='hidden';
  window.scrollTo(0,0);
  // code rain columns
  if(!reduced){
    const rain=document.getElementById('codeRain');
    const glyphs='01{};</>=+*#$&%!?';
    if(rain){
      for(let i=0;i<26;i++){
        const s=document.createElement('span');
        let txt='';
        const len=8+Math.floor(Math.random()*10);
        for(let k=0;k<len;k++) txt+=glyphs[Math.floor(Math.random()*glyphs.length)];
        s.textContent=txt;
        s.style.left=(Math.random()*100)+'%';
        s.style.animationDuration=(3+Math.random()*5)+'s';
        s.style.animationDelay=(-Math.random()*6)+'s';
        if(Math.random()<0.25) s.style.color='#7c5cff';
        rain.appendChild(s);
      }
    }
  }
  function enterSite(){
    if(pre.classList.contains('leave')) return;
    pre.classList.add('leave');
    setTimeout(()=>{
      pre.classList.add('done');
      document.body.classList.add('loaded');
      document.body.style.overflow='';
      window.scrollTo(0,0);
      // retrigger hero reveals from the true top
      requestAnimationFrame(()=>document.querySelectorAll('.hero .reveal').forEach(el=>el.classList.add('visible')));
    }, reduced?50:750);
  }
  if(reduced){ enterSite(); }
  else{
    // fixed 5-second boot sequence
    const BOOT_MS=5000, t0=performance.now();
    let shown=0;
    const tick = setInterval(()=>{
      const el=performance.now()-t0;
      let p=Math.min(100, el/BOOT_MS*100);
      p=Math.max(shown, p+Math.random()*0.6);
      if(p>=100||el>=BOOT_MS){clearInterval(tick);
        fill.style.width='100%';pct.textContent='100';
        if(loadMsg) loadMsg.textContent='deploy portfolio --prod ✓';
        setTimeout(enterSite,450);return;}
      shown=p;
      fill.style.width = p+'%';
      pct.textContent = Math.floor(p);
      if(loadMsg) loadMsg.textContent=bootMsgs[Math.min(bootMsgs.length-1,Math.floor(p/22))];
    },120);
  }

  // Custom cursor
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;
    dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;
    ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();

  // Magnetic buttons
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      el.style.transform=`translate(${x*.15}px,${y*.15}px)`;
    });
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });

  // Mobile nav
  const burger=document.getElementById('burger');
  const links=document.getElementById('navLinks');
  burger.addEventListener('click',()=>links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));

  // Section watermarks + nav active state
  const water={about:'01',expertise:'02',work:'03',cases:'03B',experience:'04',education:'05',contact:'06'};
  const navMap={};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a=>{navMap[a.getAttribute('href').slice(1)]=a;});
  const secIO=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
      const link=navMap[e.target.id]; if(link) link.classList.add('active');
    }
  }),{rootMargin:'-40% 0px -55% 0px'});
  Object.keys(water).forEach(id=>{
    const s=document.getElementById(id);
    if(s){s.dataset.water=water[id]; secIO.observe(s);}
  });

  // Case-file tabs
  document.querySelectorAll('.case-tabs .pill').forEach(p=>p.addEventListener('click',()=>{
    const wrap=p.closest('.case-tabs');
    wrap.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));
    p.classList.add('active');
    wrap.querySelectorAll('.tabpane').forEach(t=>t.classList.toggle('active',t.id===p.dataset.tab));
  }));

  // CV → open printable resume (Save as PDF from there)
  const cvBtn=document.getElementById('cvBtn');
  if(cvBtn) cvBtn.addEventListener('click',()=>window.open('cv.html','_blank'));

  // Scroll reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Counters
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target, target=+el.dataset.count; let cur=0;
    const step=setInterval(()=>{
      cur++; el.textContent=cur;
      if(cur>=target) clearInterval(step);
    },120);
    cio.unobserve(el);
  }),{threshold:.6});
  document.querySelectorAll('.num').forEach(el=>cio.observe(el));

  // PHT clock (hero card + contact panel)
  const clock=document.getElementById('clock');
  const clock2=document.getElementById('clock2');
  function time(){
    try{
      const t=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Manila',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());
      if(clock) clock.textContent=t+' PHT';
      if(clock2) clock2.textContent=t+' PHT';
    }catch{
      const f=new Date().toLocaleTimeString();
      if(clock) clock.textContent=f; if(clock2) clock2.textContent=f;
    }
  }
  time(); setInterval(time,1000);

  // Testimonial slider
  const slides=[...document.querySelectorAll('.slide')];
  const count=document.getElementById('slideCount');
  let i=0;
  function show(n){
    i=(n+slides.length)%slides.length;
    slides.forEach((s,k)=>s.classList.toggle('active',k===i));
    count.textContent=String(i+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  }
  document.getElementById('nextBtn').onclick=()=>show(i+1);
  document.getElementById('prevBtn').onclick=()=>show(i-1);
  if(!reduced) setInterval(()=>show(i+1),8000);

  // Contact: pills, counter, copy, validation, loading, mailto fallback
  const toast=document.getElementById('toast');
  function say(msg){ if(!toast) return;
    toast.textContent=msg; toast.classList.add('show');
    clearTimeout(say._t); say._t=setTimeout(()=>toast.classList.remove('show'),2600);
  }
  let inquiryType='Production Support';
  document.querySelectorAll('.pill').forEach(p=>p.addEventListener('click',()=>{
    document.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));
    p.classList.add('active'); inquiryType=p.dataset.type;
  }));
  const fMsg=document.getElementById('fMsg'), msgCount=document.getElementById('msgCount');
  if(fMsg&&msgCount) fMsg.addEventListener('input',()=>{
    msgCount.textContent=fMsg.value.length+' / 1000';
  });
  // Copy-to-clipboard (stop card link navigation)
  document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async e=>{
    e.preventDefault(); e.stopPropagation();
    const txt=btn.dataset.copy;
    try{ await navigator.clipboard.writeText(txt); say('COPIED: '+txt); }
    catch{
      const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta);
      ta.select(); try{document.execCommand('copy'); say('COPIED: '+txt);}catch{say(txt);}
      ta.remove();
    }
    const old=btn.textContent; btn.textContent='✓'; setTimeout(()=>btn.textContent=old,1200);
  }));
  // Live-clear errors
  [['fName','eName'],['fEmail','eEmail'],['fSubj','eSubj'],['fMsg','eMsg']].forEach(([f])=>{
    const el=document.getElementById(f);
    if(el) el.addEventListener('input',()=>el.closest('.field').classList.remove('invalid'));
  });
  const form=document.getElementById('contactForm');
  if(form) form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('fName').value.trim();
    const email=document.getElementById('fEmail').value.trim();
    const phone=document.getElementById('fPhone').value.trim();
    const urg=document.getElementById('fUrg').value;
    const subj=document.getElementById('fSubj').value.trim();
    const msg=document.getElementById('fMsg').value.trim();
    let ok=true;
    const mark=(id,bad)=>{document.getElementById(id).closest('.field').classList.toggle('invalid',bad); if(bad) ok=false;};
    mark('fName',name.length<2);
    mark('fEmail',!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email));
    mark('fSubj',subj.length<4);
    mark('fMsg',msg.length<20);
    if(!ok){ say('PLEASE FIX THE HIGHLIGHTED FIELDS'); return; }
    const btn=document.getElementById('sendBtn');
    btn.classList.add('loading');
    btn.querySelector('.btn-label').textContent='Transmitting…';
    setTimeout(()=>{
      btn.classList.remove('loading');
      btn.querySelector('.btn-label').textContent='Transmit Signal ↗';
      const detail=document.getElementById('okDetail');
      detail.textContent=`Thanks ${name} — [${inquiryType} · ${urg}] received. I'll reply to ${email} within 24 hours.`;
      document.getElementById('formOk').classList.add('show');
      const body=`Hi Alvin,%0D%0A%0D%0AType: ${encodeURIComponent(inquiryType)}%0D%0AUrgency: ${encodeURIComponent(urg)}%0D%0AName: ${encodeURIComponent(name)}%0D%0APhone: ${encodeURIComponent(phone||'—')}%0D%0A%0D%0A${encodeURIComponent(msg)}`;
      document.getElementById('mailtoFallback').href=`mailto:vino71997@gmail.com?subject=${encodeURIComponent('['+inquiryType+'] '+subj)}&body=${body}`;
      say('✓ SIGNAL RECEIVED');
      form.querySelectorAll('input,textarea').forEach(f=>f.value='');
      if(msgCount) msgCount.textContent='0 / 1000';
    },1400);
  });
  const again=document.getElementById('sendAnother');
  if(again) again.addEventListener('click',()=>{
    document.getElementById('formOk').classList.remove('show');
    document.getElementById('fName').focus();
  });

  // Atmospheric Signal particle field (skipped under reduced motion)
  if(!reduced){
  const cv=document.getElementById('signalCanvas'), ctx=cv.getContext('2d');
  let W,H,pts=[];
  function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight;
    pts=Array.from({length:Math.min(90,Math.floor(W/16))},()=>({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,
      r:Math.random()*1.8+.4
    }));
  }
  resize(); addEventListener('resize',resize);
  (function draw(){
    ctx.clearRect(0,0,W,H);
    const my2=scrollY;
    pts.forEach(a=>{
      a.x+=a.vx;a.y+=a.vy;
      if(a.x<0||a.x>W)a.vx*=-1; if(a.y<0||a.y>H)a.vy*=-1;
      ctx.beginPath();ctx.arc(a.x,a.y-my2*.02%H,a.r,0,7);
      ctx.fillStyle='#4a8dff33';ctx.fill();
    });
    // connect near lines at top
    for(let k=0;k<pts.length;k++)for(let j=k+1;j<pts.length;j++){
      const dx=pts[k].x-pts[j].x,dy=pts[k].y-pts[j].y,d=dx*dx+dy*dy;
      if(d<12000){ctx.strokeStyle='#7c5cff22';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(pts[k].x,pts[k].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
    }
    requestAnimationFrame(draw);
  })();

  } // end reduced-motion guard

  // Work — scroll-driven horizontal showcase (desktop only)
  const hwrap=document.getElementById('hwrap'), htrack=document.getElementById('htrack');
  const hPanels=htrack?[...htrack.querySelectorAll('.hpanel')]:[];
  const hActive=!reduced && hwrap && htrack && hPanels.length && window.matchMedia('(min-width:961px)').matches;
  function hUpdate(){
    if(!hActive) return;
    const r=hwrap.getBoundingClientRect();
    const total=r.height-innerHeight;
    const p=total>0?Math.min(1,Math.max(0,-r.top/total)):0;
    const max=Math.max(0,htrack.scrollWidth-innerWidth);
    htrack.style.transform='translateX('+(-p*max)+'px)';
    // focus zoom: active panel full size, neighbors shrink + dim
    hPanels.forEach(pn=>{
      const r=pn.getBoundingClientRect();
      const d=Math.min(1,Math.abs(innerWidth/2-(r.left+r.width/2))/(innerWidth/2));
      const s=1-d*0.1;
      pn.style.transform='scale('+s.toFixed(3)+')';
      pn.style.opacity=(0.6+0.4*(s-0.9)/0.1).toFixed(3);
    });
  }
  if(hActive){
    let hTick=false;
    addEventListener('scroll',()=>{if(!hTick){hTick=true;requestAnimationFrame(()=>{hUpdate();hTick=false;});}},{passive:true});
    addEventListener('resize',hUpdate);
    hUpdate();
  }

  // Contact finale — CONNECT opens photo modal; message button reveals drawer
  const drawer=document.getElementById('drawer');
  const connectBtn=document.getElementById('connectBtn');
  const modal=document.getElementById('photoModal');
  const modalX=document.getElementById('modalX');
  const modalMsg=document.getElementById('modalMsg');
  function openModal(){ if(!modal) return;
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    if(modalX) modalX.focus();
  }
  function closeModal(){ if(!modal) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
  function openDrawer(){
    if(!drawer) return;
    drawer.classList.add('open');
    if(connectBtn) connectBtn.querySelector('.btn-label').textContent='CLOSE ↑';
    setTimeout(()=>drawer.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'}),120);
  }
  if(connectBtn) connectBtn.addEventListener('click',()=>{
    if(drawer&&drawer.classList.contains('open')){
      drawer.classList.remove('open');
      connectBtn.querySelector('.btn-label').textContent='CONNECT ↓';
    } else openModal();
  });
  if(modalX) modalX.addEventListener('click',closeModal);
  if(modal) modal.addEventListener('click',e=>{if(e.target===modal) closeModal();});
  addEventListener('keydown',e=>{if(e.key==='Escape') closeModal();});
  if(modalMsg) modalMsg.addEventListener('click',()=>{closeModal();openDrawer();});
  const fTitle=document.getElementById('finaleTitle');
  // Contact jumps land with the message panel dead-center in view
  document.querySelectorAll('a[href="#contact"]').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();
    const panel=document.querySelector('#contact .glass');
    if(panel) panel.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
    try{history.replaceState(null,'','#contact');}catch{}
  }));
  if(fTitle&&!reduced){
    let fTick=false;
    addEventListener('scroll',()=>{
      if(fTick) return; fTick=true;
      requestAnimationFrame(()=>{
        const r=fTitle.getBoundingClientRect();
        const p=(innerHeight/2-(r.top+r.height/2))/innerHeight;
        if(Math.abs(p)<1) fTitle.style.translate='0 '+(p*-24)+'px';
        fTick=false;
      });
    },{passive:true});
  }

  // Nav shadow on scroll
  const nav=document.getElementById('nav');
  addEventListener('scroll',()=>{
    nav.style.boxShadow=scrollY>20?'0 10px 40px #0008':'none';
  });
})();
