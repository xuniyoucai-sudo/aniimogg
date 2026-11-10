// Missing an intentionally unconfigured CSP is a warning, never a security PASS.
// A configured policy that disappears or drifts in production remains a failure.
export function auditCsp(configured, actual) {
  if (configured) return actual === configured
    ? {status:'PASS', detail:actual}
    : {status:'FAIL', detail:'Production CSP does not match configured _headers policy'};
  return actual
    ? {status:'FAIL', detail:'Unexpected enforced CSP not present in repository configuration'}
    : {status:'WARN', detail:'No enforced CSP configured or served; script-injection mitigation is not verified. Existing AdSense policy decision retained.'};
}
