import {stepConfiguration, UiStep} from "@/store/UiSteps";
import getters from "@/store/getters";
import {state} from "@/store/state";
import setters from "@/store/setters";
import {mapApiDataToTasting} from "@/api/mappings";
import {useApiClient} from "@/api/client";
import {TastingDto, UserScoresDto} from '@/api/types'

async function moveUi(step: UiStep): Promise<boolean> {
    let index = getters.currentStepIndex.value
    if (index === -1) {
        index = 0
    }

    const newIndex = step === 'next' ? index + 1 : index - 1

    if (index >= 0 && index < state.ui.steps.length) {
        // TODO handle return
        setters.setCurrentStepIndexChange(newIndex)

        const stepId = state.ui.steps[index].id
        const stepConfig = stepConfiguration.find(x => x.id === stepId)

        if (stepConfig !== undefined && stepConfig.move !== undefined) {
            let config = {}

            if (stepConfig.getConfig !== undefined) {
                config = stepConfig.getConfig(state)
            }

            const hasStepped = await stepConfig.move(config, state)

            if (hasStepped) {
                setters.setCurrentStep(state.ui.steps[newIndex].id)
            }

            return false
        } else {
            setters.setCurrentStep(state.ui.steps[newIndex].id)
            return true
        }
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

    return await Promise.all([tasting$, scoring$]).then(() => true).catch(() => false)
}

export default {
    loadTastingForScoring,
    moveUi
}