import fs from 'node:fs';

const host='aniimogg.com';
const key='4f1a9c7e6b2d4380a5e1f9c3d7b6428a';
const sitemap=fs.readFileSync(new URL('../sitemap.xml',import.meta.url),'utf8');
const urlList=[...sitemap.matchAll(/<loc>(https:\/\/aniimogg\.com\/[^<]*)<\/loc>/g)].map(match=>match[1]);
const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'content-type':'application/json; charset=utf-8'},body:JSON.stringify({host,key,keyLocation:`https://${host}/${key}.txt`,urlList})});
if(!response.ok&&!([202,204].includes(response.status)))throw new Error(`IndexNow returned HTTP ${response.status}: ${await response.text()}`);
console.log(`IndexNow accepted ${urlList.length} URLs with HTTP ${response.status}.`);
