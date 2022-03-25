import {Tasting} from '../services/tasting/tasting.class'
import {ServiceAddons} from '@feathersjs/feathers'
import {Scoring} from '../services/scoring/scoring.class'
import {FlightReveal} from '../services/flight-reveal/flight-reveal.class'
import {Expose, Type} from 'class-transformer'
import 'reflect-metadata'
import {TastingResult} from '../services/tasting-result/tasting-result.class'

export type RevealAfter = 'flight' | 'never' | 'always'

export interface ServiceTypes {
  'tasting': Tasting & ServiceAddons<any>
  'scoring': Scoring & ServiceAddons<any>
  'flight-reveal': FlightReveal & ServiceAddons<any>
  'tasting-result': TastingResult & ServiceAddons<any>
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

export class ResultWineDto {
  flight = ''
  flightIndex = 0
  index = 0
  name = ''
  id = ''
}

// all the tasting results type need refactoring as soon as the query is improved
export class TastingResultBaseDataDto {
  title = ''
}

export class TastingResultDto {
  @Type(() => TastingResultBaseDataDto)
  @Expose({name: '_id'})
    tasting = new TastingResultBaseDataDto()
  @Type(() => SingleTastingResultDto)
    wineResults: SingleTastingResultDto[] = []
}

export class SingleTastingResultDto {
  @Type(() => ResultWineDto)
  @Expose({name: '_id'})
    wine = new ResultWineDto()
  avg = 0
  min = 0
  max = 0
  stddev = 0
  @Type(() => UserScoresDto)
    scores: UserScoresDto[] = []
}
