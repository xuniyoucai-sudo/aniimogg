import fs from 'node:fs';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';
import {sources,parseOfficialIndex,matchLocalizations} from './official-localization.mjs';
const out='artifacts/aniimogg-p1-a1/official';fs.mkdirSync(out,{recursive:true});
const indexes={},hashes={},date=new Date().toISOString().slice(0,10);
for(const [lang,url] of Object.entries(sources)){
 const response=await fetch(url);if(!response.ok)throw Error(url+' HTTP '+response.status);const html=await response.text();
 fs.writeFileSync(`${out}/${lang}.html`,html);indexes[lang]=parseOfficialIndex(html);hashes[lang]=createHash('sha256').update(html).digest('hex');
 if(process.argv.includes('--write')){fs.mkdirSync('src/fixtures/localization',{recursive:true});fs.writeFileSync(`src/fixtures/localization/${lang}.html.gz`,gzipSync(html,{mtime:0}));}
}
const result=matchLocalizations(JSON.parse(fs.readFileSync('src/data/aniimo-index.json')),indexes,date);result.sourceHtmlSha256=hashes;
fs.writeFileSync(`${out}/match-results.json`,JSON.stringify(result,null,2)+'\n');console.log(result.coverage,result.differences);
if(process.argv.includes('--write'))fs.writeFileSync('src/data/aniimo-localizations.json',JSON.stringify(result,null,2)+'\n');
