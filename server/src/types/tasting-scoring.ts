import {ScoreDto, transformMongoIdToString} from './index'
import {IScoreUser} from './common'
import {Expose, Transform, Type} from 'class-transformer'

export type RevealAfter = 'flight' | 'never' | 'always'

export class TastingDto {
  @Expose({name: '_id'})
  @Transform(transformMongoIdToString)
    id = ''
  publicId = ''
  @Type(() => ScoringScale)
    scoringScale = new ScoringScale()
  @Type(() => FlightDto)
    flights: FlightDto[] = []
  title = ''
  @Type(() => Date)
    date = new Date()
  intro = ''
  outro = ''
  revealAfter: RevealAfter = 'flight'
}

export class FlightDto {
  @Expose({name: '_id'})
  @Transform(transformMongoIdToString)
    id = ''
  name = ''
  @Type(() => BaseWineDto)
    wines: BaseWineDto[] = []
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

export class UserScoresDto implements IScoreUser {
  userId = ''
  userName = ''
  isFinished = false
  @Type(() => ScoreDto)
    scores: ScoreDto[] = []
}

export interface IScoringScale {
  min: number
  max: number
}

export class ScoringScale implements IScoringScale {
  @Expose({name: '_id'})
  @Transform(transformMongoIdToString)
    id = ''
  name = ''
  min = 0
  max = 0
  @Type(() => ScoringScaleItem)
    items: ScoringScaleItem[] = []
}

export class ScoringScaleItem implements IScoringScale {
  description = ''
  min = 0
  max = 0
}
