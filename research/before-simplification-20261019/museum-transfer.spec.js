import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const expected=JSON.parse(fs.readFileSync('research/museum-transfer/expected.json','utf8'));
async function open(page,number){await page.goto(`./#topic/topic-${number}`);await expect(page.locator('body')).toHaveClass(/detail-open/);await page.evaluate(()=>document.fonts.ready);await expect(page.locator('#detail')).toHaveJSProperty('inert',false);}
for(const [width,height]of [[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[375,667]]){
 test(`all museum sections and selectors at ${width}x${height}`,async({page})=>{
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));let count=0;
  for(const topic of expected.filter(t=>t.number!=='05')){
   await open(page,Number(topic.number));await expect(page.locator('#detail h1')).toHaveText(topic.title);
   const hero=page.locator('.hero-image img');await expect(hero).toHaveAttribute('src',`/mongol-history/assets/optimized/${topic.number}.jpg`);
   const nav=page.locator('.detail-nav'),scroller=page.locator('.detail-scroll');const navBox=await nav.boundingBox();
   expect((await scroller.boundingBox()).y).toBeGreaterThanOrEqual(navBox.height-.5);
   for(const exhibit of topic.sections){count++;
    const section=page.locator(`[data-section-id="${exhibit.id}"]`),heading=section.locator('h2');await heading.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    expect((await heading.boundingBox()).y).toBeGreaterThanOrEqual(navBox.height-.5);
    for(const widget of await section.locator('[data-learning]').all())for(const tab of await widget.locator('[role=tab]').all()){
     await tab.click();const item=exhibit.items[Number(await tab.getAttribute('data-choice'))],panel=widget.locator('[role=tabpanel][aria-hidden=false]');
     await expect(panel.locator('h3')).toHaveText(item.title);if(item.details)await expect(panel.locator('li')).toHaveText(item.details);else await expect(panel.locator('p')).toHaveText(item.description);
     if(item.image)await expect(panel.locator('img')).toHaveAttribute('src','/mongol-history'+item.image);else await expect(panel.locator('img')).toHaveCount(0);
     const box=await tab.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44);expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width+.5);
    }
    for(const img of await section.locator('img:visible').all()){
     await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
     const box=await img.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width+.5);
     const ratio=await img.evaluate(el=>(el.clientWidth/el.clientHeight)/(el.naturalWidth/el.naturalHeight));expect(ratio).toBeGreaterThan(.98);expect(ratio).toBeLessThan(1.02);
    }
    expect(await scroller.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
    expect(await page.locator('#detail').evaluate(el=>el.scrollTop)).toBe(0);
   }
  }
  expect(count).toBe(35);expect(errors).toEqual([]);
 });
}
test('rapid selectors and detail navigation stay stationary; browser Back and gallery return work',async({page})=>{
 await open(page,4);const widget=page.locator('.learning-artifacts');await widget.scrollIntoViewIfNeeded();
 const heading=page.locator('.exhibit-section').first().locator('h2'),before=await heading.boundingBox();
 await widget.evaluate(el=>{const tabs=el.querySelectorAll('[role=tab]');for(let i=0;i<50;i++)tabs[i%7].click();tabs[5].click();});
 await expect(widget.locator('[role=tabpanel][aria-hidden=false] h3')).toHaveText(expected.find(t=>t.number==='04').sections[0].items[5].title);await page.waitForTimeout(500);
 expect(Math.abs((await heading.boundingBox()).y-before.y)).toBeLessThan(1);
 const transforms=await widget.evaluate(el=>[el,...el.querySelectorAll('[role=tabpanel],.panel-copy')].map(x=>getComputedStyle(x).transform));expect(transforms.every(x=>x==='none'||x==='matrix(1, 0, 0, 1, 0, 0)')).toBe(true);
 await page.locator('[data-detail-topic="4"]').click();await expect(page.locator('#detail .detail-view')).toBeVisible();await expect(page.locator('#detail')).not.toHaveAttribute('data-exhibition');
 await page.goBack();await expect(page.locator('#detail')).toHaveAttribute('data-topic','04');await expect(page.locator('.detail-scroll')).toHaveJSProperty('scrollTop',0);
 await page.locator('.brand').click();await expect(page.locator('body')).not.toHaveClass(/detail-open/);
 await page.locator('#indexToggle').click();await page.locator('#indexLinks [data-topic="1"]').click();await page.locator('#enterTopic').click();await expect(page.locator('#detail')).toHaveAttribute('data-topic','02');
 await page.locator('[data-detail-topic="2"]').click();await expect(page.locator('#detail')).toHaveAttribute('data-topic','03');await page.goBack();await expect(page.locator('#detail')).toHaveAttribute('data-topic','02');
 await page.locator('[data-detail-topic="2"]').click();await expect(page.locator('#detail')).toHaveAttribute('data-topic','03');await page.locator('.brand').click();await expect(page.locator('body')).not.toHaveClass(/detail-open/);await expect(page).toHaveURL(/#gallery/);
});
test('all ten homepage topics open and the existing Topic 05 next control still works',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');await expect(page.locator('#loader')).toHaveClass(/loaded/);
 for(let i=0;i<10;i++){
  await page.locator('#indexToggle').click();await page.locator(`#indexLinks [data-topic="${i}"]`).click();await page.locator('#enterTopic').click();await expect(page.locator('body')).toHaveClass(/detail-open/);
  await expect(page.locator('#detail .detail-hero img')).toHaveAttribute('src',`/mongol-history/assets/optimized/${String(i+1).padStart(2,'0')}.jpg`);
  if(i===4){await page.locator('#nextDetail').click();await expect(page.locator('#detail')).toHaveAttribute('data-topic','06');}
  await page.locator('.brand').click();
  await expect(page.locator('body')).not.toHaveClass(/detail-open/);
 }
});
test('image viewer and keyboard selectors work on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await open(page,8);
 const widget=page.locator('.learning-scripts');await widget.locator('[role=tab]').first().focus();await page.keyboard.press('End');await expect(widget.locator('[role=tab]').last()).toHaveAttribute('aria-selected','true');
 await widget.locator('[aria-hidden=false] [data-inspect]').click();const viewer=page.locator('.document-viewer');await expect(viewer).toBeVisible();await expect(viewer.locator('img')).toHaveAttribute('src',/phags-pa/);
 await viewer.locator('[data-viewer-action=in]').click();await expect(viewer.locator('output')).toHaveText('125%');await page.keyboard.press('Escape');await expect(viewer).not.toBeVisible();await expect(page).toHaveURL(/#topic\/topic-8$/);
});

