import {store} from "@/store";
import {computed, ref, WritableComputedRef} from "vue";
import {FormFieldState} from "@/lib/types";
import {UserScoresDto} from '@/api/types'

export function useScoringValidators() {
    return {
        isInValidRange(value: number): boolean {
            const currentScale = store.getters.currentScoreScale.value

            return value >= currentScale.min && value <= currentScale.max
        }
    }
}

export function useScoringForWine(id: string) {
    const scoreStatus = ref<FormFieldState<number>>(new FormFieldState<number>(0))

    const setLocalScoreFromState = (wineId: string, defaultValue = 0) => {
        if (wineId) {
            scoreStatus.value.value = store.getters.getScore(wineId)?.score ?? defaultValue
        }
    }

    const setScore = (value: number) => {
        const score = parseInt(value.toString(10), 10)

        if (!isNaN(score) && id) {
            scoreStatus.value.value = score
            store.setters.setScore(id, score).then((x: boolean | UserScoresDto) => {
                if (x === false) {
                    scoreStatus.value.ok = false
                } else {
                    scoreStatus.value.ok = true

                    setLocalScoreFromState(id, score)
                }
            })
        } else {
            scoreStatus.value.ok = false
        }
    }

    const score: WritableComputedRef<number> = computed({
            get(): number {
                return scoreStatus.value.value
            },
            set(value: number): void {
                setScore(value)
            }
        }
    )

    return {
        setLocalScoreFromState,
        currentScale: store.getters.currentScoreScale,
        scoreStatus: computed(() => scoreStatus.value),
        score
    }
}
