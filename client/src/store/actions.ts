import {UiStep} from '@/store/UiSteps';
import getters from '@/store/getters';
import {state} from '@/store/state';
import setters from '@//store/setters';
import {mapApiDataToTasting} from '@/api/mappings';
import {useApiClient} from '@/api/client';
import {BaseWineDto, TastingDto, TastingResultDto, UserScoresDto} from '@/api/types'
import {useUtils} from "@/lib/useUtils";
import {plainToInstance} from "class-transformer";
import {store} from "@/store/index";
import {useErrorHandling} from "@/lib/useErrorHandling";

async function moveUi(step: UiStep): Promise<boolean> {
    let index = getters.currentStepIndex.value

    if (index === -1) {
        index = 0
    }

    const newIndex = step === 'next' ? index + 1 : index - 1

    if (newIndex >= 0 && newIndex <= state.ui.steps.length - 1) {
        const step = state.ui.steps[newIndex]

        // TODO make more dynamic and/or use Pinia
        if (step.type === 'reveal') {
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
    const id = useUtils().loadTastingIdFromBrowser();
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

    const userId = useUtils().readUserIdFromBrowser(id)

    if (userId) {
        scoring$ = client.service('scoring').get(id, {query: {userId: userId}})
            .then((x: UserScoresDto) => state.scoreData = x)
    }

    return await Promise.all([tasting$, scoring$]).then((values) => {
        setters.setUiSteps(values[0])

        if (store.state.scoreData.isFinished) {
            store.state.ui.isFinishedOnLoading = true
            moveToEnd()
        }

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

async function loadTastingResults(): Promise<TastingResultDto> {
    const id = useUtils().loadTastingIdFromBrowser();
    const client = useApiClient()

    return client.service('tasting-result').get(id).then((result: TastingResultDto) => {
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
    moveToEnd
}