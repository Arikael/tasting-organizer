export interface IEntityWithState<T> {
    ok: boolean,
    value: T
}

export class FormFieldState<T> implements IEntityWithState<T> {
    message = ''
    value: T
    ok = true

    constructor(val: T) {
        this.value = val
    }
}

export class ActionResult<T> implements IEntityWithState<T>{
    message = ''
    value: T
    ok = true

    constructor(val: T) {
        this.value = val
    }
}