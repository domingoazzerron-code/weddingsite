/* ===== Site settings: fill these in (leave "" to keep a feature off) ===== */
const CFG={
 formEndpoint:"https://formspree.io/f/meaawkaq",    // Form backend URL, e.g. "https://formspree.io/f/xxxxxxxx". Empty = falls back to opening the visitor's email app.
 formKey:"",         // Only for providers that need an access key (e.g. Web3Forms). Otherwise leave empty.
 plausibleDomain:"", // Your site's domain for Plausible analytics, e.g. "yourdomain.com". Empty = no analytics.
 whatsapp:"639703895918",        // Number with country code, digits only, e.g. "639171234567"
 instagram:"https://instagram.com/marcusweddingstudio",       // Full profile URL, e.g. "https://instagram.com/yourhandle"
 facebook:"",        // Full page URL
 clients:[],         // Studios you edit for, only with their permission: [{name:"Studio name",logo:"media/studio.svg",url:"https://…"}]. Empty = strip stays hidden.
 tawk:"6af9659e75c1dd3c38fc4b13/1k7f39tlj", // Tawk.to live chat: "propertyId/widgetId" from your Tawk.to widget code. Empty = no chat box.
 editKey:"editfilm", // Private code that unlocks the film editor: open the site once with ?edit=THIS_CODE. Without it, ?edit does nothing.
 booking:""          // Calendly / booking link, e.g. "https://calendly.com/yourname/intro". Shows "Book a call" buttons.
};
/* Tawk.to live chat. Tawk's own bubble can't be sized or aligned exactly, so it is hidden and replaced by our own
   button (.tk-fab, same size and right edge as the other floating buttons) that opens Tawk's chat window. */
if(CFG.tawk){window.Tawk_API=window.Tawk_API||{};window.Tawk_LoadStart=new Date();
 (function(){var A=Tawk_API,b,ready=false,want=false,root=document.documentElement;
  A.customStyle={visibility:{desktop:{position:"br",xOffset:20,yOffset:84},mobile:{position:"br",xOffset:0,yOffset:0}}};
  root.classList.add("has-chat");
  /* Hide Tawk's own bubble from the first frame so it never flashes before ours takes over. The chat window itself is not affected. */
  var st=document.createElement("style");st.textContent="#tawk-bubble-container,#tawkchat-minified-wrapper{display:none!important}";document.head.appendChild(st);
  A.onBeforeLoad=function(){try{A.hideWidget()}catch(e){}};
  var open=function(){try{A.showWidget();A.maximize()}catch(e){}};
  var mk=function(){b=document.createElement("button");b.type="button";b.className="tk-fab no-pop";b.setAttribute("aria-label","Live chat");
   b.innerHTML='<svg class="tk-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v10H12l-4.5 4v-4H4z"/><path d="M8.5 10.5h7"/></svg><svg class="tk-x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="tk-n" hidden></span>';
   b.onclick=function(){if(!ready){want=true;return}var m=false;try{m=A.isChatMaximized()}catch(e){}if(m){A.minimize()}else{open()}};
   document.body.appendChild(b)};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mk);else mk();
  A.onLoad=function(){ready=true;A.hideWidget();if(want)open()};
  A.onChatMaximized=function(){if(b)b.classList.add("is-open")};
  A.onChatMinimized=function(){if(b)b.classList.remove("is-open");A.hideWidget()};
  A.onUnreadCountChanged=function(n){var c=b&&b.querySelector(".tk-n");if(!c)return;c.textContent=n>9?"9+":n;c.hidden=!n};
  var s=document.createElement("script"),f=document.getElementsByTagName("script")[0];s.async=true;s.src="https://embed.tawk.to/"+CFG.tawk;s.charset="UTF-8";s.setAttribute("crossorigin","*");f.parentNode.insertBefore(s,f)})()}
/* Buttons fade in once per visit, not on every page. */
(function(){var r=document.documentElement;try{if(sessionStorage.getItem("fabSeen")==="1")r.classList.add("fab-seen");else sessionStorage.setItem("fabSeen","1")}catch(e){}})();
/* Show the WhatsApp button and set the button spacing right away, so nothing jumps when the page loads. */
(function(){var r=document.documentElement;if(!CFG.whatsapp)return;r.classList.add("has-wa");
 var u="https://wa.me/"+CFG.whatsapp.replace(/\D/g,"")+"?text="+encodeURIComponent("Hi Marcus Wedding Studio, I\u2019d like to ask about an edit.");
 var go=function(){[].forEach.call(document.querySelectorAll(".wa"),function(a){a.href=u;a.hidden=false})};
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go()})();
