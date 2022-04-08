import {store} from "@/store";

export function useScoringValidators() {
    return {
        isInValidRange(value: number): boolean {
            const currentScale = store.getters.currentScoreScale.value

            return value >= currentScale.min && value <= currentScale.max
        }
    }
}