import {store} from "@/store";

export function useValidators() {
    return {
        isScoreInValidRange(value: number): boolean {
            const currentScale = store.getters.currentScoreScale.value

            return value >= currentScale.min && value <= currentScale.max
        },
        isUsernameValid(userName: string): boolean {
            return !(!userName || userName.length == 0);
        }
    }
}

