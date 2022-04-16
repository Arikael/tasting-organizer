import {store} from "@/store";
import {computed, ref, watch, WritableComputedRef} from "vue";
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

    watch(scoreStatus, (val, oldVal) => console.log(val.value, oldVal.value))

    const setScore = (value: number) => {
        console.log('val: ' + value + " local-state: " + scoreStatus.value.value + " state: " + store.getters.getScore(id)?.score)
        const score = parseInt(value.toString(10), 10)

        if (!isNaN(score) && id) {
            scoreStatus.value.value = score
            store.setters.setScore(id, score).then((x: boolean | UserScoresDto) => {
                if (x === false) {
                    scoreStatus.value.ok = false
                } else {
                    scoreStatus.value.ok = true
                    console.log('score set')
                    setLocalScoreFromState(id, score)
                }
                console.log('val: ' + value + " local-state: " + scoreStatus.value.value + " state: " + store.getters.getScore(id)?.score)
                console.log('--------')
            })
        } else {
            scoreStatus.value.ok = false
        }

    }

    // const score: WritableComputedRef<number> = computed({
    //         get(): number {
    //             return scoreStatus.value.value
    //         },
    //         set(value: number): void {
    //             setScore(value)
    //         }
    //     }
    // )

    const score = computed(() => scoreStatus.value.value)

    return {
        setLocalScoreFromState,
        setScore,
        currentScale: store.getters.currentScoreScale,
        scoreStatus: computed(() => scoreStatus.value),
        score
    }
}
