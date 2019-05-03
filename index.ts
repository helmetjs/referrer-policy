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
  policy?: string | string[];
}

export = function referrerPolicy (options?: ReferrerPolicyOptions) {
  options = options || {}

  let policyOption: unknown
  if ('policy' in options) {
    policyOption = options.policy
  } else {
    policyOption = DEFAULT_POLICY
  }

  const policies: unknown[] = Array.isArray(policyOption) ? policyOption : [policyOption]

  const policiesSeen: Set<string> = new Set()
  policies.forEach((policy) => {
    if ((typeof policy !== 'string') || (ALLOWED_POLICIES.indexOf(policy) === -1)) {
      throw new Error('"' + policy + '" is not a valid policy. Allowed policies: ' + ALLOWED_POLICIES_ERROR_LIST + '.')
    }

    if (policiesSeen.has(policy)) {
      throw new Error('"' + policy + '" specified more than once. No duplicates are allowed.')
    }
    policiesSeen.add(policy)
  })

  const headerValue: string = policies.join(',');

  return function referrerPolicy (_req: IncomingMessage, res: ServerResponse, next: () => void) {
    res.setHeader('Referrer-Policy', headerValue)
    next()
  }
}
