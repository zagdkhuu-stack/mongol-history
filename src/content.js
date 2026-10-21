import {topics} from './museum-topics.js';
import {buildExhibitions} from './exhibits.js';
import {renderLearning,bindLearning,exhibitFigure} from './learning.js';
const escape=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const paragraphs=lines=>(lines||[]).filter(Boolean).map(line=>`<p>${escape(line)}</p>`).join('');
function renderSection(section,topic,index){
  const notes=section.items&&!section.interactive?`<dl class="exhibit-notes">${section.items.map(item=>`<div><dt>${escape(item.title)}</dt><dd>${escape(item.description)}</dd></div>`).join('')}</dl>`:'';
  const copy=`<div class="editorial-copy">${paragraphs(section.paragraphs)}${notes}</div>`;
  const stat=section.stat?`<p class="exhibit-stat">${escape(section.stat)}<small>${escape(section.statLabel)}</small></p>`:'';
  const timeline=section.timeline?`<details class="closing-dates"><summary>Он цаг дундуурх холбоо</summary><dl>${section.timeline.map(item=>`<div><dt>${escape(item.title)}</dt><dd>${escape(item.text)}</dd></div>`).join('')}</dl></details>`:'';
  const content=section.interactive?`${copy}${renderLearning(section)}`
    :section.visual?.image?`<div class="editorial-exhibit">${exhibitFigure(section.visual,{inspect:true})}${copy}</div>`:copy;
  return`<section id="${section.id}" class="exhibit-section layout-${section.kind} ${section.kind==='conclusion'?'museum-conclusion':''}" data-exhibition-type="${section.kind}" data-section-id="${section.id}" aria-labelledby="${section.id}-heading"><div class="section-heading"><span class="exhibit-number">${String(index+1).padStart(2,'0')} / ${topic.sections.length}</span><h2 id="${section.id}-heading" tabindex="-1">${escape(section.title)}</h2></div><div class="section-body">${stat}${content}${timeline}</div></section>`;
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
  article.dataset.exhibition='museum';article.dataset.topic=topic.number;
  const sections=buildExhibitions(topic),index=topics.indexOf(topic),sourcePages=[...new Set(sections.flatMap(s=>s.sourcePages))].sort((a,b)=>a-b);
  article.innerHTML=`<div class="detail-scroll" tabindex="0" aria-label="${escape(topic.title)}">
      <div class="detail-hero"><div class="hero-copy"><span class="eyebrow">${escape(topic.number)} — ${escape(topic.category)}</span><h1>${escape(topic.title)}</h1><p>${escape(topic.intro)}</p><span class="hero-date">${escape(topic.date)}</span><nav class="section-contents" aria-label="Сэдвийн хэсгүүд">${sections.map((section,i)=>`<button data-section-target="${section.id}"><span>${String(i+1).padStart(2,'0')}</span>${escape(section.title)}</button>`).join('')}</nav></div><div class="hero-image"><img src="${escape(topic.image)}" alt="${escape(topic.imageAlt)}" decoding="async"><span class="hero-image-note">${escape(topic.title)}</span></div></div>
      <div class="exhibit-content">${sections.map((s,i)=>renderSection(s,topic,i)).join('')}
      <footer class="museum-footer"><p class="museum-source">Эх сурвалж · «Монгол гүрний аж ахуй, соёл» · 4-р баг · х. ${sourcePages.join(', ')}</p><nav class="museum-topic-links" aria-label="Сэдэв хооронд шилжих">${index?`<button data-detail-topic="${index-1}"><span>← Өмнөх сэдэв</span>${escape(topics[index-1].title)}</button>`:''}${index<topics.length-1?`<button data-detail-topic="${index+1}"><span>Дараагийн сэдэв →</span>${escape(topics[index+1].title)}</button>`:'<button data-return-gallery><span>Үзэсгэлэн дууслаа</span>Үзэсгэлэнд буцах ↗</button>'}</nav></footer></div>
    </div>
    <dialog class="document-viewer" aria-labelledby="document-viewer-title"><header><h2 id="document-viewer-title"></h2><button data-viewer-action="close" aria-label="Зургийн үзүүлэлтийг хаах">×</button></header><div class="viewer-controls"><button data-viewer-action="out" aria-label="Жижигрүүлэх">−</button><output data-zoom-status>100%</output><button data-viewer-action="in" aria-label="Томруулах">+</button><button data-viewer-action="reset">Анхны хэмжээ</button></div><div class="document-image-wrap"><img alt=""></div></dialog>`;
  const events=new AbortController();
  let sectionMotion;
  article.addEventListener('click',event=>{
    const button=event.target.closest('[data-detail-topic]');if(button)onNavigate?.(Number(button.dataset.detailTopic));
    if(event.target.closest('[data-return-gallery]'))onBack?.();
    const target=event.target.closest('[data-section-target]');
    if(target){
      const section=article.querySelector(`#${target.dataset.sectionTarget}`);if(!section)return;
      sectionMotion?.cancel();section.scrollIntoView({block:'start',behavior:'instant'});
      section.querySelector('h2').focus({preventScroll:true});
      if(!matchMedia('(prefers-reduced-motion: reduce)').matches)sectionMotion=section.animate([{opacity:.25},{opacity:1}],{duration:400,easing:'ease-out'});
    }
  },{signal:events.signal});
  const unbind=bindLearning(article),closeViewer=bindViewer(article,events.signal);
  article.querySelector('.detail-scroll').scrollTo({top:0,behavior:'instant'});
  return()=>{sectionMotion?.cancel();events.abort();unbind();closeViewer();};
}
