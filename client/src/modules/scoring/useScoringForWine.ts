import {store} from "@/store";
import {computed, reactive, WritableComputedRef} from "vue";
import {FormFieldState} from "@/lib/types";

export function useScoringForWine(id: string) {
    const currentScale = store.getters.currentScoreScale
    const defaultScore = Math.round((currentScale.value.max - currentScale.value.min) / 2) + currentScale.value.min
    const scoreStatus = reactive<FormFieldState>(new FormFieldState())

    const setScore = (value: number) => {
        const score = parseInt(value.toString(10), 10)

        if (!isNaN(score) && id) {
            scoreStatus.ok = store.setters.setScore(id, score)
            console.log(scoreStatus.ok)
        }
    }

    const score: WritableComputedRef<number> = computed({
            get(): number {
                return store.getters.getScore(id)?.score ?? defaultScore
            },
            set(value: number): void {
                setScore(value)
            }
        }
    )

    return {
        setScore,
        currentScale: store.getters.currentScoreScale,
        scoreStatus: computed(() => scoreStatus),
        score
    }
}