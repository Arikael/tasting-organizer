import io from "socket.io-client"
import feathers from "@feathersjs/feathers"
import socketio from "@feathersjs/socketio-client"
import {ServiceTypes} from './types'

export function useApiClient(): feathers.Application<ServiceTypes> {
    let client: feathers.Application<ServiceTypes> | undefined

    function createClient(): feathers.Application<ServiceTypes> {
        const socket = io(process.env.VUE_APP_BACKEND_URL as string);
        const client = feathers();
        client.configure(socketio(socket))

        return client
    }

    if(client === undefined) {
        client = createClient()
    }

    return client as feathers.Application<ServiceTypes>
}