// Janela de case, usada pelas opções 3 e 4.
// abrirCaso(caso, {modo:'rolo'|'grade'}) — 'rolo' = peças em fila horizontal; 'grade' = mosaico.
(function(){
  const css = `
  #caso{position:fixed;inset:0;z-index:200;display:none;overflow:hidden;color:#fff;font-family:"Poppins",sans-serif}
  #caso.on{display:block}
  #caso .fundo{position:absolute;inset:0;background:var(--caso-cor,#121212);transition:background .6s}
  #caso .fundo::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,.1) 60%)}
  #caso .fechar{position:absolute;top:22px;right:clamp(16px,4vw,48px);z-index:5;background:#B6EE75;color:#121212;border:0;font-family:"Kode Mono",monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;padding:12px 16px;cursor:pointer}
  #caso .info{position:absolute;left:clamp(16px,5vw,72px);top:0;bottom:0;width:min(380px,84vw);display:flex;flex-direction:column;justify-content:center;z-index:3}
  #caso .info .mono{font-family:"Kode Mono",monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#B6EE75}
  #caso .info h2{margin-top:12px;font-size:clamp(34px,4.4vw,64px);line-height:.95;letter-spacing:-.035em;font-weight:600}
  #caso .info h3{margin-top:10px;font-weight:400;font-size:18px;color:rgba(255,255,255,.8)}
  #caso .info p{margin-top:18px;line-height:1.6;color:rgba(255,255,255,.78);font-size:15px}
  #caso .info .tags{margin-top:20px;display:flex;gap:6px;flex-wrap:wrap}
  #caso .info .tags span{border:1px solid rgba(255,255,255,.35);padding:6px 10px;font-family:"Kode Mono",monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase}
  #caso .info .nav{margin-top:28px;display:flex;gap:10px}
  #caso .info .nav button{background:transparent;border:1px solid rgba(255,255,255,.4);color:#fff;padding:10px 14px;font-family:"Kode Mono",monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
  #caso .info .nav button:hover{background:#fff;color:#121212}
  /* rolo */
  #caso .rolo{position:absolute;inset:0;display:flex;align-items:center;gap:28px;padding-left:calc(min(380px,84vw) + clamp(16px,5vw,72px) + 64px);padding-right:12vw;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;z-index:2;cursor:grab}
  #caso .rolo::-webkit-scrollbar{display:none}
  #caso .rolo figure{flex:0 0 auto;height:70vh;background:rgba(0,0,0,.25);box-shadow:0 40px 80px rgba(0,0,0,.45)}
  #caso .rolo figure img{height:100%;width:auto;display:block}
  /* grade */
  #caso .grade-caso{position:absolute;inset:0;overflow-y:auto;z-index:2;padding:110px clamp(16px,5vw,72px) 80px calc(min(380px,84vw) + clamp(16px,5vw,72px) + 56px);display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;align-items:start}
  #caso .grade-caso figure{min-width:0;box-shadow:0 30px 60px rgba(0,0,0,.4)}
  #caso .grade-caso img{width:100%;height:auto;display:block}
  @media (max-width:820px){
    #caso .info{position:relative;left:auto;width:auto;padding:90px 16px 20px;top:auto;bottom:auto;display:block}
    #caso .rolo{position:relative;display:block;padding:0 16px 40px;overflow:visible;cursor:auto}
    #caso .rolo figure{height:auto;margin-bottom:14px}
    #caso .rolo figure img{width:100%;height:auto}
    #caso .fundo{position:fixed}
    #caso .grade-caso{position:relative;padding:0 16px 40px;grid-template-columns:1fr}
    #caso{overflow-y:auto}
  }`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  const el=document.createElement('div'); el.id='caso';
  el.innerHTML=`<div class="fundo"></div><button class="fechar">Fechar ✕</button>
    <div class="info"><span class="mono"></span><h2></h2><h3></h3><p></p><div class="tags"></div>
    <div class="nav"><button data-d="-1">← Anterior</button><button data-d="1">Próximo →</button></div></div>
    <div class="corpo"></div>`;
  document.body.appendChild(el);
  let lista=[], idx=0, modo='rolo';
  function render(){
    const c=lista[idx]; el.scrollTop=0;
    el.style.setProperty('--caso-cor',c.cor||'#121212');
    el.querySelector('.mono').textContent=`Case ${String(idx+1).padStart(2,'0')} / ${String(lista.length).padStart(2,'0')}`;
    el.querySelector('h2').textContent=c.cliente;
    el.querySelector('h3').textContent=c.projeto;
    el.querySelector('p').textContent=c.texto||'';
    el.querySelector('.tags').innerHTML=c.frentes.map(f=>`<span>${f}</span>`).join('');
    const corpo=el.querySelector('.corpo');
    const figs=c.pecas.map(p=>`<figure><img src="${p}" alt="${c.cliente} — ${c.projeto}" loading="lazy"></figure>`).join('');
    corpo.innerHTML = modo==='rolo' ? `<div class="rolo">${figs}</div>` : `<div class="grade-caso">${figs}</div>`;
    const rolo=corpo.querySelector('.rolo');
    if(rolo){
      if(innerWidth>=820){
      rolo.addEventListener('wheel',e=>{ if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){ rolo.scrollLeft+=e.deltaY; e.preventDefault(); } },{passive:false});
      }
      let arr=null; rolo.addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse')return; arr={x:e.clientX,s:rolo.scrollLeft};rolo.style.cursor='grabbing'});
      addEventListener('pointerup',()=>{arr=null;rolo.style.cursor=''});
      rolo.addEventListener('pointermove',e=>{ if(arr) rolo.scrollLeft=arr.s-(e.clientX-arr.x) });
      if(window.gsap) gsap.from(rolo.querySelectorAll('figure'),{x:innerWidth<820?0:120,y:innerWidth<820?40:0,opacity:0,stagger:.07,duration:1,ease:'expo.out'});
    } else if(window.gsap) gsap.from(corpo.querySelectorAll('figure'),{y:60,opacity:0,stagger:.05,duration:.9,ease:'expo.out'});
    if(window.gsap) gsap.from(el.querySelectorAll('.info > *'),{y:24,opacity:0,stagger:.05,duration:.8,ease:'expo.out'});
  }
  function fechar(){ el.classList.remove('on'); document.documentElement.style.overflow=''; window.__lenis&&window.__lenis.start(); }
  el.querySelector('.fechar').onclick=fechar;
  el.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>{ idx=(idx+ +b.dataset.d+lista.length)%lista.length; render(); });
  addEventListener('keydown',e=>{ if(!el.classList.contains('on'))return; if(e.key==='Escape')fechar(); if(e.key==='ArrowRight'){idx=(idx+1)%lista.length;render()} if(e.key==='ArrowLeft'){idx=(idx-1+lista.length)%lista.length;render()} });
  window.abrirCaso=function(todos,i,m){ lista=todos; idx=i; modo=m||'rolo'; render(); el.classList.add('on'); document.documentElement.style.overflow='hidden'; window.__lenis&&window.__lenis.stop(); };
})();
