import {svgVisual} from './museum-visuals.js';
const escape=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function exhibitFigure(item,{inspect=false}={}){
  if(!item.image)return'';
  const img=`<img src="${escape(item.image)}" ${item.srcset?`srcset="${escape(item.srcset)}" sizes="(max-width:767px) calc(100vw - 40px), 55vw"`:''} alt="${escape(item.imageAlt)}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async" style="--native-width:${item.width}px">`;
  return`<figure class="exhibit-visual" style="--native-width:${item.width}px;--image-ratio:${item.width/item.height}">${inspect?`<button type="button" class="image-inspect" data-inspect aria-label="${escape(item.imageAlt)} — зургийг томруулж харах">${img}</button>`:img}<figcaption>${escape(item.imageAlt)}</figcaption></figure>`;
}
export function renderLearning(exhibit){
  const{type,items,id,kind}=exhibit;
  return`<div class="learning learning-${type} exhibit-${kind}" data-learning="${type}" data-exhibit-id="${id}">
    ${exhibit.map?`<div class="interactive-diagram">${svgVisual(exhibit.map).replace('role="img"','role="group"').replace(/data-node="(\d+)"/g,(_,i)=>`data-node="${i}" role="button" tabindex="0" aria-label="${escape(items[Number(i)].title)}" aria-pressed="${Number(i)===0}"`).replace(/(<g [^>]*data-node[^>]*>)/g,'$1<circle class="node-target" r="48"/>')}</div>`:''}
    <div class="learning-controls" role="tablist" aria-label="${escape(exhibit.title)}">${items.map((item,i)=>`<button type="button" role="tab" id="${item.id}-tab" aria-controls="${item.id}-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-choice="${i}"><span>${String(i+1).padStart(2,'0')}</span>${escape(item.label)}</button>`).join('')}<span class="category-underline" aria-hidden="true"></span></div>
    <div class="learning-stage ${exhibit.selectorVisual?'has-context-visual':''}">${exhibit.selectorVisual?exhibitFigure(exhibit.selectorVisual,{inspect:true}):''}<div class="learning-panels">${items.map((item,i)=>`<div role="tabpanel" id="${item.id}-panel" aria-labelledby="${item.id}-tab" aria-hidden="${i!==0}" tabindex="0" data-panel="${i}" data-item-id="${item.id}" data-source-page="${item.sourcePage}" class="${item.image?'has-image':'text-only'}" ${i?'hidden inert':''}>${exhibitFigure(item,{inspect:true})}<div class="panel-copy">${item.year||item.direction?`<span class="eyebrow">${escape(item.year||item.direction)}</span>`:''}<h3>${escape(item.title)}</h3>${item.details?`<ul class="artifact-details">${item.details.map(detail=>`<li>${escape(detail)}</li>`).join('')}</ul>`:`<p>${escape(item.description)}</p>`}</div></div>`).join('')}</div></div>
  </div>`;
}
export function bindLearning(root){
  const events=new AbortController(),disposers=[];
  for(const widget of root.querySelectorAll('[data-learning]')){
    const tabs=[...widget.querySelectorAll('[role=tab]')],panels=[...widget.querySelectorAll('[data-panel]')];
    let current=0;
    let disposed=false;
    const controls=widget.querySelector('.learning-controls'),underline=widget.querySelector('.category-underline');
    function alignUnderline(){if(disposed)return;const tab=tabs[current];underline.style.width=`${tab.offsetWidth}px`;underline.style.transform=`translate(${tab.offsetLeft}px,${tab.offsetTop+tab.offsetHeight}px)`;}
    function activate(index,focus=false){
      if(!Number.isInteger(index)||index<0||index>=tabs.length)return;
      current=index;widget.dataset.activeItem=panels[index].dataset.itemId;
      // One state update replaces the entire image/title/description unit.
      tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===current));tab.tabIndex=i===current?0:-1;});
      panels.forEach((panel,i)=>{panel.hidden=i!==current;panel.inert=i!==current;panel.setAttribute('aria-hidden',String(i!==current));});
      widget.querySelectorAll('[data-node]').forEach(node=>{const active=Number(node.dataset.node)===current;node.classList.toggle('selected',active);node.setAttribute('aria-pressed',String(active));});
      alignUnderline();
      if(focus)tabs[current].focus({preventScroll:true});
    }
    widget.addEventListener('click',event=>{
      const choice=event.target.closest('[data-choice],[data-node]');if(choice&&widget.contains(choice))activate(Number(choice.dataset.choice??choice.dataset.node));
    },{signal:events.signal});
    widget.addEventListener('keydown',event=>{
      const node=event.target.closest('[data-node]');if(node&&['Enter',' '].includes(event.key)){event.preventDefault();activate(Number(node.dataset.node));return;}
      const tab=event.target.closest('[role=tab]');if(!tab)return;const position=tabs.indexOf(tab);let next;
      if(['ArrowRight','ArrowDown'].includes(event.key))next=(position+1)%tabs.length;
      if(['ArrowLeft','ArrowUp'].includes(event.key))next=(position+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();activate(next,true);}
    },{signal:events.signal});
    activate(0);
    const observer=new ResizeObserver(alignUnderline);observer.observe(controls);
    const frame=requestAnimationFrame(alignUnderline);document.fonts.ready.then(alignUnderline);
    disposers.push(()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame);});
  }
  return()=>{events.abort();disposers.forEach(dispose=>dispose());};
}
