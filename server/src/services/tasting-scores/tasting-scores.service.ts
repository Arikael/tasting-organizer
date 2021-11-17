// Initializes the `TastingScores` service on path `/tasting-scores`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TastingScores } from './tasting-scores.class';
import createModel from '../../models/tasting-scores.model';
import hooks from './tasting-scores.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'tasting-scores': TastingScores & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tasting-scores', new TastingScores());

  // Get our initialized service so that we can register hooks
  const service = app.service('tasting-scores');

  service.hooks(hooks);
}
