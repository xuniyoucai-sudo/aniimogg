import {createHash} from 'node:crypto';

export const affinityTerms=['Aniimo Affinity','Affinity Level','Rename Unlock','Heal','Swoleshroom','Daily Affinity Cap','Weekly Affinity Cap','Affinity Points','Affinity Growth','Skill Effect','Aniimo Affinity Level','伊莫亲密度','伊莫親密度','アニモ親密度'];
export const sourceText=html=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
export const hash=value=>createHash('sha256').update(value).digest('hex');

// A candidate is a review lead, never an automatically verified mechanic.
// In particular, dates, numbered lists, friend tiers and skill names can contain digits.
export function affinityReview(html,previous=null){
 const text=sourceText(html),start=text.search(/New Aniimo Affinity Feature|新增伊莫[亲親]密度功能|アニモ親密度機能追加/i);
 let section='';
 if(start>=0){const tail=text.slice(start),end=tail.search(/New Events|全新活動上線|全新活动上线|新イベント開催/i);section=tail.slice(0,end<0?3000:end);}
 const fragments=(section||text).split(/(?<=[.!?。！？])\s*/u).filter(s=>s.trim()&&(section||/affinity|亲密度|親密度|Swoleshroom/i.test(s)));
 const sentenceHashes=fragments.map(hash),sectionSha256=hash(fragments.join('\n'));
 const old=previous?.sentenceHashes||[];
 return {scope:start>=0?'individual_aniimo_section':'unclassified_mentions',matchedTerms:affinityTerms.filter(term=>text.toLowerCase().includes(term.toLowerCase())),sectionSha256,sentenceHashes,
  changed:previous?previous.sectionSha256!==sectionSha256:null,
  added:fragments.filter((s,i)=>!old.includes(sentenceHashes[i])),removedHashes:old.filter(h=>!sentenceHashes.includes(h)),
  numericCandidates:fragments.filter(s=>/\d|[%％倍]/.test(s)),
  numericStatus:'UNVERIFIED_REVIEW_ONLY',requiresScopeVerification:true};
}
