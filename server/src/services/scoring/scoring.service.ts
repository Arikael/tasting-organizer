// Initializes the `Scoring` service on path `/scoring`
import { Application } from '../../declarations'
import { Scoring } from './scoring.class'
import hooks from './scoring.hooks'

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/scoring', new Scoring(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('scoring')

  service.hooks(hooks)
}
