export class BaseWine {
    name = ''
    id = ''
}

export class WineWithScore extends BaseWine {
    score = 0
}

export class Flight<T> {
    name = ''
    wines: T[] = []
}



export class Score {
    wineId = ''
    score = 0
}

export class TastingScoreData {
    username = ''
    flights: Flight<WineWithScore>[] = []
}

export class Tasting {
    flights: Flight<BaseWine>[] = []
    title = ''
    date: Date = new Date()
    intro = ''
    outro = ''
    revealAfter: 'flight' | 'submit' | 'admin' = 'flight'
}