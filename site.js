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

(()=>{const p=$("sprog"),d=document.documentElement;let t=0;const u=()=>{t=0;p.style.transform="scaleX("+Math.min(1,scrollY/Math.max(1,d.scrollHeight-innerHeight))+")"};addEventListener("scroll",()=>{t||(t=requestAnimationFrame(u))},{passive:!0});u();})();
(()=>{const r=document.documentElement,b=$("theme"),m=$("tc"),mq=matchMedia("(prefers-color-scheme:dark)");
let saved=null;try{saved=localStorage.getItem("theme")}catch(e){}
const nv=$("nav"),row=document.createElement("button");row.type="button";row.className="theme-row";row.id="themerow";
row.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg><span>Dark mode</span><em class="st"></em>';
if(nv){const last=nv.querySelector("a:last-child"),h=document.createElement("span");h.className="sec";h.setAttribute("aria-hidden","true");h.textContent="Preferences";const box=document.createElement("div");box.className="prefs";box.id="prefs";box.setAttribute("role","group");box.setAttribute("aria-label","Preferences");box.appendChild(row);nv.insertBefore(h,last||null);nv.insertBefore(box,last||null);row.addEventListener("click",()=>b.click())}
const apply=t=>{r.setAttribute("data-theme",t);m.content=t=="dark"?"#2B2421":"#FBF6F3";b.setAttribute("aria-label",t=="dark"?"Switch to light mode":"Switch to dark mode");row.setAttribute("aria-pressed",t=="dark");row.querySelector(".st").textContent=t=="dark"?"On":"Off"};
apply(r.getAttribute("data-theme")=="dark"?"dark":"light");
b.addEventListener("click",()=>{const t=r.getAttribute("data-theme")=="dark"?"light":"dark";const done=()=>{apply(t);saved=t;try{localStorage.setItem("theme",t)}catch(e){}};if(document.startViewTransition&&!reduce){r.classList.add("vt-theme");document.startViewTransition(done).finished.catch(()=>{}).finally(()=>r.classList.remove("vt-theme"))}else{r.classList.add("tt");setTimeout(()=>r.classList.remove("tt"),700);done()}});
mq.addEventListener("change",e=>{if(!saved)apply(e.matches?"dark":"light")})})();
(()=>{const b=$("menu"),n=$("nav");
const set=o=>{n.classList.toggle("open",o);b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Close menu":"Open menu")};
b.addEventListener("click",()=>set(!n.classList.contains("open")));
n.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
document.addEventListener("click",e=>{if(!e.target.closest(".bar"))set(false)});
addEventListener("keydown",e=>{if(e.key==="Escape"&&n.classList.contains("open")){set(false);b.focus()}});
matchMedia("(min-width:901px)").addEventListener("change",e=>{if(e.matches)set(false)})})();
(()=>{const q=[...document.querySelectorAll(".faq details")].map(d=>({"@type":"Question",name:d.querySelector("summary").textContent.trim(),acceptedAnswer:{"@type":"Answer",text:d.querySelector("p").textContent.trim()}}));
if(!q.length)return;const sc=document.createElement("script");sc.type="application/ld+json";sc.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:q});document.head.appendChild(sc)})();

/* Header shadow line */
const hd=$("site"),tp=()=>{if(hd)hd.classList.toggle("scrolled",scrollY>8)};
addEventListener("scroll",tp,{passive:true});tp();
(()=>{window.__rv=1;const els=[...document.querySelectorAll(".rv")];
if(!("IntersectionObserver" in window)||!document.documentElement.classList.contains("anim")){els.forEach(el=>el.classList.add("in"));return}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;el.classList.add("in");io.unobserve(el);setTimeout(()=>el.style.removeProperty("--d"),1600)}),{threshold:.08,rootMargin:"0px 0px -4% 0px"});
els.forEach(el=>io.observe(el))})();


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

/* ===== Pricing page: peek cards ===== */
(()=>{
  const cards=[...document.querySelectorAll(".peek")];
  if(!cards.length)return;
  let open=null;
  const close=c=>{if(!c)return;c.classList.remove("open");c.setAttribute("aria-expanded","false")};
  const openFn=c=>{
    if(open&&open!==c)close(open);
    c.classList.add("open");
    c.setAttribute("aria-expanded","true");
    open=c;
  };
  cards.forEach(c=>{
    const toggle=()=>{
      if(c.classList.contains("open")){close(c);open=null}
      else openFn(c);
    };
    c.addEventListener("click",e=>{
      if(e.target.closest("a"))return;
      toggle();
    });
    c.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){e.preventDefault();toggle()}
    });
  });
})();

/* ===== Contact page: brief form ===== */
(()=>{
const f=$("qb");if(!f)return;
const msg=$("bmsg"),btn=$("bsend"),TO="marcusweddingstudio@gmail.com",SEND=CFG.formEndpoint?"Send my brief":"Email my brief";
btn.textContent=SEND;
document.documentElement.classList.add("pg-c");
/* Remember a half-finished form in this browser until it is sent */
const KEY="briefDraft",ids=["bn","bln","bco","bw","be","bs","bm","bh"];
try{const o=JSON.parse(localStorage.getItem(KEY)||"null");if(o&&typeof o==="object")ids.forEach(i=>{if(typeof o[i]!=="string")return;const el=$(i);if(el.tagName==="SELECT"&&![...el.options].some(x=>x.value===o[i]))return;el.value=o[i]})}catch(e){}
/* Notes from other pages ("Try a test edit", "Use as reference") are added to the message once, then cleared */
try{const o=JSON.parse(localStorage.getItem(KEY)||"null");if(o&&(o.brq||o.br)){const m=$("bm"),add=[];
 if(o.brq)add.push(o.brq+".");if(o.br)add.push("Reference film: "+o.br);
 if(m&&add.length&&!m.value.includes(add[add.length-1]))m.value=(m.value?m.value.trim()+"\n":"")+add.join(" ");
 delete o.brq;delete o.br;localStorage.setItem(KEY,JSON.stringify(o))}}catch(e){}
const save=()=>{try{const o={};ids.forEach(i=>{o[i]=$(i).value});localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};
f.addEventListener("input",save);f.addEventListener("change",save);
let started=false;f.addEventListener("focusin",()=>{if(!started){started=true;track("Brief Start")}});
const subj=()=>($("bs").value||"Editing inquiry")+" from "+name();
const name=()=>($("bn").value.trim()+" "+$("bln").value.trim()).trim();
const site=()=>{const v=$("bw").value.trim();return v&&!/^https?:\/\//i.test(v)?"https://"+v:v};
["bn","bln","be","bt2"].forEach(i=>$(i).addEventListener(i==="bt2"?"change":"input",()=>$(i).removeAttribute("aria-invalid")));
const ok=()=>{["bn","bln","be","bt2"].forEach(i=>$(i).removeAttribute("aria-invalid"));
 const bad=(el,t)=>{msg.textContent=t;el.setAttribute("aria-invalid","true");el.focus();return false};
 if(!$("bn").value.trim())return bad($("bn"),"Please add your first name.");
 if(!$("bln").value.trim())return bad($("bln"),"Please add your last name.");
 const m=$("be");if(!m.value.trim()||!m.checkValidity())return bad(m,"Please add a valid email so we can reply.");
 if(!$("bt2").checked)return bad($("bt2"),"Please agree to the terms and conditions to continue.");
 msg.textContent="";return true};
const build=()=>"Hi Marcus Wedding Studio,\n\nI'd like to book an edit.\n\n"+[["Name",name()],["Email",$("be").value.trim()],["Company",$("bco").value.trim()],["Website",site()],["Subject",$("bs").value],["Message",$("bm").value.trim()],["Heard about us from",$("bh").value]].filter(r=>r[1]).map(r=>r[0]+": "+r[1]).join("\n")+"\n\nThanks!";
const mailto=()=>"mailto:"+TO+"?subject="+encodeURIComponent(subj())+"&body="+encodeURIComponent(build());
const payload=()=>{const o={name:name(),first_name:$("bn").value.trim(),last_name:$("bln").value.trim(),email:$("be").value.trim(),company:$("bco").value.trim(),website:site(),heard_from:$("bh").value,topic:$("bs").value,message:$("bm").value.trim(),_subject:subj()};
 if(CFG.formKey){o.access_key=CFG.formKey;o.subject=o._subject}
 return Object.fromEntries(Object.entries(o).filter(([,v])=>v))};
f.addEventListener("submit",async e=>{e.preventDefault();$("next").hidden=true;if(!ok())return;
 if(f.elements._gotcha&&f.elements._gotcha.value){msg.textContent="Thank you! Your message is in. We’ll reply within a day.";return}
 if(!CFG.formEndpoint){track("Brief Submit",{method:"email"});
  msg.textContent="Opening your email app. If nothing opens, email us at "+TO+".";location.href=mailto();return}
 btn.disabled=true;btn.textContent="Sending…";
 let sent=false;
 try{const r=await fetch(CFG.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(payload())});
  if(!r.ok)throw new Error(r.status);
  sent=true;
  msg.textContent="Thank you! Your message is in.";track("Brief Submit",{method:"form"});f.reset();try{localStorage.removeItem(KEY)}catch(e){}const nx=$("next");nx.hidden=false;nx.scrollIntoView({block:"nearest",behavior:reduce?"auto":"smooth"});nx.focus({preventScroll:true})}
 catch(err){if(sent)return;track("Brief Error");msg.textContent="The form couldn’t send, so we’re opening your email app with your message ready. If nothing opens, email us at "+TO+".";location.href=mailto()}
 finally{btn.disabled=false;btn.textContent=SEND}})})();

/* ===== Project details multi-step form ===== */
(()=>{const f=$("pd");if(!f)return;
const msg=$("pmsg"),nxt=$("pnext"),back=$("pback"),nav=$("pnav"),bar=$("pbar"),lab=$("plab"),done=$("pdone"),TO="marcusweddingstudio@gmail.com",KEY="projectDraft",SEND=CFG.formEndpoint?"Send details":"Email details";
const steps=[...f.querySelectorAll(".step")],titles=["The wedding","Vibe and music","Final details"],reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
let cur=0;document.documentElement.classList.add("pg-c");
const v=id=>$(id).value.trim(),vals=n=>[...f.querySelectorAll('input[name="'+n+'"]:checked')].map(i=>i.value),rad=n=>vals(n)[0]||"";
const url=id=>{const x=v(id);return x&&!/^https?:\/\//i.test(x)?"https://"+x:x};
const show=n=>{cur=n;steps.forEach((s,i)=>s.hidden=i!==n);bar.style.width=(n+1)*100/3+"%";lab.textContent="Step "+(n+1)+" of 3: "+titles[n];back.hidden=n===0;nav.classList.toggle("one",n===0);nxt.textContent=n===2?SEND:"Next";msg.textContent=""};
const top=()=>f.scrollIntoView({block:"start",behavior:reduce?"auto":"smooth"});
const excl=(name,val)=>{const all=[...f.querySelectorAll('input[name="'+name+'"]')];all.forEach(i=>i.addEventListener("change",()=>{if(!i.checked)return;all.forEach(o=>{if(i.value===val?o!==i:o.value===val)o.checked=false})}))};
excl("vibe","A bit of everything");excl("music","You pick a track that matches the day");
const clear=()=>f.querySelectorAll("[aria-invalid]").forEach(e=>e.removeAttribute("aria-invalid"));
f.addEventListener("input",clear);f.addEventListener("change",clear);
const bad=(el,t)=>{msg.textContent=t;el.setAttribute("aria-invalid","true");(el.matches("input,textarea,select")?el:el.querySelector("input")).focus();return false};
const valid=n=>{clear();
 if(n===0){const m=$("pe");if(!m.value.trim()||!m.checkValidity())return bad(m,"Please add the email you used for your brief.");
  if(!v("pc"))return bad($("pc"),"Please add the couple’s names.");
  if(!vals("edit").length)return bad($("g-edit"),"Please choose what we should edit.")}
 if(n===1){if(!vals("vibe").length)return bad($("g-vibe"),"Please choose at least one vibe.");
  if(!vals("music").length)return bad($("g-music"),"Please choose at least one music type.");
  if(!rad("vows"))return bad($("g-vows"),"Please choose an option for the vows.");
  if(!$("pok").checked)return bad($("pok"),"Please confirm you understand the music note.")}
 return true};
const subj=()=>"Project details: "+(v("pc")||"new wedding");
const rows=()=>[["Couple",v("pc")],["Wedding date",v("pwd")],["Studio or name",v("pn")],["Edits wanted",vals("edit").join(", ")],["Target lengths",v("pl")],["Footage link",url("pf")],["Deadline",v("pdl")],["Must-have moments",v("pm")],["Names to spell",v("pnm")],["Vibe",vals("vibe").join(", ")],["Music",vals("music").join(", ")],["Music source",rad("msrc")],["Vows over footage",rad("vows")],["Song inspiration",v("ps")],["Audio notes",v("pa")],["Reference films",v("pr")],["Delivery format",v("px")],["Logo or watermark",v("pg")],["Anything else",v("po")]].filter(r=>r[1]);
const mailto=()=>"mailto:"+TO+"?subject="+encodeURIComponent(subj())+"&body="+encodeURIComponent("Hi Marcus Wedding Studio,\n\nHere are the project details.\n\nEmail: "+v("pe")+"\n"+rows().map(r=>r[0]+": "+r[1]).join("\n")+"\n\nThanks!");
const payload=()=>{const o={email:v("pe"),_subject:subj(),...Object.fromEntries(rows())};if(CFG.formKey){o.access_key=CFG.formKey;o.subject=o._subject}return o};
/* Remember a half-finished form in this browser until it is sent */
const keyOf=e=>e.type==="checkbox"||e.type==="radio"?e.name+"|"+e.value:e.id;
const fields=()=>[...f.querySelectorAll("input,select,textarea")].filter(e=>e.name!=="_gotcha"&&(e.id||e.name));
const save=()=>{try{const o={};fields().forEach(e=>{o[keyOf(e)]=e.type==="checkbox"||e.type==="radio"?e.checked:e.value});localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};
try{const o=JSON.parse(localStorage.getItem(KEY)||"null");if(o&&typeof o==="object")fields().forEach(e=>{const k=keyOf(e);if(!(k in o))return;if(e.type==="checkbox"||e.type==="radio")e.checked=o[k]===true;else if(typeof o[k]==="string"&&(e.tagName!=="SELECT"||[...e.options].some(x=>x.value===o[k]||x.text===o[k])))e.value=o[k]})}catch(e){}
f.addEventListener("input",save);f.addEventListener("change",save);
let started=false;f.addEventListener("focusin",()=>{if(!started){started=true;track("Details Start")}});
back.onclick=()=>{show(cur-1);top()};
const finish=()=>{steps.forEach(s=>s.hidden=true);nav.hidden=true;msg.textContent="";f.querySelector(".pp").hidden=true;done.hidden=false;top();done.focus({preventScroll:true})};
$("pagain").onclick=()=>{f.reset();try{localStorage.removeItem(KEY)}catch(e){}done.hidden=true;nav.hidden=false;f.querySelector(".pp").hidden=false;show(0);top()};
f.addEventListener("submit",async e=>{e.preventDefault();if(!valid(cur))return;
 if(cur<2){show(cur+1);top();return}
 if(f.elements._gotcha&&f.elements._gotcha.value){finish();return}
 if(!CFG.formEndpoint){track("Details Submit",{method:"email"});msg.textContent="Opening your email app. If nothing opens, email us at "+TO+".";location.href=mailto();return}
 nxt.disabled=true;nxt.textContent="Sending…";let sent=false;
 try{const r=await fetch(CFG.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(payload())});
  if(!r.ok)throw new Error(r.status);sent=true;track("Details Submit",{method:"form"});f.reset();try{localStorage.removeItem(KEY)}catch(e){}finish()}
 catch(err){if(sent)return;track("Details Error");msg.textContent="The form couldn’t send, so we’re opening your email app with your details ready. If nothing opens, email us at "+TO+".";location.href=mailto()}
 finally{nxt.disabled=false;nxt.textContent=SEND}});
show(0)})();

/* ===== Navigation polish: active page, scroll restore, focus ===== */
(()=>{
  /* Mark current page in the nav */
  const path=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  document.querySelectorAll("nav a[href]").forEach(a=>{
    const href=(a.getAttribute("href")||"").split("#")[0].split("/").pop().toLowerCase();
    if(!href)return;
    const isHome=(path===""||path==="index.html")&&(href==="index.html"||href===""||href==="#");
    const match=href===path||isHome;
    if(match)a.setAttribute("aria-current","page");
  });

  /* Close mobile menu when orientation changes or resize crosses breakpoint */
  const mq=matchMedia("(min-width:901px)");
  const menu=$("menu"),nav=$("nav");
  if(menu&&nav){
    mq.addEventListener("change",()=>{if(mq.matches){nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}});
  }

})();
