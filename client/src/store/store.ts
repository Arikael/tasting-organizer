import {ScoreDto, TastingDto} from '../api/types'
import feathers from "@feathersjs/feathers"
import {createClient} from "@/api/client"
import {reactive} from "vue"
import {createId} from "@/helpers"
import {UnwrapNestedRefs} from "@vue/reactivity"
import {ServiceTypes, UserScoresDto} from '../api/types'
import {
    FlightStepConfig,
    flightStepMove,
    FlightStepState, isFlightStepState,
    UiStep,
    UiStepConfiguration
} from "@/store/UiSteps";
import {mapApiDataToTasting} from '@/api/mappings'

export class State {
    tasting = new TastingDto()
    scoreData = new UserScoresDto()
    test: Record<string, any> = {}
    ui: {
        currentStep: string,
        currentStepState: Record<string, any>
    } = {currentStep: '', currentStepState: {}}
}

export class Store {
    public get tasting(): UnwrapNestedRefs<TastingDto> {
        return this.state.tasting
    }

    public get scoreData(): UserScoresDto {
        return this.state.scoreData
    }

    public uiStepConfigurations: UiStepConfiguration[] = [
        {
            id: 'intro',
            state: {}
        },
        {
            id: 'flight',
            move: flightStepMove,
            state: {
                flightIndex: 0,
                isOnFlightReveal: false
            } as FlightStepState,
            getConfig: (state: State | UnwrapNestedRefs<State>): FlightStepConfig => {
                let flightId = '';

                if (state.ui.currentStepState !== undefined && isFlightStepState(state.ui.currentStepState)) {
                    if (state.ui.currentStepState.flightIndex > state.tasting.flights.length) {
                        throw `state flight index is higher than flight length ${state.ui.currentStepState.flightIndex} > ${state.tasting.flights.length} `
                    }
                    flightId = state.tasting.flights[state.ui.currentStepState.flightIndex].id;
                }

                return {
                    flightId,
                    flightCount: state.tasting.flights.length,
                    tastingPublicId: state.tasting.publicId,
                    client: this.client
                }
            }
        }
    ]

    public state: UnwrapNestedRefs<State> = reactive({
        tasting: new TastingDto(),
        scoreData: new UserScoresDto(),
        test: {
            i: 0,
            t: '1'
        },
        ui: {
            currentStep: this.uiStepConfigurations[0].id,
            currentStepState: this.uiStepConfigurations[0].state
        }
    })

    constructor() {
        this.client = createClient()
    }

    private client: feathers.Application<ServiceTypes>

    public async moveUi(step: UiStep): Promise<boolean> {
        let index = this.uiStepConfigurations.findIndex(x => x.id === this.state.ui.currentStep)
        this.state.test.i++
        if (index === -1) {
            index = 0
        }

        const newIndex = step === 'next' ? index + 1 : index - 1

        // TODO use state step config
        if (index >= 0 && index < this.uiStepConfigurations.length) {
            const stepConfig = this.uiStepConfigurations[index]

            if (stepConfig.move !== undefined) {
                let config = {}
                let state = {}

                if (stepConfig.getConfig !== undefined) {
                    config = stepConfig.getConfig(this.state)
                }

                if (stepConfig.state !== undefined) {
                    state = this.state.ui.currentStepState
                }

                const hasStepped = await stepConfig.move(config, state)

                if (hasStepped) {
                    this.state.ui.currentStep = this.uiStepConfigurations[newIndex].id
                    this.state.ui.currentStepState = this.uiStepConfigurations[newIndex].state
                } else {
                    this.state.ui.currentStepState = state
                }

                return false
            } else {

this.state.ui.currentStep = this.uiStepConfigurations[newIndex].id
   this.state.ui.currentStepState = this.uiStepConfigurations[newIndex].state
                return true
            }
        }

        return false
    }

    public async loadTastingForScoring(id: string): Promise<boolean> {
        const tasting$ = this.client.service('tasting').get(id).then((result: Partial<TastingDto>) => {
            this.state.tasting = mapApiDataToTasting(result)

            return this.state.tasting
        })

        let scoring$ = new Promise<UserScoresDto>((resolve) => {
            resolve(new UserScoresDto())
        })

        const localData = window.localStorage.getItem('tasting-organizer')

        if (localData) {
            const localObject = JSON.parse(localData)

            if (localObject[id]) {
                scoring$ = this.client.service('scoring').get(id, {query: {userId: localObject[id]}})
                    .then((x: UserScoresDto) => this.state.scoreData = x)
            }
        }

        return await Promise.all([tasting$, scoring$]).then(() => true).catch(() => false)
    }

    public setUser(userName: string): void {
        this.state.scoreData.userName = userName

        if (!this.state.scoreData.userId) {
            this.state.scoreData.userId = createId(4)
        }

        const service = this.client.service('scoring')
        service.update(this.tasting.id, this.scoreData).then((x: any) => console.log(x))

        this.createLocalTastingData()
    }

    private createLocalTastingData() {
        const localData: any = {}
        localData[this.tasting.publicId] = this.state.scoreData.userId

        window.localStorage.setItem('tasting-organizer', JSON.stringify(localData))
    }

    public getScore(wineId: string): ScoreDto | undefined {
        const scoreData = this.state.scoreData.scores.find(x => x.wineId === wineId)

        return scoreData ? scoreData : undefined
    }

    public async setScore(wineId: string, score: number): Promise<UserScoresDto> {
        const scoreData = this.getScore(wineId)

        if (scoreData) {
            scoreData.score = score
        } else {
            this.state.scoreData.scores.push({
                score,
                wineId
            })
        }

        const service = this.client.service('scoring')
        return await service.update(this.state.tasting.id, this.scoreData)
    }
}