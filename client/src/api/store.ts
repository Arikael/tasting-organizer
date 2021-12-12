import {Flight, Score, Tasting, WineWithScore} from "@/modules/scoring/Entities";
import feathers from "@feathersjs/feathers";
import {createClient} from "@/api/client";
import {reactive } from "vue";
import {createId} from "@/helpers";
import {UnwrapNestedRefs} from "@vue/reactivity";

export class Store {
    public get tasting(): UnwrapNestedRefs<Tasting> {
        return this.state.tasting
    }

    public get scoreData() {
        return this.state.scoreData
    }

    public state = reactive({
        tasting: new Tasting(),
        scoreData: {
            userId: '',
            userName: '',
            scores: Array<Score>(),
        }
    })
    private client: feathers.Application<any>

    constructor() {
        this.client = createClient()
    }

    public async loadTastingForScoring(id: string): Promise<boolean> {
        const tasting$ = this.client.service('tasting').get(id).then((result: any) => {
            this.state.tasting = mapApiDataToTasting(result)

            return this.state.tasting
        })

        let scoring$ = new Promise<any>((resolve) => {
            resolve({})
        })

        const localData = window.localStorage.getItem('tasting-organizer')

        if (localData) {
            const localObject = JSON.parse(localData)

            if (localObject[id]) {
                scoring$ = this.client.service('scoring').get(id ,{query: { userId: localObject[id]}})
                    .then((x: any) => this.state.scoreData = x)
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
        service.patch(this.tasting.id, this.scoreData).then((x: any) => console.log(x))

        const localData: any = {}
        localData[this.tasting.publicId] = this.state.scoreData.userId

        window.localStorage.setItem('tasting-organizer', JSON.stringify(localData))
    }

    public getScore(wineId: string): Score | undefined {
        const scoreData = this.state.scoreData.scores.find(x => x.wineId === wineId)

        return scoreData ? scoreData : undefined
    }

    public setScore(wineId: string, score: number): void {
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
        service.update(this.state.tasting.id, this.scoreData)
    }
}

function mapApiDataToTasting(data: any): Tasting {
    const tasting = new Tasting()
    tasting.id = data._id ?? ''
    tasting.publicId = data.publicId ?? ''
    tasting.title = data.title ?? ''
    tasting.intro = data.intro ?? ''
    tasting.date = data.date
    tasting.outro = data.outro ?? ''
    tasting.flights = []

    if (data.flights && Array.isArray(data.flights)) {
        data.flights.map((flight: any) => {
            const scoreFlight = new Flight<WineWithScore>()
            flight.wines.map((wine: any) => {
                scoreFlight.wines.push({
                    name: wine.name,
                    id: wine.id,
                    score: 0
                })
            })

            tasting.flights.push(scoreFlight)
        })
    }

    return tasting
}
