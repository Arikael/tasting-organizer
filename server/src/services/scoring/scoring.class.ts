import {Db, ObjectId, UpdateResult} from 'mongodb'
import {Service, MongoDBServiceOptions} from 'feathers-mongodb'
import {Application} from '../../declarations'
import {NullableId, Params} from '@feathersjs/feathers'
import logger from '../../logger'
import {BadRequest, GeneralError} from '@feathersjs/errors'
import {UserScoresDto} from '../../types'

export class Scoring extends Service<UserScoresDto> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options)
    const client: Promise<Db> = app.get('mongoClient')

    client.then(db => {
      this.Model = db.collection('tasting-organizer')
    })
  }

  async get(id: NullableId, params?: Params): Promise<UserScoresDto> {
    if (!params?.query?.userId) {
      const error = new BadRequest('query.userId was not provided')
      return Promise.reject(error)
    }

    try {
      const results = await this.Model.aggregate(
        [
          {
            '$unwind': '$scores'
          },
          {
            '$match': {
              'publicId': id,
              'scores.userId': params?.query?.userId
            }
          },
          {
            '$project': {
              'scores': '$scores'
            }
          },
          {
            '$replaceRoot': {
              'newRoot': '$scores'
            }
          }
        ]
      ).toArray()

      if(results.length === 0) {
        return Promise.resolve(new UserScoresDto())
      }

      return Promise.resolve(results[0] as UserScoresDto)

    } catch (e) {
      return Promise.reject(e)
    }
  }

  async update(id: NullableId, data: Partial<any>, params?: Params): Promise<any> {
    console.log(id)
    if (!id) {
      return Promise.reject()
    }
    const userScores = await this.Model.findOne({
      'scores.userId': data.userId
    })

    let result: Promise<UpdateResult>

    if (userScores) {
      console.log(data)
      result = this.Model.updateOne({
        '_id': new ObjectId(id),
        'scores.userId': data.userId
      }, {
        $set: {
          'scores.$': data
        }
      })
    } else {
      result = this.Model.updateOne({
        '_id': new ObjectId(id)
      }, {
        $push: {
          scores: data
        }
      })
    }

    let returnedData: any

    try {
      await result
      returnedData = data
      console.log(result)

      return returnedData
    } catch (e) {
      logger.error(e)
      const generalError = new GeneralError('http 500')

      return Promise.reject(generalError)
    }
  }
}
