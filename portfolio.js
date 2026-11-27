/* Portfolio page: groups films by type, filter pills, type-only labels (no couple initials), modal player. */
(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const track=(n,p)=>{try{if(window.umami)window.umami.track(n,p)}catch(e){}};

const labelOf=t=>{
  const s=String(t||"");
  if(/teaser/i.test(s))return"Teaser";
  if(/highlight/i.test(s))return"Highlight";
  return s||"Film";
};

const FILMS=(window.SITE_FILMS||[]).map(([v,title,type,meta])=>({
  v,title,type,meta:meta||"",kind:/teaser/i.test(type)?"teaser":(/highlight/i.test(type)?"highlight":"other"),label:labelOf(type)
}));
const host=$("pf");if(!host||!FILMS.length)return;

const SECS=[
  {k:"highlight",re:/highlight/i,h:"Highlight films",d:"Cinematic films of the full day — getting ready through the reception — shaped into a clear story."},
  {k:"teaser",re:/teaser/i,h:"Teasers",d:"Short, dynamic cuts of the best moments, made for social and for pulling people into the full film."},
  {k:"other",re:/./,h:"More films",d:"Other edits from recent weddings."}
];
const groups=SECS.map(s=>({...s,films:[]}));
FILMS.forEach(f=>{(groups.find(g=>g.re.test(f.type))||groups[groups.length-1]).films.push(f)});
const shown=groups.filter(g=>g.films.length);
let order=shown.flatMap(g=>g.films);

const card=(f,n,firstSec)=>`<button class="film" style="--i:${n%6}" type="button" data-id="${esc(f.v)}" data-kind="${esc(f.kind)}" aria-label="Watch ${esc(f.label)} film${f.meta?" — "+esc(f.meta):""}"><img src="https://img.youtube.com/vi/${esc(f.v)}/hq720.jpg" onerror="this.onerror=null;this.src=this.src.replace('hq720','hqdefault')" alt="" ${n<2&&firstSec?'fetchpriority="high"':'loading="lazy"'} decoding="async" width="480" height="270"><span class="play" aria-hidden="true"></span><span class="pf-badge">${esc(f.label)}</span></button>`;

host.innerHTML=shown.map((g,gi)=>`<section class="pf-sec rv" id="sec-${g.k}" data-kind="${g.k}" aria-labelledby="pf-${g.k}"><div class="pf-t"><h2 id="pf-${g.k}">${g.h}</h2><span class="pf-n">${g.films.length} ${g.films.length===1?"film":"films"}</span></div><p>${g.d}</p><div class="pf-grid">${g.films.map((f,n)=>card(f,n,gi===0)).join("")}</div></section>`).join("");

/* Filter pills: All / section names */
const jb=$("pfj");
if(jb&&shown.length){
  const pills=[{k:"all",h:"All"},...shown.map(g=>({k:g.k,h:g.k==="highlight"?"Highlights":(g.k==="teaser"?"Teasers":g.h)}))];
  jb.innerHTML=pills.map((p,i)=>`<button type="button" class="pf-pill${i===0?" is-on":""}" data-filter="${esc(p.k)}" aria-pressed="${i===0?"true":"false"}">${esc(p.h)}</button>`).join("");
  jb.hidden=false;
  jb.addEventListener("click",e=>{
    const b=e.target.closest("[data-filter]");if(!b)return;
    const k=b.getAttribute("data-filter");
    jb.querySelectorAll(".pf-pill").forEach(x=>{const on=x===b;x.classList.toggle("is-on",on);x.setAttribute("aria-pressed",on?"true":"false")});
    host.querySelectorAll(".pf-sec").forEach(sec=>{
      const show=k==="all"||sec.getAttribute("data-kind")===k;
      sec.hidden=!show;
    });
    order=shown.filter(g=>k==="all"||g.k===k).flatMap(g=>g.films);
    /* Keep the sticky filter usable: bring first visible section into view under it */
    const first=host.querySelector(".pf-sec:not([hidden])");
    if(first){
      const y=first.getBoundingClientRect().top+scrollY-(jb.offsetHeight+72);
      if(Math.abs(scrollY-y)>40)scrollTo({top:Math.max(0,y),behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});
    }
    track("Portfolio Filter",{label:k});
  });
}

/* Fade-in for new blocks */
if(window.matchMedia&&!matchMedia("(prefers-reduced-motion:reduce)").matches&&"IntersectionObserver" in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.08,rootMargin:"0px 0px -4% 0px"});
  document.querySelectorAll(".rv:not(.in)").forEach(n=>io.observe(n));
}else document.querySelectorAll(".rv").forEach(n=>n.classList.add("in"));

/* Player — title shows type only, never couple initials */
const dlg=$("pl");let now=null;
const show=f=>{
  now=f;
  $("ytl").href="https://www.youtube.com/watch?v="+f.v;
  $("pt").innerHTML=esc(f.label)+`<small>${esc(f.type)}${f.meta?" · "+esc(f.meta):""}</small>`;
  $("yt").src="https://www.youtube-nocookie.com/embed/"+f.v+"?autoplay=1&playsinline=1&rel=0";
};
const step=d=>{
  let i=order.indexOf(now);if(i<0)i=d>0?-1:0;
  const f=order[(i+d+order.length)%order.length];
  show(f);track("Film Step",{label:f.label+" - "+f.type});
};
host.addEventListener("click",e=>{
  const b=e.target.closest(".film[data-id]");if(!b)return;
  const f=FILMS.find(x=>x.v===b.dataset.id);if(!f)return;
  track("Film Play",{label:f.label+" - "+f.type});
  show(f);dlg.showModal();
});
$("pp").onclick=()=>step(-1);
$("pn").onclick=()=>step(1);
$("pr").onclick=()=>{
  if(!now)return;
  try{const o=JSON.parse(localStorage.getItem("briefDraft")||"{}")||{};o.br="https://www.youtube.com/watch?v="+now.v;localStorage.setItem("briefDraft",JSON.stringify(o))}catch(e){}
  track("Film Reference",{label:now.label+" - "+now.type});
  location.href="contact.html";
};
dlg.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")step(-1);else if(e.key==="ArrowRight")step(1)});
$("pc").onclick=()=>dlg.close();
dlg.addEventListener("close",()=>$("yt").removeAttribute("src"));
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
})();

/* Sticky filter: add is-stuck class when pinned */
(()=>{const bar=$("pfj");if(!bar||!("IntersectionObserver" in window))return;
const sentinel=document.createElement("div");
sentinel.setAttribute("aria-hidden","true");
sentinel.style.cssText="position:relative;top:-1px;height:1px;width:100%;pointer-events:none;visibility:hidden";
bar.parentNode.insertBefore(sentinel,bar);
const io=new IntersectionObserver(([e])=>{bar.classList.toggle("is-stuck",!e.isIntersecting)},{rootMargin:"-1px 0px 0px 0px",threshold:0});
io.observe(sentinel);
})();


/* Keep sticky filter bar directly under the header, whatever its height */
(()=>{const hd=document.getElementById("site");if(!hd)return;
const set=()=>document.documentElement.style.setProperty("--hh",Math.round(hd.getBoundingClientRect().height)+"px");
set();addEventListener("resize",set,{passive:true});addEventListener("load",set);
if("ResizeObserver" in window)new ResizeObserver(set).observe(hd);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(set);
})();
