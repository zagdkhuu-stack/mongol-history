export function bindNavigation({element, canNavigate, move, enter, close}) {
  const cleanup=[];
  function listen(target,event,callback,options){target.addEventListener(event,callback,options);cleanup.push(()=>target.removeEventListener(event,callback,options));}
  let sum=0,lastEvent=0,lastStep=-Infinity,gestureUsed=false,start=null;
  listen(window,'wheel',event=>{
    if(!canNavigate())return;
    event.preventDefault();
    const now=performance.now();
    if(now-lastEvent>190){sum=0;gestureUsed=false;}
    lastEvent=now;
    if(gestureUsed||now-lastStep<850)return;
    sum+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
    if(Math.abs(sum)>45){move(Math.sign(sum));lastStep=now;gestureUsed=true;sum=0;}
  },{passive:false});
  listen(window,'keydown',event=>{
    if(event.key==='Escape'){close();return;}
    if(!canNavigate()||event.target.closest('input,textarea,select'))return;
    if(event.key==='Enter'&&event.target.closest('button,a'))return;
    if(['ArrowDown','ArrowRight','PageDown','ArrowUp','ArrowLeft','PageUp','Enter'].includes(event.key))event.preventDefault();
    if(['ArrowDown','ArrowRight','PageDown'].includes(event.key))move(1);
    if(['ArrowUp','ArrowLeft','PageUp'].includes(event.key))move(-1);
    if(event.key==='Enter'&&!event.target.closest('button,a'))enter();
  });
  listen(element,'touchstart',event=>{if(canNavigate())start={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
  listen(element,'touchmove',event=>{if(canNavigate())event.preventDefault();},{passive:false});
  listen(element,'touchend',event=>{
    if(!start||!canNavigate())return;
    const dx=start.x-event.changedTouches[0].clientX,dy=start.y-event.changedTouches[0].clientY;
    if(Math.max(Math.abs(dx),Math.abs(dy))>45)move(Math.sign(Math.abs(dy)>Math.abs(dx)?dy:dx));
    start=null;
  });
  return ()=>cleanup.forEach(fn=>fn());
}


