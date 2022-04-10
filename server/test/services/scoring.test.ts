import assert from 'assert'
import app from '../../src/app'

describe('\'Scoring\' service', () => {
  it('registered the service', () => {
    const service = app.service('scoring')

    assert.ok(service, 'Registered the service')
  })
})
