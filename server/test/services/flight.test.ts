import assert from 'assert';
import app from '../../src/app';

describe('\'flight\' service', () => {
  it('registered the service', () => {
    const service = app.service('flight');

    assert.ok(service, 'Registered the service');
  });
});
