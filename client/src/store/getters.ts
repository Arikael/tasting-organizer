import {UnwrapNestedRefs} from '@vue/reactivity';
import {FlightDto, ScoreDto, ScoringScale, TastingDto} from '@/api/types';
import {state} from './state';
import {computed} from 'vue';
import {Step, StepTypes} from './UiSteps';
import {useUtils} from "@/lib/useUtils";
import {useErrorHandling} from "@/lib/useErrorHandling";

function isStepTypeMatch(step: Step | undefined, type: StepTypes) {
    return step !== undefined && step.type === type
}

function currentUser(): string {
    return useUtils().readUserIdFromBrowser(state.tastingId)
}

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

function getCurrentFlight(): FlightDto {
    const step = getCurrentStep()

    // TODO: handle flight id better
    if (step && (step.type === 'flight' || step.type === 'reveal')) {
        const id = step.id.replace('flight-', '').replace('reveal-', '')
        return state.tasting.flights.find(x => x.id === id) ?? new FlightDto()
    }

    return new FlightDto()
}

function getCurrentFlightIndex(): number {
    const currentFlight = getCurrentFlight()

    if (!currentFlight) {
        return -1
    }

    return state.tasting.flights.findIndex(x => x.id === currentFlight.id)
}

function getCurrentScoreScale(): ScoringScale {
    return state.tasting.scoringScale
}

function getCurrentScoreScaleMarkerSteps(): {value: number, label: string}[] {
    const config = []
    const currentScoreScale = getCurrentScoreScale()

    const range = (currentScoreScale.max - currentScoreScale.min) / currentScoreScale.markerStepsEvery

    for(let r = 0; r < range; r++) {
        config[r+1] = {value: r * range + currentScoreScale.min, label: (r * range + currentScoreScale.min).toFixed(0)}
    }

    config[config.length] = {value: currentScoreScale.max, label: currentScoreScale.max.toFixed(0)}

    return config
}

function isOnFlightRevealStep(): boolean {
    const step = getCurrentStep()

    return isStepTypeMatch(step, 'reveal')
}

function getCurrentRevealedWines(): string[] {
    const currentFlight = getCurrentFlight()

    return currentFlight.wines.map(x => x.revealedName)
}

function isOnFirstStep(): boolean {
    return getCurrentStepIndex() <= 0
}

function isOnLastStepBeforeEndStep(): boolean {
    const currentIndex = getCurrentStepIndex()
    const endStepIndex = state.ui.steps.findIndex(x => x.type === 'end')

    return currentIndex + 1 === endStepIndex;
}

function isOnEndStep(): boolean {
    const step = getCurrentStep()

    return isStepTypeMatch(step, 'end')
}

function isOnLastStep(): boolean {
    return getCurrentStepIndex() >= state.ui.steps.length - 1
}

function canMoveForward(): boolean {
    return !isOnLastStepBeforeEndStep()
}

function canMoveBack(): boolean {
    return !isOnFirstStep()
}

function isTastingResultLoaded(): boolean {
    return !!state.tastingResults.tasting.publicId;
}

export default {
    isTastingResultLoaded: computed(() => isTastingResultLoaded()),
    isOnEndStep: computed(() => isOnEndStep()),
    isOnLastStepBeforeEndStep: computed(() => isOnLastStepBeforeEndStep()),
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
    currentRevealedWines: computed(() => getCurrentRevealedWines()),
    currentUser: computed(() => currentUser()),
    currentScoreScale: computed(() => getCurrentScoreScale()),
    ...useErrorHandling().getters,
    currentFlightIndex: computed(() => getCurrentFlightIndex()),
    currentScoreScaleMarkerSteps: computed(() => getCurrentScoreScaleMarkerSteps())
}
