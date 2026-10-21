import {topics} from './museum-topics.js';
import {buildExhibitions} from './exhibits.js';
import {renderLearning,bindLearning,exhibitFigure} from './learning.js';
const escape=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const paragraphs=lines=>(lines||[]).filter(Boolean).map(line=>`<p>${escape(line)}</p>`).join('');
function table(section){return`<details class="exhibit-table"><summary>Хүснэгтээр харьцуулах</summary><div class="table-wrap"><table><caption class="sr-only">${escape(section.title)}</caption><thead><tr>${section.table.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${section.table.rows.map(row=>`<tr><th scope="row">${escape(row[0])}</th><td>${escape(row[1])}</td></tr>`).join('')}</tbody></table></div></details>`;}
function renderSection(section,topic,index){
  let content='';
  if(section.stat)content+=`<div class="historical-stat"><span>${escape(section.stat)}</span><small>${escape(section.statLabel)}</small></div>`;
  if(section.kind==='editorial'&&section.visual.image){
    content+=`<div class="editorial-exhibit">${exhibitFigure(section.visual,{inspect:true})}<div class="editorial-copy">${paragraphs(section.paragraphs)}</div></div>`;
  }else{
    content+=`<div class="editorial-copy">${paragraphs(section.paragraphs)}</div>`;
    if(section.kind==='comparison')content+=`<div class="comparison-exhibit">${section.items.map((item,i)=>`<div><span class="section-number">${String(i+1).padStart(2,'0')}</span><h3>${escape(item.title)}</h3>${exhibitFigure(item,{inspect:true})}<p>${escape(item.description)}</p></div>`).join('')}</div>`;
    else if(section.items)content+=renderLearning(section);
    if(section.visual.image)content+=`<div class="exhibit-context">${exhibitFigure(section.visual,{inspect:true})}</div>`;
  }
  if(section.table)content+=table(section);
  if(section.supplementaryVisuals?.length)content+=`<div class="source-image-gallery">${section.supplementaryVisuals.map(visual=>exhibitFigure(visual,{inspect:true})).join('')}</div>`;
  if(section.network)content+=`<div class="network-exhibit">${exhibitFigure(section.network,{inspect:true})}<p class="image-caption">Өртөөний сүлжээг тайлбарласан эхийн бүдүүвч.</p></div>`;
  return`<section class="exhibit-section layout-${section.layout||'learning'} museum-${section.kind}" data-exhibition-type="${section.kind}" data-section-id="${section.id}" aria-labelledby="${section.id}-heading"><div class="section-heading"><span class="section-number">${topic.number}.${String(index+1).padStart(2,'0')}</span><h2 id="${section.id}-heading">${escape(section.title)}</h2></div><div class="section-body">${content}</div></section>`;
}
function bindViewer(article,signal){
  const viewer=article.querySelector('.document-viewer');let origin=null,zoom=1;
  const image=viewer.querySelector('img'),scroller=viewer.querySelector('.document-image-wrap');
  function close(){viewer.close();origin?.focus({preventScroll:true});}
  article.addEventListener('click',event=>{
    const inspect=event.target.closest('[data-inspect]');
    if(inspect){
      origin=inspect;const source=inspect.querySelector('img');image.src=source.src;image.alt=source.alt;
      viewer.querySelector('h2').textContent=source.alt;zoom=1;image.style.setProperty('--document-zoom',zoom);viewer.querySelector('[data-zoom-status]').textContent='100%';viewer.showModal();scroller.scrollTo(0,0);return;
    }
    const action=event.target.closest('[data-viewer-action]')?.dataset.viewerAction;if(!action)return;
    if(action==='close'){close();return;}
    zoom=action==='reset'?1:Math.max(1,Math.min(3,zoom+(action==='in' ? .25 : -.25)));
    image.style.setProperty('--document-zoom',zoom);viewer.querySelector('[data-zoom-status]').textContent=`${Math.round(zoom*100)}%`;
  },{signal});
  viewer.addEventListener('keydown',event=>{if(event.key==='Escape')event.stopPropagation();},{signal});
  viewer.addEventListener('close',()=>origin?.focus({preventScroll:true}),{signal});
  return()=>{if(viewer.open)viewer.close();image.removeAttribute('src');};
}
export function renderTopic(article,topic,onBack,onNavigate){
  if(topic.number==='05')throw new Error('Topic 05 must use the existing Copy renderer');
  article.dataset.exhibition='museum';article.dataset.topic=topic.number;
  const sections=buildExhibitions(topic),index=topics.indexOf(topic),sourcePages=[...new Set(sections.flatMap(s=>s.sourcePages))].sort((a,b)=>a-b);
  article.innerHTML=`<div class="detail-nav" aria-hidden="true"></div>
    <div class="detail-scroll" tabindex="0" aria-label="${escape(topic.title)}">
      <div class="detail-hero"><div class="hero-copy"><span class="eyebrow">${escape(topic.category)}</span><h1>${escape(topic.title)}</h1><p>${escape(topic.intro)}</p><span class="hero-date">${escape(topic.date)}</span></div><div class="hero-image"><img src="${escape(topic.image)}" alt="${escape(topic.imageAlt)}"></div></div>
      <div class="exhibit-content">${sections.map((s,i)=>renderSection(s,topic,i)).join('')}
      ${topic.number==='10'?`<div class="museum-epilogue"><span class="eyebrow">ТҮҮХЭН ХОЛБОО · СОЁЛЫН ӨВ</span><p>${escape(topic.title)}</p><span class="epilogue-rule"></span></div>`:''}
      <footer class="museum-footer"><p class="museum-source">Эх сурвалж · «Монгол гүрний аж ахуй, соёл» · 4-р баг · х. ${sourcePages.join(', ')}</p><nav class="museum-topic-links" aria-label="Сэдэв хооронд шилжих">${index?`<button data-detail-topic="${index-1}"><span>← Өмнөх сэдэв</span>${escape(topics[index-1].title)}</button>`:''}${index<topics.length-1?`<button data-detail-topic="${index+1}"><span>Дараагийн сэдэв →</span>${escape(topics[index+1].title)}</button>`:''}</nav></footer></div>
    </div>
    <dialog class="document-viewer" aria-labelledby="document-viewer-title"><header><h2 id="document-viewer-title"></h2><button data-viewer-action="close" aria-label="Зургийн үзүүлэлтийг хаах">×</button></header><div class="viewer-controls"><button data-viewer-action="out" aria-label="Жижигрүүлэх">−</button><output data-zoom-status>100%</output><button data-viewer-action="in" aria-label="Томруулах">+</button><button data-viewer-action="reset">Анхны хэмжээ</button></div><div class="document-image-wrap"><img alt=""></div></dialog>`;
  const events=new AbortController();
  article.addEventListener('click',event=>{const button=event.target.closest('[data-detail-topic]');if(button)onNavigate?.(Number(button.dataset.detailTopic));},{signal:events.signal});
  const unbind=bindLearning(article),closeViewer=bindViewer(article,events.signal);
  article.querySelector('.detail-scroll').scrollTo({top:0,behavior:'instant'});
  const entrance=matchMedia('(prefers-reduced-motion: reduce)').matches?null:article.querySelector('.detail-scroll').animate([{opacity:0},{opacity:1}],{duration:250,easing:'ease-out'});
  return()=>{events.abort();unbind();closeViewer();entrance?.cancel();};
}
