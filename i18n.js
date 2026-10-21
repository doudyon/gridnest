/* Native Hebrew/English localization; user selection overrides browser preference. */
(()=>{'use strict';
const translations=[
['.hero h1','הבית שלך יכול<br>לעבוד בשבילך'],
['.hero p','מארחים בבית יחידת מחשוב AI של GridNest, נהנים מהכנסה חודשית ולוקחים חלק בדור הבא של הבינה המלאכותית.'],
['.intro h2','מה זה GridNest?'],
['.intro p','GridNest היא רשת מחשוב מבוזרת לבינה מלאכותית, הפועלת מבתים פרטיים. אנחנו מתקינים ומנהלים בביתכם יחידות מחשוב AI מתקדמות, והופכים שטח פנוי לכוח מחשוב ולהכנסה חודשית.'],
['.intro .outline-button','למידע נוסף <span aria-hidden="true">→</span>'],
['.node-copy h2','נבנה עבור AI.<br>תוכנן לבית.'],
['.node-copy p','יחידת מחשוב AI עוצמתית, המותקנת באופן מקצועי ומנוהלת מרחוק על ידי GridNest — לפעילות אמינה מהבית, מסביב לשעון.'],
['.benefit:nth-child(1) .benefit-text span','הכנסה חודשית'],
['.benefit:nth-child(1) .benefit-text h3','מרוויחים מהשטח<br>הפנוי בבית'],
['.benefit:nth-child(2) .benefit-text span','ניהול מלא'],
['.benefit:nth-child(2) .benefit-text h3','אנחנו דואגים להכול'],
['.benefit:nth-child(3) .benefit-text span','מתאים גם לסולארי'],
['.benefit:nth-child(3) .benefit-text h3','מפיקים יותר<br>מהאנרגיה הסולארית'],
['.app-heading h2','שליטה מלאה<br>מכל מקום'],
['.app-heading p','כל המידע על רשת GridNest שלכם, ישירות בכף היד.'],
['.app-slide:nth-child(1) .app-slide-index','01 / ראשי'],
['.app-slide:nth-child(1) h3','הכול במקום אחד'],
['.app-slide:nth-child(1) p','צופים ביחידות GridNest שלכם, בביצועים בזמן אמת, בצריכת החשמל ובהכנסות — הכול במסך אחד.'],
['.app-slide:nth-child(2) .app-slide-index','02 / הכנסות'],
['.app-slide:nth-child(2) h3','הכנסות בזמן אמת'],
['.app-slide:nth-child(2) p','עוקבים בזמן אמת אחר ההכנסה החודשית, החזרי החשמל והתשלומים הקרובים.'],
['.app-slide:nth-child(3) .app-slide-index','03 / פרטי היחידה'],
['.app-slide:nth-child(3) h3','כל יחידה. כל פרט.'],
['.app-slide:nth-child(3) p','מביצועים ועד צריכת חשמל — מקבלים תמונה ברורה של פעילות יחידת ה־AI שלכם ושל התרומה שלכם, בכל רגע.'],
['.apply h2','מוכנים לתת לבית<br>שלכם לעבוד?'],
['.apply form>label:nth-of-type(1)','שם מלא'],
['.apply form>label:nth-of-type(2)','מספר טלפון'],
['.apply form>label:nth-of-type(3)','כתובת אימייל'],
['.apply form>label:nth-of-type(4)','איפה אתם גרים?'],
['.apply form>label:nth-of-type(5)','מה סוג הנכס?'],
['.apply fieldset:nth-of-type(1) legend','יש לכם אינטרנט בסיבים אופטיים?'],
['.apply fieldset:nth-of-type(2) legend','יש לכם פאנלים סולאריים?'],
['.apply form>label:nth-of-type(6)','מה מהירות האינטרנט שלכם?'],
['.apply form>label:nth-of-type(7)','כמה יחידות GridNest תרצו לארח?'],
['.submit','בדיקת התאמה <span aria-hidden="true">→</span>'],
['.footer-links a:nth-child(1)','על GridNest'],
['.footer-links a:nth-child(2)','יחידת ה־AI'],
['.footer-links a:nth-child(3)','האפליקציה'],
['.footer-links a:nth-child(4)','הצטרפות כמארחים'],
['.footer-bottom','©2026 gridnest.cloud, כל הזכויות שמורות.']
];
const labelSelectors=['.apply form>label:nth-of-type(1)','.apply form>label:nth-of-type(2)','.apply form>label:nth-of-type(3)','.apply form>label:nth-of-type(4)','.apply form>label:nth-of-type(5)','.apply form>label:nth-of-type(6)','.apply form>label:nth-of-type(7)'];
const originals=new Map();for(const [selector] of translations){const el=document.querySelector(selector);if(el&&!originals.has(selector))originals.set(selector,el.innerHTML)}
const labels=['שם מלא','מספר טלפון','כתובת אימייל','איפה אתם גרים?','מה סוג הנכס?','מה מהירות האינטרנט שלכם?','כמה יחידות GridNest תרצו לארח?'];
const optionNames={'Apartment':'דירה','House':'בית פרטי','Other':'אחר','Under 1 Gbps':'פחות מ־1 Gbps'};
const originalOptions=[...document.querySelectorAll('select option')].map(el=>[el,el.textContent]);
const originalPlaceholders=[...document.querySelectorAll('input[placeholder]')].map(el=>[el,el.placeholder]);
const originalRadio=[...document.querySelectorAll('.choice label')].map(el=>[el,[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE)?.textContent||'']);
const originalAria=[...document.querySelectorAll('[aria-label]')].map(el=>[el,el.getAttribute('aria-label')]);
const initial=location.pathname.match(/^\/(he|en)(?:\/|$)/)?.[1];let language=initial || localStorage.getItem('gridnest-language') || ((navigator.languages||[navigator.language||'en']).some(l=>/^he(?:-|$)/i.test(l))?'he':'en');
function apply(lang,updateUrl=false){language=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='he'?'rtl':'ltr';document.title=lang==='he'?'GridNest — הבית שלך יכול לעבוד בשבילך':'GridNest — Put your home to work';document.querySelector('meta[name=description]').content=lang==='he'?'מארחים יחידת מחשוב AI של GridNest בבית ונהנים מהכנסה חודשית.':'Host a GridNest AI Node at home and earn monthly income while powering the next generation of AI.';
for(const [selector,he] of translations){const el=document.querySelector(selector);if(!el)continue;if(labelSelectors.includes(selector)){const input=el.querySelector('input,select');if(input){const text=lang==='he'?labels[labelSelectors.indexOf(selector)]:originals.get(selector).split('<')[0];for(const node of el.childNodes){if(node.nodeType===Node.TEXT_NODE){node.textContent=text;break}}}continue}el.innerHTML=lang==='he'?he:originals.get(selector)}
for(const [el,original] of originalOptions)el.textContent=lang==='he'?(optionNames[original]||original):original;
for(const [el,original] of originalPlaceholders)el.placeholder=lang==='he'?({'David':'שם מלא','Tel Aviv':'תל אביב'}[original]||original):original;
for(const [el,original] of originalRadio){const node=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(node)node.textContent=lang==='he'?(original.trim()==='Yes'?' כן':' לא'):original}
for(const [el,original] of originalAria){if(lang==='he'){const map={'Apply to become a host':'הצטרפות כמארחים','GridNest app screens, swipe horizontally to explore':'מסכי אפליקציית GridNest, החליקו כדי לדפדף','Previous screen':'מסך קודם','Next screen':'מסך הבא','Show dashboard':'הצגת מסך ראשי','Show earnings':'הצגת הכנסות','Show Node details':'הצגת פרטי יחידה','Why host a GridNest Node':'למה לארח יחידת GridNest','App screen position':'מיקום במסכי האפליקציה'};el.setAttribute('aria-label',map[original]||original)}else el.setAttribute('aria-label',original)}
const toggle=document.getElementById('language-toggle');toggle.textContent=lang==='he'?'English':'עברית';toggle.setAttribute('aria-label',lang==='he'?'Switch to English':'מעבר לעברית');
if(updateUrl){localStorage.setItem('gridnest-language',lang);history.pushState({lang},'', '/'+lang+'/'+location.hash)}
}
document.getElementById('language-toggle')?.addEventListener('click',()=>apply(language==='he'?'en':'he',true));
window.addEventListener('popstate',()=>apply(location.pathname.startsWith('/he')?'he':'en'));
apply(language,!initial);
window.gridnestLanguage=()=>language;
})();
