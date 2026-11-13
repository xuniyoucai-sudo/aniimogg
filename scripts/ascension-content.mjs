import fs from 'node:fs';
// Human-reviewed Traditional Chinese for the new Part 2 blocks only. Keep the
// shared factual data, original URLs and historical community text untouched.
const tw=JSON.parse(fs.readFileSync(new URL('../src/locales/ascension-tw.json',import.meta.url),'utf8'));
export function applyAscensionLocalization({locales}){
 const g=locales.find(l=>l.lang==='zh-TW').guides['resonance-ascension'];
 if(g.body.length!==11||!g.body[0][0].includes('Part 2')||!g.sources[0][1].endsWith('/100244'))throw new Error('Ascension Part 2 localization structure changed');
 g.body.splice(0,3,...tw.body);g.matrix.rows.splice(0,3,...tw.rows);g.faq.splice(0,3,...tw.faq);
 g.changeLog=tw.changeLog;g.sources[0][0]=tw.source;
}
