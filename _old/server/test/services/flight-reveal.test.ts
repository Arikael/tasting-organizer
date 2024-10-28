import assert from 'assert'
import app from '../../src/app'

describe('\'FlightReveal\' service', () => {
  it('registered the service', () => {
    const service = app.service('flight-reveal')

    assert.ok(service, 'Registered the service')
  })
})
