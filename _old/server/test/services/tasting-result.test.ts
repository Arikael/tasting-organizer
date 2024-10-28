import assert from 'assert'
import app from '../../src/app'

describe('\'TastingResult\' service', () => {
  it('registered the service', () => {
    const service = app.service('tasting-result')

    assert.ok(service, 'Registered the service')
  })
})
