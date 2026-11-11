import fs from 'node:fs';import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';assert.match(base,/^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});const results=[];
try{for(const prefix of ['','zh-cn/','zh-tw/','ja/'])for(const value of ['{broken','{"version":2,"entityIds":"invalid","unrecognizedIds":[]}']){
 const context=await browser.newContext();await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
 await context.addInitScript(({value})=>{localStorage.setItem('aniimo-guide-collection-v1','["001","unknown-legacy"]');localStorage.setItem('aniimo-guide-collection-v2',value);},{value});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/'+prefix+'guides/confirmed-aniimo/');assert.equal(await page.locator('.collection-warning').isVisible(),true);await page.locator('[data-aniimo-save="004"]').click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('aniimo-guide-collection-v2')),value);assert.equal(await page.evaluate(()=>localStorage.getItem('aniimo-guide-collection-v1')),'["001","unknown-legacy"]');assert.deepEqual(errors,[]);results.push({prefix:prefix||'en',scenario:value==='{broken'?'corrupt-v2-json':'invalid-v2-schema',status:'PASS',originalV1AndV2:'retained'});await context.close();
}fs.writeFileSync('artifacts/aniimogg-p0/storage-v2-browser.json',JSON.stringify(results,null,2));console.log(`PASS ${results.length} real-browser v2 corruption cases: warning, usable session, original v1/v2 preserved.`);
}finally{await browser.close();}
