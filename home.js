const $=id=>document.getElementById(id);
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ===== Analytics (Umami) + click tracking ===== */
if(CFG.umamiId){const sc=document.createElement("script");sc.defer=true;sc.src="https://cloud.umami.is/script.js";sc.setAttribute("data-website-id",CFG.umamiId);document.head.appendChild(sc)}
const track=(n,p)=>{try{if(window.umami)window.umami.track(n,p)}catch(e){}};
document.addEventListener("click",e=>{const a=e.target.closest("[data-ev]");if(a)track(a.dataset.ev,a.dataset.label?{label:a.dataset.label}:undefined)});
/* ===== Contact channels, footer socials, privacy dialog ===== */
(()=>{const ch=[];
 if(CFG.whatsapp){const u="https://wa.me/"+CFG.whatsapp.replace(/\D/g,"")+"?text="+encodeURIComponent("Hi Marcus Wedding Studio, I’d like to ask about an edit.");ch.push(["WhatsApp",u]);document.querySelectorAll(".wa").forEach(a=>{a.href=u;a.hidden=false});document.documentElement.classList.add("has-wa")}
 if(CFG.instagram)ch.push(["Instagram",CFG.instagram]);
 if(CFG.youtube)ch.push(["YouTube",CFG.youtube]);
 if(CFG.facebook)ch.push(["Facebook",CFG.facebook]);
 if(CFG.booking)document.querySelectorAll(".bk").forEach(a=>{a.href=CFG.booking;a.hidden=false});
 const all=CFG.booking?[...ch,["Book a call",CFG.booking]]:ch;
 const a=(c,cls)=>`<a ${cls?`class="${cls}" `:""}href="${esc(c[1])}" target="_blank" rel="noopener" data-ev="Channel Click" data-label="${esc(c[0])}">${esc(c[0])}</a>`;
 if(all.length&&$("chan")){$("chan").innerHTML=`<span class="chan-l">Or reach us on</span>`+all.map(c=>a(c,"btn ghost")).join("");$("chan").hidden=false}
 $("soc").innerHTML=ch.map(c=>a(c)).join("");
 $("pv-an").hidden=!CFG.umamiId;
 const pv=$("pv");document.querySelectorAll(".pvopen").forEach(b=>b.addEventListener("click",()=>pv.showModal()));
 $("pvc").onclick=()=>pv.close();pv.addEventListener("click",e=>{if(e.target===pv)pv.close()})})();

if(CFG.clients.length){$("cl").innerHTML=CFG.clients.map(c=>{const i=c.logo?`<img src="${esc(c.logo)}" alt="${esc(c.name)}" loading="lazy" decoding="async">`:esc(c.name);return `<li>${c.url?`<a href="${esc(c.url)}" target="_blank" rel="noopener">${i}</a>`:i}</li>`}).join("");$("clients").hidden=false}
/* Films: [YouTube ID, title, type, optional details such as "4:12 · Cinematic"] */
const FILMS=(window.SITE_RECENT||window.SITE_FILMS||[]).map(([v,title,type,meta])=>({v,title,type,meta:meta||""}));

/* Brief form -> form backend (falls back to the email app when no endpoint is set) */


/* Free test edit: any [data-test] link notes the request in the form */
document.addEventListener("click",e=>{if(!e.target.closest("[data-test]"))return;try{const o=JSON.parse(localStorage.getItem("briefDraft")||"{}")||{};o.brq="Test edit (30-60 sec)";localStorage.setItem("briefDraft",JSON.stringify(o))}catch(x){}track("Free Test Edit Request")},true);

/* Copy email address */
const mcpEl=$("mcp");if(mcpEl){const mt=mcpEl.textContent;mcpEl.addEventListener("click",async()=>{const b=$("mcp");track("Email Copy");
 try{await navigator.clipboard.writeText("marcusweddingstudio@gmail.com");b.textContent="Copied ✓"}catch(e){b.textContent="Copy failed"}
 setTimeout(()=>{b.textContent=mt},1800)})}

/* Film grid + player */
const SLIDES=8; /* how many recent films the home page slider shows */
$("grid").innerHTML=FILMS.slice(0,SLIDES).map((f,i)=>`<button class="film" data-v="${f.v}" aria-label="Watch ${esc(f.title)}, ${esc(f.type)}, on YouTube"><img src="https://img.youtube.com/vi/${f.v}/hq720.jpg" onerror="this.onerror=null;this.src=this.src.replace('hq720','hqdefault')" alt="" ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async" width="480" height="360"><span class="play"></span><span class="cap">${esc(f.title)}<small>${esc(f.type)}${f.meta?" · "+esc(f.meta):""}</small></span></button>`).join("");
/* Recent work slider: swipe, arrows and dots. Cards are the slides. */
(()=>{const car=$("grid"),cards=[...car.children].filter(c=>c.matches(".film")),dots=$("wdots"),pv=$("wprev"),nx=$("wnext");
if(!cards.length){$("work").hidden=true;return}
dots.innerHTML=cards.map((_,i)=>`<button type="button" aria-label="Film ${i+1}"></button>`).join("");const ds=[...dots.children];
let cur=-1;const set=i=>{if(i===cur)return;cur=i;ds.forEach((d,j)=>d.setAttribute("aria-current",j==i));cards.forEach((c,j)=>c.classList.toggle("is-on",j==i));pv.disabled=i<=0;nx.disabled=i>=cards.length-1};
const go=i=>{i=Math.max(0,Math.min(cards.length-1,i));car.scrollTo({left:i*car.clientWidth,behavior:reduce?"auto":"smooth"})};
let t=0;car.addEventListener("scroll",()=>{if(t)return;t=requestAnimationFrame(()=>{t=0;set(Math.round(car.scrollLeft/(car.clientWidth||1)))})},{passive:true});
pv.onclick=()=>go(cur-1);nx.onclick=()=>go(cur+1);ds.forEach((d,i)=>d.onclick=()=>go(i));
car.addEventListener("keydown",e=>{if(e.target!==car)return;if(e.key==="ArrowLeft")go(cur-1);else if(e.key==="ArrowRight")go(cur+1)});
{let lw=innerWidth;addEventListener("resize",()=>{if(innerWidth===lw)return;lw=innerWidth;car.scrollTo({left:Math.max(cur,0)*car.clientWidth,behavior:"auto"})})}set(0)})();
(()=>{let now=null;
const show=f=>{now=f;$("ytl").href="https://www.youtube.com/watch?v="+f.v;
 $("pt").innerHTML=esc(f.title)+`<small>${esc(f.type)}${f.meta?" · "+esc(f.meta):""}</small>`;
 $("yt").src="https://www.youtube-nocookie.com/embed/"+f.v+"?autoplay=1&playsinline=1&rel=0"};
/* step through what the visitor is currently filtering by; fall back to all films */
const list=()=>{const v=[...$("grid").children].map((c,i)=>c.hidden?null:FILMS[i]).filter(Boolean);return v.includes(now)?v:FILMS};
const step=d=>{const l=list();let i=l.indexOf(now);if(i<0)i=d>0?-1:0;const f=l[(i+d+l.length)%l.length];show(f);track("Film Step",{label:f.title+" - "+f.type})};
document.addEventListener("click",e=>{const b=e.target.closest(".film[data-v]");if(!b)return;const f=FILMS.find(x=>x.v===b.dataset.v)||(()=>{const c=b.querySelector(".cap");return c?{v:b.dataset.v,title:c.firstChild.textContent,type:(c.querySelector("small")||{}).textContent||"",meta:""}:null})();if(!f)return;track("Film Play",{label:f.title+" - "+f.type});show(f);$("pl").showModal();$("pc").focus()});
$("pp").onclick=()=>step(-1);$("pn").onclick=()=>step(1);
$("pr").onclick=()=>{if(!now)return;try{const o=JSON.parse(localStorage.getItem("briefDraft")||"{}")||{};o.br="https://www.youtube.com/watch?v="+now.v;localStorage.setItem("briefDraft",JSON.stringify(o))}catch(e){}
 track("Film Reference",{label:now.title+" - "+now.type});location.href="contact.html"};
$("pl").addEventListener("keydown",e=>{if(e.key==="ArrowLeft")step(-1);else if(e.key==="ArrowRight")step(1)})})();
$("pc").onclick=()=>$("pl").close();
$("pl").addEventListener("close",()=>$("yt").removeAttribute("src"));
$("pl").addEventListener("click",e=>{if(e.target===$("pl"))$("pl").close()});

/* Workflow carousel */
(()=>{const ol=document.querySelector(".steps"),li=[...ol.children],dots=$("sd"),dm={matches:false,addEventListener(){}};let cur=0,down=false,sx=0,sl=0;
const tabfix=()=>dm.matches?ol.removeAttribute("tabindex"):ol.setAttribute("tabindex","0");tabfix();dm.addEventListener("change",tabfix);
dots.innerHTML=li.map((_,i)=>`<button aria-label="Step ${i+1}"></button>`).join("");const ds=[...dots.children];
const set=i=>{cur=i;li.forEach((x,j)=>x.classList.toggle("on",j==i));ds.forEach((d,j)=>d.setAttribute("aria-current",j==i))};
const go=i=>{i=Math.max(0,Math.min(li.length-1,i));ol.scrollTo({left:li[i].offsetLeft+li[i].offsetWidth/2-ol.clientWidth/2,behavior:reduce?"auto":"smooth"})};
ds.forEach((d,i)=>d.onclick=()=>go(i));$("sp").onclick=()=>go(cur-1);$("sn").onclick=()=>go(cur+1);
ol.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();go(cur+1)}else if(e.key==="ArrowLeft"){e.preventDefault();go(cur-1)}});
ol.addEventListener("scroll",()=>{let b=0,m=1e9;const c=ol.scrollLeft+ol.clientWidth/2;li.forEach((x,j)=>{const d=Math.abs(x.offsetLeft+x.offsetWidth/2-c);if(d<m){m=d;b=j}});if(b!=cur)set(b)},{passive:true});
let moved=0;
ol.addEventListener("pointerdown",e=>{if(e.pointerType!="mouse"||dm.matches)return;down=true;moved=0;sx=e.clientX;sl=ol.scrollLeft;ol.classList.add("drag")});
addEventListener("pointermove",e=>{if(down){moved=Math.max(moved,Math.abs(e.clientX-sx));ol.scrollLeft=sl-(e.clientX-sx)}});
ol.addEventListener("click",e=>{if(moved>5){e.preventDefault();e.stopPropagation()}moved=0},true);
const end=()=>{if(!down)return;down=false;ol.classList.remove("drag");go(cur)};
addEventListener("pointerup",end);addEventListener("pointercancel",end);
set(0)})();

/* Film hover preview: cycles YouTube's own frames while the pointer is over a card (mouse devices only) */
(()=>{if(reduce||!matchMedia("(hover:hover) and (pointer:fine)").matches)return;
const start=b=>{if(b._t)return;const img=b.querySelector("img");if(!img)return;
 let ov=b._ov;if(!ov){ov=b._ov=document.createElement("img");ov.className="pv";ov.alt="";ov.decoding="async";img.after(ov)}
 let i=0;const next=()=>{i=i%3+1;const u="https://img.youtube.com/vi/"+b.dataset.v+"/hq"+i+".jpg",t=new Image();t.onload=()=>{if(!b._t)return;ov.src=u;ov.classList.add("on")};t.src=u};
 b._t=setInterval(next,900);next()};
const stop=b=>{clearInterval(b._t);b._t=0;if(b._ov)b._ov.classList.remove("on")};
document.addEventListener("pointerover",e=>{const b=e.target.closest(".film[data-v]");if(b&&!b.contains(e.relatedTarget))start(b)});
document.addEventListener("pointerout",e=>{const b=e.target.closest(".film[data-v]");if(b&&!b.contains(e.relatedTarget))stop(b)})})();
/* Scroll progress */
(()=>{const p=$("sprog"),d=document.documentElement;let t=0;const u=()=>{t=0;p.style.transform="scaleX("+Math.min(1,scrollY/Math.max(1,d.scrollHeight-innerHeight))+")"};addEventListener("scroll",()=>{t||(t=requestAnimationFrame(u))},{passive:!0});u();})();

/* Theme toggle (remembers choice; follows system until one is picked) */
(()=>{const r=document.documentElement,b=$("theme"),m=$("tc"),mq=matchMedia("(prefers-color-scheme:dark)");
let saved=null;try{saved=localStorage.getItem("theme")}catch(e){}
const nv=$("nav"),row=document.createElement("button");row.type="button";row.className="theme-row";row.id="themerow";
row.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg><span>Dark mode</span><em class="st"></em>';
if(nv){const last=nv.querySelector("a:last-child"),h=document.createElement("span");h.className="sec";h.setAttribute("aria-hidden","true");h.textContent="Preferences";const box=document.createElement("div");box.className="prefs";box.id="prefs";box.setAttribute("role","group");box.setAttribute("aria-label","Preferences");box.appendChild(row);nv.insertBefore(h,last||null);nv.insertBefore(box,last||null);row.addEventListener("click",()=>b.click())}
const apply=t=>{r.setAttribute("data-theme",t);m.content=t=="dark"?"#2B2421":"#FBF6F3";b.setAttribute("aria-label",t=="dark"?"Switch to light mode":"Switch to dark mode");row.setAttribute("aria-pressed",t=="dark");row.querySelector(".st").textContent=t=="dark"?"On":"Off"};
apply(r.getAttribute("data-theme")=="dark"?"dark":"light");
b.addEventListener("click",()=>{const t=r.getAttribute("data-theme")=="dark"?"light":"dark";const done=()=>{apply(t);saved=t;try{localStorage.setItem("theme",t)}catch(e){}};if(document.startViewTransition&&!reduce){r.classList.add("vt-theme");document.startViewTransition(done).finished.catch(()=>{}).finally(()=>r.classList.remove("vt-theme"))}else{r.classList.add("tt");setTimeout(()=>r.classList.remove("tt"),700);done()}});
mq.addEventListener("change",e=>{if(!saved)apply(e.matches?"dark":"light")})})();

/* Mobile menu */
(()=>{const b=$("menu"),n=$("nav");
const set=o=>{n.classList.toggle("open",o);b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Close menu":"Open menu")};
b.addEventListener("click",()=>set(!n.classList.contains("open")));
n.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
document.addEventListener("click",e=>{if(!e.target.closest(".bar"))set(false)});
addEventListener("keydown",e=>{if(e.key==="Escape"&&n.classList.contains("open")){set(false);b.focus()}});
matchMedia("(min-width:901px)").addEventListener("change",e=>{if(e.matches)set(false)})})();

/* Sticky "Start a project" bar (phones): hidden over the hero and the contact section */
(()=>{const el=$("scta");if(!el||!("IntersectionObserver" in window))return;
let h=true,c=false;const upd=()=>{el.classList.toggle("show",!h&&!c);document.documentElement.classList.toggle("in-contact",c)};
new IntersectionObserver(e=>{h=e[0].isIntersecting;upd()}).observe($("hero"));
new IntersectionObserver(e=>{c=e[0].isIntersecting;upd()}).observe($("contact"))})();

/* Manila clock */
(()=>{const el=$("mnl");if(!el)return;
const draw=()=>{try{const t=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Manila",weekday:"short",hour:"numeric",minute:"2-digit"}).format(new Date());el.textContent="Manila time now: "+t+" (UTC+8)";el.hidden=false}catch(e){el.hidden=true}};
draw();setInterval(()=>{if(!document.hidden)draw()},30000)})();

/* Highlight the nav link for the section in view */
(()=>{if(!("IntersectionObserver" in window))return;
const links=[...document.querySelectorAll("#nav a[href^='#']")],map=new Map(links.map(a=>[a.getAttribute("href").slice(1),a]));
const alias={words:"work"};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;links.forEach(a=>a.removeAttribute("aria-current"));const a=map.get(alias[e.target.id]||e.target.id);if(a)a.setAttribute("aria-current","true")}),{rootMargin:"-45% 0px -50% 0px"});
io.observe($("hero"));[...map.keys(),...Object.keys(alias),"words"].forEach(id=>{const el=$(id);if(el)io.observe(el)})})();

/* FAQ rich-result markup, built from the visible questions so it never goes out of date */
(()=>{const q=[...document.querySelectorAll(".faq details")].map(d=>({"@type":"Question",name:d.querySelector("summary").textContent.trim(),acceptedAnswer:{"@type":"Answer",text:d.querySelector("p").textContent.trim()}}));
if(!q.length)return;const sc=document.createElement("script");sc.type="application/ld+json";sc.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:q});document.head.appendChild(sc)})();

/* Header shadow line + back to top */
const tb=$("top"),hd=$("site"),tp=()=>{if(tb)tb.classList.toggle("show",scrollY>600);if(hd)hd.classList.toggle("scrolled",scrollY>8)};
addEventListener("scroll",tp,{passive:true});
if(tb)tb.onclick=()=>scrollTo({top:0,behavior:reduce?"auto":"smooth"});tp();

/* Footer logo: scroll to top */
(()=>{const a=document.querySelector(".f-brand .brand");if(!a)return;
a.addEventListener("click",e=>{e.preventDefault();scrollTo({top:0,behavior:reduce?"auto":"smooth"})})})();
/* Film thumbnails fade in once loaded */
(()=>{const imgs=[...document.querySelectorAll(".film img")],done=i=>i.classList.add("ld");
imgs.forEach(i=>{if(i.complete&&i.naturalWidth)done(i);else{i.addEventListener("load",()=>done(i));i.addEventListener("error",()=>setTimeout(()=>{if(i.complete&&i.naturalWidth)done(i)},60))}});
document.documentElement.classList.add("imgfade");setTimeout(()=>imgs.forEach(done),6000)})();

/* Scroll reveal */
(()=>{window.__rv=1;const els=[...document.querySelectorAll(".rv")];
if(!("IntersectionObserver" in window)||!document.documentElement.classList.contains("anim")){els.forEach(el=>el.classList.add("in"));return}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;el.classList.add("in");io.unobserve(el);setTimeout(()=>el.style.removeProperty("--d"),1600)}),{threshold:.08,rootMargin:"0px 0px -4% 0px"});
els.forEach(el=>io.observe(el))})();


/* Price carousel: arrows and dots drive the native scroll-snap row */;
/* ===== Tap sound: a soft click on every tap (synthesised, no audio file) ===== */
(()=>{let ctx=null;
const play=hi=>{try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=ctx||new AC();if(ctx.state==="suspended")ctx.resume();
 const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(),f=hi?880:560;
 o.type="sine";o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.62,t+.07);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.09,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+.1);
 o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.11)}catch(e){}};
/* click fires for taps and key presses, not for scroll gestures */
let on=true;try{on=localStorage.getItem("sound")!=="off"}catch(e){}
/* Sound on/off button, placed beside the dark-mode toggle on every page */
const th=document.getElementById("theme"),nv=document.getElementById("nav");
if(th){const ic='<svg class="on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9a4 4 0 0 1 0 6M18.8 6.7a7.3 7.3 0 0 1 0 10.6"/></svg><svg class="off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M17 9.5l4.5 5M21.5 9.5l-4.5 5"/></svg>';
 const mk=(cls,html)=>{const x=document.createElement("button");x.type="button";x.className=cls;x.innerHTML=html;return x};
 /* Wide screens: round button beside the dark-mode toggle. Phones and tablets: a row inside the menu. */
 const b=mk("theme snd",ic);b.id="snd";
 const r=nv?mk("snd-row",ic+'<span>Tap sounds</span><em class="st"></em>'):null;if(r)r.id="sndrow";
 const set=v=>{on=v;b.setAttribute("aria-pressed",v);b.setAttribute("aria-label",v?"Turn tap sounds off":"Turn tap sounds on");if(r){r.setAttribute("aria-pressed",v);r.querySelector(".st").textContent=v?"On":"Off"}try{localStorage.setItem("sound",v?"on":"off")}catch(e){}};
 set(on);th.parentNode.insertBefore(b,th);
 if(r){const pf=$("prefs");if(pf)pf.appendChild(r);else nv.insertBefore(r,nv.querySelector("a:last-child")||null)}
 [b,r].forEach(x=>x&&x.addEventListener("click",()=>set(!on)))}
document.addEventListener("click",e=>{if(on)play(!!e.target.closest("a,button,summary,select,label,input,[role=button]"))},{passive:true})})();
/* Pause the hero button glow while the hero is off-screen */
(()=>{const s=document.getElementById("hero");if(!s||!("IntersectionObserver" in window))return;
new IntersectionObserver(e=>document.documentElement.classList.toggle("stage-off",!e[0].isIntersecting)).observe(s)})();
