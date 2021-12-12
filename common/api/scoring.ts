export class UserScoringDto {
    userId = ''
    userName = ''
    scores: ScoringDto[] = []
}

export class ScoringDto {
    wineId = ''
    score = 0
}

