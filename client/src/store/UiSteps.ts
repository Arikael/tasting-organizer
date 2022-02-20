import {BaseWineDto, ServiceTypes} from '../api/types'
import feathers from '@feathersjs/feathers';
import {FeathersError} from '@feathersjs/errors'
import {State} from "@/store/store";
import {UnwrapNestedRefs} from "@vue/reactivity";
export type UiStep = 'prev' | 'next'

export interface UiStepConfiguration {
    id: string,
    move?: (config: Record<string, unknown>, state: Record<string, unknown>) => Promise<boolean>
    state: Record<string, unknown>
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

export async function flightStepMove(config: Record<string, unknown>, state: Record<string, unknown>)
    : Promise<boolean> {

    if (!isFlightStepConfig(config) || !isFlightStepState(state)) {
        return Promise.resolve(false)
    }

    if (state.flightIndex >= config.flightCount) {
        return true
    }

    let needsReveal = false

    if(!state.isOnFlightReveal) {
        const result = await config.client.service('flight-reveal').get(config.flightId, {
            query: {
                publicId: config.tastingPublicId
            }
        })

        if (result.revealAfter === 'flight') {
            needsReveal = true
            state.revealedWines = result.wines
        }
    }

    if (needsReveal) {
        state.isOnFlightReveal = true
    } else {
        state.flightIndex++
        state.isOnFlightReveal = false
    }

    return false
}