// Initializes the `TastingResult` service on path `/tasting-result`
import { Application } from '../../declarations'
import { TastingResult } from './tasting-result.class'
import hooks from './tasting-result.hooks'

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/tasting-result', new TastingResult(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('tasting-result')

  service.hooks(hooks)
}
