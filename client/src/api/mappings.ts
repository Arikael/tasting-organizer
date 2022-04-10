import {TastingDto} from './types'

export function mapApiDataToTasting(tasting: TastingDto): TastingDto {
    tasting.date = new Date(tasting.date)

    return tasting
}
