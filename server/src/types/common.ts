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
