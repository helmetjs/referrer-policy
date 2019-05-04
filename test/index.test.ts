import connect = require('connect')
import request = require('supertest')
import { IncomingMessage, ServerResponse } from 'http';

import referrerPolicy = require('..')

function app (middleware: ReturnType<typeof referrerPolicy>): connect.Server {
  const result = connect();
  result.use(middleware);
  result.use((_req: IncomingMessage, res: ServerResponse) => {
    res.end('Hello world!');
  });
  return result;
}

describe('referrerPolicy', () => {
  it('sets header to no-referrer when passed no arguments', () => {
    return request(app(referrerPolicy())).get('/')
      .expect('Referrer-Policy', 'no-referrer');
  });

  it('sets header to no-referrer when passed no policy', () => {
    return request(app(referrerPolicy({}))).get('/')
      .expect('Referrer-Policy', 'no-referrer');
  });

  [
    'no-referrer',
    'no-referrer-when-downgrade',
    'same-origin',
    'origin',
    'strict-origin',
    'origin-when-cross-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url',
    '',
  ].forEach((policy) => {
    it(`can set the header to "${policy}" by specifying it as a string`, () => {
      return request(app(referrerPolicy({ policy }))).get('/')
        .expect('Referrer-Policy', policy);
    });

    it(`can set the header to "${policy}" by specifying it as an array string`, () => {
      return request(app(referrerPolicy({ policy: [policy] }))).get('/')
        .expect('Referrer-Policy', policy);
    });
  });

  it('can set an array with multiple values', () => {
    return request(app(referrerPolicy({ policy: ['origin', 'unsafe-url'] }))).get('/')
      .expect('Referrer-Policy', 'origin,unsafe-url');
  });

  describe('with bad input', () => {
    it('fails with a bad policy', () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      expect(referrerPolicy.bind(null, { policy: 'garbage' })).toThrow();
      expect(referrerPolicy.bind(null, { policy: 'sameorigin' })).toThrow();
      expect(referrerPolicy.bind(null, { policy: 123 as any })).toThrow();
      expect(referrerPolicy.bind(null, { policy: false as any })).toThrow();
      expect(referrerPolicy.bind(null, { policy: null as any })).toThrow();
      expect(referrerPolicy.bind(null, { policy: undefined as any })).toThrow();
      expect(referrerPolicy.bind(null, { policy: {} as any })).toThrow();
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });

    it('fails with an empty array', () => {
      expect(referrerPolicy.bind(null, { policy: [] })).toThrow();
    });

    it('fails with duplicate values', () => {
      expect(referrerPolicy.bind(null, { policy: ['origin', 'origin'] })).toThrow();
      expect(referrerPolicy.bind(null, { policy: ['same-origin', 'origin', 'same-origin'] })).toThrow();
    });
  });

  it('names its function and middleware', () => {
    expect(referrerPolicy.name).toBe('referrerPolicy');
    expect(referrerPolicy.name).toBe(referrerPolicy().name);
  });
});
