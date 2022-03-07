import {UiStep} from '@/store/UiSteps';
import getters from '@/store/getters';
import {state} from '@/store/state';
import setters from '@//store/setters';
import {mapApiDataToTasting} from '@/api/mappings';
import {useApiClient} from '@/api/client';
import {TastingDto, UserScoresDto} from '@/api/types'

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

async function loadTastingForScoring(id: string): Promise<boolean> {
    const client = useApiClient()
    const tasting$ = client.service('tasting').get(id).then((result: Partial<TastingDto>) => {
        state.tasting = mapApiDataToTasting(result)

        return state.tasting
    })

    let scoring$ = new Promise<UserScoresDto>((resolve) => {
        resolve(new UserScoresDto())
    })

    const localData = window.localStorage.getItem('tasting-organizer')

    if (localData) {
        const localObject = JSON.parse(localData)

        if (localObject[id]) {
            scoring$ = client.service('scoring').get(id, {query: {userId: localObject[id]}})
                .then((x: UserScoresDto) => state.scoreData = x)
        }
    }

    return await Promise.all([tasting$, scoring$]).then((values) => {
        setters.setUiSteps(values[0])

        return true
    }).catch(() => false)
}

async function loadCurrentRevealedWines() {
    const flight = getters.currentFlight?.value


    if (flight.wines.every(x => x.revealedName)) {
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


export default {
    loadTastingForScoring,
    loadCurrentRevealedWines,
    moveUi
}