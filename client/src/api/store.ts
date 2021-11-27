import {Flight, Score, Tasting, TastingScoreData, WineWithScore} from "@/modules/scoring/Entities";
import feathers from "@feathersjs/feathers";
import {createClient} from "@/api/client";
import {reactive, ref} from "vue";
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

    public loadTastingForScoring(id: string): Promise<Tasting> {
        return this.client.service('tasting').get(id).then((result: any) => {
            this.state.tasting = mapApiDataToTasting(result)

            return this.state.tasting
        })
    }

    public setUser(userName: string): void {
        this.state.scoreData.userName = userName

        if (!this.state.scoreData.userId) {
            this.state.scoreData.userId = createId(4)
        }
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
    }
}

function mapApiDataToTasting(data: any): Tasting {
    const tasting = new Tasting()
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
