import assert from 'assert'
import app from '../../src/app'

describe('\'TastingScores\' service', () => {
  it('registered the service', () => {
    const service = app.service('tasting-scores')

    assert.ok(service, 'Registered the service')
  })
})
