import io from "socket.io-client"
import feathers from "@feathersjs/feathers"
import socketio from "@feathersjs/socketio-client"
import {ServiceTypes} from './types'

export function createClient(): feathers.Application<ServiceTypes> {
    const socket = io(process.env.VUE_APP_BACKEND_URL as string);
    const client = feathers();
    client.configure(socketio(socket))

    return client
}