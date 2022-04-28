import {store} from "@/store";
import {computed, reactive, WritableComputedRef} from "vue";
import {FormFieldState} from "@/lib/types";

export function useScoringForWine(id: string) {
    const scoreStatus = reactive<FormFieldState>(new FormFieldState())

    const setScore = (value: number) => {
        const score = parseInt(value.toString(10), 10)

        if (!isNaN(score) && id) {
            scoreStatus.ok = store.setters.setScore(id, score)
        }
    }

    const score: WritableComputedRef<number> = computed({
            get(): number {
                return store.getters.getScore(id)?.score ?? 0
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