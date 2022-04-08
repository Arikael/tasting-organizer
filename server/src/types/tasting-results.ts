
// all the tasting results type need refactoring as soon as the query is improved
import {Expose, Type} from 'class-transformer'
import {ScoreWithUserDto} from './index'

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
  @Type(() => Date)
    date = new Date()
}


export class ResultWineDto {
  flight = ''
  name = ''
  id = ''
  wineNr = ''
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
