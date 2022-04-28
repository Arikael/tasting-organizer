import {UiStep} from '@/store/UiSteps';
import getters from '@/store/getters';
import {state} from '@/store/state';
import setters from '@//store/setters';
import {mapApiDataToTasting} from '@/api/mappings';
import {useApiClient} from '@/api/client';
import {BaseWineDto, TastingDto, TastingResultDto, UserScoresDto} from '@/api/types'
import {useBrowserStorageUtils} from "@/lib/useBrowserStorageUtils";
import {plainToInstance} from "class-transformer";
import {store} from "@/store/index";
import {useErrorHandling} from "@/lib/useErrorHandling";
import {useValidators} from "@/modules/scoring/useValidators";

async function finishScoring(): Promise<UserScoresDto> {
    state.scoreData.isFinished = true

    const scores = await updateScores()
    store.actions.moveToEnd()

    return scores
}

async function updateScores(): Promise<UserScoresDto> {
    store.state.ui.isSaving = true
    const service = useApiClient().service('scoring')
    const newScores = await service.update(state.tasting.id, state.scoreData)
    store.state.ui.isSaving = false

    return newScores
}

async function saveAndMoveForward(): Promise<boolean> {
    try {
        await updateScores()
    } catch (error) {
        console.log(error)
        return false
    }

    return await moveUi('next')
}

async function moveUi(step: UiStep): Promise<boolean> {
    let index = getters.currentStepIndex.value

    if (index === -1) {
        index = 0
    }

    const newIndex = step === 'next' ? index + 1 : index - 1

    if (newIndex >= 0 && newIndex <= state.ui.steps.length - 1) {
        const newStep = state.ui.steps[newIndex]

        // TODO make more dynamic and/or use Pinia
        if (newStep.type === 'reveal') {
            await loadCurrentRevealedWines()
        }

        setters.setCurrentStep(state.ui.steps[newIndex])

        return true
    }

    return false
}

function moveToEnd() {
    const endStep = state.ui.steps.find(x => x.type === 'end')

    if (endStep) {
        setters.setCurrentStep(endStep)
    }
}

async function loadTastingForScoring(): Promise<boolean> {
    store.state.ui.globalIsLoading = true
    const id = useBrowserStorageUtils().loadTastingIdFromBrowser();
    const client = useApiClient()
    const tasting$ = client.service('tasting').get(id).then((result: Partial<TastingDto>) => {
        const tmp = plainToInstance(TastingDto, result)
        state.tasting = mapApiDataToTasting(tmp)
        state.tastingId = state.tasting.id

        return state.tasting
    })

    let scoring$ = new Promise<UserScoresDto>((resolve) => {
        resolve(new UserScoresDto())
    })

    const userId = useBrowserStorageUtils().readUserIdFromBrowser(id)

    if (userId) {
        scoring$ = client.service('scoring').get(id, {query: {userId: userId}})
            .then((x: UserScoresDto) => state.scoreData = x)
    }

    return await Promise.all([tasting$, scoring$]).then((values) => {
        setters.setUiSteps(values[0])

        if (store.state.scoreData.isFinished) {
            store.state.ui.scoringIsFinishedOnLoading = true
            moveToEnd()
        }

        store.state.ui.globalIsLoading = false

        const valid = useValidators().isUsernameValid(values[1].userName)
        setters.setStepModelValidity(valid)

        return true
    }).catch(err => {
        useErrorHandling().actions.setError(err?.code, 'unableToLoadTasting', err?.stack)
        return false
    })
}

async function loadCurrentRevealedWines() {
    const flight = getters.currentFlight?.value

    if (flight.wines.every((x: BaseWineDto) => x.revealedName)) {
        return
    }

    if (flight && state.tasting.revealAfter === 'flight') {
        return useApiClient().service('flight-reveal').get(flight.id, {
            query: {
                publicId: state.tasting.publicId
            }
        }).then(flightReveal => {
            // TODO: maybe use Id.
            if (flightReveal.wines.length !== flight.wines.length) {
                throw `flightReveal returned ${flightReveal.wines.length} names whereas flight expects ${flight.wines.length} names`
            }
            for (let i = 0; i < flightReveal.wines.length; i++) {
                flight.wines[i].revealedName = flightReveal.wines[i]
            }
        })
    }
}

async function loadTastingResults(id: string, onlyMyScores: boolean): Promise<TastingResultDto> {
    const client = useApiClient()

    let params = {}

    if(onlyMyScores) {
        const currentUser = store.getters.currentUser.value
        params = {query: {userId: currentUser}}
    }

    return client.service('tasting-result').get(id, params).then((result: TastingResultDto) => {
        const tmp = plainToInstance(TastingResultDto, result)
        // this is an ugly workaround because the type annotation for date doesn't seem to work properly
        tmp.tasting.date = new Date(tmp.tasting.date);
        state.tastingResults = tmp
        state.tastingId = state.tastingResults.tasting.publicId

        return state.tastingResults
    })
}

export default {
    loadTastingForScoring,
    loadTastingResults,
    loadCurrentRevealedWines,
    moveUi,
    moveToEnd,
    finishScoring,
    saveAndMoveForward
}