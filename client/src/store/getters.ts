import {UnwrapNestedRefs} from "@vue/reactivity";
import {BaseWineDto, FlightDto, ScoreDto, TastingDto, UserScoresDto} from "@/api/types";
import {state} from "@/store/state";
import {isFlightStepState} from "@/store/UiSteps";
import {computed} from "vue";

function getCurrentStepState(): Record<string, unknown> {
    if (state.ui.currentStep !== undefined) {
        const currentStep = state.ui.steps.find(x => x.id === state.ui.currentStep)

        if (currentStep !== undefined) {
            return currentStep?.stepState
        }
    }

    return {}
}

function getCurrentStepIndex(): number {
    return state.ui.steps.findIndex(x => x.id === state.ui.currentStep)
}

function getTasting(): Readonly<UnwrapNestedRefs<TastingDto>> {
    return state.tasting
}

function getScoreData(): UserScoresDto {
    return state.scoreData
}

function getScore(wineId: string): ScoreDto | undefined {
    const scoreData = state.scoreData.scores.find(x => x.wineId === wineId)

    return scoreData ? scoreData : undefined
}

function getCurrentFlight(): FlightDto<BaseWineDto> {
    const stepState = getCurrentStepState()

    if (state.ui.currentStep == 'flight' && stepState
        && isFlightStepState(stepState)) {
        return state.tasting.flights[stepState.flightIndex]
    }

    return new FlightDto<BaseWineDto>()
}

function getCurrentRevealedWines() {
    const stepState = getCurrentStepState()

    if (stepState !== undefined && isFlightStepState(stepState)) {
        return stepState.revealedWines
    }
}

function isOnFlightRevealStep(): boolean {
    const stepState = getCurrentStepState()

    if (isFlightStepState(stepState)) {
        return stepState.isOnFlightReveal
    }

    return false
}

function isOnFirstStep(): boolean {
    console.log(state)
    return getCurrentStepIndex() <= 0
}

function isOnLastStep(): boolean {
    return getCurrentStepIndex() > state.ui.steps.length
}

function canMoveForward(): boolean {
    return !isOnLastStep()
}

function canMoveBack(): boolean {
    return !isOnFirstStep()
}

export default {
    isOnLastStep: computed(() => isOnLastStep()),
    isOnFirstStep: computed(() => isOnFirstStep()),
    canMoveBack: computed(() => canMoveBack()),
    canMoveForward: computed(() => canMoveForward()),
    isOnFlightRevealStep: computed(() => isOnFlightRevealStep()),
    currentStepState: computed(() => getCurrentStepState()),
    currentStepIndex: computed(() => getCurrentStepIndex()),
    getScore,
    getTasting,
    currentFlight: computed(() => getCurrentFlight()),
    currentRevealedWines: computed(() => getCurrentRevealedWines())
}