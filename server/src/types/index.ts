import {Tasting} from '../services/tasting/tasting.class'
import {ServiceAddons} from '@feathersjs/feathers'
import {Scoring} from '../services/scoring/scoring.class'
import {FlightReveal} from '../services/flight-reveal/flight-reveal.class'

export type RevealAfter = 'flight' | 'never' | 'always'

export interface ServiceTypes {
  'tasting': Tasting & ServiceAddons<any>
  'scoring': Scoring & ServiceAddons<any>
  'flight-reveal': FlightReveal & ServiceAddons<any>
}

export class UserScoresDto {
  userId = ''
  userName = ''
  isFinished = false
  scores: ScoreDto[] = []
}


export class ScoreDto {
  wineId = ''
  score = 0
}

export class TastingDto {
  id = ''
  publicId = ''
  flights: FlightDto<BaseWineDto>[] = []
  title = ''
  date: Date = new Date()
  intro = ''
  outro = ''
  revealAfter: RevealAfter = 'flight'
}


export class FlightDto<T> {
  id = ''
  name = ''
  wines: T[] = []
}

export class BaseWineDto {
  name = ''
  id = ''
  revealedName = ''
}

export class FlightRevealDto {
  flightId = ''
  revealAfter: RevealAfter = 'flight'
  wines: string[] = []

}
