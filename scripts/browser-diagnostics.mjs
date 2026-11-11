// Provider diagnostics remain visible warnings; unknown/application errors block.
export function isCloudflareTelemetryRequest(url,base){
 try{const u=new URL(url);return u.origin===new URL(base).origin&&u.pathname==='/cdn-cgi/rum';}catch{return false;}
}
export function classifyRuntimeDiagnostic(source){
 if(/https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js(?:\/|[?:])/.test(source))return 'Cloudflare RUM provider error';
 if(/https:\/\/(?:[a-z0-9-]+\.)*(?:googlesyndication\.com|doubleclick\.net|googleads\.com)(?:[\/:]|$)/.test(source))return 'third-party advertising runtime error';
 return null;
}
