import { Application } from '../declarations'
import tasting from './tasting/tasting.service'
import scoring from './scoring/scoring.service'
import flightReveal from './flight-reveal/flight-reveal.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(tasting)
  app.configure(scoring)
  app.configure(flightReveal)
}
