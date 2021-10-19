export class BaseWine {
    name = ''
    id = ''
}

export class WineWithScore extends BaseWine {
    score = 0
}

export class BaseFlight {
    name = ''
    wines: BaseWine[] = []
}

export class Tasting {
    flights: BaseFlight[] = []
    name = ''
}