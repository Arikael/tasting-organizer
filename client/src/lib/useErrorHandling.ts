import {computed} from "vue";
import {store} from "@/store";

export class ApplicationError {
    messageKey = ''
    code = -1
    detail = ''

    constructor(code: number, messageKey: string, detail = '') {
        this.code = code
        this.messageKey = messageKey
        this.detail = detail
    }
}

export function useErrorHandling() {
    return {
        getters: {
            hasError: computed((): boolean => store.state.ui.applicationError !== undefined)
        },
        actions: {
            setError(code: number, message: string, detail = '') {
                store.state.ui.applicationError = new ApplicationError(code, message, detail)

                if (process.env.VUE_APP_NODE_ENV && process.env.VUE_APP_NODE_ENV === 'develop') {
                    console.log('', 'code: ', code, '\n', 'message: ', message, '\n', 'detail: ', detail)
                }
            }
        }
    }
}