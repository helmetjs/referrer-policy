var referrerPolicy = require('..')

var connect = require('connect')
var request = require('supertest')
var assert = require('assert')

function makeApp () {
  var result = connect()

  result.use(referrerPolicy.apply(this, arguments))

  result.use(function (req, res) {
    res.end('Hello world!')
  })

  return result
}

describe('referrerPolicy', function () {
  it('sets header to no-referrer when passed no arguments', function (done) {
    request(makeApp()).get('/')
    .expect('Referrer-Policy', 'no-referrer', done)
  })

  it('sets header to no-referrer when passed no policy', function (done) {
    request(makeApp({})).get('/')
    .expect('Referrer-Policy', 'no-referrer', done)
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
    it('can set the header to "' + policy + '"', function (done) {
      request(makeApp({ policy: policy })).get('/')
        .expect('Referrer-Policy', policy, done)
    })
  })

  describe('with bad input', function () {
    function callWith () {
      var args = arguments
      return function () {
        return referrerPolicy.apply(this, args)
      }
    }

    it('fails with a bad policy', function () {
      assert.throws(callWith({ policy: 'garbage' }))
      assert.throws(callWith({ policy: 'sameorigin' }))
      assert.throws(callWith({ policy: 123 }))
      assert.throws(callWith({ policy: false }))
      assert.throws(callWith({ policy: null }))
      assert.throws(callWith({ policy: {} }))
      assert.throws(callWith({ policy: [] }))
      assert.throws(callWith({ policy: ['same-origin'] }))
      assert.throws(callWith({ policy: /cool_regex/g }))
    })
  })

  it('names its function and middleware', function () {
    assert.equal(referrerPolicy.name, 'referrerPolicy')
    assert.equal(referrerPolicy.name, referrerPolicy().name)
  })
})
