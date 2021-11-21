import {Flight, Tasting, TastingScoreData, WineWithScore} from "@/modules/scoring/Entities";
import feathers from "@feathersjs/feathers";
import {createClient} from "@/api/client";
import {reactive, ref} from "vue";

export class Store {
    public get tasting() {
        return this.state.tasting
    }

    private state = reactive({
        tasting: new Tasting(),
        scores: {}
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

export const getTastingDataForScoring = (tastingId: string): Tasting => {
    const tasting = new Tasting()
    tasting.title = "My Tasting"
    tasting.flights.push({
            name: "flight 1",
            wines: [
                {
                    name: "Wine 1",
                    id: "1"
                },
                {
                    name: "Wine 2",
                    id: "2"
                }
            ]
        },
        {
            name: "flight 2",
            wines: [
                {
                    name: "Wine 3",
                    id: "3"
                },
                {
                    name: "Wine 4",
                    id: "4"
                }
            ]
        })

    return tasting
};