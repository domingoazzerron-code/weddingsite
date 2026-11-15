/* Portfolio page: groups the films from films.js by type and plays them in a pop-up player. */
(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const track=(n,p)=>{try{if(window.plausible)window.plausible(n,p?{props:p}:undefined)}catch(e){}};
const FILMS=(window.SITE_FILMS||[]).map(([v,title,type,meta])=>({v,title,type,meta:meta||""}));
const host=$("pf");if(!host||!FILMS.length)return;

/* Sections shown on the page, in order. A film goes in the first section its type matches. */
const SECS=[
 {k:"highlight",re:/highlight/i,h:"Highlight films",d:"Cinematic films that relive the wedding day from getting ready to the reception, told through the best shots and moments."},
 {k:"teaser",re:/teaser/i,h:"Teasers",d:"Short, dynamic cuts of the best moments of the wedding, made for social media."},
 {k:"other",re:/./,h:"More films",d:"Other edits from recent weddings."}
];
const groups=SECS.map(s=>({...s,films:[]}));
FILMS.forEach(f=>{(groups.find(g=>g.re.test(f.type))||groups[groups.length-1]).films.push(f)});
const shown=groups.filter(g=>g.films.length);
const order=shown.flatMap(g=>g.films);

host.innerHTML=shown.map(g=>`<section class="pf-sec rv" id="sec-${g.k}" aria-labelledby="pf-${g.k}"><div class="pf-t"><h2 id="pf-${g.k}">${g.h}</h2><span class="pf-n">${g.films.length} ${g.films.length==1?"film":"films"}</span></div><p>${g.d}</p><div class="pf-grid">${g.films.map(f=>`<button class="film" type="button" data-id="${esc(f.v)}" aria-label="Watch ${esc(f.title)}, ${esc(f.type)}, on YouTube"><img src="https://img.youtube.com/vi/${esc(f.v)}/hq720.jpg" onerror="this.onerror=null;this.src=this.src.replace('hq720','hqdefault')" alt="" loading="lazy" decoding="async" width="480" height="270"><span class="play"></span><span class="cap">${esc(f.title)}<small>${esc(f.type)}${f.meta?" · "+esc(f.meta):""}</small></span></button>`).join("")}</div></section>`).join("");
/* quick links to each section (only when there is more than one) */
const jb=$("pfj");if(jb&&shown.length>1){jb.innerHTML=shown.map(g=>`<a href="#sec-${g.k}">${g.h}</a>`).join("");jb.hidden=false}
/* make the new blocks fade in like the rest of the page */
if(window.matchMedia&&!matchMedia("(prefers-reduced-motion:reduce)").matches&&"IntersectionObserver" in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});
 host.querySelectorAll(".rv").forEach(n=>io.observe(n))}else host.querySelectorAll(".rv").forEach(n=>n.classList.add("in"));

/* Player */
const dlg=$("pl");let now=null;
const show=f=>{now=f;$("ytl").href="https://www.youtube.com/watch?v="+f.v;
 $("pt").innerHTML=esc(f.title)+`<small>${esc(f.type)}${f.meta?" · "+esc(f.meta):""}</small>`;
 $("yt").src="https://www.youtube-nocookie.com/embed/"+f.v+"?autoplay=1&playsinline=1&rel=0"};
const step=d=>{let i=order.indexOf(now);if(i<0)i=d>0?-1:0;const f=order[(i+d+order.length)%order.length];show(f);track("Film Step",{label:f.title+" - "+f.type})};
host.addEventListener("click",e=>{const b=e.target.closest(".film[data-id]");if(!b)return;const f=FILMS.find(x=>x.v===b.dataset.id);if(!f)return;
 track("Film Play",{label:f.title+" - "+f.type});show(f);dlg.showModal()});
$("pp").onclick=()=>step(-1);$("pn").onclick=()=>step(1);
$("pr").onclick=()=>{if(!now)return;try{const o=JSON.parse(localStorage.getItem("briefDraft")||"{}")||{};o.br="https://www.youtube.com/watch?v="+now.v;localStorage.setItem("briefDraft",JSON.stringify(o))}catch(e){}
 track("Film Reference",{label:now.title+" - "+now.type});location.href="contact.html"};
dlg.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")step(-1);else if(e.key==="ArrowRight")step(1)});
$("pc").onclick=()=>dlg.close();
dlg.addEventListener("close",()=>$("yt").removeAttribute("src"));
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
})();
