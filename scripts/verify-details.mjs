import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import chapters from '../src/pdf-chapters.json' with { type: 'json' };

const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[];
try {
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  for(let topic=1;topic<=10;topic++){
   await page.goto(`http://127.0.0.1:5174/#topic/topic-${topic}`);
   await page.locator('body.detail-open').waitFor();
   assert.equal(await page.locator('#indexToggle').isVisible(),false);
   assert.equal(await page.locator('.masthead').evaluate(el=>getComputedStyle(el).borderBottomWidth),'0px');
   assert.equal(await page.locator('.pdf-slide').count(),0);
   const hero=page.locator('.detail-hero>img');
   assert.equal(await hero.getAttribute('src'),`/assets/optimized/${String(topic).padStart(2,'0')}.jpg`);
   const expected=chapters[topic]?.sections.map(s=>s.page)||[];
   assert.deepEqual(await page.locator('[data-pdf-page]').evaluateAll(els=>els.map(e=>Number(e.dataset.pdfPage))),expected);
   assert.equal(await page.locator('#detail').evaluate(el=>el.scrollWidth>el.clientWidth),false);
   for(const img of await page.locator('.chapter-figures img, .chapter-panel:visible img').all()){
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(el=>el.decode());
    assert.ok(await img.evaluate(el=>el.naturalWidth>0));
    assert.ok(await img.evaluate(el=>getComputedStyle(el).objectFit==='contain'));
   }
   if(topic===4){
    const tabs=page.locator('[data-pdf-page="8"] [role=tab]');
    assert.equal(await tabs.count(),7);
    for(let i=0;i<7;i++){
     await tabs.nth(i).click();
     assert.equal(await tabs.nth(i).getAttribute('aria-selected'),'true');
     const panel=page.locator('[data-pdf-page="8"] [role=tabpanel]:visible');
     assert.equal(await panel.count(),1);
     await panel.locator('img').evaluate(el=>el.decode());
     assert.ok((await panel.locator('img').getAttribute('src')).includes(`figure-${String(i+1).padStart(2,'0')}`));
    }
    await tabs.nth(0).focus();await page.keyboard.press('ArrowDown');
    assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');
   }
   if(topic===5){assert.equal(await page.locator('.sources').count(),1);assert.equal(await page.locator('.pdf-chapter').count(),0);}
   await page.locator('#nextDetail').scrollIntoViewIfNeeded();
   await page.locator('#nextDetail').click();
   if(topic<10) await page.waitForURL(`**/#topic/topic-${topic+1}`);
   else await page.locator('#detail').waitFor({state:'hidden'});
   if(topic<10){await page.locator('.brand').click();await page.locator('#detail').waitFor({state:'hidden'});}
   await page.locator('#indexToggle').click();
   assert.equal(await page.locator('#indexLinks button').count(),10);
   await page.locator('#closeIndex').click();
  }
  await page.goto('http://127.0.0.1:5174/#topic/topic-6');
  await page.locator('body.detail-open').waitFor();
  await page.locator('[data-pdf-page="17"]').scrollIntoViewIfNeeded();
  await page.locator('[data-pdf-page="17"] img').evaluate(el=>el.decode());
  await page.screenshot({path:`test-results/detail-${viewport.width}.png`});
  await page.close();
 }
 const motionPage=await browser.newPage();
 await motionPage.goto('http://127.0.0.1:5174/#topic/topic-1');
 await motionPage.locator('body.detail-open').waitFor();
 await motionPage.locator('.pdf-section').first().scrollIntoViewIfNeeded();
 await motionPage.locator('.pdf-visible').first().waitFor();
 assert.equal(await motionPage.locator('.pdf-section').first().evaluate(el=>getComputedStyle(el).transitionDuration),'0.5s, 0.5s');
 await motionPage.close();
 assert.deepEqual(errors,[]);
 fs.writeFileSync('test-results/detail-verification.json',JSON.stringify({topics:10,viewports:[1440,390],mapping:true,images:true,navigation:true,errors},null,2));
 console.log('PASS: all 10 topics at desktop and mobile sizes; mapping, hero images, image ratios, menu, logo, next navigation, motion, and console.');
}finally{await browser.close();}
