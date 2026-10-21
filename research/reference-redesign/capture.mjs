import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const dir='research/reference-redesign/previews';await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'msedge'}),page=await browser.newPage({reducedMotion:'reduce'});
try{
 for(const [width,height]of [[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[375,667]]){
  await page.setViewportSize({width,height});
  for(const number of [1,2,3,4,6,7,8,9,10]){
   await page.goto(`http://127.0.0.1:5173/mongol-history/#topic/topic-${number}`);
   await page.locator('.detail-scroll').waitFor();await page.evaluate(()=>document.fonts.ready);
   const heading=page.locator('.exhibit-section').nth(number===3?0:1).locator('h2');await heading.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   await page.evaluate(async()=>{const images=[...document.querySelectorAll('.exhibit-section img')];for(const img of images){img.loading='eager';await img.decode().catch(()=>{});}});
   await page.screenshot({path:`${dir}/topic-${number}-${width}x${height}.png`});
   if(number===3){await page.locator('.detail-scroll').evaluate(el=>el.scrollTo(0,0));await page.screenshot({path:`${dir}/hero-3-${width}x${height}.png`});}
  }
 }
 console.log('Captured 63 topic selector previews and 7 Topic 03 hero previews, all on port 5173.');
}finally{await browser.close();}
