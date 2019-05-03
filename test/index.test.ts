import connect = require('connect')
import request = require('supertest')
import { IncomingMessage, ServerResponse } from 'http'

import referrerPolicy = require('..')

function app (middleware: ReturnType<typeof referrerPolicy>): connect.Server {
  const result = connect()
  result.use(middleware)
  result.use(function (_req: IncomingMessage, res: ServerResponse) {
    res.end('Hello world!')
  })
  return result
}

describe('referrerPolicy', function () {
  it('sets header to no-referrer when passed no arguments', function () {
    return request(app(referrerPolicy())).get('/')
      .expect('Referrer-Policy', 'no-referrer')
  })

  it('sets header to no-referrer when passed no policy', function () {
    return request(app(referrerPolicy({}))).get('/')
      .expect('Referrer-Policy', 'no-referrer')
  })

  ;[
    'no-referrer',
    'no-referrer-when-downgrade',
    'same-origin',
    'origin',
    'strict-origin',
    'origin-when-cross-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url',
    ''
  ].forEach(function (policy) {
    it('can set the header to "' + policy + '"', function () {
      return request(app(referrerPolicy({ policy }))).get('/')
        .expect('Referrer-Policy', policy)
    })
  })

  describe('with bad input', function () {
    it('fails with a bad policy', function () {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      expect(referrerPolicy.bind(null, { policy: 'garbage' })).toThrow()
      expect(referrerPolicy.bind(null, { policy: 'sameorigin' })).toThrow()
      expect(referrerPolicy.bind(null, { policy: 123 as any })).toThrow()
      expect(referrerPolicy.bind(null, { policy: false as any })).toThrow()
      expect(referrerPolicy.bind(null, { policy: null as any })).toThrow()
      expect(referrerPolicy.bind(null, { policy: undefined as any })).toThrow()
      expect(referrerPolicy.bind(null, { policy: {} as any })).toThrow()
      expect(referrerPolicy.bind(null, { policy: ['same-origin'] as any })).toThrow()
      /* eslint-enable @typescript-eslint/no-explicit-any */
    })
  })

  it('names its function and middleware', function () {
    expect(referrerPolicy.name).toBe('referrerPolicy')
    expect(referrerPolicy.name).toBe(referrerPolicy().name)
  })
})
