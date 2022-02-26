import {ServiceTypes} from '../api/types'
import feathers from '@feathersjs/feathers';
import {state, State} from "@/store/state";
import {UnwrapNestedRefs} from "@vue/reactivity";
import {useApiClient} from "@/api/client";
import getters from './getters'

export type UiStep = 'prev' | 'next'
export type StepIds = 'intro' | 'flight' | 'end'

export interface UiStepConfiguration {
    id: StepIds,
    move?: (config: Record<string, unknown>, state: State) => Promise<boolean>
    getConfig?: (state: State | UnwrapNestedRefs<State>) => Record<string, unknown>
}

export type FlightStepState = {
    flightIndex: number,
    isOnFlightReveal: boolean,
    revealedWines: string[]
}

export type FlightStepConfig = {
    flightId: string,
    flightCount: number,
    tastingPublicId: string,
    client: feathers.Application<ServiceTypes>
}

export const stepConfiguration: UiStepConfiguration[] = [
    {
        id: 'flight',
        move: flightStepMove,
        getConfig: (state: State | UnwrapNestedRefs<State>): FlightStepConfig => {
            let flightId = '';

            const stepState = getters.currentStepState.value

            if (stepState !== undefined && isFlightStepState(stepState)) {
                if (stepState.flightIndex > state.tasting.flights.length) {
                    throw `state flight index is higher than flight length ${stepState.flightIndex} > ${state.tasting.flights.length} `
                }
                flightId = state.tasting.flights[stepState.flightIndex].id;
            }

            return {
                flightId,
                flightCount: state.tasting.flights.length,
                tastingPublicId: state.tasting.publicId,
                client: useApiClient()
            }
        }
    }
]


function prop<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

function typeKey<T>(key: keyof T) {
    return key
}

function isFlightStepConfig(config: Record<string, unknown>): config is FlightStepConfig {
    return typeKey<FlightStepConfig>('flightCount') in config
        && typeKey<FlightStepConfig>('tastingPublicId') in config
        && typeKey<FlightStepConfig>('client') in config;
}

export function isFlightStepState(config: Record<string, unknown>): config is FlightStepState {
    return typeKey<FlightStepState>('flightIndex') in config
        && typeKey<FlightStepState>('isOnFlightReveal') in config;
}

export async function flightStepMove(config: Record<string, unknown>, state: State)
    : Promise<boolean> {

    const stepState = getters.currentStepState.value

    if (!isFlightStepConfig(config) || !isFlightStepState(stepState)) {
        return Promise.resolve(false)
    }


    if (stepState.flightIndex >= config.flightCount || stepState.flightIndex === 0 && state.ui.currentStepIndexChange < 0) {
        return true
    }

    let needsReveal = false

    if(!stepState.isOnFlightReveal) {
        const result = await config.client.service('flight-reveal').get(config.flightId, {
            query: {
                publicId: config.tastingPublicId
            }
        })

        if (result.revealAfter === 'flight') {
            needsReveal = true
            stepState.revealedWines = result.wines
        }
    }

    if (needsReveal) {
        stepState.isOnFlightReveal = true
    } else {
        stepState.flightIndex++
        stepState.isOnFlightReveal = false
    }

    return false
}