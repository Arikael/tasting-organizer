import {state} from '@/store/state';
import {createId} from '@/helpers';
import getters from '@/store/getters';
import {TastingDto} from '@/api/types'
import {Step} from "@/store/UiSteps";
import {useValidators} from "@/modules/scoring/useValidators";
import {store} from "@/store/index";

// TODO move all setters to actions
function setCurrentStep(step: Step) {
    state.ui.currentStep = step
}

function setUser(userName: string): boolean {
    const valid = useValidators().isUsernameValid(userName)
    setStepModelValidity(valid)

    state.scoreData.userName = userName

    if (!state.scoreData.userId) {
        state.scoreData.userId = createId(4)
    }

    createLocalTastingData()

    return valid
}

function setScore(wineId: string, score: number): boolean {
    const scoreData = getters.getScore(wineId)
    const valid = useValidators().isScoreInValidRange(score)
    setStepModelValidity(valid)

    if (scoreData) {
        scoreData.score = score
    } else {
        state.scoreData.scores.push({
            score,
            wineId
        })
    }

    return valid
}

function setUiSteps(tasting: TastingDto) {
    state.ui.steps.push({
        id: 'intro',
        type: 'intro',
        modelIsValid: false,
    })

    for (const flight of tasting.flights) {
        state.ui.steps.push({
            id: `flight-${flight.id}`,
            type: 'flight',
            modelIsValid: true
        })

        if (tasting.revealAfter === 'flight') {
            state.ui.steps.push({
                id: `reveal-${flight.id}`,
                type: 'reveal',
                modelIsValid: true
            })
        }
    }

    state.ui.steps.push({
        id: 'end',
        type: 'end',
        modelIsValid: true
    })
}

function createLocalTastingData() {
    const localData: any = {}
    localData[state.tasting.publicId] = state.scoreData.userId

    window.localStorage.setItem('tasting-organizer', JSON.stringify(localData))
}

function setLanguage(lang: string) {
    if (lang != 'de' && lang != 'en-US') {
        lang = 'en-US'
    }

    store.state.language = lang
}

function setStepModelValidity(valid: boolean) {
    const currentStep = store.getters.currentStepState

    if(!currentStep.value) {
        return
    }

    currentStep.value.modelIsValid = valid
}

export default {
    setScore,
    setCurrentStep,
    setUser,
    setUiSteps,
    setLanguage,
    setStepModelValidity
}