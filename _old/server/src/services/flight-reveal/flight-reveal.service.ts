// Initializes the `FlightReveal` service on path `/flight-reveal`
import { Application } from '../../declarations'
import { FlightReveal } from './flight-reveal.class'
import hooks from './flight-reveal.hooks'

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/flight-reveal', new FlightReveal(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('flight-reveal')

  service.hooks(hooks)
}
