import { IncomingMessage, ServerResponse } from 'http'

const DEFAULT_POLICY = 'no-referrer'
const ALLOWED_POLICIES: string[] = [
  'no-referrer',
  'no-referrer-when-downgrade',
  'same-origin',
  'origin',
  'strict-origin',
  'origin-when-cross-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url',
  ''
]
const ALLOWED_POLICIES_ERROR_LIST = ALLOWED_POLICIES.map(function (policy) {
  if (policy.length) {
    return '"' + policy + '"'
  } else {
    return 'and the empty string'
  }
}).join(', ')

interface ReferrerPolicyOptions {
  policy?: string;
}

export = function referrerPolicy (options?: ReferrerPolicyOptions) {
  options = options || {}

  let policy: unknown
  if ('policy' in options) {
    policy = options.policy
  } else {
    policy = DEFAULT_POLICY
  }

  if ((typeof policy !== 'string') || (ALLOWED_POLICIES.indexOf(policy) === -1)) {
    throw new Error('"' + policy + '" is not a valid policy. Allowed policies: ' + ALLOWED_POLICIES_ERROR_LIST + '.')
  }

  const headerValue: string = policy;

  return function referrerPolicy (_req: IncomingMessage, res: ServerResponse, next: () => void) {
    res.setHeader('Referrer-Policy', headerValue)
    next()
  }
}
