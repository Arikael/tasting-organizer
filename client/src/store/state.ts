import {TastingDto} from '../api/types'
import {reactive} from "vue"
import {UnwrapNestedRefs} from "@vue/reactivity"
import {UserScoresDto} from '../api/types'
import {
    FlightStepState, StepIds
} from "@/store/UiSteps";

export class State {
    tasting = new TastingDto()
    scoreData = new UserScoresDto()
    ui: {
        currentStep: StepIds,
        currentStepIndexChange: number,
        steps: {
            id: StepIds,
            stepState: Record<string, unknown>
        }[]
    } = {
        currentStep: 'intro',
        currentStepIndexChange: 0,
        steps:
            [
                {
                    id: 'intro',
                    stepState: {}
                },
                {
                    id: 'flight',
                    stepState: {
                        flightIndex: 0,
                        isOnFlightReveal: false,
                        revealedWines: []
                    } as FlightStepState
                }
            ]
    }
}

export const state: UnwrapNestedRefs<State> = reactive(new State())
