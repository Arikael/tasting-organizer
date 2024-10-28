import {Tasting} from '../services/tasting/tasting.class'
import {ServiceAddons} from '@feathersjs/feathers'
import {Scoring} from '../services/scoring/scoring.class'
import {FlightReveal} from '../services/flight-reveal/flight-reveal.class'
import 'reflect-metadata'
import {TastingResult} from '../services/tasting-result/tasting-result.class'
export * from './common'
export * from './tasting-scoring'
export * from './tasting-results'

export interface ServiceTypes {
  'tasting': Tasting & ServiceAddons<any>
  'scoring': Scoring & ServiceAddons<any>
  'flight-reveal': FlightReveal & ServiceAddons<any>
  'tasting-result': TastingResult & ServiceAddons<any>
}
