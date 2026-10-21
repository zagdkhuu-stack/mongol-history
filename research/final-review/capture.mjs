import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const out='research/final-review/sections';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge'});
try{
 const page=await browser.newPage({reducedMotion:'reduce'});
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(let number=1;number<=10;number++){
   await page.goto(`http://127.0.0.1:5173/mongol-history/#topic/topic-${number}`);
   await page.waitForFunction(()=>document.querySelector('#detail')?.dataset.topic&&document.querySelector('#detail').inert===false&&getComputedStyle(document.querySelector('#loader')).visibility==='hidden');
   const sections=page.locator('.exhibit-section');
   for(let i=0;i<await sections.count();i++){
    const section=sections.nth(i);await section.scrollIntoViewIfNeeded();
    await section.evaluate(async el=>{for(const img of el.querySelectorAll('img')){img.loading='eager';await img.decode().catch(()=>{});}});
    await section.screenshot({path:`${out}/${number}-${i}-${width}.png`});
   }
  }
 }
 console.log('Captured all 39 sections at desktop and mobile sizes.');
}finally{await browser.close();}
