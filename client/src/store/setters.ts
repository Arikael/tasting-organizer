import {state} from '@/store/state';
import {createId} from '@/helpers';
import {useApiClient} from '@/api/client';
import getters from '@/store/getters';
import {TastingDto, UserScoresDto} from '@/api/types'
import {Step} from "@/store/UiSteps";
import {useScoringValidators} from "@/modules/scoring/useScoringValidators";
import {store} from "@/store/index";

// TODO move all setters to actions

function setCurrentStep(step: Step) {
    state.ui.currentStep = step
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

async function setScore(wineId: string, score: number): Promise<UserScoresDto | boolean> {
    const scoreData = getters.getScore(wineId)

    const result = useScoringValidators().isInValidRange(score)

    if (!result) {
        return false
    }

    if (scoreData) {
        scoreData.score = score
    } else {
        state.scoreData.scores.push({
            score,
            wineId
        })
    }

    return updateScores()
}

async function finishScoring(): Promise<UserScoresDto> {
    state.scoreData.isFinished = true

    return updateScores()
}

async function updateScores(): Promise<UserScoresDto> {
    const service = useApiClient().service('scoring')
    return await service.update(state.tasting.id, state.scoreData)
}

function setUiSteps(tasting: TastingDto) {
    state.ui.steps.push({
        id: 'intro',
        type: 'intro'
    })

    for (const flight of tasting.flights) {
        state.ui.steps.push({
            id: `flight-${flight.id}`,
            type: 'flight'
        })

        if (tasting.revealAfter === 'flight') {
            state.ui.steps.push({
                id: `reveal-${flight.id}`,
                type: 'reveal'
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

function setLanguage(lang: string) {
    if (lang != 'de' && lang != 'en-US') {
        lang = 'en-US'
    }

    store.state.language = lang
}

export default {
    setScore,
    setCurrentStep,
    setUser,
    setUiSteps,
    finishScoring,
    setLanguage
}