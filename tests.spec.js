import { test, expect } from '@playwright/test';
test('spiral navigation, topic entry, independent scrolling, history and all ten topics',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('#loader')).toHaveClass(/loaded/);
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
 await page.locator('#returnGallery').click();await expect(page.locator('#detail')).toBeHidden();await expect(page.locator('#currentNumber')).toHaveText('05');
 await page.locator('#enterTopic').click();await expect(page.locator('#detail')).toBeVisible();await page.goBack();await expect(page.locator('#detail')).toBeHidden();await expect(page.locator('#currentNumber')).toHaveText('05');
 for(let i=0;i<10;i++){
  await page.locator('#indexToggle').click();await page.locator(`#indexLinks [data-topic="${i}"]`).click();
  await page.locator('#enterTopic').click();await expect(page.locator('#detail')).toBeVisible();
  await expect(page.locator('.reading-content section')).toHaveCount(4);
  await expect(page.locator('#detail h1')).not.toBeEmpty();await page.locator('#returnGallery').click();await expect(page.locator('#detail')).toBeHidden();
 }
 expect(errors).toEqual([]);
});
test('mobile touch, deep link, index and reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#topic/topic-8');await expect(page.locator('#detail')).toBeVisible();await expect(page.locator('#detail h1')).toContainText('Бичиг');
 await page.locator('#returnGallery').click();await expect(page.locator('#detail')).toBeHidden();await expect(page.locator('#currentNumber')).toHaveText('08');
 await page.locator('#indexToggle').click();await page.locator('#indexLinks [data-topic="1"]').click();await expect(page.locator('#currentNumber')).toHaveText('02');
 await page.evaluate(()=>{const el=document.getElementById('gallery');el.dispatchEvent(new TouchEvent('touchstart',{touches:[new Touch({identifier:0,target:el,clientX:200,clientY:650})],bubbles:true}));});
 await page.evaluate(()=>{const el=document.getElementById('gallery');el.dispatchEvent(new TouchEvent('touchend',{changedTouches:[new Touch({identifier:0,target:el,clientX:200,clientY:450})],bubbles:true}));});
 await expect(page.locator('#currentNumber')).toHaveText('03');
 await page.screenshot({path:'mobile-preview.png'});
 await page.locator('#enterTopic').click();await expect(page.locator('#detail')).toBeVisible();
});


test('keyboard controls preserve native button activation and Escape returns',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('#loader')).toHaveClass(/loaded/);
 await page.locator('#enterTopic').focus();await page.keyboard.press('ArrowDown');await expect(page.locator('#currentNumber')).toHaveText('02');
 await page.keyboard.press('Enter');await expect(page.locator('#detail')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('#detail')).toBeHidden();await expect(page.locator('#currentNumber')).toHaveText('02');
 await page.locator('#indexToggle').focus();await page.keyboard.press('Enter');await expect(page.locator('#topicIndex')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('#topicIndex')).toBeHidden();
});
