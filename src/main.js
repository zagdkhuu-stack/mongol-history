import { topics } from './topics.js';
import { createExhibition } from './scene.js';
import { bindNavigation } from './navigation.js';
import { renderTopic as renderMuseumTopic } from './content.js';
import { topics as museumTopics } from './museum-topics.js';
import '../styles/museum-foundation.css';
import '../styles/museum.css';
const $=id=>document.getElementById(id);
const detail=$('detail'),index=$('topicIndex');
let selected=0,mode='gallery',transition=0,scene;
let navigationVersion=0;
let disposeMuseum=()=>{};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function setIndex(open){
  index.hidden=!open;$('indexToggle').setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('index-open',open);
  if(open){index.querySelector('button').focus();}else $('indexToggle').focus();
}
function select(i,updateURL=true){
  if(mode!=='gallery')return;
  selected=Math.max(0,Math.min(topics.length-1,i));
  scene?.select(selected);
  const t=topics[selected];
  $('currentNumber').textContent=t.number;$('currentCategory').textContent=t.category;$('currentTitle').textContent=t.short;
  document.querySelectorAll('[data-topic]').forEach(el=>{const active=Number(el.dataset.topic)===selected;el.classList.toggle('active',active);el.setAttribute('aria-current',active?'true':'false');});
  $('previous').disabled=selected===0;$('next').disabled=selected===9;
  $('announcement').textContent=`${t.number}. ${t.title}`;
  if(updateURL)history.replaceState({topic:selected},'',`#gallery/${t.id}`);
}
function renderDetail(){
  document.body.classList.add('museum-detail-open');
  detail.classList.remove('pdf-detail');
  disposeMuseum=renderMuseumTopic(detail,museumTopics[selected],returnGallery,navigateMuseumTopic);
}
function cancelDetailNavigation(){
  navigationVersion++;
  clearTimeout(transition);
  disposeMuseum();disposeMuseum=()=>{};
  detail.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
  return navigationVersion;
}
function resetDetailScroll(){detail.scrollTo({top:0,left:0,behavior:'instant'});detail.querySelector('.detail-scroll')?.scrollTo({top:0,left:0,behavior:'instant'});}
async function revealTopic(version,push){
  if(version!==navigationVersion)return;
  // An opaque article remains mounted while its old content is discarded.
  detail.replaceChildren();resetDetailScroll();renderDetail();
  const view=detail;view.style.opacity='0';view.inert=true;
  detail.hidden=false;document.body.classList.add('detail-open');
  document.body.classList.remove('entering');
  $('galleryUI').inert=true;$('gallery').inert=true;scene.pause(true);
  const hero=view.querySelector('.detail-hero img');
  if(hero)await hero.decode().catch(()=>{});
  if(version!==navigationVersion||!view.isConnected)return;
  resetDetailScroll();view.style.opacity='1';view.inert=false;mode='detail';
  if(!reduced.matches)view.animate([{opacity:0},{opacity:1}],{duration:360,easing:'ease-out'});
  detail.focus({preventScroll:true});
  if(push)history.pushState({topic:selected,detail:true},'',`#topic/${topics[selected].id}`);
}
function navigateMuseumTopic(i){
  history.pushState({topic:i,detail:true},'',`#topic/${topics[i].id}`);
  switchTopic(i);
}
function switchTopic(i){
  const version=cancelDetailNavigation();
  detail.replaceChildren();resetDetailScroll();
  mode='gallery';select(i,false);mode='detail-loading';scene.pause(true);
  history.replaceState({...history.state,topic:selected,detail:Boolean(history.state?.detail)},'',`#topic/${topics[selected].id}`);
  revealTopic(version,false);
}
function enterTopic(push=true){
  if(mode!=='gallery')return;
  const version=cancelDetailNavigation();
  setIndex(false);mode='entering';scene.zoom(1);document.body.classList.add('entering');
  detail.replaceChildren();resetDetailScroll();
  transition=setTimeout(()=>revealTopic(version,push),reduced.matches?0:780);
}
function returnGallery(changeURL=true){
  if(mode==='gallery')return;
  const version=cancelDetailNavigation();mode='leaving';
  detail.replaceChildren();detail.hidden=true;resetDetailScroll();
  delete detail.dataset.exhibition;delete detail.dataset.topic;detail.style.removeProperty('opacity');detail.inert=false;
  document.body.classList.remove('museum-detail-open');
  document.body.classList.remove('detail-open','entering');
  $('galleryUI').inert=false;$('gallery').inert=false;scene.pause(false);scene.zoom(0);
  mode='gallery';
  transition=setTimeout(()=>{if(version!==navigationVersion)return;mode='gallery';select(selected,false);$('enterTopic').focus({preventScroll:true});},reduced.matches?0:650);
  if(changeURL)history.pushState({topic:selected},'','#gallery');
}

function route(){
  const match=location.hash.match(/^#(topic|gallery)\/topic-(\d+)$/);
  if(!match){if(mode!=='gallery')returnGallery(false);return;}
  const i=Math.max(0,Math.min(9,Number(match[2])-1));
  if(match[1]==='topic'){
    if(mode==='detail'||mode==='detail-loading')switchTopic(i);
    else {cancelDetailNavigation();mode='gallery';select(i,false);enterTopic(false);}
  }else if(mode!=='gallery'){
    selected=i;scene.select(i);returnGallery(false);
  }else select(i,false);
}
$('dots').innerHTML=topics.map((t,i)=>`<button data-topic="${i}" aria-label="${t.number}. ${t.title}"><span>${t.number}</span></button>`).join('');
$('indexLinks').innerHTML=topics.map((t,i)=>`<button data-topic="${i}"><span>${t.number}</span><span>${t.title}</span><span>↗</span></button>`).join('');
document.querySelectorAll('[data-topic]').forEach(el=>el.onclick=()=>{
  if(el.closest('#indexLinks')&&(mode==='detail'||mode==='detail-loading')){setIndex(false);navigateMuseumTopic(Number(el.dataset.topic));return;}
  if(mode!=='gallery')returnGallery(false);
  cancelDetailNavigation();detail.replaceChildren();detail.hidden=true;mode='gallery';
  document.body.classList.remove('detail-open','entering');$('galleryUI').inert=false;$('gallery').inert=false;
  scene.zoom(0);select(Number(el.dataset.topic));setIndex(false);
});
$('indexToggle').onclick=()=>setIndex(index.hidden);$('closeIndex').onclick=()=>setIndex(false);
$('previous').onclick=()=>select(selected-1);$('next').onclick=()=>select(selected+1);$('enterTopic').onclick=()=>enterTopic();
document.querySelector('.brand').onclick=e=>{e.preventDefault();if(mode!=='gallery')returnGallery();else select(0);};
scene=createExhibition($('world'),topics,select,enterTopic);
// CSS3D hit testing can fall through a rotated card to its scene container.
// Recover clicks on the visible selected card without changing its rendering.
$('gallery').addEventListener('click',event=>{
  if(mode!=='gallery'||!index.hidden||event.target.closest('.topic-screen'))return;
  const card=document.querySelector('.topic-screen.focused');
  if(!card)return;
  const rect=card.getBoundingClientRect();
  if(event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom)enterTopic();
});
const unbind=bindNavigation({element:$('gallery'),canNavigate:()=>mode==='gallery'&&index.hidden,move:delta=>select(selected+delta),enter:enterTopic,close:()=>{if(!index.hidden)setIndex(false);else if(mode!=='gallery')returnGallery();}});
// Trap the modal topic index without trapping the independently scrolling article.
document.addEventListener('keydown',e=>{
  if(index.hidden||e.key!=='Tab')return;
  const buttons=index.querySelectorAll('button');const first=buttons[0],last=buttons[buttons.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
window.addEventListener('popstate',route);
select(0,false);route();
Promise.all([document.fonts.ready,...topics.slice(0,2).map(t=>new Promise(resolve=>{const img=new Image();img.onload=img.onerror=resolve;img.src=t.image;}))]).then(()=>$('loader').classList.add('loaded'));
setTimeout(()=>$('loader').classList.add('loaded'),4500);
window.addEventListener('pagehide',()=>{cancelDetailNavigation();unbind();scene.dispose();},{once:true});
