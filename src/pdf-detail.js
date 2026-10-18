import chapters from './pdf-chapters.json';
import './pdf-detail.css';
import { renderTopicFour, initTopicFour } from './topic-four.js';
import { imageAssociations, associatedImages } from './pdf-associations.js';
import { bindAtomicSelection } from './atomic-selection.js';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function chapterFor(index) { return chapters[String(index + 1)]; }
const paragraphs = values => values.map(value=>`<p>${escape(value)}</p>`).join('');
const figure = (image,title='')=>`<figure><a href="${image.src}" target="_blank" rel="noopener"><img src="${image.src}" width="${image.width}" height="${image.height}" alt="${escape(title)}" loading="lazy" decoding="async"></a></figure>`;
function selections(section){
 const bindings=imageAssociations[section.page]?.groups;
 const items=section.crafts||(bindings?bindings.map(binding=>({text:[binding.heading,...section.groups[binding.textGroup]],images:associatedImages(section,binding.images)})):section.groups.map(text=>({text,images:[]})));
 const id=`page-${section.page}`;
 return `<div class="chapter-explorer"><div class="chapter-choices" role="tablist" aria-label="${escape(section.heading||items[0].text[0])}" aria-orientation="vertical">${items.map((item,i)=>`<button type="button" role="tab" id="${id}-tab-${i}" aria-controls="${id}-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}"><span>${escape(item.text[0])}</span><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="chapter-panels">${items.map((item,i)=>`<div class="chapter-panel" role="tabpanel" id="${id}-panel-${i}" aria-labelledby="${id}-tab-${i}" tabindex="0" ${i?'hidden':''}><div class="content-unit ${(item.images?.length||item.image)?'with-image':''}"><div><h3>${escape(item.text[0])}</h3>${paragraphs(item.text.slice(1))}</div><div class="unit-images">${(item.images||[item.image].filter(Boolean)).map(image=>figure(image,item.text[0])).join('')}</div></div></div>`).join('')}</div></div>`;
}
export function renderChapter(chapter) {
 if(chapter.pages[0]===8)return renderTopicFour(chapter);
 return `<div class="pdf-chapter">${chapter.sections.map(section=>{const images=associatedImages(section);return `<section class="pdf-section chapter-${section.layout}" data-pdf-page="${section.page}"><div class="chapter-inner">${section.heading?`<h2>${escape(section.heading)}</h2>`:''}${section.groups?selections(section):`<div class="content-unit ${images.length?'with-image':''} ${!section.paragraphs.length&&!section.table?'image-only':''}"><div>${paragraphs(section.paragraphs)}${section.table?`<table><thead><tr>${section.table.head.map(value=>`<th scope="col">${escape(value)}</th>`).join('')}</tr></thead><tbody>${section.table.rows.map(row=>`<tr><th scope="row">${escape(row[0])}</th><td>${escape(row[1])}</td></tr>`).join('')}</tbody></table>`:''}</div><div class="unit-images">${images.map(image=>figure(image,section.heading)).join('')}</div></div>`}</div></section>`;}).join('')}</div>`;
}
let observer;
let disposeTopic=()=>{};
export function destroyChapter(detail){
 observer?.disconnect();observer=undefined;
 disposeTopic();disposeTopic=()=>{};
 detail.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
 detail.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
}
export function observeChapter(detail) {
  destroyChapter(detail);
  const cleanups=[initTopicFour(detail)||(()=>{})];
  disposeTopic=()=>cleanups.forEach(cleanup=>cleanup());
  detail.querySelectorAll('.chapter-explorer').forEach(explorer=>{
    explorer.querySelector('[role="tablist"]').setAttribute('aria-orientation',matchMedia('(max-width:760px)').matches?'horizontal':'vertical');
    const tabs=[...explorer.querySelectorAll('[role="tab"]')],panels=[...explorer.querySelectorAll('[role="tabpanel"]')];
    cleanups.push(bindAtomicSelection(tabs,panels));
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const activeObserver = new IntersectionObserver(entries => {
    if(observer!==activeObserver)return;
    entries.forEach(entry => {
      if (entry.isIntersecting&&detail.contains(entry.target)) {
        entry.target.classList.add('pdf-visible');
        activeObserver.unobserve(entry.target);
      }
    });
  }, {root:detail, threshold:0, rootMargin:'0px 0px -30px 0px'});
  observer=activeObserver;
  detail.querySelectorAll('.pdf-section').forEach(section => {
    section.classList.add('pdf-reveal');
    observer.observe(section);
  });
}
