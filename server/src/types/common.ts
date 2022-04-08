import {TransformFnParams} from 'class-transformer'

export const transformMongoIdToString = (params: TransformFnParams) => {
  return params.obj._id.toHexString()
}

export interface IScoreUser {
  userId: string
  userName: string
}

export class ScoreDto {
  wineId = ''
  score = 0
}

export class ScoreWithUserDto extends ScoreDto implements IScoreUser {
  userId = ''
  userName = ''
}
