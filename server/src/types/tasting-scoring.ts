import {ScoreDto} from './index'
import {IScoreUser} from './common'

export type RevealAfter = 'flight' | 'never' | 'always'


export class TastingDto {
  id = ''
  publicId = ''
  flights: FlightDto<BaseWineDto>[] = []
  title = ''
  date = new Date()
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

export class UserScoresDto implements IScoreUser {
  userId = ''
  userName = ''
  isFinished = false
  scores: ScoreDto[] = []
}
