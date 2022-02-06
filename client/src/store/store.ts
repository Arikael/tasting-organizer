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
    FlightStepState,
    UiStep,
    UiStepConfiguration
} from "@/store/UiSteps";
import { mapApiDataToTasting } from '@/api/mappings'

export class Store {
    public get tasting(): UnwrapNestedRefs<TastingDto> {
        return this.state.tasting
    }

    public get scoreData(): UserScoresDto {
        return this.state.scoreData
    }

    public state = reactive({
        tasting: new TastingDto(),
        scoreData: new UserScoresDto(),
        ui: {
            flightIndex: 0,
            currentStep: ''
        }
    })

    constructor() {
        this.client = createClient()
    }

    private client: feathers.Application<ServiceTypes>

    private uiStepConfigurations: UiStepConfiguration[] = [
        {
            id: 'intro',
        },
        {
            id: 'flight',
            move: flightStepMove,
            state: {
                flightIndex: 0,
                isOnFlightReveal: false
            } as FlightStepState,
            getConfig: (): FlightStepConfig => {
                return {
                    flightCount: 0,
                    tastingPublicId: '',
                    client: this.client
                }
            }
        }
    ]

    public moveUi(step: UiStep) {
        let index = this.uiStepConfigurations.findIndex(x => x.id === this.state.ui.currentStep)

        if (index === -1) {
            index = 0
        }

        const newIndex = step === 'prev' ? index + 1 : index - 1

        if (index > 0 && index < this.uiStepConfigurations.length) {
            const stepConfig = this.uiStepConfigurations[index]

            if (stepConfig.move !== undefined) {
                let config = {}
                let state = {}

                if(stepConfig.getConfig !== undefined) {
                    config = stepConfig.getConfig()
                }

                if(stepConfig.state !== undefined) {
                    state = stepConfig.state
                }

                const hasStepped = stepConfig.move(config, state)

                if (!hasStepped) {
                    this.state.ui.currentStep = this.uiStepConfigurations[newIndex].id
                }
            }
        }
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