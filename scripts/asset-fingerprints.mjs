import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

export const assetInputs={app:'app.js',styles:'styles.css',siteContent:'site-content.css',accessibility:'accessibility.css'};
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export function fingerprintAssets(root){
  const assets={};
  for(const [key,name] of Object.entries(assetInputs)){
    // Sources formerly lived at the web root. Resolve their local dependencies
    // there before moving the generated stylesheet under /assets/.
    const source=fs.readFileSync(path.join(root,'src/assets',name));
    const bytes=name.endsWith('.css')?Buffer.from(source.toString().replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(all,q,url)=>/^(?:\/|#|data:|https?:)/.test(url)?all:`url(${q}/${url}${q})`)):source;
    const digest=sha256(bytes),ext=path.extname(name),stem=path.basename(name,ext);
    const file=`/assets/${stem}.${digest.slice(0,16)}${ext}`;
    fs.mkdirSync(path.join(root,'assets'),{recursive:true});
    fs.writeFileSync(path.join(root,file.slice(1)),bytes);
    assets[key]={file,sha256:digest,mime:ext==='.js'?'text/javascript':'text/css'};
  }
  const manifest={version:1,algorithm:'sha256',hashLength:16,assets};
  fs.writeFileSync(path.join(root,'assets/asset-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  // Never delete previous fingerprints: cached HTML may still reference them.
  return manifest;
}
