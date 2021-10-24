import {Tasting} from "@/modules/scoring/Entities";

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