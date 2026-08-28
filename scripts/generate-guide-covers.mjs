import fs from 'node:fs';
import path from 'node:path';
import {createCanvas,loadImage} from '/Users/asuka/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas/index.js';

const root=process.cwd();
const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/site.json'),'utf8'));
const out=path.join(root,'assets','guides');
fs.mkdirSync(out,{recursive:true});
const palettes=[['#071d2b','#16b989','#baffea'],['#15152d','#8c72ff','#e2dcff'],['#172511','#8ecb45','#e7ffc7'],['#301a16','#ff765f','#ffe0d8'],['#102438','#43a8ff','#d7efff'],['#2d2411','#f3bd3f','#fff0bd']];

const escapeXml=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const wrap=(s,max=24)=>{const words=s.split(' '),lines=[];let line='';for(const w of words){if((line+' '+w).trim().length>max){lines.push(line);line=w}else line=(line+' '+w).trim()}if(line)lines.push(line);return lines.slice(0,3)};
const saveWebp=async(svg,file,width,height)=>{const canvas=createCanvas(width,height),ctx=canvas.getContext('2d'),img=await loadImage(Buffer.from(svg));ctx.drawImage(img,0,0,width,height);fs.writeFileSync(file,await canvas.encode('webp',84))};

for(const [index,id] of data.guideArticles.entries()){
  const [dark,accent,pale]=palettes[index%palettes.length];
  const title=wrap(id.replaceAll('-',' ').toUpperCase());
  const titleSvg=title.map((x,i)=>`<text x="80" y="${320+i*72}" font-size="58" font-weight="800" fill="#fff" font-family="Arial, sans-serif">${escapeXml(x)}</text>`).join('');
  const rings=Array.from({length:5},(_,i)=>`<circle cx="${930+i*25}" cy="${180+i*70}" r="${130+i*28}" fill="none" stroke="${i%2?accent:pale}" stroke-opacity="${0.5-i*0.06}" stroke-width="${18-i*2}"/>`).join('');
  const cover=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${dark}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><rect width="1200" height="675" rx="36" fill="url(#g)"/><path d="M0 560C220 470 310 660 540 560s390-30 660-190v305H0Z" fill="${pale}" opacity=".12"/>${rings}<text x="80" y="95" font-size="24" letter-spacing="7" fill="${pale}" font-family="Arial, sans-serif">ANIIMO.GG</text><text x="80" y="150" font-size="16" letter-spacing="4" fill="#fff" opacity=".7" font-family="Arial, sans-serif">FIELD NOTE ${String(index+1).padStart(2,'0')}</text>${titleSvg}<rect x="80" y="565" width="160" height="8" rx="4" fill="${pale}"/><circle cx="1110" cy="90" r="22" fill="${pale}"/><circle cx="1110" cy="90" r="8" fill="${dark}"/></svg>`;
  const visual=`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" rx="30" fill="${dark}"/><circle cx="770" cy="90" r="210" fill="${accent}" opacity=".3"/><circle cx="870" cy="440" r="180" fill="${pale}" opacity=".1"/><text x="60" y="75" font-size="20" letter-spacing="6" fill="${pale}" font-family="Arial, sans-serif">ANIIMO GUIDE</text>${[['OFFICIAL',70],['VERSIONED',250],['PLAYER GUIDE',430]].map(([t,x],i)=>`<g transform="translate(${x} 180)"><rect width="150" height="170" rx="22" fill="#fff" opacity="${.08+i*.03}"/><circle cx="75" cy="58" r="25" fill="${i===1?pale:accent}"/><path d="M61 58l10 10 20-24" fill="none" stroke="${dark}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><text x="75" y="125" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="Arial, sans-serif">${t}</text></g>`).join('')}<path d="M70 410H890" stroke="${pale}" stroke-opacity=".4"/><text x="70" y="465" font-size="20" fill="#fff" opacity=".78" font-family="Arial, sans-serif">SOURCE-AWARE • UPDATED • UNOFFICIAL</text></svg>`;
  await saveWebp(cover,path.join(out,`${id}-cover.webp`),1200,675);
  await saveWebp(visual,path.join(out,`${id}-visual.webp`),960,540);
}
console.log(`Generated ${data.guideArticles.length*2} WebP guide images.`);
