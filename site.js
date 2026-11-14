const $=id=>document.getElementById(id);
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ===== Analytics (Plausible) + click tracking ===== */
if(CFG.plausibleDomain){window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};
 const sc=document.createElement("script");sc.defer=true;sc.dataset.domain=CFG.plausibleDomain;sc.src="https://plausible.io/js/script.js";document.head.appendChild(sc)}
const track=(n,p)=>{try{if(window.plausible)window.plausible(n,p?{props:p}:undefined)}catch(e){}};
document.addEventListener("click",e=>{const a=e.target.closest("[data-ev]");if(a)track(a.dataset.ev,a.dataset.label?{label:a.dataset.label}:undefined)});

/* ===== Contact channels, footer socials, privacy dialog ===== */
(()=>{const ch=[];
 if(CFG.whatsapp){const u="https://wa.me/"+CFG.whatsapp.replace(/\D/g,"")+"?text="+encodeURIComponent("Hi Marcus Wedding Studio, I’d like to ask about an edit.");ch.push(["WhatsApp",u]);document.querySelectorAll(".wa").forEach(a=>{a.href=u;a.hidden=false});document.documentElement.classList.add("has-wa")}
 if(CFG.instagram)ch.push(["Instagram",CFG.instagram]);
 if(CFG.facebook)ch.push(["Facebook",CFG.facebook]);
 if(CFG.booking)document.querySelectorAll(".bk").forEach(a=>{a.href=CFG.booking;a.hidden=false});
 const all=CFG.booking?[...ch,["Book a call",CFG.booking]]:ch;
 const a=(c,cls)=>`<a ${cls?`class="${cls}" `:""}href="${esc(c[1])}" target="_blank" rel="noopener" data-ev="Channel Click" data-label="${esc(c[0])}">${esc(c[0])}</a>`;
 if(all.length&&$("chan")){$("chan").innerHTML=`<span class="chan-l">Or reach us on</span>`+all.map(c=>a(c,"btn ghost")).join("");$("chan").hidden=false}
 $("soc").innerHTML=ch.map(c=>a(c)).join("");
 $("pv-an").hidden=!CFG.plausibleDomain;
 const pv=$("pv");document.querySelectorAll(".pvopen").forEach(b=>b.addEventListener("click",()=>pv.showModal()));
 $("pvc").onclick=()=>pv.close();pv.addEventListener("click",e=>{if(e.target===pv)pv.close()})})();

(()=>{const p=$("sprog"),d=document.documentElement;let t=0;const u=()=>{t=0;p.style.transform="scaleX("+Math.min(1,scrollY/Math.max(1,d.scrollHeight-innerHeight))+")"};addEventListener("scroll",()=>{t||(t=requestAnimationFrame(u))},{passive:!0});u();})();
(()=>{const r=document.documentElement,b=$("theme"),m=$("tc"),mq=matchMedia("(prefers-color-scheme:dark)");
let saved=null;try{saved=localStorage.getItem("theme")}catch(e){}
const apply=t=>{r.setAttribute("data-theme",t);m.content=t=="dark"?"#16141F":"#F7F3F0";b.setAttribute("aria-label",t=="dark"?"Switch to light mode":"Switch to dark mode")};
apply(r.getAttribute("data-theme")=="dark"?"dark":"light");
b.addEventListener("click",()=>{const t=r.getAttribute("data-theme")=="dark"?"light":"dark";const done=()=>{apply(t);saved=t;try{localStorage.setItem("theme",t)}catch(e){}};if(document.startViewTransition&&!reduce)document.startViewTransition(done);else{r.classList.add("tt");setTimeout(()=>r.classList.remove("tt"),700);done()}});
mq.addEventListener("change",e=>{if(!saved)apply(e.matches?"dark":"light")})})();
(()=>{const b=$("menu"),n=$("nav");
const set=o=>{n.classList.toggle("open",o);b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Close menu":"Open menu")};
b.addEventListener("click",()=>set(!n.classList.contains("open")));
n.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
document.addEventListener("click",e=>{if(!e.target.closest(".bar"))set(false)});
addEventListener("keydown",e=>{if(e.key==="Escape"&&n.classList.contains("open")){set(false);b.focus()}});
matchMedia("(min-width:901px)").addEventListener("change",e=>{if(e.matches)set(false)})})();
(()=>{const q=[...document.querySelectorAll(".faq-list details")].map(d=>({"@type":"Question",name:d.querySelector("summary").textContent.trim(),acceptedAnswer:{"@type":"Answer",text:d.querySelector("p").textContent.trim()}}));
if(!q.length)return;const sc=document.createElement("script");sc.type="application/ld+json";sc.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:q});document.head.appendChild(sc)})();

/* Header shadow line + back to top */
const tb=$("top"),hd=$("site"),tp=()=>{tb.classList.toggle("show",scrollY>600);hd.classList.toggle("scrolled",scrollY>8)};
addEventListener("scroll",tp,{passive:true});
tb.onclick=()=>scrollTo({top:0,behavior:reduce?"auto":"smooth"});tp();
(()=>{window.__rv=1;const els=[...document.querySelectorAll(".rv")];
if(!("IntersectionObserver" in window)||!document.documentElement.classList.contains("anim")){els.forEach(el=>el.classList.add("in"));return}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;el.classList.add("in");io.unobserve(el);setTimeout(()=>el.style.removeProperty("--d"),1600)}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
els.forEach(el=>io.observe(el))})();

