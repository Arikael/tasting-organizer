export type UiStep = 'prev' | 'next'
export type StepTypes = 'intro' | 'flight' | 'reveal' | 'end'

export interface Step {
    id: string,
    type: StepTypes,
    stepState?: Record<string, unknown>
}

function prop<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

function typeKey<T>(key: keyof T) {
    return key
}