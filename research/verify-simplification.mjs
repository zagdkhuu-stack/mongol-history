import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {chromium} from '@playwright/test';
const hashes=JSON.parse(await fs.readFile('research/before-simplification-20261019/protected.json','utf8'));
for(const [file,expected]of Object.entries(hashes))if(crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')!==expected)throw Error('Protected file changed: '+file);
const browser=await chromium.launch({channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
try{
 await page.goto('http://127.0.0.1:5173/mongol-history/');await page.locator('#loader.loaded').waitFor({state:'attached'});await page.evaluate(()=>document.fonts.ready);
 const gallery=await page.evaluate(()=>({html:document.querySelector('#galleryUI').innerHTML,images:[...document.querySelectorAll('.topic-screen img')].map(x=>x.getAttribute('src')),styles:['#gallery','.masthead','#galleryUI','.topic-screen'].map(s=>({selector:s,styles:[...getComputedStyle(document.querySelector(s))].map(k=>[k,getComputedStyle(document.querySelector(s)).getPropertyValue(k)])}))}));
 const before=JSON.parse(await fs.readFile('research/museum-transfer/gallery-after.json','utf8'));
 if(JSON.stringify(gallery)!==JSON.stringify(before))throw Error('Homepage changed');
 await page.goto('http://127.0.0.1:5173/mongol-history/#topic/topic-5');await page.locator('body.detail-open').waitFor();await page.waitForTimeout(250);
 const topic5=await page.evaluate(()=>({html:document.querySelector('#detail').innerHTML,hero:document.querySelector('#detail .detail-hero img').getAttribute('src'),styles:[...document.querySelectorAll('#detail,#detail .detail-hero,#detail h1,#detail .reading')].map(el=>({tag:el.tagName,styles:[...getComputedStyle(el)].map(k=>[k,getComputedStyle(el).getPropertyValue(k)])}))}));
 const before5=JSON.parse(await fs.readFile('research/museum-transfer/topic5-after.json','utf8'));
 if(JSON.stringify(topic5)!==JSON.stringify(before5))throw Error('Topic 05 changed');
 const result=await page.evaluate(async()=>{
  const {topics}=await import('/mongol-history/src/museum-topics.js');const {buildExhibitions}=await import('/mongol-history/src/exhibits.js');
  return topics.map(t=>({number:t.number,title:t.title,sections:buildExhibitions(t)}));
 });
 await fs.writeFile('research/simplification-content-map.json',JSON.stringify(result,null,2));
 await fs.writeFile('research/museum-transfer/expected.json',JSON.stringify(result,null,2).replaceAll('/mongol-history/assets/','/assets/'));
 if(result.flatMap(t=>t.sections).length!==28||result.flatMap(t=>t.sections).filter(s=>s.interactive).length!==5)throw Error('Unexpected section/category count');
 const facts={
  '01':['1206'],
  '03':['хатааж','ааруул','исгэсэн гүүний сүү','Зэрлэг ургамал','хуваарилах','Хятад, Перс, Төв Азийн'],
  '04':['1235','нийслэл биш','сумны үзүүр','мөнгөн мод'],
  '06':['30–40','хэт ядраахаас','гэрэгэ','Самарканд'],
  '07':['бөгтөг','босго гишгэх','Хүүхдүүд','данх','Юань'],
  '08':['1204','1240','1269','Лодойжалцан','Хөх дэвтэр','тооллого','Тататунга'],
  '09':['1254','Насир ад-Дин','несториан','луужин','Төвөдөөс'],
  '10':['XIV','болзошгүй','Юань','Алтан утас']
 };
 for(const [number,words]of Object.entries(facts)){
  await page.goto(`http://127.0.0.1:5173/mongol-history/#topic/topic-${Number(number)}`);await page.locator('.exhibit-content').waitFor();
  const text=await page.locator('.exhibit-content').textContent();for(const word of words)if(!text.toLowerCase().includes(word.toLowerCase()))throw Error(`Missing retained fact in ${number}: ${word}`);
  for(const section of await page.locator('.exhibit-section').all())if(await section.locator('img:visible').count()>1)throw Error('More than one main image');
 }
 console.log('PASS: protected files, homepage DOM/styles/images, Topic 05 DOM/styles/hero, retained fact checks, 28 sections and 5 genuine category selectors. All checks used port 5173.');
}finally{await browser.close();}
