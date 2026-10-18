import './topic-four.css';
import { bindAtomicSelection } from './atomic-selection.js';
import { assetUrl } from './asset-url.js';

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title=item=>item.text[0].replace(/^\d+\.\s*/, '');
function imageButton(image,label){
 return `<button class="museum-image" type="button" data-inspect aria-label="${esc(label)} — Томруулж харах"><img src="${assetUrl(image.src)}" width="${image.width}" height="${image.height}" alt="${esc(label)}" loading="lazy" decoding="async"><span aria-hidden="true">↗</span></button>`;
}
function tabs(items,prefix){
 return `<div class="museum-tabs" role="tablist" aria-label="Гар урлал, үйлдвэрлэл">${items.map((item,i)=>`<button type="button" role="tab" id="${prefix}-tab-${i}" aria-controls="${prefix}-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}"><small>${String(i+1).padStart(2,'0')}</small>${esc(item.label)}</button>`).join('')}<span class="museum-indicator" aria-hidden="true"></span></div>`;
}
export function renderTopicFour(chapter){
 const [crafts,production,final]=chapter.sections;
 const items=crafts.crafts;
 return `<div class="museum-four pdf-chapter">
 <section class="museum-scene pdf-section" data-pdf-page="8"><div class="museum-heading"><span class="museum-number">04 / 01</span><h2>Гар урлал,<br>үйлдвэрлэл</h2></div><div class="museum-content"><p class="museum-intro">${esc(crafts.paragraphs.join(' '))}</p>
 <div class="museum-selection">${tabs(items.map(item=>({label:title(item)})),'artifact')}
 <div class="museum-stage">${items.map((item,i)=>`<div class="museum-panel ${i===0?'is-active':''}" id="artifact-panel-${i}" role="tabpanel" aria-labelledby="artifact-tab-${i}" ${i?'inert aria-hidden="true"':''}>${imageButton(item.image,title(item))}<div class="museum-copy"><h3>${esc(title(item))}</h3><ul>${item.text.slice(1).filter(line=>!/^\d+\./.test(line)).map(line=>`<li>${esc(line)}</li>`).join('')}</ul></div></div>`).join('')}</div></div><p class="museum-source">PDF · 8</p></div></section>
 <section class="museum-scene museum-production pdf-section" data-pdf-page="9"><div class="museum-heading"><span class="museum-number">04 / 02</span><h2>Гар урлал,<br>үйлдвэрлэл</h2></div><div class="museum-content"><div class="museum-selection">${tabs(production.images.map((_,i)=>({label:String(i+1).padStart(2,'0')})),'production')}<div class="museum-stage">${production.images.map((image,i)=>`<div class="museum-panel ${i===0?'is-active':''}" id="production-panel-${i}" role="tabpanel" aria-labelledby="production-tab-${i}" ${i?'inert aria-hidden="true"':''}>${imageButton(image,'Гар урлал, үйлдвэрлэл')}</div>`).join('')}</div></div><p class="museum-source">PDF · 9</p></div></section>
 <section class="museum-scene museum-finale pdf-section" data-pdf-page="10"><div class="museum-heading"><span class="museum-number">04 / 03</span><h2>Гар урлал,<br>үйлдвэрлэл</h2></div><div class="museum-content">${imageButton(final.images[0],'Гар урлал, үйлдвэрлэл')}<p class="museum-source">PDF · 10</p></div></section>
 <dialog class="museum-viewer" aria-label="Үзмэрийг томруулж харах"><button class="museum-viewer-close" type="button" aria-label="Хаах">×</button><img alt=""><p></p></dialog></div>`;
}
export function initTopicFour(detail){
 const root=detail.querySelector('.museum-four');
 if(!root)return;
 const cleanups=[];
 let alive=true;
 root.querySelectorAll('.museum-selection').forEach(selection=>{
  const buttons=[...selection.querySelectorAll('[role="tab"]')];
  const panels=[...selection.querySelectorAll('[role="tabpanel"]')];
  const indicator=selection.querySelector('.museum-indicator');
  let active=0;
  function moveIndicator(){
   const button=buttons[active];
   indicator.style.width=`${button.offsetWidth}px`;
   indicator.style.transform=`translate(${button.offsetLeft}px,${button.offsetTop+button.offsetHeight-1}px)`;
  }
  cleanups.push(bindAtomicSelection(buttons,panels,{museum:true,onCommit:index=>{active=index;moveIndicator();}}));
  const resize=new ResizeObserver(()=>{if(!root.isConnected){resize.disconnect();return;}moveIndicator();});
  resize.observe(selection.querySelector('.museum-tabs'));
  const frame=requestAnimationFrame(()=>{if(alive)moveIndicator();});
  cleanups.push(()=>{resize.disconnect();cancelAnimationFrame(frame);});
 });
 const viewer=root.querySelector('dialog'),large=viewer.querySelector('img');
 let opener;
 root.querySelectorAll('[data-inspect]').forEach(button=>button.onclick=()=>{
  opener=button;const img=button.querySelector('img');large.src=img.src;large.alt=img.alt;viewer.querySelector('p').textContent=img.alt;viewer.showModal();viewer.querySelector('button').focus({preventScroll:true});
 });
 viewer.querySelector('button').onclick=()=>viewer.close();
 viewer.addEventListener('keydown',event=>{
  if(event.key==='Escape')event.stopPropagation();
  if(event.key==='Tab'){event.preventDefault();viewer.querySelector('button').focus();}
 });
 viewer.addEventListener('click',event=>{if(event.target!==viewer)return;const rect=viewer.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)viewer.close();});
 viewer.addEventListener('close',()=>{if(alive&&opener?.isConnected)opener.focus({preventScroll:true});});
 return ()=>{alive=false;cleanups.forEach(cleanup=>cleanup());if(viewer.open)viewer.close();root.querySelectorAll('[data-inspect]').forEach(button=>button.onclick=null);};
}
