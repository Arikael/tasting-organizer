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

export interface IScoreUser {
  userId: string
  userName: string
}

export class UserScoresDto implements IScoreUser {
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
  name = ''
  id = ''
  wineNr = ''
}

// all the tasting results type need refactoring as soon as the query is improved
export class TastingResultDto {
  @Type(() => TastingResultBaseDataDto)
    tasting = new TastingResultBaseDataDto()
  @Type(() => SingleTastingResultDto)
    wineResults: SingleTastingResultDto[] = []
  highAndLowScores: { [key: string]: number } = {}
}

export class TastingResultBaseDataDto {
  publicId = ''
  title = ''
}

export class SingleTastingResultDto {
  @Type(() => ResultWineDto)
  @Expose({name: '_id'})
    wine = new ResultWineDto()
  avg = 0
  min = 0
  max = 0
  stddev = 0
  @Type(() => ScoreWithUserDto)
    scores: ScoreWithUserDto[] = []
}

export class ScoreWithUserDto extends ScoreDto implements IScoreUser {
  userId = ''
  userName = ''
}
