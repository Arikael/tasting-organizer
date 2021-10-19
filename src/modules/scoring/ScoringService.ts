import {Tasting} from "@/modules/scoring/BaseWine";
import {getTastingDataForScoring} from "@/api/api";

export const initializeCurrentTasting = (): Tasting => {
    const scoringData = getTastingDataForScoring("d")

    return scoringData
}