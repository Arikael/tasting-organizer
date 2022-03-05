import {TastingDto} from '../api/types'
import {reactive} from "vue"
import {UnwrapNestedRefs} from "@vue/reactivity"
import {UserScoresDto} from '../api/types'
import {
    Step
} from "@/store/UiSteps";

export class State {
    tasting = new TastingDto()
    scoreData = new UserScoresDto()
    ui: {
        currentStep: Pick<Step, 'id' | 'type'>,
        currentStepIndexChange: number,
        steps: Step[]
    } = {
        currentStep: {id: 'intro', type: 'intro'},
        currentStepIndexChange: 0,
        steps: []
    }
}

export const state: UnwrapNestedRefs<State> = reactive(new State())
