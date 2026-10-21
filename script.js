const form=document.getElementById('application-form');const message=document.getElementById('form-message');if(form&&message){form.addEventListener('submit',event=>{event.preventDefault();message.textContent=window.gridnestLanguage?.()==='he'?'הטופס עדיין אינו שולח פניות. שירות ההרשמה המאובטח יחובר בקרוב.':'Applications are not being submitted yet. The secure registration service will be connected soon.';});}
const appSlider=document.getElementById('app-slider');if(appSlider){const slides=[...appSlider.querySelectorAll('.app-slide')];const dots=[...document.querySelectorAll('.app-dot')];let active=0;function goToSlide(i){active=Math.max(0,Math.min(slides.length-1,i));appSlider.scrollTo({left:slides[active].offsetLeft-slides[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});syncDots()}function syncDots(){dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===active);if(i===active)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')})}dots.forEach((dot,i)=>dot.addEventListener('click',()=>goToSlide(i)));document.getElementById('app-prev').addEventListener('click',()=>goToSlide(active-1));document.getElementById('app-next').addEventListener('click',()=>goToSlide(active+1));let raf=0;appSlider.addEventListener('scroll',()=>{if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const left=appSlider.scrollLeft;let closest=0,dist=Infinity;slides.forEach((slide,i)=>{const d=Math.abs(slide.offsetLeft-slides[0].offsetLeft-left);if(d<dist){dist=d;closest=i}});active=closest;syncDots()})},{passive:true});appSlider.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();goToSlide(active+1)}if(e.key==='ArrowLeft'){e.preventDefault();goToSlide(active-1)}})}

/* Keep navigation floating and change to white once the hero is scrolled */
const siteHeader=document.getElementById('site-header');if(siteHeader){let headerFrame=0;function updateHeader(){headerFrame=0;siteHeader.classList.toggle('is-scrolled',window.scrollY>36)}updateHeader();window.addEventListener('scroll',()=>{if(!headerFrame)headerFrame=requestAnimationFrame(updateHeader)},{passive:true});window.addEventListener('pageshow',updateHeader)}


/* Cinematic hero: finish entrance, then transition smoothly into scroll parallax. */
(()=>{const hero=document.querySelector('.hero');if(!hero)return;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');if(reduce.matches)return;let frame=0;const update=()=>{frame=0;const height=hero.offsetHeight||window.innerHeight;const progress=Math.max(0,Math.min(1,window.scrollY/height));hero.style.setProperty('--hero-scroll',progress.toFixed(4));hero.style.setProperty('--hero-opacity',Math.max(0,1-progress*1.55).toFixed(4))};const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});window.addEventListener('pageshow',onScroll);window.setTimeout(()=>{update();hero.classList.add('hero-ready')},3100)})();


/* Scroll-linked intro reveal: title, paragraph, CTA in a measured sequence. */
(()=>{const intro=document.querySelector('.intro');if(!intro||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const items=[{el:intro.querySelector('p'),start:.24,end:.69,name:'body',travel:42,blur:5},{el:intro.querySelector('.outline-button'),start:.51,end:.87,name:'button',travel:30,blur:0}].filter(x=>x.el);const clamp=x=>Math.max(0,Math.min(1,x));let frame=0;function render(){frame=0;const rect=intro.getBoundingClientRect();const viewport=window.innerHeight;const progress=clamp((viewport-rect.top)/(viewport+rect.height*.22));for(const item of items){const raw=clamp((progress-item.start)/(item.end-item.start));const eased=raw*raw*(3-2*raw);intro.style.setProperty('--intro-'+item.name+'-opacity',eased.toFixed(3));intro.style.setProperty('--intro-'+item.name+'-y',((1-eased)*item.travel).toFixed(2)+'px');if(item.blur)intro.style.setProperty('--intro-'+item.name+'-blur',((1-eased)*item.blur).toFixed(2)+'px')}}function schedule(){if(!frame)frame=requestAnimationFrame(render)}render();intro.classList.add('intro-motion');window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});window.addEventListener('pageshow',schedule)})();

/* Reveal the network topology when it enters the viewport. */
(()=>{const map=document.querySelector('.network-map');if(!map)return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){map.classList.add('is-visible');return}const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){map.classList.add('is-visible','is-active')}else{map.classList.remove('is-active')}}},{threshold:.25});observer.observe(map)})();

/* Refined staggered reveals for sections after the intro, without overriding the
   hero sequence, the intro scrub or the animated network topology. */
(()=>{if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const groups=[
['.node-image'],
['.node-copy h2','.node-copy p'],
['.benefits .benefit'],
['.app-heading h2','.app-heading p'],
['.app-slider-wrap'],
['.apply h2','#application-form'],
['.footer-head','.footer-links','.footer-bottom']
];
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}}},{threshold:.12,rootMargin:'0px 0px -35px 0px'});
for(const selectors of groups){let items=[];for(const selector of selectors)items.push(...document.querySelectorAll(selector));items.forEach((el,i)=>{el.style.setProperty('--reveal-delay',Math.min(i*105,525)+'ms');el.classList.add('scroll-reveal');observer.observe(el)})}
})();

/* Accessible pill-style radio choices and fully styled dropdown menus. */
(()=>{
const form=document.getElementById('application-form');if(!form)return;
const dropdowns=[];
function closeAll(except){for(const d of dropdowns){if(d===except)continue;d.wrapper.classList.remove('is-open');d.trigger.setAttribute('aria-expanded','false');d.menu.hidden=true}}
for(const select of form.querySelectorAll('select')){
 const wrapper=document.createElement('div');wrapper.className='custom-select';
 const trigger=document.createElement('button');trigger.type='button';trigger.className='custom-select-trigger';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
 const value=document.createElement('span');value.className='custom-select-value';const arrow=document.createElement('span');arrow.className='custom-select-chevron';arrow.setAttribute('aria-hidden','true');arrow.textContent='⌄';trigger.append(value,arrow);
 const menu=document.createElement('div');menu.className='custom-select-menu';menu.setAttribute('role','listbox');menu.hidden=true;
 const id='gridnest-'+select.name;menu.id=id+'-options';trigger.setAttribute('aria-controls',menu.id);
 select.parentNode.insertBefore(wrapper,select);wrapper.append(select,trigger,menu);
 const d={wrapper,trigger,menu,select};dropdowns.push(d);
 function sync(){value.textContent=select.selectedOptions[0]?.textContent||'';menu.replaceChildren();for(const [index,opt] of [...select.options].entries()){if(opt.disabled)continue;const item=document.createElement('button');item.type='button';item.className='custom-select-option';item.setAttribute('role','option');item.setAttribute('aria-selected',String(select.selectedIndex===index));item.textContent=opt.textContent;item.addEventListener('click',()=>{select.selectedIndex=index;select.dispatchEvent(new Event('change',{bubbles:true}));closeAll();trigger.focus()});menu.append(item)}}
 sync();select.addEventListener('change',sync);
 new MutationObserver(sync).observe(select,{subtree:true,characterData:true,childList:true});
 trigger.addEventListener('click',()=>{const opening=menu.hidden;closeAll();menu.hidden=!opening;wrapper.classList.toggle('is-open',opening);trigger.setAttribute('aria-expanded',String(opening));if(opening)menu.querySelector('[aria-selected="true"]')?.focus()});
 trigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='Enter'||e.key===' '){e.preventDefault();if(menu.hidden)trigger.click();else menu.querySelector('button')?.focus()}});
 menu.addEventListener('keydown',e=>{const items=[...menu.querySelectorAll('button')];let index=items.indexOf(document.activeElement);if(e.key==='Escape'){e.preventDefault();closeAll();trigger.focus()}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();items[(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus()}if(e.key==='Home'){e.preventDefault();items[0]?.focus()}if(e.key==='End'){e.preventDefault();items.at(-1)?.focus()}});
}
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.custom-select'))closeAll()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
})();
