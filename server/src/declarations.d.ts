import { Application as ExpressFeathers } from '@feathersjs/express'
import {ServiceTypes} from './types'

// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>;
