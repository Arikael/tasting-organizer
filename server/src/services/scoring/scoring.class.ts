import {Db, ObjectId, UpdateResult} from 'mongodb'
import {Service, MongoDBServiceOptions} from 'feathers-mongodb'
import {Application} from '../../declarations'
import {Id, NullableId, Paginated, Params} from '@feathersjs/feathers'
import logger from '../../logger'
import {BadRequest, GeneralError} from '@feathersjs/errors'

export class Scoring extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options)

    const client: Promise<Db> = app.get('mongoClient')

    client.then(db => {
      this.Model = db.collection('tasting-organizer')
    })
  }

  // async find(params?: Params): Promise<any[]> {
  //
  //   // if(!params) {
  //   //
  //   // }
  //   //
  //   // if(params?.user) {
  //   //   logger.error('getting score for user: no params.user provided')
  //   //
  //   //   const  new BadRequest('400 bad request')
  //   // }
  //
  //   return await this.Model.aggregate(
  //     [
  //       {
  //         "$unwind": "$scores"
  //       },
  //       {
  //         "$match": {
  //           "_id": new ObjectId(id),
  //           "scores.userId": params.user
  //         }
  //       },
  //       {
  //         "$project": {
  //           "scores": "$scores"
  //         }
  //       },
  //       {
  //         "$replaceRoot": {
  //           "newRoot": "$scores"
  //         }
  //       }
  //     ]
  //   )
  // }

  async find(params?: Params): Promise<any> {

    if (!params?.query?.id || !params?.query?.userId) {

      return Promise.resolve({})
    }

    console.log(params?.query)

    try {
      const results = await this.Model.aggregate(
        [
          {
            '$unwind': '$scores'
          },
          {
            '$match': {
              'publicId': params?.query?.id,
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
      console.log(results)
      return results.length === 1 ? results[0] : {}
    }
    catch(e) {
      console.log(e)
    }
  }

  async patch(id: NullableId, data: Partial<any>, params?: Params): Promise<any> {
    if (!id) {
      return Promise.reject()
    }

    console.log(data)
    const userScores = await this.Model.findOne({
      'scores.userId': data.userId
    })
    console.log(id)
    let result: Promise<UpdateResult>

    if (userScores) {
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

      return returnedData
    } catch (e) {
      logger.error(e)
      const generalError = new GeneralError('http 500')

      return Promise.reject(generalError)
    }
  }
}
