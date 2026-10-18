import { test, expect } from '@playwright/test';
import chapters from './src/pdf-chapters.json' with { type: 'json' };
test('rapid topic changes and artifact changes stay stationary and synchronized',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{
  window.__liveObservers=new Set();
  for(const name of ['IntersectionObserver','ResizeObserver']){
   const Native=window[name];
   window[name]=class extends Native{
    observe(target,...args){window.__liveObservers.add(this);return super.observe(target,...args);}
    disconnect(){window.__liveObservers.delete(this);return super.disconnect();}
   };
  }
 });
 for(const width of [1440,1024,390]){
  await page.setViewportSize({width,height:900});
  await page.goto('./');await expect(page.locator('#loader')).toHaveClass(/loaded/);
  await page.locator('#indexToggle').click();await page.locator('#indexLinks [data-topic="3"]').click();
  await page.locator('#enterTopic').click();await expect(page.locator('body')).toHaveClass(/detail-open/);
  await expect(page.locator('.museum-four')).toHaveCount(1);
  const tabs=page.locator('[data-pdf-page="8"] [role=tab]');
  await tabs.nth(0).scrollIntoViewIfNeeded();
  const sampled=await page.evaluate(async()=>{
   const scene=document.querySelector('[data-pdf-page="8"]');
   const tabs=[...scene.querySelectorAll('[role=tab]')];
   const failures=[];
   const sample=()=>{
    const selected=tabs.findIndex(tab=>tab.getAttribute('aria-selected')==='true');
    const active=[...scene.querySelectorAll('.museum-panel.is-active')];
    if(active.length!==1||active[0].id!==`artifact-panel-${selected}`)failures.push('category/panel mismatch');
    if(active[0]&&!active[0].querySelector('img').src.includes(`figure-${String(selected+1).padStart(2,'0')}`))failures.push('wrong image');
    for(const element of [scene,...scene.querySelectorAll('.museum-panel,.museum-copy')]){
     const matrix=getComputedStyle(element).transform;
     if(matrix!=='none'&&matrix!=='matrix(1, 0, 0, 1, 0, 0)')failures.push('content moved');
    }
   };
   const timer=setInterval(sample,8);
   for(const index of [6,1,4,2,5,0,3,6,2]){tabs[index].click();await new Promise(resolve=>setTimeout(resolve,25));}
   await new Promise(resolve=>setTimeout(resolve,600));clearInterval(timer);sample();return failures;
  });
  expect(sampled).toEqual([]);await expect(tabs.nth(2)).toHaveAttribute('aria-selected','true');
  await page.locator('#detail').evaluate(el=>el.scrollTo({top:1300,behavior:'instant'}));
  await page.evaluate(()=>{location.hash='#topic/topic-9';});
  await expect(page.locator('#detail h1')).toContainText('Шашин');
  expect(await page.locator('#detail').evaluate(el=>el.scrollTop)).toBe(0);
  await expect(page.locator('.museum-four')).toHaveCount(0);
  await expect(page.locator('.detail-view')).toHaveCount(1);
  await page.evaluate(async()=>{
   for(const topic of [2,8,4,6,9,7]){location.hash=`#topic/topic-${topic}`;await new Promise(resolve=>setTimeout(resolve,25));}
  });
  await expect(page.locator('#detail h1')).toHaveText('Эдийн соёл, өдөр тутмын ахуй');
  const clothing=page.locator('[data-pdf-page="20"] [role=tab]').nth(1);
  await clothing.click();await expect(clothing).toHaveAttribute('aria-selected','true');
  const panel=page.locator('[data-pdf-page="20"] [role=tabpanel]:visible');
  await expect(panel.locator('h3')).toHaveText('Хувцас');
  await expect(panel.locator('img')).toHaveAttribute('src',/page-20-figure-02/);
  const housing=page.locator('[data-pdf-page="20"] [role=tab]').nth(0);
  await housing.click();await expect(housing).toHaveAttribute('aria-selected','true');
  await expect(panel.locator('h3')).toHaveText('Орон сууц: гэр');
  await expect(panel.locator('img')).toHaveAttribute('src',/page-20-figure-01/);
  expect(await page.locator('#detail').evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(false);
  await panel.scrollIntoViewIfNeeded();await panel.locator('img').evaluate(img=>img.decode());
  await page.waitForTimeout(400);await page.screenshot({path:`test-results/synchronization-${width}.png`});
  await page.locator('.brand').click();await expect(page.locator('#detail')).toBeHidden();
  await expect(page.locator('.detail-view')).toHaveCount(0);
  expect(await page.evaluate(()=>window.__liveObservers.size)).toBe(0);
 }
 expect(errors).toEqual([]);
});
test('topic 04 museum selection, image viewer, keyboard and responsive layout',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('./#topic/topic-4');await expect(page.locator('body')).toHaveClass(/detail-open/);
 await expect(page.locator('.detail-hero>img')).toHaveAttribute('src','/mongol-history/assets/optimized/04.jpg');
 await expect(page.locator('.museum-scene')).toHaveCount(3);
 const tabs=page.locator('[data-pdf-page="8"] [role=tab]');
 await expect(tabs).toHaveCount(7);
 const stage=page.locator('[data-pdf-page="8"] .museum-stage');
 let stableHeight;
 for(let i=0;i<7;i++){
  await tabs.nth(i).click();await expect(tabs.nth(i)).toHaveAttribute('aria-selected','true');
  const panel=page.locator('[data-pdf-page="8"] .museum-panel.is-active');
  await expect(panel).toHaveCount(1);await panel.locator('img').evaluate(el=>el.decode());
  await expect(panel.locator('img')).toHaveAttribute('src',new RegExp(`figure-${String(i+1).padStart(2,'0')}`));
  const height=await stage.evaluate(el=>el.getBoundingClientRect().height);
  if(stableHeight===undefined)stableHeight=height;
  expect(Math.abs(height-stableHeight)).toBeLessThan(1);
 }
 await tabs.nth(0).focus();await page.keyboard.press('ArrowRight');await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
 await page.keyboard.press('End');await expect(tabs.nth(6)).toHaveAttribute('aria-selected','true');
 const inspect=page.locator('[data-pdf-page="8"] .is-active [data-inspect]');
 await inspect.click();const viewer=page.locator('.museum-viewer');await expect(viewer).toBeVisible();
 await viewer.locator('img').evaluate(el=>el.decode());
 await page.keyboard.press('Tab');await expect(viewer.locator('button')).toBeFocused();
 await page.keyboard.press('Escape');await expect(viewer).not.toBeVisible();await expect(page.locator('#detail')).toBeVisible();await expect(inspect).toBeFocused();
 await inspect.click();await viewer.locator('button').click();await expect(viewer).not.toBeVisible();
 await inspect.click();await page.mouse.click(1,1);await expect(viewer).not.toBeVisible();
 await tabs.nth(0).click();await page.waitForTimeout(650);
 await page.locator('[data-pdf-page="8"]').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/topic04-desktop.png'});
 await page.locator('[data-pdf-page="9"] [role=tab]').nth(1).click();
 await expect(page.locator('[data-pdf-page="9"] .is-active img')).toHaveAttribute('src',/page-09-figure-02/);
 for(const width of [1024,390]){
  await page.setViewportSize({width,height:844});
  expect(await page.locator('#detail').evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(false);
  await tabs.nth(3).click();await expect(tabs.nth(3)).toHaveAttribute('aria-selected','true');
 }
 await page.emulateMedia({reducedMotion:'reduce'});await tabs.nth(0).click();
 await page.locator('[data-pdf-page="8"]').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/topic04-mobile.png'});
 await page.locator('.brand').click();await expect(page.locator('#detail')).toBeHidden();
 await expect(page.locator('#indexToggle')).toBeVisible();expect(errors).toEqual([]);
});
test('spiral navigation, topic entry, independent scrolling, history and all ten topics',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./');await expect(page.locator('#loader')).toHaveClass(/loaded/);
 await expect(page.locator('#currentNumber')).toHaveText('01');
 await page.mouse.wheel(0,1800);await expect(page.locator('#currentNumber')).toHaveText('02');
 await page.waitForTimeout(1200);await expect(page.locator('#currentNumber')).toHaveText('02');
 await page.locator('#indexToggle').click();await page.locator('#indexLinks [data-topic="4"]').click();
 await expect(page.locator('#currentNumber')).toHaveText('05');await page.waitForTimeout(1500);
 const focused=page.locator('.topic-screen.focused');await expect(focused).toHaveAttribute('aria-label',/^05/);await focused.click();
 await expect(page.locator('#detail')).toBeVisible();await expect(page.locator('#detail h1')).toContainText('Худалдаа');
 const transform=await focused.evaluate(el=>el.style.transform);
 await page.locator('#detail').evaluate(el=>el.scrollTo({top:600,behavior:'instant'}));await page.mouse.move(900,500);await page.mouse.wheel(0,500);await page.waitForTimeout(600);
 expect(await focused.evaluate(el=>el.style.transform)).toBe(transform);expect(await page.locator('#detail').evaluate(el=>el.scrollTop)).toBeGreaterThan(600);
 await page.locator('.brand').click();await expect(page.locator('#detail')).toBeHidden();await expect(page.locator('#currentNumber')).toHaveText('05');
 await page.locator('#enterTopic').click();await expect(page.locator('#detail')).toBeVisible();await page.goBack();await expect(page.locator('#detail')).toBeHidden();await expect(page.locator('#currentNumber')).toHaveText('05');
 for(let i=0;i<10;i++){
  await page.locator('#indexToggle').click();await page.locator(`#indexLinks [data-topic="${i}"]`).click();
  await page.locator('#enterTopic').click();await expect(page.locator('#detail')).toBeVisible();
  await expect(page.locator(i===4?'.reading-content section':'.pdf-section')).toHaveCount(i===4?4:chapters[String(i+1)].sections.length);
  await expect(page.locator('#detail h1')).not.toBeEmpty();await page.locator('.brand').click();await expect(page.locator('#detail')).toBeHidden();
 }
 expect(errors).toEqual([]);
});
test('mobile touch, deep link, index and reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./#topic/topic-8');await expect(page.locator('#detail')).toBeVisible();await expect(page.locator('#detail h1')).toContainText('Бичиг');
 await page.locator('.brand').click();await expect(page.locator('#detail')).toBeHidden();await expect(page.locator('#currentNumber')).toHaveText('08');
 await page.locator('#indexToggle').click();await page.locator('#indexLinks [data-topic="1"]').click();await expect(page.locator('#currentNumber')).toHaveText('02');
 await page.evaluate(()=>{const el=document.getElementById('gallery');el.dispatchEvent(new TouchEvent('touchstart',{touches:[new Touch({identifier:0,target:el,clientX:200,clientY:650})],bubbles:true}));});
 await page.evaluate(()=>{const el=document.getElementById('gallery');el.dispatchEvent(new TouchEvent('touchend',{changedTouches:[new Touch({identifier:0,target:el,clientX:200,clientY:450})],bubbles:true}));});
 await expect(page.locator('#currentNumber')).toHaveText('03');
 await page.screenshot({path:'test-results/mobile-navigation.png'});
 await page.locator('#enterTopic').click();await expect(page.locator('#detail')).toBeVisible();
});


test('keyboard controls preserve native button activation and Escape returns',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');await expect(page.locator('#loader')).toHaveClass(/loaded/);
 await page.locator('#enterTopic').focus();await page.keyboard.press('ArrowDown');await expect(page.locator('#currentNumber')).toHaveText('02');
 await page.keyboard.press('Enter');await expect(page.locator('#detail')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('#detail')).toBeHidden();await expect(page.locator('#currentNumber')).toHaveText('02');
 await page.locator('#indexToggle').focus();await page.keyboard.press('Enter');await expect(page.locator('#topicIndex')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('#topicIndex')).toBeHidden();
});
