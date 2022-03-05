import {FlightDto, TastingDto, BaseWineDto} from './types'

export function mapApiDataToTasting(data: any): TastingDto {
    const tasting = new TastingDto()
    tasting.id = data._id ?? ''
    tasting.publicId = data.publicId ?? ''
    tasting.title = data.title ?? ''
    tasting.intro = data.intro ?? ''
    tasting.date = new Date(data.date)
    tasting.outro = data.outro ?? ''
    tasting.flights = []
    tasting.revealAfter = data.revealAfter

    if (data.flights && Array.isArray(data.flights)) {
        data.flights.map((flight: any) => {
            const tastingFlight = new FlightDto<BaseWineDto>()
            tastingFlight.id = flight._id
            tastingFlight.name = flight.name
            flight.wines.map((wine: BaseWineDto) => {
                tastingFlight.wines.push({
                    name: wine.name,
                    id: wine.id,
                    revealedName: tasting.revealAfter === 'always' ? wine.name : ''
                })
            })

            tasting.flights.push(tastingFlight)
        })
    }

    return tasting
}