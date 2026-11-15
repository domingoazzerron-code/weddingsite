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
/* Tawk.to live chat with our own launcher button (bottom-right, opens and closes smoothly). */
if(CFG.tawk){window.Tawk_API=window.Tawk_API||{};window.Tawk_LoadStart=new Date();
 (function(){var A=Tawk_API,root=document.documentElement,btn=null,open=false,unread=0,timer=0;
  A.customStyle={visibility:{desktop:{position:"br",xOffset:20,yOffset:88},mobile:{position:"br",xOffset:10,yOffset:10}}};
  var badge=function(){if(!btn)return;var b=btn.querySelector(".tk-n");b.textContent=unread>9?"9+":unread;b.hidden=!unread};
  var set=function(v){open=v;if(!btn)return;btn.setAttribute("aria-expanded",v?"true":"false");btn.setAttribute("aria-label",v?"Close live chat":"Open live chat");btn.classList.toggle("is-open",v);if(v){unread=0;badge()}};
  var show=function(){clearTimeout(timer);root.classList.remove("tk-out");try{A.showWidget();A.maximize()}catch(e){}set(true)};
  var hide=function(){root.classList.add("tk-out");set(false);clearTimeout(timer);timer=setTimeout(function(){try{A.minimize();A.hideWidget()}catch(e){}root.classList.remove("tk-out")},230)};
  var build=function(){if(btn)return;btn=document.createElement("button");btn.type="button";btn.className="tk-fab";btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-label","Open live chat");
   btn.innerHTML='<svg class="tk-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5z"/></svg><svg class="tk-x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="tk-n" hidden></span>';
   btn.addEventListener("click",function(){open?hide():show()});document.body.appendChild(btn);root.classList.add("has-chat")};
  A.onLoad=function(){try{A.hideWidget()}catch(e){}build()};
  A.onChatMaximized=function(){if(!open){clearTimeout(timer);root.classList.remove("tk-out");set(true)}};
  A.onChatMinimized=function(){if(open)hide()};
  A.onChatMessageAgent=function(){if(!open){unread++;badge()}};
  var s=document.createElement("script"),f=document.getElementsByTagName("script")[0];s.async=true;s.src="https://embed.tawk.to/"+CFG.tawk;s.charset="UTF-8";s.setAttribute("crossorigin","*");f.parentNode.insertBefore(s,f)})()}
