(()=>{const f=$("pd"),msg=$("pmsg"),nxt=$("pnext"),back=$("pback"),nav=$("pnav"),bar=$("pbar"),lab=$("plab"),done=$("pdone"),TO="marcusweddingstudio@gmail.com",KEY="projectDraft",SEND=CFG.formEndpoint?"Send details":"Email details";
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
