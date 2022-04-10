import {Db, ObjectId} from 'mongodb'
import {Service, MongoDBServiceOptions} from 'feathers-mongodb'
import {Application} from '../../declarations'
import {Id, Params} from '@feathersjs/feathers'
import {FlightRevealDto} from '../../types'
import {BadRequest} from '@feathersjs/errors'
import 'reflect-metadata'
import {plainToInstance} from 'class-transformer'

export class FlightReveal extends Service<FlightRevealDto> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options)

    const client: Promise<Db> = app.get('mongoClient')

    client.then(db => {
      this.Model = db.collection('tasting-organizer')
    })
  }

  async get(id: Id, params?: Params): Promise<FlightRevealDto> {
    if (!params?.query?.publicId) {
      const error = new BadRequest('query.publicId was not provided')
      return Promise.reject(error)
    }

    const result = await this.Model.aggregate([
      {
        '$unwind': '$flights'
      },
      {
        '$match': {
          'publicId': params?.query?.publicId,
          'flights._id': new ObjectId(id)
        },
      },
      {
        '$project': {
          'wines': '$flights.wines.name',
          'revealAfter': '$revealAfter',
          'flightId': id,
        }
      }
    ]).toArray()

    if (result.length == 1) {
      if (result[0]['revealAfter'] !== 'flight') {
        result[0]['wines'] = []
      }

      return plainToInstance(FlightRevealDto, result[0])
    }

    return new FlightRevealDto()
  }
}
