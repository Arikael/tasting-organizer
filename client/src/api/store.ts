import {BaseWineDto, FlightDto, ScoreDto, TastingDto } from './types'
import feathers from "@feathersjs/feathers";
import {createClient} from "@/api/client";
import {reactive } from "vue";
import {createId} from "@/helpers";
import {UnwrapNestedRefs} from "@vue/reactivity";
import {ServiceTypes, UserScoresDto} from './types'

export class Store {
    public get tasting(): UnwrapNestedRefs<TastingDto> {
        return this.state.tasting
    }

    public get scoreData(): UserScoresDto {
        return this.state.scoreData
    }

    public state = reactive({
        tasting: new TastingDto(),
        scoreData: new UserScoresDto()
    })
    private client: feathers.Application<ServiceTypes>

    constructor() {
        this.client = createClient()
    }

    public async loadTastingForScoring(id: string): Promise<boolean> {
        const tasting$ = this.client.service('tasting').get(id).then((result: TastingDto) => {
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
                scoring$ = this.client.service('scoring').get(id ,{query: { userId: localObject[id]}})
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

function mapApiDataToTasting(data: any): TastingDto {
    const tasting = new TastingDto()
    tasting.id = data._id ?? ''
    tasting.publicId = data.publicId ?? ''
    tasting.title = data.title ?? ''
    tasting.intro = data.intro ?? ''
    tasting.date = data.date
    tasting.outro = data.outro ?? ''
    tasting.flights = []

    if (data.flights && Array.isArray(data.flights)) {
        data.flights.map((flight: FlightDto<BaseWineDto>) => {
            const tastingFlight = new FlightDto<BaseWineDto>()
            flight.wines.map((wine: BaseWineDto) => {
                tastingFlight.wines.push({
                    name: wine.name,
                    id: wine.id,
                })
            })

            tasting.flights.push(tastingFlight)
        })
    }

    return tasting
}
