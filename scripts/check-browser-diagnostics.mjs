import assert from 'node:assert/strict';import {isCloudflareTelemetryRequest,classifyRuntimeDiagnostic,classifyConsoleDiagnostic} from './browser-diagnostics.mjs';
const base='https://aniimogg.com';assert.ok(isCloudflareTelemetryRequest(base+'/cdn-cgi/rum?',base));
for(const url of ['https://aniimogg.com.evil/cdn-cgi/rum',base+'/assets/rum.js',base+'/cdn-cgi/rum-extra',base+'/assets/compendium.js'])assert.equal(isCloudflareTelemetryRequest(url,base),false);
assert.equal(classifyRuntimeDiagnostic('at a (https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092:1:832)'), 'Cloudflare RUM provider error');
for(const stack of ['', 'undefined','at render (https://aniimogg.com/assets/compendium.62156dcd5e89ba90.js:1:99)','at a (https://static.cloudflareinsights.com.evil/beacon.min.js/v:1:1)'])assert.equal(classifyRuntimeDiagnostic(stack),null);
console.log('PASS diagnostics: exact Cloudflare endpoint/source attribution; application, unknown and spoofed origins still block.');

assert.equal(classifyRuntimeDiagnostic('Li@https://pagead2.googlesyndication.com/pagead/managed/js/adsense/m202611100101/show_ads_impl_fy2021.js:99:247'),'third-party advertising runtime error');
assert.equal(classifyRuntimeDiagnostic('at render (https://aniimogg.com/assets/team-builder.abc.js:1:1) at ad (https://pagead2.googlesyndication.com/test.js:1:1)'),null);

const report="Framing 'https://www.google.com/' violates the following report-only Content Security Policy directive: \"frame-ancestors 'self'\". The violation has been logged, but no further action has been taken.";
assert.equal(classifyConsoleDiagnostic(report,''),'Google advertising frame CSP report-only warning');
assert.equal(classifyConsoleDiagnostic(report,'https://aniimogg.com/assets/team-builder.abc.js'),null);
assert.equal(classifyConsoleDiagnostic(report.replace('report-only','enforced'),''),null);
assert.equal(classifyConsoleDiagnostic(report.replace('www.google.com','www.google.com.evil'),''),null);
