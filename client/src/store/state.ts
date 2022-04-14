import {TastingDto, TastingResultDto} from '../api/types'
import {reactive} from "vue"
import {UnwrapNestedRefs} from "@vue/reactivity"
import {UserScoresDto} from '../api/types'
import {
    Step
} from "@/store/UiSteps";
import {ApplicationError} from "@/lib/useErrorHandling";

// separate state by module
export class State {
    language = ''
    tasting = new TastingDto()
    tastingId = ''
    tastingResults = new TastingResultDto()
    scoreData = new UserScoresDto()
    ui: {
        applicationError: ApplicationError | undefined,
        globalIsLoading: boolean,
        currentStep: Pick<Step, 'id' | 'type'>,
        steps: Step[]
    } = {
        applicationError: undefined,
        globalIsLoading: false,
        currentStep: {id: 'intro', type: 'intro'},
        steps: []
    }
}

export const state: UnwrapNestedRefs<State> = reactive(new State())
