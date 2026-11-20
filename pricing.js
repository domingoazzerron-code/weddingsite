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
