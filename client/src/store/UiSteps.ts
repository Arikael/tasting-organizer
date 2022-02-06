import {ServiceTypes} from '../api/types'
import feathers from "@feathersjs/feathers";
export type UiStep = 'prev' | 'next'

export interface UiStepConfiguration {
    id: string,
    move?: (config: Record<string, unknown>, state: Record<string, unknown>) => Promise<boolean>
    state?: Record<string, unknown>
    getConfig?: () => Record<string, unknown>
}

export type FlightStepState = {
    flightIndex: number,
    isOnFlightReveal: boolean
}

export type FlightStepConfig = {
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

function isFlightStepState(config: Record<string, unknown>): config is FlightStepState {
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

    const result = await config.client.service('tasting').get(config.tastingPublicId, {
        query: {
            $select: ['revealAfter', 'flights'],
            revealAfter: 'flight'
        }
    })

    const needsReveal = true

    if (needsReveal) {
        state.isOnFlightReveal = true
    } else {
        state.flightIndex++
    }
    //needs reveal

    return false
}