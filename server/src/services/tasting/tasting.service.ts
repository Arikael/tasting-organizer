// Initializes the `tasting` service on path `/tasting`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Tasting } from './tasting.class'
import hooks from './tasting.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'tasting': Tasting & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    // paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/tasting', new Tasting(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('tasting')

  service.hooks(hooks)
}
