import {BaseWine, Flight, Tasting, TastingScoreData, WineWithScore} from "@/modules/scoring/Entities";
import {getTastingDataForScoring} from "@/api/store";

export const initializeCurrentTasting = (tastingId: string): { baseData: Tasting, scoreData: TastingScoreData } => {
    const tastingData = getTastingDataForScoring(tastingId)

    const scoreData = new TastingScoreData()
    tastingData.flights.map((flight: Flight<BaseWine>) => {
        const scoreFlight = new Flight<WineWithScore>()
        flight.wines.map((wine: BaseWine) => {
            scoreFlight.wines.push({
                name: wine.name,
                id: wine.id,
                score: 0
            })
        })

        scoreData.flights.push(scoreFlight)
    })

    return {baseData: tastingData, scoreData}
}