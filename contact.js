(()=>{const f=$("qb"),msg=$("bmsg"),btn=$("bsend"),TO="marcusweddingstudio@gmail.com",SEND=CFG.formEndpoint?"Send my brief":"Email my brief";
btn.textContent=SEND;
document.documentElement.classList.add("pg-c");
/* Terms dialog */
{const tm=$("tm");document.querySelectorAll(".tmopen").forEach(b=>b.addEventListener("click",()=>tm.showModal()));$("tmc").onclick=()=>tm.close();tm.addEventListener("click",e=>{if(e.target===tm)tm.close()})}
/* Remember a half-finished form in this browser until it is sent */
const KEY="briefDraft",ids=["bn","bln","bco","bw","be","brq","bf","bd","br","bm","bh"];
try{const o=JSON.parse(localStorage.getItem(KEY)||"null");if(o&&typeof o==="object")ids.forEach(i=>{if(typeof o[i]!=="string")return;const el=$(i);if(el.tagName==="SELECT"&&![...el.options].some(x=>x.value===o[i]))return;el.value=o[i]})}catch(e){}
const save=()=>{try{const o={};ids.forEach(i=>{o[i]=$(i).value});localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};
f.addEventListener("input",save);f.addEventListener("change",save);
let started=false;f.addEventListener("focusin",()=>{if(!started){started=true;track("Brief Start")}});
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
const build=()=>"Hi Marcus Wedding Studio,\n\nI'd like to book an edit.\n\n"+[["Name",name()],["Email",$("be").value.trim()],["Company",$("bco").value.trim()],["Website",site()],["Request",$("brq").value],["Footage link",$("bf").value.trim()],["Deadline",$("bd").value],["Reference film",$("br").value.trim()],["Message",$("bm").value.trim()],["Heard about us from",$("bh").value]].filter(r=>r[1]).map(r=>r[0]+": "+r[1]).join("\n")+"\n\nThanks!";
const mailto=()=>"mailto:"+TO+"?subject="+encodeURIComponent("Editing inquiry from "+name())+"&body="+encodeURIComponent(build());
const payload=()=>{const o={name:name(),first_name:$("bn").value.trim(),last_name:$("bln").value.trim(),email:$("be").value.trim(),company:$("bco").value.trim(),website:site(),heard_from:$("bh").value,request:$("brq").value,footage_link:$("bf").value.trim(),deadline:$("bd").value,reference_link:$("br").value.trim(),message:$("bm").value.trim(),_subject:"Editing inquiry from "+name()};
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
  msg.textContent="Thank you! Your message is in.";track("Brief Submit",{method:"form"});$("nxm").href="mailto:"+TO+"?subject="+encodeURIComponent("Footage link from "+name())+"&body="+encodeURIComponent("Hi Marcus Wedding Studio,\n\nHere is the footage link and any references for my project:\n\n");f.reset();try{localStorage.removeItem(KEY)}catch(e){}const nx=$("next");nx.hidden=false;nx.scrollIntoView({block:"nearest",behavior:reduce?"auto":"smooth"});nx.focus({preventScroll:true})}
 catch(err){if(sent)return;track("Brief Error");msg.textContent="The form couldn’t send, so we’re opening your email app with your message ready. If nothing opens, email us at "+TO+".";location.href=mailto()}
 finally{btn.disabled=false;btn.textContent=SEND}})})();
