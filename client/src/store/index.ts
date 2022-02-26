import {state} from "@/store/state";
import getters from './getters'
import setters from './setters'
import actions from './actions'

export const store = {
    state,
    getters: {
        ...getters
    },
    setters: {
        ...setters
    },
    actions: {
        ...actions
    }
}