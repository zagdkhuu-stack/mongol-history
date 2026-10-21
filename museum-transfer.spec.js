import {test,expect} from '@playwright/test';
import {topics} from './src/museum-source-topics.js';
import {exhibitionsFor} from './src/museum-exhibition-data.js';

async function open(page,number){
 await page.goto(`./#topic/topic-${number}`);
 await expect(page.locator('#detail')).toHaveAttribute('data-topic',String(number).padStart(2,'0'));
 await expect(page.locator('#detail')).toHaveJSProperty('inert',false);
 await expect(page.locator('#loader')).toHaveCSS('visibility','hidden');
}
for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[375,812]]){
 test(`39 sections, selectors and image proportions at ${width}x${height}`,async({page})=>{
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});
  const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&r.url().includes('/assets/'))failed.push(r.url());});
  let count=0;
  for(const topic of topics){
   await open(page,Number(topic.number));
   await expect(page.locator('#detail h1')).toHaveText(topic.title);
   const sections=page.locator('.exhibit-section');await expect(sections).toHaveCount(topic.sections.length);
   const hero=await page.locator('.detail-hero').boundingBox();expect(hero.y).toBeGreaterThanOrEqual(80);
   await expect(page.locator('#indexToggle')).toBeVisible();
   await expect(page.locator('.detail-toolbar,.detail-nav')).toHaveCount(0);
   for(let i=0;i<topic.sections.length;i++){
    count++;const section=sections.nth(i);
    await page.locator(`.section-contents [data-section-target="${topic.id}-section-${i}"]`).click();
    expect((await section.locator('h2').boundingBox()).y).toBeGreaterThanOrEqual(80);
    for(const widget of await section.locator('[data-learning]').all()){
     for(const tab of await widget.locator('[role=tab]').all()){
      await tab.click();await expect(tab).toHaveAttribute('aria-selected','true');
      const panel=widget.locator('[role=tabpanel]:not([hidden])');await expect(panel).toHaveCount(1);
      await expect(panel.locator('h3')).not.toBeEmpty();
      expect(await tab.evaluate(el=>el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
      for(const hidden of await widget.locator('[role=tabpanel][hidden]').all())await expect(hidden).toHaveJSProperty('inert',true);
      for(const img of await panel.locator('img').all()){
       await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
      }
     }
    }
    for(const img of await section.locator('img:visible').all()){
     await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
     const ratio=await img.evaluate(el=>(el.clientWidth/el.clientHeight)/(el.naturalWidth/el.naturalHeight));
     expect(ratio).toBeGreaterThan(.98);expect(ratio).toBeLessThan(1.02);
    }
    expect(await page.locator('.detail-scroll').evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
   }
   if(width===390||width===1440){
    await page.locator('.detail-scroll').evaluate(el=>el.scrollTo(0,0));
    await page.screenshot({path:`research/final-review/topic-${topic.number}-${width}.png`});
   }
  }
  expect(count).toBe(39);expect(errors).toEqual([]);expect(failed).toEqual([]);
 });
}
test('all gallery entries, hamburger navigation, Back and exact logo route',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 await expect(page.locator('#loader')).toHaveCSS('visibility','hidden');
 await expect(page.locator('#indexLinks [data-topic]')).toHaveCount(10);
 await expect(page.locator('.topic-screen.focused')).toHaveCount(1);
 await expect(page.locator('canvas.architecture')).toBeVisible();
 await page.keyboard.press('ArrowDown');await expect(page.locator('#currentNumber')).toHaveText('02');
 await expect(page.locator('.topic-screen.focused')).toHaveAttribute('aria-label',/^02\./);
 await page.keyboard.press('ArrowUp');await expect(page.locator('#currentNumber')).toHaveText('01');
 for(let i=0;i<10;i++){
  await page.locator('#indexToggle').click();await page.locator(`#indexLinks [data-topic="${i}"]`).click();
  await page.locator('#enterTopic').click();await expect(page.locator('#detail')).toHaveAttribute('data-topic',String(i+1).padStart(2,'0'));
  await expect(page.locator('#detail')).toHaveJSProperty('inert',false);
  await page.locator('.brand').click();await expect(page).toHaveURL(/#gallery$/);
  await expect(page.locator('#detail')).toBeHidden();
 }
 await open(page,5);await page.locator('[data-detail-topic="5"]').click();await expect(page.locator('#detail')).toHaveAttribute('data-topic','06');
 await page.goBack();await expect(page.locator('#detail')).toHaveAttribute('data-topic','05');
 await page.locator('#indexToggle').click();await page.locator('#indexLinks [data-topic="7"]').click();
 await expect(page.locator('#detail')).toHaveAttribute('data-topic','08');
 await page.goBack();await expect(page.locator('#detail')).toHaveAttribute('data-topic','05');
});
test('keyboard, map points, image inspection and touch selection',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await open(page,2);const seasons=page.locator('.learning-seasons');
 await seasons.locator('[role=tab]').first().focus();await page.keyboard.press('End');
 await expect(seasons.locator('[role=tabpanel]:not([hidden]) h3')).toHaveText('Өвөл');
 await expect(seasons.locator('[role=tabpanel]:not([hidden]) img')).toHaveAttribute('src',/winter.webp/);
 await page.keyboard.press('Home');await expect(seasons.locator('[role=tabpanel]:not([hidden]) h3')).toHaveText('Хавар');
 await open(page,5);const map=page.locator('.learning-trade');
 await map.locator('[data-node="3"]').focus();await page.keyboard.press('Enter');
 await expect(map.locator('[role=tabpanel]:not([hidden]) h3')).toHaveText('Хятад');
 await open(page,6);await page.locator('[data-node="2"]').click();
 await expect(page.locator('.learning-relay [role=tabpanel]:not([hidden]) h3')).toHaveText('Морио солих');
 await page.locator('.layout-paiza [data-inspect]').click();const viewer=page.locator('.document-viewer');
 await expect(viewer).toBeVisible();await viewer.locator('[data-viewer-action=in]').click();await expect(viewer.locator('output')).toHaveText('125%');
 await page.keyboard.press('Escape');await expect(viewer).not.toBeVisible();await expect(page).toHaveURL(/#topic\/topic-6$/);
 await open(page,7);await page.locator('[data-node="4"]').click();
 await expect(page.locator('.learning-ger [role=tabpanel]:not([hidden]) h3')).toHaveText('Хаалга · урд');
 const context=await page.context().browser().newContext({hasTouch:true,viewport:{width:390,height:844},reducedMotion:'reduce'});
 try{const touch=await context.newPage();await touch.goto('http://127.0.0.1:5173/mongol-history/#topic/topic-4');await expect(touch.locator('#detail')).toHaveJSProperty('inert',false);await touch.locator('.learning-artifacts [role=tab]').nth(6).tap();await expect(touch.locator('.learning-artifacts [role=tabpanel]:not([hidden]) h3')).toHaveText('Шашин, зан үйлийн эд зүйлс');}finally{await context.close();}
});
test('rapid changes dispose observers and preserve coherent panels',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{const Native=ResizeObserver;window.liveObservers=new Set();window.ResizeObserver=class extends Native{observe(el,...args){window.liveObservers.add(this);return super.observe(el,...args);}disconnect(){window.liveObservers.delete(this);return super.disconnect();}};});
 await open(page,4);
 await page.locator('.learning-artifacts').evaluate(el=>{for(let i=0;i<70;i++)el.querySelectorAll('[role=tab]')[i%7].click();});
 await expect(page.locator('.learning-artifacts [role=tabpanel]:not([hidden]) h3')).toHaveText('Шашин, зан үйлийн эд зүйлс');
 await page.evaluate(()=>{for(let i=0;i<30;i++)document.querySelector('[data-detail-topic="'+(i%2?3:4)+'"]')?.click();});
 await expect(page.locator('#detail')).toHaveJSProperty('inert',false);await expect(page.locator('#detail h1')).toHaveCount(1);
 expect(await page.evaluate(()=>window.liveObservers.size)).toBe(await page.locator('[data-learning]').count());
 await page.locator('.brand').click();expect(await page.evaluate(()=>window.liveObservers.size)).toBe(0);expect(errors).toEqual([]);
});
test('source presentation retains all original sections and required facts',()=>{
 expect(topics.reduce((sum,t)=>sum+exhibitionsFor(t).length,0)).toBe(39);
 const text=JSON.stringify(topics.map(exhibitionsFor));
 for(const fact of ['1206','30–40','Тататунга','1240','1269','1254','Ганлин','Марага','ат-Туси','Хөх дэвтэр','татвар','цаасан мөнгө','болзошгүй'])expect(text).toContain(fact);
});
