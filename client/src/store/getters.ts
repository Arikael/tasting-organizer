import {UnwrapNestedRefs} from '@vue/reactivity';
import {BaseWineDto, FlightDto, ScoreDto, TastingDto} from '@/api/types';
import {state} from './state';
import {computed} from 'vue';
import {Step} from './UiSteps';

function getCurrentStep(): Step | undefined {
    if (state.ui.currentStep !== undefined) {
        const currentStep = state.ui.steps.find(x => x.id === state.ui.currentStep.id)

        if (currentStep !== undefined) {
            return currentStep
        }
    }

    return undefined
}

function getCurrentStepIndex(): number {
    return state.ui.steps.findIndex(x => x.id === state.ui.currentStep.id)
}

function getTasting(): Readonly<UnwrapNestedRefs<TastingDto>> {
    return state.tasting
}

function getScore(wineId: string): ScoreDto | undefined {
    const scoreData = state.scoreData.scores.find(x => x.wineId === wineId)

    return scoreData ? scoreData : undefined
}

function getCurrentFlight(): FlightDto<BaseWineDto> {
    const step = getCurrentStep()

    // TODO: handle flight id better
    if (step && (step.type === 'flight' || step.type === 'reveal')) {
        const id = step.id.replace('flight-', '').replace('reveal-', '')
        return state.tasting.flights.find(x => x.id === id) ?? new FlightDto<BaseWineDto>()
    }

    return new FlightDto<BaseWineDto>()
}

function isOnFlightRevealStep(): boolean {
    const step = getCurrentStep()

    return step !== undefined && step.type === 'reveal'
}

function getCurrentRevealedWines(): string[] {
    const currentFlight = getCurrentFlight()

    return currentFlight.wines.map(x => x.revealedName)
}

function isOnFirstStep(): boolean {
    return getCurrentStepIndex() <= 0
}

function isOnLastStep(): boolean {
    return getCurrentStepIndex() >= state.ui.steps.length - 1
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
    currentStepState: computed(() => getCurrentStep()),
    currentStepIndex: computed(() => getCurrentStepIndex()),
    getScore,
    getTasting,
    currentFlight: computed(() => getCurrentFlight()),
    currentRevealedWines: computed(() => getCurrentRevealedWines())
}
