/* Sidebar navigation + quick search. Shown only >= 1024px (see sidebar.css). */
(function(){
"use strict";
var D=document,R=D.documentElement,wide=matchMedia("(min-width:1024px)");
var path=(location.pathname.split("/").pop()||"index.html").toLowerCase();
var home=path==="index.html";
var ic={
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
 panel:'<rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><path d="M9.5 4.5v15"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 films:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
 workflow:'<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
 portfolio:'<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 4.5v5M13 4.5v5"/>',
 tools:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
 pricing:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',
 about:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
 faq:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01"/>',
 guide:'<path d="M5 4.5h10l4 4v11H5z"/><path d="M14.5 4.5v4.5H19M8.5 13h7M8.5 16.5h5"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 palette:'<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 1.9-1 1.4-2.1-.6-1.3.2-2.7 1.7-2.7h2.4a3 3 0 0 0 3-3c0-5.1-3.8-9.200-8.500-9.200z"/><circle cx="7.600" cy="11.500" r="1"/><circle cx="10.500" cy="7.800" r="1"/><circle cx="15.200" cy="8.200" r="1"/>',
 moon:'<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 on:'<path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9a4 4 0 0 1 0 6M18.8 6.7a7.3 7.3 0 0 1 0 10.6"/>',
 off:'<path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M17 9.5l4.5 5M21.5 9.5l-4.5 5"/>'
};
var svg=function(k,cls){return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"'+(cls?' class="'+cls+'"':'')+'>'+ic[k]+'</svg>'};
var sec=function(id){return (home?"":"index.html")+"#"+id};

/* ---- data: sidebar links + search index ---- */
var pages=[
 {k:"portfolio",l:"Portfolio",h:"portfolio.html",f:"portfolio.html",d:"Every teaser and highlight film",w:"projects films teasers highlights reels gallery work"},
 {k:"tools",l:"Tools",h:"tools.html",f:"tools.html",d:"Helpful tools for videographers",w:"tools resources software helpers"},
 {k:"pricing",l:"Pricing",h:"pricing.html",f:"pricing.html",d:"Rates and what is included",w:"price cost rate rates packages quote how much fee"},
 {k:"mail",l:"Contact",h:"contact.html",f:"contact.html",d:"Get in touch or send a brief",w:"contact email whatsapp reach message hire"}
];
var sections=[
 {k:"films",l:"Films",id:"work",d:"Recent teasers and highlight films",w:"recent work showreel watch youtube videos"},
 {k:"workflow",l:"Workflow",id:"workflow",d:"How we work with you, step by step",w:"process steps brief delivery revisions frame.io dropbox timeline"},
 {k:"about",l:"About",id:"about",d:"The studio behind the edits",w:"about studio manila team story who"},
 {k:"faq",l:"FAQ",id:"faq",d:"Answers to common questions",w:"faq questions answers help turnaround revisions"}
];
var extra=[
 {k:"mail",l:"Start your brief",h:"contact.html",type:"Page",d:"Tell us about your project",w:"brief quote start project test edit free order new"},
 {k:"guide",l:"How to outsource wedding video editing",h:"how-to-outsource-wedding-video-editing.html",type:"Guide",d:"A practical guide for videographers",w:"guide outsource outsourcing editor hire article blog"},
 {k:"guide",l:"How to prep wedding footage for an editor",h:"how-to-prep-wedding-footage-for-an-editor.html",type:"Guide",d:"Get your footage ready before you send it",w:"guide prep prepare footage organize files editor article blog"}
];
var items=[].concat(
 pages.map(function(p){return {k:p.k,l:p.l,h:p.h,type:"Page",d:p.d,w:p.w}}),
 sections.map(function(s){return {k:s.k,l:s.l,h:sec(s.id),type:"Section",d:s.d,w:s.w}}),
  extra,
 (window.MWSTheme?window.MWSTheme.list:[]).map(function(t){return {k:"palette",l:"Theme: "+t.name,h:"#",pal:t.id,type:"Theme",d:"Switch the site colors",w:"theme themes color colors colour palette appearance style"}})
);

/* ---- build sidebar ---- */
var wmSrc=D.querySelector("header.site .wm");
var wm="";
if(wmSrc){var c=wmSrc.cloneNode(true);c.removeAttribute("id");[].forEach.call(c.querySelectorAll("[id]"),function(n){n.removeAttribute("id")});wm=c.outerHTML}
var mac=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent||"");
var markPath="M96.5 44.2C71.9 72.1 59.5 90.4 59.5 99.4C59.5 102 61.3 104.1 63.6 104.1C69.5 104.1 78.4 91.3 97.5 68.4C120.4 41.3 140.3 18.2 166.4 6.1C159.4 12.3 151.8 18.1 145.9 24.3C113.2 58.6 93.6 81.2 93.6 97C93.6 101.1 96.3 103.8 100 103.8C108.9 103.8 124.5 90.3 124.5 88.9C124.5 88.6 124.5 88.3 124.2 88.3C123.3 88.3 122.1 89.5 121.8 89.8C112.6 98 103.6 101.6 101.2 101.6C98.3 101.6 96.6 101.3 96.6 98.6C96.6 95.1 104.5 81.9 120.3 62.5C141.4 36.4 157.6 18.2 168.5 8.4C171 6.3 173.2 4.1 173.2 3.2C173.2 2.5 172.6 2 172 2C170 2 165.8 3.8 160.3 6.7C136.1 19.6 113.2 46.7 85.6 80.4C73.1 95.4 67.4 102.3 63.3 102.3C62.7 102.3 63.1 101.3 63.1 100.7C63.1 100.7 68 90.7 79.7 76.2C95 56.9 113.6 31 139.4 5.6C139.9 5.2 141.2 3.8 141.2 3.4C141.2 2.5 140.3 2.8 139.9 2.8C139.9 2.8 128.9 5.8 116.4 15.2C85.6 38.4 67.5 66.9 54.6 80.3C40.2 95.1 27.5 102.7 17 102.7C9.4 102.7 5.6 98.9 5.6 97.4C5.6 97 5.6 96.6 5.8 96.2C6.5 96.3 6.9 96.6 7.6 96.6C10.8 96.6 13.1 95.4 13.1 92.9C13.1 89.5 11.2 87.2 8.7 87.2C4 87.2 2 90 2 94.8C2 98.9 6.7 104.5 17.2 104.5C30.2 104.5 47.4 93.6 65.4 70.9C91.5 38.3 112.9 16 134.7 6.7C112.3 25.5 101.3 38.9 96.5 44.2Z";
var cur=function(p){return p.h===path?' aria-current="page"':''};
var link=function(p,extraCls){return '<a class="sb-i'+(extraCls?" "+extraCls:"")+'" href="'+p.h+'" data-tip="'+p.l+'"'+cur(p)+'><span class="sb-ic">'+svg(p.k)+'</span><span class="sb-tx">'+p.l+'</span></a>'};

var aside=D.createElement("aside");
aside.className="sb";aside.id="sb";aside.setAttribute("aria-label","Sidebar");
aside.innerHTML=
 '<div class="sb-top">'+
  '<a class="sb-brand" href="index.html" aria-label="Marcus Wedding Studio, home"><span class="bt">'+wm+'<small>Wedding Studio</small></span></a>'+
  '<a class="sb-mark" href="index.html" aria-label="Marcus Wedding Studio, home" data-tip="Home"><svg viewBox="0 0 64 64" aria-hidden="true"><path transform="translate(8.35 17.64) scale(0.27)" d="'+markPath+'"/></svg></a>'+
  '<button class="sb-toggle" id="sbToggle" type="button" aria-controls="sb" aria-expanded="true" aria-label="Collapse sidebar" data-tip="Expand sidebar">'+svg("panel")+'</button>'+
  '<button class="sb-close" id="sbClose" type="button" aria-label="Close menu">'+svg("x")+'</button>'+
 '</div>'+
 '<button class="sb-i sb-search" id="sbOpen" type="button" aria-haspopup="dialog" aria-label="Search the site" data-tip="Search"><span class="sb-ic">'+svg("search")+'</span><span class="sb-tx">Search</span><kbd>'+(mac?"\u2318K":"Ctrl K")+'</kbd></button>'+
 '<a class="sb-i sb-cta" href="contact.html" data-tip="Start your brief" data-ev="CTA Click" data-label="Sidebar: Start your brief"><span class="sb-ic">'+svg("mail")+'</span><span class="sb-tx">Start your brief</span></a>'+
 '<div class="sb-nav" role="navigation" aria-label="Primary">'+
  '<div class="sb-lbl" aria-hidden="true"><span>Pages</span></div>'+
  pages.filter(function(p){return p.k!=="mail"}).concat(pages.filter(function(p){return p.k==="mail"})).map(function(p){return link(p)}).join("")+
  '<div class="sb-lbl" aria-hidden="true"><span>Sections</span></div>'+
  sections.map(function(s){return '<a class="sb-i" data-sec="'+s.id+'" href="'+sec(s.id)+'" data-tip="'+s.l+'"><span class="sb-ic">'+svg(s.k)+'</span><span class="sb-tx">'+s.l+'</span></a>'}).join("")+
 '</div>'+
 '<div class="sb-ft">'+
  '<button class="sb-btn sb-theme" id="sbTheme" type="button" aria-label="Switch to dark mode" data-tip="Toggle theme" data-tip-always>'+svg("moon","moon")+svg("sun","sun")+'</button>'+
  (window.MWSTheme?'<button class="sb-btn sb-pal-btn" id="sbPalBtn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="sbPal" aria-label="Color theme" data-tip="Color theme" data-tip-always>'+svg("palette")+'</button>':'')+
  '<button class="sb-btn sb-snd" id="sbSnd" type="button" aria-pressed="true" aria-label="Turn tap sounds off" data-tip="Tap sounds" data-tip-always>'+svg("on","on")+svg("off","off")+'</button>'+
 '</div>'+
 (window.MWSTheme?'<div class="sb-pal" id="sbPal" role="dialog" aria-labelledby="sbPalTitle" hidden><p id="sbPalTitle">Color theme</p><div class="pal-grid" role="radiogroup" aria-labelledby="sbPalTitle">'+
  window.MWSTheme.list.map(function(t){return '<button class="pal-card" type="button" role="radio" data-pal="'+t.id+'" aria-checked="false" tabindex="-1"><span class="pal-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>'+t.name.replace("&","&amp;")+'</span></button>'}).join("")+
 '</div></div>':'');
D.body.insertBefore(aside,D.body.firstChild);

var tip=D.createElement("div");tip.className="sb-tip";tip.setAttribute("aria-hidden","true");D.body.appendChild(tip);

/* ---- collapse / expand ---- */
var tg=D.getElementById("sbToggle");
var isCol=function(){return R.getAttribute("data-sb")==="collapsed"};
var paint=function(){var c=isCol();tg.setAttribute("aria-expanded",!c);tg.setAttribute("aria-label",c?"Expand sidebar":"Collapse sidebar");tg.setAttribute("data-tip",c?"Expand sidebar":"Collapse sidebar")};
paint();
tg.addEventListener("click",function(){
 var c=!isCol();
 if(c)R.setAttribute("data-sb","collapsed");else R.removeAttribute("data-sb");
 try{localStorage.setItem("sb",c?"collapsed":"expanded")}catch(e){}
 paint();hideTip();closePal(false);
});
requestAnimationFrame(function(){requestAnimationFrame(function(){R.classList.add("sb-ready")})});

/* ---- color theme picker (colors: themes.css, switching: themes.js) ---- */
var palBtn=D.getElementById("sbPalBtn"),pal=D.getElementById("sbPal"),
    cards=pal?[].slice.call(pal.querySelectorAll(".pal-card")):[];
var palOpen=function(){return !!pal&&!pal.hidden};
var syncPal=function(){var id=window.MWSTheme.get();cards.forEach(function(c){var on=c.getAttribute("data-pal")===id;c.setAttribute("aria-checked",String(on));c.tabIndex=on?0:-1})};
var closePal=function(back){if(!palOpen())return;pal.hidden=true;palBtn.setAttribute("aria-expanded","false");if(back)palBtn.focus()};
if(pal){
 syncPal();D.addEventListener("palettechange",syncPal);
 palBtn.addEventListener("click",function(e){
  e.stopPropagation();hideTip();
  if(palOpen()){closePal(false);return}
  pal.hidden=false;palBtn.setAttribute("aria-expanded","true");syncPal();
  var on=pal.querySelector('[aria-checked="true"]');if(on)on.focus({preventScroll:true})});
 pal.addEventListener("click",function(e){var c=e.target.closest(".pal-card");if(c)window.MWSTheme.set(c.getAttribute("data-pal"))});
 pal.addEventListener("keydown",function(e){
  var i=cards.indexOf(D.activeElement),step={ArrowRight:1,ArrowLeft:-1,ArrowDown:2,ArrowUp:-2}[e.key];
  if(step&&i>=0){e.preventDefault();var n=cards[(i+step+cards.length)%cards.length];n.focus();window.MWSTheme.set(n.getAttribute("data-pal"));cards.forEach(function(c){c.tabIndex=c===n?0:-1})}
  else if(e.key==="Escape"){e.preventDefault();e.stopPropagation();closePal(true)}
  else if(e.key==="Tab"){e.preventDefault();e.stopPropagation();closePal(true)}
 });
 palBtn.addEventListener("keydown",function(e){if(e.key==="Escape"&&palOpen()){e.preventDefault();e.stopPropagation();closePal(true)}});
 D.addEventListener("click",function(e){if(palOpen()&&!pal.contains(e.target)&&!palBtn.contains(e.target))closePal(false)},true);
 addEventListener("resize",function(){closePal(false)});
 addEventListener("pagehide",function(){closePal(false)});
}

/* ---- tooltips (collapsed state, and always for icon-only buttons) ---- */
function showTip(el){
 if(!wide.matches)return;
 if(el===palBtn&&palOpen())return;
 if(!isCol()&&!el.hasAttribute("data-tip-always")&&el!==tg)return;
 tip.textContent=el.getAttribute("data-tip");
 var r=el.getBoundingClientRect();
 tip.style.left=(r.right+14)+"px";
 tip.style.top=(r.top+r.height/2-tip.offsetHeight/2)+"px";
 tip.classList.add("on");
}
function hideTip(){tip.classList.remove("on")}
aside.addEventListener("mouseover",function(e){var t=e.target.closest("[data-tip]");if(t)showTip(t)});
aside.addEventListener("mouseout",function(e){if(e.target.closest("[data-tip]"))hideTip()});
aside.addEventListener("focusin",function(e){var t=e.target.closest("[data-tip]");if(t&&e.target.matches(":focus-visible"))showTip(t)});
aside.addEventListener("focusout",hideTip);
aside.querySelector(".sb-nav").addEventListener("scroll",hideTip,{passive:true});

/* ---- theme + sound proxies (reuse the existing header buttons / logic) ---- */
var proxy=function(btn,id){btn.addEventListener("click",function(e){e.stopPropagation();var o=D.getElementById(id);if(o)o.click()})};
proxy(D.getElementById("sbTheme"),"theme");
proxy(D.getElementById("sbSnd"),"snd");
var syncTheme=function(){var b=D.getElementById("sbTheme"),d=R.getAttribute("data-theme")==="dark";b.setAttribute("aria-label",d?"Switch to light mode":"Switch to dark mode")};
new MutationObserver(syncTheme).observe(R,{attributes:true,attributeFilter:["data-theme"]});syncTheme();
var syncSnd=function(){var b=D.getElementById("sbSnd"),o=D.getElementById("snd"),v;
 if(o)v=o.getAttribute("aria-pressed")!=="false";else{try{v=localStorage.getItem("sound")!=="off"}catch(e){v=true}}
 b.setAttribute("aria-pressed",v);b.setAttribute("aria-label",v?"Turn tap sounds off":"Turn tap sounds on")};
var watchSnd=function(){var o=D.getElementById("snd");if(o)new MutationObserver(syncSnd).observe(o,{attributes:true,attributeFilter:["aria-pressed"]});syncSnd()};
if(D.readyState==="loading")D.addEventListener("DOMContentLoaded",watchSnd);else watchSnd();

/* ---- active state: pages by URL, home sections by scroll position ---- */
var links=[].slice.call(aside.querySelectorAll(".sb-nav .sb-i"));
var secLinks=links.filter(function(a){return a.hasAttribute("data-sec")});
var setSec=function(id){secLinks.forEach(function(a){if(a.getAttribute("data-sec")===id)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current")})};
if(home){
 var ids=sections.map(function(s){return s.id}),tk=0;
 var spy=function(){tk=0;var line=innerHeight*.4,found=null;
  ids.forEach(function(id){var el=D.getElementById(id);if(!el)return;var r=el.getBoundingClientRect();if(r.top<=line&&r.bottom>line)found=id});
  setSec(found)};
 addEventListener("scroll",function(){if(!tk)tk=requestAnimationFrame(spy)},{passive:true});
 addEventListener("resize",spy);addEventListener("load",spy);spy();
}

/* ---- mobile / tablet drawer (opened by the header hamburger) ---- */
var mobile=matchMedia("(max-width:1023.98px)"),menuBtn=D.getElementById("menu"),dOpen=false;
var scrim=D.createElement("div");scrim.className="sb-scrim";scrim.setAttribute("aria-hidden","true");D.body.appendChild(scrim);
var syncMenu=function(){if(!menuBtn)return;menuBtn.setAttribute("aria-expanded",String(dOpen));menuBtn.setAttribute("aria-label",dOpen?"Close menu":"Open menu")};
var openDrawer=function(){
 if(dOpen||!mobile.matches)return;dOpen=true;hideTip();
 aside.classList.add("drawer-open");scrim.classList.add("on");R.classList.add("sb-lock");
 aside.setAttribute("role","dialog");aside.setAttribute("aria-modal","true");syncMenu();
 setTimeout(function(){var c=D.getElementById("sbClose");if(c&&dOpen)c.focus()},60)};
var closeDrawer=function(back){
 if(!dOpen)return;dOpen=false;closePal(false);
 aside.classList.remove("drawer-open");scrim.classList.remove("on");R.classList.remove("sb-lock");
 aside.removeAttribute("role");aside.removeAttribute("aria-modal");syncMenu();
 if(back&&menuBtn)menuBtn.focus()};
if(menuBtn){
 menuBtn.setAttribute("aria-controls","sb");menuBtn.setAttribute("aria-haspopup","dialog");
 menuBtn.addEventListener("click",function(){if(!mobile.matches)return;if(dOpen)closeDrawer(true);else openDrawer();setTimeout(syncMenu,0)});
 /* the old dropdown script also edits these attributes; keep them in step with the drawer */
 new MutationObserver(function(){if(menuBtn.getAttribute("aria-expanded")!==String(dOpen)||menuBtn.getAttribute("aria-label")!==(dOpen?"Close menu":"Open menu"))syncMenu()}).observe(menuBtn,{attributes:true,attributeFilter:["aria-expanded","aria-label"]});
}
D.getElementById("sbClose").addEventListener("click",function(){closeDrawer(true)});
scrim.addEventListener("click",function(){closeDrawer(true)});
aside.addEventListener("click",function(e){if(e.target.closest("a"))closeDrawer(false)});
mobile.addEventListener("change",function(e){if(!e.matches)closeDrawer(false)});
addEventListener("pageshow",function(){closeDrawer(false)});
addEventListener("keydown",function(e){
 if(!dOpen||(typeof dlg!=="undefined"&&dlg.open))return;
 if(e.key==="Escape"){e.preventDefault();closeDrawer(true)}
 else if(e.key==="Tab"){
  var f=[].filter.call(aside.querySelectorAll("a[href],button:not([disabled])"),function(n){return n.offsetParent!==null});
  if(!f.length)return;var a=f[0],z=f[f.length-1];
  if(e.shiftKey&&D.activeElement===a){e.preventDefault();z.focus()}
  else if(!e.shiftKey&&D.activeElement===z){e.preventDefault();a.focus()}
  else if(!aside.contains(D.activeElement)){e.preventDefault();a.focus()}
 }});
var tx=0,ty=0;
aside.addEventListener("touchstart",function(e){var t=e.touches[0];tx=t.clientX;ty=t.clientY},{passive:true});
aside.addEventListener("touchend",function(e){if(!dOpen)return;var t=e.changedTouches[0];if(t.clientX-tx<-70&&Math.abs(t.clientY-ty)<60)closeDrawer(true)},{passive:true});

/* ---- quick search ---- */
var dlg=D.createElement("dialog");dlg.className="sb-sr";dlg.setAttribute("aria-label","Search the site");
dlg.innerHTML=
 '<div class="sb-sr-in">'+svg("search")+'<input id="sbQ" type="text" placeholder="Search pages, sections and guides\u2026" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="sbList" aria-autocomplete="list" aria-label="Search the site"><kbd>Esc</kbd></div>'+
 '<ul class="sb-sr-list" id="sbList" role="listbox" aria-label="Results"></ul>'+
 '<p class="sb-sr-empty" id="sbEmpty" hidden>No match. Try \u201cpricing\u201d, \u201cfaq\u201d or \u201cworkflow\u201d.</p>';
D.body.appendChild(dlg);
var q=D.getElementById("sbQ"),list=D.getElementById("sbList"),empty=D.getElementById("sbEmpty"),shown=[],sel=0;

var score=function(it,toks){
 var lab=it.l.toLowerCase(),hay=(it.l+" "+it.d+" "+it.w+" "+it.type).toLowerCase(),s=0;
 for(var i=0;i<toks.length;i++){var t=toks[i];if(hay.indexOf(t)<0)return -1;s+=lab.indexOf(t)===0?5:lab.indexOf(t)>0?3:1}
 return s};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var render=function(){
 var toks=q.value.toLowerCase().split(/\s+/).filter(Boolean);
 shown=toks.length?items.map(function(it){return {it:it,s:score(it,toks)}}).filter(function(x){return x.s>=0}).sort(function(a,b){return b.s-a.s}).map(function(x){return x.it}):items.slice();
 sel=0;
 list.innerHTML=shown.map(function(it,i){return '<li role="option" id="sbo'+i+'" aria-selected="'+(i===0)+'"><a href="'+it.h+'" tabindex="-1"'+(it.pal?' data-pal="'+it.pal+'"':'')+'><span class="ic">'+svg(it.k)+'</span><span class="t"><b>'+esc(it.l)+'</b><span>'+esc(it.d)+'</span></span><span class="k">'+it.type+'</span></a></li>'}).join("");
 empty.hidden=shown.length>0;list.hidden=!shown.length;
 q.setAttribute("aria-activedescendant",shown.length?"sbo0":"");
};
var pick=function(i){
 if(!shown.length)return;sel=(i+shown.length)%shown.length;
 [].forEach.call(list.children,function(li,n){li.setAttribute("aria-selected",n===sel)});
 var li=list.children[sel];q.setAttribute("aria-activedescendant",li.id);li.scrollIntoView({block:"nearest"})};
var openS=function(){if(dlg.open)return;closePal(false);closeDrawer(false);q.value="";render();dlg.showModal();q.focus();hideTip()};
var closeS=function(){if(dlg.open)dlg.close()};
D.getElementById("sbOpen").addEventListener("click",openS);
q.addEventListener("input",render);
q.addEventListener("keydown",function(e){
 if(e.key==="ArrowDown"){e.preventDefault();pick(sel+1)}
 else if(e.key==="ArrowUp"){e.preventDefault();pick(sel-1)}
 else if(e.key==="Enter"){e.preventDefault();var a=list.children[sel]&&list.children[sel].querySelector("a");if(a)a.click()}
});
list.addEventListener("mousemove",function(e){var li=e.target.closest("li");if(li){var n=[].indexOf.call(list.children,li);if(n>=0&&n!==sel)pick(n)}});
list.addEventListener("click",function(e){var a=e.target.closest("a");if(!a)return;var id=a.getAttribute("data-pal");if(id){e.preventDefault();closeS();window.MWSTheme.set(id)}else closeS()});
dlg.addEventListener("click",function(e){if(e.target===dlg)closeS()});
addEventListener("keydown",function(e){
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();dlg.open?closeS():openS()}
});
})();
