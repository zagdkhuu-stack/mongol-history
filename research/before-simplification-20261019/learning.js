import {svgVisual} from './museum-visuals.js';
const escape=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function exhibitFigure(item,{inspect=false}={}){
  if(!item.image)return'';
  const img=`<img src="${escape(item.image)}" alt="${escape(item.imageAlt)}" width="${item.width}" height="${item.height}" loading="lazy" style="--native-width:${item.width}px">`;
  return`<figure class="exhibit-visual" style="--native-width:${item.width}px;--image-ratio:${item.width/item.height}">${inspect?`<button type="button" class="image-inspect" data-inspect aria-label="${escape(item.imageAlt)} — зургийг томруулж харах">${img}<span aria-hidden="true">&#8599;</span></button>`:img}<figcaption>Дүрслэлийн эх · х. ${item.imageSourcePage}</figcaption></figure>`;
}
export function renderLearning(exhibit){
  const{type,items,id,kind}=exhibit;
  const schematic=['seasons','ger','relay','exchange'].includes(type)?svgVisual(type,items.length):'';
  return`<div class="learning learning-${type} exhibit-${kind}" data-learning="${type}" data-exhibit-id="${id}">
    <div class="learning-controls" role="tablist" aria-label="${escape(exhibit.title)}">${items.map((item,i)=>`<button type="button" role="tab" id="${item.id}-tab" aria-controls="${item.id}-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-choice="${i}"><span>${String(i+1).padStart(2,'0')}</span>${escape(item.label)}</button>`).join('')}<span class="category-underline" aria-hidden="true"></span></div>
    <div class="learning-stage ${exhibit.selectorVisual?'has-context-visual':''}">${schematic}${exhibit.selectorVisual?exhibitFigure(exhibit.selectorVisual,{inspect:true}):''}<div class="learning-panels">${items.map((item,i)=>`<div role="tabpanel" id="${item.id}-panel" aria-labelledby="${item.id}-tab" aria-hidden="${i!==0}" tabindex="0" data-panel="${i}" data-item-id="${item.id}" data-source-page="${item.sourcePage}" class="${item.image?'has-image':'text-only'}" ${i?'hidden':''}>${exhibitFigure(item,{inspect:true})}<div class="panel-copy">${item.year||item.direction?`<span class="eyebrow">${escape(item.year||item.direction)}</span>`:''}<h3>${escape(item.title)}</h3>${item.details?`<ul class="artifact-details">${item.details.map(detail=>`<li>${escape(detail)}</li>`).join('')}</ul>`:`<p>${escape(item.description)}</p>`}</div></div>`).join('')}</div></div>
    ${type==='relay'?`<div class="relay-actions"><button type="button" data-relay-back disabled aria-label="Өмнөх алхам">←</button><span data-relay-counter>01 / ${String(items.length).padStart(2,'0')}</span><button type="button" data-relay-next aria-label="Дараагийн алхам">→</button></div>`:''}
  </div>`;
}
export function bindLearning(root){
  const events=new AbortController(),disposers=[];
  for(const widget of root.querySelectorAll('[data-learning]')){
    const tabs=[...widget.querySelectorAll('[role=tab]')],panels=[...widget.querySelectorAll('[data-panel]')];
    const controls=widget.querySelector('.learning-controls'),underline=widget.querySelector('.category-underline');
    let current=0,disposed=false;
    function alignUnderline(){if(disposed)return;const tab=tabs[current];underline.style.width=`${tab.offsetWidth}px`;underline.style.transform=`translate(${tab.offsetLeft}px,${tab.offsetTop+tab.offsetHeight}px)`;}
    function activate(index,focus=false){
      if(!Number.isInteger(index)||index<0||index>=tabs.length)return;
      current=index;widget.dataset.activeItem=panels[index].dataset.itemId;
      // Synchronous complete units; interrupted CSS fades reverse without stale callbacks.
      tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===current));tab.tabIndex=i===current?0:-1;});
      panels.forEach((panel,i)=>{panel.hidden=i!==current;panel.setAttribute('aria-hidden',String(i!==current));});
      widget.querySelectorAll('[data-node]').forEach(node=>node.classList.toggle('selected',Number(node.dataset.node)===current));
      const courier=widget.querySelector('.courier');if(courier)courier.setAttribute('transform',`translate(${90+240*current} 90)`);
      const back=widget.querySelector('[data-relay-back]');
      if(back){back.disabled=current===0;widget.querySelector('[data-relay-next]').disabled=current===tabs.length-1;widget.querySelector('[data-relay-counter]').textContent=`${String(current+1).padStart(2,'0')} / ${String(tabs.length).padStart(2,'0')}`;}
      alignUnderline();if(focus)tabs[current].focus({preventScroll:true});
    }
    widget.addEventListener('click',event=>{
      const choice=event.target.closest('[data-choice],[data-node],[data-relay-back],[data-relay-next]');if(!choice||!widget.contains(choice))return;
      activate(choice.hasAttribute('data-relay-back')?current-1:choice.hasAttribute('data-relay-next')?current+1:Number(choice.dataset.choice??choice.dataset.node));
    },{signal:events.signal});
    widget.addEventListener('keydown',event=>{
      const tab=event.target.closest('[role=tab]');if(!tab)return;const position=tabs.indexOf(tab);let next;
      if(['ArrowRight','ArrowDown'].includes(event.key))next=(position+1)%tabs.length;
      if(['ArrowLeft','ArrowUp'].includes(event.key))next=(position+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();activate(next,true);}
    },{signal:events.signal});
    const observer=new ResizeObserver(alignUnderline);observer.observe(controls);const frame=requestAnimationFrame(alignUnderline);document.fonts.ready.then(alignUnderline);activate(0);
    disposers.push(()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame);widget.getAnimations({subtree:true}).forEach(animation=>animation.cancel());});
  }
  return()=>{events.abort();disposers.forEach(dispose=>dispose());};
}
