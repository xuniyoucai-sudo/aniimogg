// Provider diagnostics remain visible warnings; unknown/application errors block.
export function isCloudflareTelemetryRequest(url,base){
 try{const u=new URL(url);return u.origin===new URL(base).origin&&u.pathname==='/cdn-cgi/rum';}catch{return false;}
}
export function classifyRuntimeDiagnostic(source){
 if(/https?:\/\/(?:localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?|aniimogg\.com|[a-z0-9-]+\.aniimogg\.pages\.dev)\/assets\/[^ )]+\.js[:?]/.test(source))return null;
 if(/https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js(?:\/|[?:])/.test(source))return 'Cloudflare RUM provider error';
 if(/https:\/\/(?:[a-z0-9-]+\.)*(?:googlesyndication\.com|doubleclick\.net|googleads\.com)(?:[\/:]|$)/.test(source))return 'third-party advertising runtime error';
 return null;
}
// Browser-generated report-only diagnostics from the existing Google ad frame.
// A console.error emitted by application code has a source URL and is not exempt.
export function classifyConsoleDiagnostic(message,location){
 if(location)return null;
 if(/^Framing 'https:\/\/www\.google\.com\/' violates .*report-only Content Security Policy directive: "frame-ancestors 'self'"\./s.test(message)||/^\[Report Only\] Refused to load https:\/\/www\.google\.com\/recaptcha\/[^\s]+.*frame-ancestors/s.test(message))return 'Google advertising frame CSP report-only warning';
 return null;
}
