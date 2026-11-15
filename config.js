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
/* Tawk.to live chat: Tawk's own chat bubble, bottom-right. The other floating buttons stack above it. */
if(CFG.tawk){window.Tawk_API=window.Tawk_API||{};window.Tawk_LoadStart=new Date();
 (function(){var A=Tawk_API;
  A.customStyle={visibility:{desktop:{position:"br",xOffset:20,yOffset:20},mobile:{position:"br",xOffset:20,yOffset:20}}};
  document.documentElement.classList.add("has-chat");
  var s=document.createElement("script"),f=document.getElementsByTagName("script")[0];s.async=true;s.src="https://embed.tawk.to/"+CFG.tawk;s.charset="UTF-8";s.setAttribute("crossorigin","*");f.parentNode.insertBefore(s,f)})()}
/* Show the WhatsApp button and set the button spacing right away, so nothing jumps when the page loads. */
(function(){var r=document.documentElement;if(!CFG.whatsapp)return;r.classList.add("has-wa");
 var u="https://wa.me/"+CFG.whatsapp.replace(/\D/g,"")+"?text="+encodeURIComponent("Hi Marcus Wedding Studio, I\u2019d like to ask about an edit.");
 var go=function(){[].forEach.call(document.querySelectorAll(".wa"),function(a){a.href=u;a.hidden=false})};
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go()})();
