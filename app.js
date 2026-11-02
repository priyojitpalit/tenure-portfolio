/* Spring Hill College tenure portfolio — original documents remain in Drive. */
const SECTIONS=[
 {file:"00-guidance.json",name:"Applicant Guidance",short:"Applicant guidance",lead:"Review instructions",desc:"The institutional guidance supplied with the tenure dossier."},
 {file:"01-candidate.json",name:"Application & Candidate Information",short:"Application & CV",lead:"Begin here",desc:"The letter of application, curriculum vitae, signed fact sheet, and submitted intent to apply."},
 {file:"02-reviews.json",name:"Division Review Materials",short:"Division reviews",lead:"Independent evaluation",desc:"Pre-tenure and divisional review materials in their original folder hierarchy."},
 {file:"03-annual.json",name:"Annual Review Materials",short:"Annual reviews",lead:"A record over time",desc:"Annual goals, Faculty Activities Reports, and evaluations by the division chair."},
 {file:"04-teaching.json",name:"Teaching & Instruction",short:"Teaching",lead:"The center of my work",desc:"Teaching philosophy, all syllabi, observations, student feedback, class notes, teaching exhibits, and archived source reports."},
 {file:"05-service.json",name:"Service",short:"Service",lead:"Building beyond the classroom",desc:"Program development, college governance, student mentoring, recruitment, and the primary supporting documents."},
 {file:"06-scholarship.json",name:"Scholarship & Professional Activity",short:"Scholarship",lead:"Inquiry and learning",desc:"Research manuscripts, scholarly evidence, the scholarship philosophy, and professional activity."},
 {file:"07-other.json",name:"Other Supporting Materials",short:"Letters & materials",lead:"Additional perspectives",desc:"Letters of support and other accompanying records."}
];
const EXPECTED=[1,4,2,10,93,32,37,9];

/* Short reading introductions and source-based starting points.
   Every highlighted document is resolved against the actual Drive inventory. */
const SECTION_GUIDES=[
 {intro:"The College's applicant guidance is included here for reference. The remaining sections contain the application and supporting materials.", picks:[
  ["Applicant guidance","Best Practices for Applicants","Institutional instructions and review guidance."]]},
 {intro:"Begin with the application letter for an overview of the case, then consult the curriculum vitae and signed fact sheet for background and required information.", picks:[
  ["Application letter","TENURE-2026-Application-Letter-with-Evidence","The application and its evidence appendix."],
  ["Curriculum vitae","Curriculum Vitae — Priyojit Palit","Education, teaching, service, and professional record."],
  ["Signed fact sheet","Signed Tenure Fact Sheet","Required candidate information."]]},
 {intro:"This section contains the pre-tenure evaluations from the division review committee and division chair.", picks:[
  ["Committee review","REVIEW-PRETENURE-2024-Division-Committee","Pre-tenure committee evaluation."],
  ["Chair review","REVIEW-PRETENURE-2024-Division-Chair","Pre-tenure chair evaluation."]]},
 {intro:"Annual goals, Faculty Activities Reports, and division-chair evaluations provide a year-by-year account of the appointment.", picks:[
  ["Recent activities report","FAR-2025-2026","Faculty Activities Report, 2025–2026."],
  ["Recent annual evaluation","REVIEW-ANNUAL-2025-2026","Division-chair review, 2025–2026."],
  ["Earlier goals","Annual Statement of Goal 2022","Goals documented near the start of the appointment."]]},
 {intro:"The teaching philosophy provides the starting point. The materials below then document courses and syllabi, classroom observations, instructional resources, and student feedback.", picks:[
  ["Teaching philosophy","Teaching Philosophy — Tenure 2026","Approach to teaching and learning."],
  ["Course notes and materials","TEACH — Direct Links to Five Faculty-Developed","A guide to full course-note collections."],
  ["Classroom observations","00 - Classroom Observations and Annual Review Guide","An entry point to observation records."]]},
 {intro:"The service philosophy and activity summaries introduce contributions to students, the division, and the College. Supporting correspondence and original documents follow.", picks:[
  ["Service philosophy","Service Philosophy — Tenure 2026","Statement of service commitments."],
  ["Service evidence map","00 — Service Activities — Guide","Guide to activities and supporting records."],
  ["Student outcomes","SERVICE-2026-Computer-Science-Internships-Placements","Internship and placement documentation."]]},
 {intro:"Research and professional activity are presented together, with a philosophy statement, scholarly records, grant-related materials, and documentation of professional development.", picks:[
  ["Scholarship philosophy","Scholarship and Professional Activity Philosophy","Overview of scholarly and professional work."],
  ["Peer-reviewed publication","SCHOLAR-2024-AAIM-Peer-Reviewed-Publication","Documentation of a peer-reviewed publication."],
  ["Professional activity","PROF-2022-2026-Professional-Development-Evidence-Map","A guide to professional-development records."]]},
 {intro:"Additional letters and materials offer perspectives from colleagues, professionals, graduates, and students.", picks:[
  ["Faculty support letter","LOR-2026-Matthew-Barnes-Unsolicited","Letter of support from Matthew Barnes."],
  ["Professional support letter","LOR-Support-Smita-Ghosh","Letter from a professional in the field."],
  ["Graduate letter","LOR-Support-Dru","Letter from a recent graduate."]]}
];
function featuredFile(i,term){
 return (state.parts[i]?.files||[]).find(f=>f.title.toLowerCase().includes(term.toLowerCase()));
}
function featuredHtml(i){
 const cards=SECTION_GUIDES[i].picks.map(([name,term,detail])=>{
  const file=featuredFile(i,term);if(!file)return "";
  return '<button class="featured-document" type="button" data-open="'+esc(file.id)+'"><span class="featured-icon" aria-hidden="true">▤</span><span class="featured-copy"><strong>'+esc(name)+'</strong><small>'+esc(detail)+'</small></span><span class="featured-arrow" aria-hidden="true">↗</span></button>';
 }).filter(Boolean).join("");
 return cards?'<div class="featured-block"><div class="featured-label">Suggested starting points</div><div class="featured-documents">'+cards+'</div></div>':"";
}

const state={parts:[],files:[],page:"overview",query:"",view:"list",saved:new Set(),current:null,partial:false};
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ordered=(a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true,sensitivity:"base"});
const archive=f=>(f.path||[]).some(s=>/archive|not for review/i.test(s));
const num=i=>String(i).padStart(2,"0");
const sectionCount=i=>(state.parts[i]?.files||[]).length;
const findTerm=term=>state.files.find(f=>f.title.toLowerCase().includes(term.toLowerCase()));
function original(f) {
  const url=f.url||"";
  try {const u=new URL(url);if(u.protocol==="https:"&&["drive.google.com","docs.google.com"].includes(u.hostname))return url;}catch(e){}
  return "https://drive.google.com/file/d/"+encodeURIComponent(f.id)+"/view";
}
function preview(f){
  const id=encodeURIComponent(f.id),m=f.mime||"";
  if(m==="application/vnd.google-apps.document")return "https://docs.google.com/document/d/"+id+"/preview";
  if(m==="application/vnd.google-apps.presentation")return "https://docs.google.com/presentation/d/"+id+"/preview";
  if(m==="application/vnd.google-apps.spreadsheet")return "https://docs.google.com/spreadsheets/d/"+id+"/preview";
  return "https://drive.google.com/file/d/"+id+"/preview";
}
function setPage(next){
  if(state.current)closeReader();
  state.page=next;state.query="";$("#global-search").value="";
  history.replaceState(null,"","#"+(next==="overview"||next==="saved"?next:"section="+next));
  render();window.scrollTo({top:0,behavior:"instant"});
}
function nav(){
  $("#section-nav").innerHTML='<button class="nav-item" data-nav="overview"><span class="nav-number">⌂</span><span class="nav-text">Portfolio overview</span></button>'+SECTIONS.map((s,i)=>'<button class="nav-item" data-nav="'+i+'"><span class="nav-number">'+num(i)+'</span><span class="nav-text">'+esc(s.short)+'</span><span class="nav-count">'+sectionCount(i)+'</span></button>').join("");
}
function highlightNav(){
 document.querySelectorAll("#section-nav [data-nav]").forEach(el=>{
  const active=el.dataset.nav===state.page;el.classList.toggle("is-active",active);
  if(active)el.setAttribute("aria-current","page");else el.removeAttribute("aria-current");
 });
 $("#bookmark-count").textContent=state.saved.size;
}
function overview(){
 const priority=[
  ["Application letter","Read the tenure application","TENURE-2026-Application-Letter"],
  ["Curriculum vitae","View qualifications and experience","Curriculum Vitae — Priyojit"]
 ];
 const order=[1,4,5,6,3,2,7,0];
 return '<div class="container simple-home">'+
 (state.partial?'<p class="data-warning">Some source folders could not be indexed. Refer to the original Drive dossier for complete coverage.</p>':"")+
 '<div class="simple-heading"><span class="eyebrow">SPRING HILL COLLEGE · 2026</span><h2>Tenure & Promotion Portfolio</h2><p>Priyojit Palit · Mathematics & Computer Science</p></div>'+
 '<div class="quick-documents">'+priority.map(([title,subtitle,term])=>'<button class="quick-document" data-open-term="'+esc(term)+'"><span class="quick-icon">▤</span><span><strong>'+esc(title)+'</strong><small>'+esc(subtitle)+'</small></span><span class="quick-arrow">↗</span></button>').join("")+'</div>'+
 '<div class="directory-header"><h3>Browse the dossier</h3><span>'+state.files.length+' documents · 8 sections</span></div>'+
 '<div class="directory-grid">'+order.map(i=>{const s=SECTIONS[i];return '<button class="directory-card" data-nav="'+i+'"><span class="directory-number">'+num(i)+'</span><span class="directory-copy"><strong>'+esc(s.name)+'</strong><small>'+sectionCount(i)+' documents</small></span><span class="directory-arrow">→</span></button>'}).join("")+'</div>'+
 '<p class="directory-footnote">Select a section to browse its documents or use Search above to find a specific item. Documents open in the reader, with a link to the original file in Google Drive.</p></div>';
}
function typeOf(f){
 const m=f.mime||"";
 if(m.includes("pdf"))return ["PDF","pdf"];
 if(m.includes("document")||m.includes("wordprocessing"))return ["DOC","doc"];
 if(m.includes("spreadsheet"))return ["XLS","doc"];
 if(m.includes("presentation"))return ["PPT","doc"];
 return ["FILE","other"];
}
function documentRow(f){
 const [code,cl]=typeOf(f),folder=(f.path||[]).slice(1,-1).join(" / ");
 return '<button class="doc-row" data-open="'+esc(f.id)+'"><span class="doc-icon '+cl+'">'+code+'</span><span class="doc-text"><span class="doc-title">'+esc(f.title)+'</span><span class="doc-desc">'+esc(folder)+(archive(f)?" · ARCHIVE":"")+'</span></span><span class="doc-arrow">↗</span></button>';
}
function groups(files){
 const m=new Map();
 files.forEach(f=>{const key=(f.path||[])[1]||"Documents in this section";if(!m.has(key))m.set(key,[]);m.get(key).push(f)});
 return [...m.entries()].sort((a,b)=>ordered(a[0],b[0]));
}
function groupHtml(name,files,groupId=""){
 return '<details class="folder-group"'+(groupId?' id="'+esc(groupId)+'"':"")+'><summary class="folder-head"><span class="folder-title"><span class="folder-chevron" aria-hidden="true">›</span><span><strong>'+esc(name)+'</strong><small>'+((files.length&&files.every(archive))?"Archived source reports":"Click to view documents")+'</small></span></span><span class="folder-count">'+files.length+' files</span></summary><div class="doc-list">'+[...files].sort((a,b)=>ordered(a.title,b.title)).map(documentRow).join("")+'</div></details>';
}
function groupList(files,sectionIndex=null){
 return groups(files).map(([name,items],n)=>groupHtml(name,items,sectionIndex===null?"":"evidence-"+sectionIndex+"-"+n)).join("");
}
function topicLinks(i,files){
 const topicGroups=groups(files);
 if(topicGroups.length<2)return "";
 return '<nav class="topic-map" aria-label="Jump to evidence folders"><span>Jump to</span><div>'+topicGroups.map(([name,items],n)=>{
  const short=name.replace(/^\s*\d+\.\s*/,"").replace(/\s*\([^)]*\)/g,"").trim();
  return '<button type="button" data-jump-folder="evidence-'+i+'-'+n+'">'+esc(short)+'</button>';
 }).join("")+'</div></nav>';
}
function treeHtml(i){
 const s=state.parts[i],root={name:SECTIONS[i].name,kids:new Map(),files:[]};
 function node(parts){let here=root;parts.forEach(p=>{if(!here.kids.has(p))here.kids.set(p,{name:p,kids:new Map(),files:[]});here=here.kids.get(p)});return here}
 (s.folders||[]).forEach(f=>node((f.path||[]).slice(1)));
 (s.files||[]).forEach(f=>node((f.path||[]).slice(1,-1)).files.push(f));
 function total(n){return n.files.length+[...n.kids.values()].reduce((sum,x)=>sum+total(x),0)}
 function html(n,rootNode){return (rootNode?'<div class="tree-node root">':'<details class="tree-node"><summary class="tree-folder">'+esc(n.name)+' <small>('+total(n)+' files)</small></summary>')+
 [...n.kids.values()].sort((a,b)=>ordered(a.name,b.name)).map(x=>html(x,false)).join("")+
 [...n.files].sort((a,b)=>ordered(a.title,b.title)).map(f=>'<button class="tree-file" data-open="'+esc(f.id)+'">▤ '+esc(f.title)+'</button>').join("")+(rootNode?'</div>':'</details>')}
 return '<div class="tree-view">'+html(root,true)+'</div>';
}
function sectionHtml(i){
 const item=SECTIONS[i],files=state.parts[i]?.files||[];
 const prior=i>0?i-1:null,next=i<SECTIONS.length-1?i+1:null;
 return '<div class="container chapter-page"><div class="content-head"><div><span class="eyebrow">SECTION '+num(i)+' · '+esc(item.lead)+'</span><h2>'+esc(item.name)+'</h2><p>'+esc(SECTION_GUIDES[i].intro)+'</p></div><div class="section-meta"><strong>'+files.length+'</strong><span>documents</span></div></div>'+
 featuredHtml(i)+
 '<div class="evidence-heading" id="evidence-start"><div><span class="eyebrow">COMPLETE DOCUMENT COLLECTION</span><h3>Supporting materials</h3><p>All documents in this section remain available below.</p></div></div>'+
 (state.view==="list"?topicLinks(i,files):"")+
 '<div class="section-tools"><span class="small-detail">Select a folder to view its documents.</span><div class="tool-buttons"><button class="toggle-button '+(state.view==="list"?"active":"")+'" data-view="list">Grouped documents</button><button class="toggle-button '+(state.view==="tree"?"active":"")+'" data-view="tree">Full folder tree</button></div></div>'+
 (state.view==="tree"?treeHtml(i):groupList(files,i))+
 (!files.length?'<div class="empty-state"><h3>No documents in this section</h3></div>':"")+
 '<nav class="chapter-next" aria-label="Section navigation">'+
 (prior!==null?'<button data-nav="'+prior+'"><span>← Previous section</span><strong>'+esc(SECTIONS[prior].name)+'</strong></button>':"<span></span>")+
 (next!==null?'<button class="chapter-next-forward" data-nav="'+next+'"><span>Next section →</span><strong>'+esc(SECTIONS[next].name)+'</strong></button>':"<span></span>")+'</nav></div>';
}
function searchHtml(query){
 const tokens=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
 const files=state.files.filter(f=>tokens.every(t=>(f.title+" "+(f.path||[]).join(" ")).toLowerCase().includes(t)));
 return '<div class="container"><div class="search-results-heading"><div><span class="eyebrow">PORTFOLIO SEARCH</span><h2>Search results</h2><span class="result-meta">'+files.length+' documents matching “'+esc(query)+'”</span></div><button class="button secondary" data-clear-search>Clear search</button></div>'+
 (files.length?'<div class="search-document-list">'+files.map(documentRow).join("")+'</div>':'<div class="empty-state"><h3>No matching records</h3><p>Try a course code, year, author, or subject.</p></div>')+'</div>';
}
function savedHtml(){
 const files=state.files.filter(f=>state.saved.has(f.id));
 return '<div class="container"><div class="content-head"><div><span class="eyebrow">YOUR READING LIST</span><h2>Saved documents</h2><p>Select Save in the reader to collect a set of documents on this browser.</p></div><div class="section-meta"><strong>'+files.length+'</strong><span>saved</span></div></div>'+
 (files.length?groupList(files):'<div class="empty-state"><h3>No saved documents yet</h3><p>Open a document and choose Save.</p><button class="button secondary" data-nav="overview">Back to overview</button></div>')+'</div>';
}
function render(){
 highlightNav();
 $("#main-content").innerHTML=state.query.trim()?searchHtml(state.query):state.page==="overview"?overview():state.page==="saved"?savedHtml():sectionHtml(Number(state.page));
 const name=state.query?"Search results":state.page==="overview"?"Overview":state.page==="saved"?"Saved documents":SECTIONS[Number(state.page)].name;
 $("#top-breadcrumb").innerHTML='Portfolio <span>/</span> '+esc(name);
 $(".sidebar").classList.remove("mobile-open");$("#menu-toggle").setAttribute("aria-expanded","false");
}
function openReader(file,restore=false){
 if(!file)return;
 state.current=file;
 $("#reader-title").textContent=file.title;
 $("#reader-path").textContent=(file.path||[]).slice(0,-1).join(" / ");
 $("#reader-subtitle").textContent=SECTIONS[file.section].name+" · Original Drive file";
 $("#reader-external").href=original(file);
 $("#reader-frame").src=preview(file);
 $("#reader-save").textContent=state.saved.has(file.id)?"★ Saved":"☆ Save";
 $("#document-reader").classList.add("open");$("#document-reader").setAttribute("aria-hidden","false");
 $("#reader-scrim").hidden=false;document.body.style.overflow="hidden";
 if(!restore)history.replaceState(null,"","#document="+file.id);
 $("#reader-close").focus();
}
function closeReader(){
 $("#document-reader").classList.remove("open","expanded");
 $("#document-reader").setAttribute("aria-hidden","true");
 $("#reader-expand").textContent="Expand view";$("#reader-scrim").hidden=true;
 $("#reader-frame").src="about:blank";document.body.style.overflow="";
 state.current=null;
 history.replaceState(null,"","#"+(state.page==="overview"||state.page==="saved"?state.page:"section="+state.page));
}
function saveCurrent(){
 const file=state.current;if(!file)return;
 if(state.saved.has(file.id))state.saved.delete(file.id);else state.saved.add(file.id);
 try{localStorage.setItem("shc-tenure-saved",JSON.stringify([...state.saved]))}catch(e){}
 $("#reader-save").textContent=state.saved.has(file.id)?"★ Saved":"☆ Save";
 $("#bookmark-count").textContent=state.saved.size;
}
async function start(){
 const responses=await Promise.allSettled(SECTIONS.map(s=>fetch("./data/"+s.file,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()})));
 state.parts=responses.map((r,i)=>r.status==="fulfilled"?r.value:{section:SECTIONS[i].name,files:[],folders:[],errors:[String(r.reason)]});
 state.parts.forEach((s,i)=>{
  s.files=(s.files||[]).map(f=>({...f,section:i}));
  if(s.files.length!==EXPECTED[i]||(s.errors||[]).length||(s.unscanned||[]).length)state.partial=true;
 });
 state.files=state.parts.flatMap(s=>s.files);
 try{const old=JSON.parse(localStorage.getItem("shc-tenure-saved")||"[]");state.saved=new Set(Array.isArray(old)?old:[])}catch(e){}
 nav();
 const h=decodeURIComponent(location.hash.slice(1));
 if(h.startsWith("section=")){const n=Number(h.slice(8));if(Number.isInteger(n)&&n>=0&&n<8)state.page=String(n)}
 else if(h==="saved")state.page="saved";
 else if(h.startsWith("document=")){const f=state.files.find(x=>x.id===h.slice(9));if(f){state.page=String(f.section);render();openReader(f,true);return}}
 render();
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-nav]");if(nav){setPage(nav.dataset.nav);return}
 const term=e.target.closest("[data-open-term]");if(term){openReader(findTerm(term.dataset.openTerm));return}
 const doc=e.target.closest("[data-open]");if(doc){openReader(state.files.find(f=>f.id===doc.dataset.open));return}
 const view=e.target.closest("[data-view]");if(view){state.view=view.dataset.view;render();return}
 const folder=e.target.closest("[data-jump-folder]");if(folder){const node=document.getElementById(folder.dataset.jumpFolder);if(node){node.open=true;node.scrollIntoView({behavior:"smooth",block:"start"})}return}
 if(e.target.closest("[data-clear-search]")){$("#global-search").value="";state.query="";render()}
});
$("#global-search").addEventListener("input",e=>{state.query=e.target.value;render()});
$("#global-search").addEventListener("keydown",e=>{if(e.key==="Escape"){e.target.value="";state.query="";render()}});
$("#reader-close").addEventListener("click",closeReader);
$("#reader-scrim").addEventListener("click",closeReader);
$("#reader-save").addEventListener("click",saveCurrent);
$("#reader-expand").addEventListener("click",()=>{
 const expanded=$("#document-reader").classList.toggle("expanded");
 $("#reader-expand").textContent=expanded?"Restore view":"Expand view";
});
$("#bookmarks-link").addEventListener("click",()=>setPage("saved"));
$("#menu-toggle").addEventListener("click",()=>{
 const expanded=$("#sidebar").classList.toggle("mobile-open");
 $("#menu-toggle").setAttribute("aria-expanded",String(expanded));
});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&state.current){closeReader();return}
 if(e.key==="/"&&!state.current&&document.activeElement!==$("#global-search")&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){
  e.preventDefault();$("#global-search").focus();
 }
});
window.addEventListener("hashchange",()=>{
 if(state.current)return;
 const h=decodeURIComponent(location.hash.slice(1));
 if(h==="overview"||h==="saved")setPage(h);
 else if(h.startsWith("section=")){const n=Number(h.slice(8));if(Number.isInteger(n)&&n>=0&&n<8)setPage(String(n))}
 else if(h.startsWith("document=")){const f=state.files.find(f=>f.id===h.slice(9));if(f){state.page=String(f.section);render();openReader(f,true)}}
});
start().catch(err=>{$("#main-content").innerHTML='<div class="container"><div class="empty-state"><h3>Portfolio data unavailable</h3><p>Reload the page or use the original SHC Drive folder.</p></div></div>';});
