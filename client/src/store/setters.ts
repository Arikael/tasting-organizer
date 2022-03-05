import {state} from '@/store/state';
import {createId} from '@/helpers';
import {useApiClient} from '@/api/client';
import getters from '@/store/getters';
import {TastingDto, UserScoresDto} from '@/api/types'
import {Step} from "@/store/UiSteps";

// TODO move all setters to actions

function setCurrentStep(step: Step) {
    state.ui.currentStep = step
}

function trySetCurrentStepIndexChange(newIndex: number): boolean {
    const currentStepIndex = getters.currentStepIndex.value

    if(currentStepIndex + newIndex < 0 || currentStepIndex + newIndex > state.ui.steps.length) {
        return false
    }

    state.ui.currentStepIndexChange = newIndex

    return true
}

function setUser(userName: string): void {
    state.scoreData.userName = userName

    if (!state.scoreData.userId) {
        state.scoreData.userId = createId(4)
    }

    const service = useApiClient().service('scoring')
    service.update(state.tasting.id, state.scoreData).then((x: any) => console.log(x))

    createLocalTastingData()
}

async function  setScore(wineId: string, score: number): Promise<UserScoresDto> {
    const scoreData = getters.getScore(wineId)

    if (scoreData) {
        scoreData.score = score
    } else {
        state.scoreData.scores.push({
            score,
            wineId
        })
    }

    const service = useApiClient().service('scoring')
    return await service.update(state.tasting.id, state.scoreData)
}

function setUiSteps(tasting: TastingDto) {
    state.ui.steps.push({
        id: 'intro',
        type: 'intro'
    })

    for(const flight of tasting.flights) {
        state.ui.steps.push({
            id: `flight-${flight.id}`,
            type: 'flight'
        })

        if(tasting.revealAfter === 'flight') {
            state.ui.steps.push({
                id: `reveal-${flight.id}`,
                type: 'reveal',
                stepState: {
                    revealedWines: []
                }
            })
        }
    }

    state.ui.steps.push({
        id: 'end',
        type: 'end'
    })
}

function createLocalTastingData() {
    const localData: any = {}
    localData[state.tasting.publicId] = state.scoreData.userId

    window.localStorage.setItem('tasting-organizer', JSON.stringify(localData))
}

export default {
    setScore,
    setCurrentStep,
    setUser,
    trySetCurrentStepIndexChange: trySetCurrentStepIndexChange,
    setUiSteps
}