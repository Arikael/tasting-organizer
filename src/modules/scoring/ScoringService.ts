import {Flight, Tasting, TastingScoreData, WineWithScore} from "@/modules/scoring/Entities";
import {getTastingDataForScoring} from "@/api/api";

export const initializeCurrentTasting = (tastingId: string): { baseData: Tasting, scoreData: TastingScoreData } => {
    const tastingData = getTastingDataForScoring(tastingId)

    const scoreData = new TastingScoreData()
    tastingData.flights.map((flight) => {
        const scoreFlight = new Flight<WineWithScore>()
        flight.wines.map((wine) => {
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