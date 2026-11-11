import assert from 'node:assert/strict';import {isCloudflareTelemetryRequest,classifyRuntimeDiagnostic} from './browser-diagnostics.mjs';
const base='https://aniimogg.com';assert.ok(isCloudflareTelemetryRequest(base+'/cdn-cgi/rum?',base));
for(const url of ['https://aniimogg.com.evil/cdn-cgi/rum',base+'/assets/rum.js',base+'/cdn-cgi/rum-extra',base+'/assets/compendium.js'])assert.equal(isCloudflareTelemetryRequest(url,base),false);
assert.equal(classifyRuntimeDiagnostic('at a (https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092:1:832)'), 'Cloudflare RUM provider error');
for(const stack of ['', 'undefined','at render (https://aniimogg.com/assets/compendium.62156dcd5e89ba90.js:1:99)','at a (https://static.cloudflareinsights.com.evil/beacon.min.js/v:1:1)'])assert.equal(classifyRuntimeDiagnostic(stack),null);
console.log('PASS diagnostics: exact Cloudflare endpoint/source attribution; application, unknown and spoofed origins still block.');
