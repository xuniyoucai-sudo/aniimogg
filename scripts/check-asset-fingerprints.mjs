import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {assetInputs,fingerprintAssets,sha256} from './asset-fingerprints.mjs';

const root=process.cwd(),readManifest=()=>JSON.parse(fs.readFileSync('assets/asset-manifest.json','utf8'));
const manifest=readManifest();assert.equal(manifest.version,1);
for(const [key,name] of Object.entries(assetInputs)){
  const a=manifest.assets[key],bytes=fs.readFileSync('.'+a.file),ext=path.extname(name);
  assert.equal(a.sha256,sha256(bytes));assert.ok(a.file.endsWith('.'+a.sha256.slice(0,16)+ext));
  assert.equal(a.mime,ext==='.js'?'text/javascript':'text/css');
  if(ext==='.css'){
    const css=bytes.toString();assert.ok(!/@import\b/.test(css),'CSS imports need fingerprint dependency support');
    for(const m of css.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)){
      if(/^(?:data:|https?:|#)/.test(m[2]))continue;
      assert.ok(m[2].startsWith('/'),'CSS dependency must be root-relative');assert.ok(fs.existsSync('.'+m[2]));
    }
  }else assert.ok(!/\bimport\s*\(|new\s+(?:Worker|SharedWorker)|serviceWorker/.test(bytes.toString()),'New module/worker dependencies need explicit fingerprint support');
}
const html=[];const walk=dir=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules','src','artifacts'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))html.push(p);}};walk('.');
const expected=Object.values(manifest.assets).map(a=>a.file).sort();
const refsFor=keys=>keys.map(k=>manifest.assets[k].file).sort();
const region=refsFor(['app','styles','siteContent','accessibility','region','regionStyle']);
const shared=refsFor(['app','styles','siteContent','accessibility']),catalogue=refsFor(['app','styles','siteContent','accessibility','compendium','compendiumStyle']),team=refsFor(['styles','siteContent','accessibility','team','teamStyle']);
for(const file of html){
  const text=fs.readFileSync(file,'utf8');
  if(/^(?:zh-cn\/|zh-tw\/|ja\/)?map\//.test(file)){const config=JSON.parse(text.match(/<script type="application\/json" class="region-config">([^<]+)<\/script>/)[1]);assert.equal(config.regions,manifest.assets.regionData.file);assert.equal(config.characters,manifest.assets.teamData.file);assert.ok(!text.includes('class="region-form"'),'Region cards load on demand');}
  if(file.includes('team-builder/'))assert.equal(JSON.parse(text.match(/<script type="application\/json" class="team-config">([^<]+)<\/script>/)[1]).data,manifest.assets.teamData.file,'Team JSON must use manifest');
  for(const m of text.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>/g)){
    if(/\.(?:js|css)(?:\?|$)/.test(m[1]))assert.ok(!/^https?:\/\/(?:[^/]*aniimogg\.com|[^/]*\.pages\.dev)(?:\/|$)/.test(m[1]),file+' absolute production/Preview asset URL');
  }
  const refs=[...text.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>/g)].map(m=>m[1]).filter(s=>/\.(?:js|css)(?:\?|$)/.test(s)&&!s.startsWith('https:'));
  assert.equal(new Set(refs).size,refs.length,file+' duplicate asset');
  for(const ref of refs)assert.ok(expected.includes(ref),file+' must use manifest asset');
  if(file.endsWith('index.html')||file==='404.html')assert.deepEqual(refs.sort(),file.includes('guides/confirmed-aniimo/')?catalogue:file.includes('team-builder/')?team:/^(?:zh-cn\/|zh-tw\/|ja\/)?map\//.test(file)?region:shared,file+' page-specific bundle');
  for(const ref of refs){assert.ok(ref.startsWith('/assets/'));assert.ok(!ref.includes('?'));assert.ok(fs.existsSync('.'+ref));}
  assert.ok(!/\/(?:app\.js|[^"\s]+\.css)\?v=/.test(text),file+' fixed query');
  assert.ok(!/file:\/\/|localhost:\d|127\.0\.0\.1:\d|\/Users\//.test(text),file+' machine-specific URL');
}
// Exercise the actual emitter in disposable roots: bytes, not timestamps or
// shared build counters, determine each independent resource identity.
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'aniimogg-fingerprint-'));
try{
  fs.mkdirSync(path.join(tmp,'src/assets'),{recursive:true});
  for(const name of Object.values(assetInputs))fs.copyFileSync(path.join(root,'src/assets',name),path.join(tmp,'src/assets',name));
  const before=fingerprintAssets(tmp);assert.deepEqual(fingerprintAssets(tmp),before);
  fs.appendFileSync(path.join(tmp,'src/assets/app.js'),'\n// mutation probe\n');const js=fingerprintAssets(tmp);
  assert.notEqual(js.assets.app.file,before.assets.app.file);
  for(const k of ['styles','siteContent','accessibility'])assert.deepEqual(js.assets[k],before.assets[k]);
  fs.copyFileSync(path.join(root,'src/assets/app.js'),path.join(tmp,'src/assets/app.js'));
  fs.appendFileSync(path.join(tmp,'src/assets/site-content.css'),'\n/* mutation probe */\n');const css=fingerprintAssets(tmp);
  assert.notEqual(css.assets.siteContent.file,before.assets.siteContent.file);assert.deepEqual(css.assets.app,before.assets.app);
  fs.appendFileSync(path.join(tmp,'src/assets/aniimo-model.js'),'\n// shared mutation\n');const dependency=fingerprintAssets(tmp);for(const k of ['compendium','team','aniimoModel','regionModel','region'])assert.notEqual(dependency.assets[k].file,css.assets[k].file);assert.deepEqual(dependency.assets.teamModel,css.assets.teamModel);
  assert.ok(fs.existsSync(path.join(tmp,before.assets.app.file.slice(1))),'Earlier hash output must survive');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
// Explicit static module imports form a fingerprint dependency graph.
for(const key of ['compendium','team','region','regionModel'])for(const m of fs.readFileSync('.'+manifest.assets[key].file,'utf8').matchAll(/from '([^']+)'/g))assert.ok(expected.includes(m[1]),'Missing module '+m[1]);
const data=manifest.assets.teamData;assert.equal(sha256(fs.readFileSync('.'+data.file)),data.sha256);assert.equal(data.mime,'application/json');assert.ok(data.file.endsWith('.'+data.sha256.slice(0,16)+'.json'));assert.equal(JSON.parse(fs.readFileSync('.'+data.file)).length,130);
const originalHtml=html.map(f=>[f,sha256(fs.readFileSync(f))]);
execFileSync(process.execPath,['scripts/build-site.mjs'],{stdio:'pipe'});
assert.deepEqual(readManifest(),manifest);assert.deepEqual(html.map(f=>[f,sha256(fs.readFileSync(f))]),originalHtml);
const compat=JSON.parse(fs.readFileSync('src/fixtures/asset-cache/provenance.json','utf8'));
for(const [file,hash] of Object.entries(compat.legacyAssets))assert.equal(sha256(fs.readFileSync(file)),hash,'Legacy bytes must not be overwritten: '+file);
for(const [file,hash] of Object.entries(compat.retainedHashedAssets))assert.equal(sha256(fs.readFileSync('.'+file)),hash,'Published P0.1 hash must be retained');
console.log(`PASS ${html.length} HTML files: manifest/SHA-256/MIME/local dependencies, no fixed query or duplicate versions; deterministic rebuild, JS/CSS mutation isolation, retained legacy bytes.`);
