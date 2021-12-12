import {Tasting} from '../services/tasting/tasting.class'
import {ServiceAddons} from '@feathersjs/feathers'
import {Scoring} from '../services/scoring/scoring.class'

export interface ServiceTypes {
  'tasting': Tasting & ServiceAddons<any>
  'scoring': Scoring & ServiceAddons<any>
}

export class UserScoresDto {
  userId = ''
  userName = ''
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
  revealAfter: 'flight' | 'never' | 'always' = 'flight'
}


export class FlightDto<T> {
  name = ''
  wines: T[] = []
}

export class BaseWineDto {
  name = ''
  id = ''
}
