import assert from 'assert'
import app from '../../src/app'

describe('\'tasting\' service', () => {
  it('registered the service', () => {
    const service = app.service('tasting')

    assert.ok(service, 'Registered the service')
  })
})
