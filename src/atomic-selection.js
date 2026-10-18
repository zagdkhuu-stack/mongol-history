// A selection commits its image, copy, tab state and accessibility state together.
// Last request wins; cancelled/departed views cannot commit a pending decode.
export function bindAtomicSelection(buttons,panels,{museum=false,onCommit=()=>{}}={}){
 let alive=true,revision=0,active=0,motion;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 panels.forEach((panel,i)=>{panel.inert=i!==0;panel.setAttribute('aria-hidden',String(i!==0));});
 async function fade(panel,from,to,duration){
  if(reduced())return;
  motion=panel.animate([{opacity:from},{opacity:to}],{duration,easing:'ease-in-out',fill:'forwards'});
  await motion.finished.catch(()=>{});
 }
 async function select(index,focus=false){
  const request=++revision;motion?.cancel();
  if(focus)buttons[index].focus({preventScroll:true});
  if(index===active)return;
  await Promise.all([...panels[index].querySelectorAll('img')].map(img=>{img.loading='eager';return img.decode().catch(()=>{});}));
  if(!alive||request!==revision||!panels[index].isConnected)return;
  await fade(panels[active],1,0,160);
  if(!alive||request!==revision)return;
  motion?.cancel();active=index;
  buttons.forEach((button,i)=>{
   const current=i===index;
   button.setAttribute('aria-selected',String(current));button.tabIndex=current?0:-1;
   if(museum)panels[i].classList.toggle('is-active',current);else panels[i].hidden=!current;
   panels[i].inert=!current;panels[i].setAttribute('aria-hidden',String(!current));
  });
  onCommit(index);
  await fade(panels[index],0,1,200);
  if(alive&&request===revision)motion?.cancel();
 }
 buttons.forEach((button,i)=>{
  button.onclick=()=>select(i);
  button.onkeydown=event=>{
   if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key))return;
   event.preventDefault();select(event.key==='Home'?0:event.key==='End'?buttons.length-1:(i+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1)+buttons.length)%buttons.length,true);
  };
 });
 return ()=>{alive=false;revision++;motion?.cancel();buttons.forEach(button=>{button.onclick=null;button.onkeydown=null;});};
}
