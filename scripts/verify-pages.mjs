import { chromium } from 'playwright';
import { preview } from 'vite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const server=process.argv[2]?null:await preview({preview:{host:'127.0.0.1',port:4173}});
const base=process.argv[2]||new URL('/mongol-history/',server.resolvedUrls.local[0]).href;
const browser=await chromium.launch({channel:process.platform==='win32'?'msedge':undefined});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
 await page.goto(base);await page.locator('#loader.loaded').waitFor({state:'attached'});
 for(let index=0;index<10;index++){
  await page.locator('#indexToggle').click();
  assert.equal(await page.locator('#indexLinks [data-topic]').count(),10);
  await page.locator(`#indexLinks [data-topic="${index}"]`).click();
  await page.waitForFunction(index=>document.querySelector('.topic-screen.focused')?.getAttribute('aria-label')?.startsWith(String(index+1).padStart(2,'0')),index);
  const img=page.locator('.topic-screen.focused img');
  await img.evaluate(el=>{el.loading='eager';return el.decode();});
  assert.ok((await img.getAttribute('src')).startsWith('/mongol-history/assets/optimized/'));
 }
 // Also request every PDF illustration, including currently hidden tab contents.
 const chapters=JSON.parse(await readFile(new URL('../src/pdf-chapters.json',import.meta.url),'utf8'));
 const assets=new Set();
 for(const chapter of Object.values(chapters))for(const section of chapter.sections){
  for(const image of section.images)assets.add(image.src);
  for(const item of section.crafts||[])assets.add(item.image.src);
 }
 for(const asset of assets){
  const response=await page.request.get(new URL(asset.slice(1),base).href);
  assert.equal(response.status(),200,asset);
  assert.ok(response.headers()['content-type'].startsWith('image/'),asset);
 }
 await page.locator('#indexToggle').click();await page.locator('#indexLinks [data-topic="3"]').click();
 await page.locator('#enterTopic').click();await page.locator('body.detail-open').waitFor();
 const tabs=page.locator('[data-pdf-page="8"] [role=tab]');
 for(let index=0;index<7;index++){
  await tabs.nth(index).click();
  await page.waitForFunction(index=>document.querySelector(`#artifact-tab-${index}`)?.getAttribute('aria-selected')==='true',index);
  await page.locator('.museum-panel.is-active img').first().evaluate(img=>img.decode());
 }
 await page.locator('[data-pdf-page="8"] .is-active [data-inspect]').click();
 await page.locator('dialog[open] img').evaluate(img=>img.decode());await page.keyboard.press('Escape');
 await page.locator('#nextDetail').scrollIntoViewIfNeeded();await page.locator('#nextDetail').click();
 await page.waitForURL('**/#topic/topic-5');await page.locator('.brand').click();await page.locator('#detail').waitFor({state:'hidden'});
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(let topic=1;topic<=10;topic++){
   await page.goto(`${base}#topic/topic-${topic}`);await page.locator('body.detail-open').waitFor();
   await page.locator('.detail-hero>img').evaluate(img=>img.decode());
   assert.equal(await page.locator('#detail h1').count(),1);
   assert.equal(await page.locator('#detail').evaluate(el=>el.scrollWidth>el.clientWidth),false);
   for(const img of await page.locator('#detail img:visible').all()){
    await img.evaluate(el=>{el.loading='eager';return el.decode();});
    assert.ok(new URL(await img.getAttribute('src'),base).pathname.startsWith('/mongol-history/'));
   }
  }
 }
 assert.deepEqual(errors,[]);
 console.log(`PASS ${base}: 10 homepage images, ${assets.size} PDF assets, all 10 topics desktop/mobile, artifact tabs, zoom, next-topic and logo navigation; no runtime errors or failed local assets.`);
}finally{
 await browser.close();
 if(server)await new Promise(resolve=>server.httpServer.close(resolve));
}
